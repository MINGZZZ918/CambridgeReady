import { createHash } from 'crypto';

const XUNHUPAY_API = 'https://api.xunhupay.com/payment/do.html';

export function getCredentials(type: 'wechat' | 'alipay') {
  if (type === 'wechat') {
    return {
      appid: process.env.XUNHUPAY_WECHAT_APPID!,
      appsecret: process.env.XUNHUPAY_WECHAT_APPSECRET!,
    };
  }
  return {
    appid: process.env.XUNHUPAY_ALIPAY_APPID!,
    appsecret: process.env.XUNHUPAY_ALIPAY_APPSECRET!,
  };
}

export function generateSign(
  params: Record<string, string>,
  appsecret: string
): string {
  const sortedKeys = Object.keys(params).filter((k) => k !== 'hash').sort();
  const str = sortedKeys.map((k) => `${k}=${params[k]}`).join('&') + appsecret;
  return createHash('md5').update(str).digest('hex');
}

export function verifySign(
  params: Record<string, string>,
  appsecret: string
): boolean {
  const expected = params.hash;
  if (!expected) return false;
  const computed = generateSign(params, appsecret);
  return computed === expected;
}

interface CreatePaymentParams {
  trade_order_id: string;
  total_fee: string;
  title: string;
  type: 'wechat' | 'alipay';
  notify_url: string;
  return_url: string;
}

interface PaymentResponse {
  url: string;
  url_qrcode?: string;
  errcode?: number;
  errmsg?: string;
}

export async function createPayment(
  opts: CreatePaymentParams
): Promise<PaymentResponse> {
  const { appid, appsecret } = getCredentials(opts.type);

  const params: Record<string, string> = {
    version: '1.1',
    appid,
    trade_order_id: opts.trade_order_id,
    total_fee: opts.total_fee,
    title: opts.title,
    time: Math.floor(Date.now() / 1000).toString(),
    notify_url: opts.notify_url,
    return_url: opts.return_url,
    nonce_str: Math.random().toString(36).slice(2, 15),
    type: opts.type,
  };

  params.hash = generateSign(params, appsecret);

  const formBody = Object.entries(params)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join('&');

  const res = await fetch(XUNHUPAY_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: formBody,
  });

  const data = await res.json();

  if (data.errcode && data.errcode !== 0) {
    throw new Error(data.errmsg || 'XunHuPay API error');
  }

  return data as PaymentResponse;
}
