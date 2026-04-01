'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

interface CheckoutButtonsProps {
  plan: 'premium';
}

function isMobile() {
  if (typeof window === 'undefined') return false;
  return /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
}

export default function CheckoutButtons({ plan }: CheckoutButtonsProps) {
  const [loading, setLoading] = useState<'wechat' | 'alipay' | null>(null);
  const [error, setError] = useState('');
  const [qrCode, setQrCode] = useState<{ url: string; method: string } | null>(null);

  async function handleCheckout(paymentMethod: 'wechat' | 'alipay') {
    setLoading(paymentMethod);
    setError('');
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, paymentMethod }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || '支付创建失败，请重试');
        return;
      }

      // On mobile, redirect directly; on PC, show QR code if available
      if (isMobile() || !data.url_qrcode) {
        window.location.href = data.url;
      } else {
        setQrCode({
          url: data.url_qrcode,
          method: paymentMethod === 'wechat' ? '微信' : '支付宝',
        });
      }
    } catch {
      setError('网络错误，请重试');
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="mt-8 flex flex-col gap-3">
      {error && (
        <div className="rounded-[--radius-sm] bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}
      <button
        onClick={() => handleCheckout('wechat')}
        disabled={loading !== null}
        className="flex items-center justify-center gap-2 rounded-[--radius-pill] bg-[#07C160] py-3 text-[15px] font-medium text-white transition-all hover:bg-[#06ad56] active:scale-[0.97] disabled:opacity-50"
      >
        {loading === 'wechat' ? '跳转中...' : '微信支付'}
      </button>
      <button
        onClick={() => handleCheckout('alipay')}
        disabled={loading !== null}
        className="flex items-center justify-center gap-2 rounded-[--radius-pill] bg-[#1677FF] py-3 text-[15px] font-medium text-white transition-all hover:bg-[#0e6ae6] active:scale-[0.97] disabled:opacity-50"
      >
        {loading === 'alipay' ? '跳转中...' : '支付宝'}
      </button>

      {/* QR Code modal for PC payment */}
      {qrCode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="relative w-full max-w-sm rounded-[--radius-md] bg-bg-card p-8 shadow-xl">
            <button
              onClick={() => setQrCode(null)}
              className="absolute top-4 right-4 text-text-tertiary hover:text-text-primary"
            >
              <X size={20} />
            </button>
            <h3
              className="text-center text-lg font-semibold tracking-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {qrCode.method}扫码支付
            </h3>
            <p className="mt-2 text-center text-sm text-text-secondary">
              请使用{qrCode.method}扫描下方二维码完成支付
            </p>
            <div className="mt-6 flex justify-center">
              <img
                src={qrCode.url}
                alt="支付二维码"
                className="h-56 w-56 rounded-lg border border-border"
              />
            </div>
            <p className="mt-4 text-center text-xs text-text-tertiary">
              支付完成后页面将自动跳转
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
