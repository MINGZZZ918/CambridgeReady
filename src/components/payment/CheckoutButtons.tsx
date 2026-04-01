'use client';

import { useState } from 'react';

interface CheckoutButtonsProps {
  plan: 'premium';
}

export default function CheckoutButtons({ plan }: CheckoutButtonsProps) {
  const [loading, setLoading] = useState<'wechat' | 'alipay' | null>(null);
  const [error, setError] = useState('');

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

      window.location.href = data.url;
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
    </div>
  );
}
