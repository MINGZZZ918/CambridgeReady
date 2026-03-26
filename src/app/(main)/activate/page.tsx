'use client';

import { useState, type ChangeEvent, type FormEvent } from 'react';
import { KeyRound, CheckCircle, AlertCircle } from 'lucide-react';

function formatCode(raw: string): string {
  const cleaned = raw.replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 16);
  const parts = cleaned.match(/.{1,4}/g);
  return parts ? parts.join('-') : '';
}

export default function ActivatePage() {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setCode(formatCode(e.target.value));
    setResult(null);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (code.replace(/-/g, '').length !== 16) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });

      const data = await res.json();

      if (!res.ok) {
        setResult({ type: 'error', message: data.error });
        return;
      }

      const expiresDate = new Date(data.expiresAt).toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      setResult({
        type: 'success',
        message: `激活成功！您的高级会员有效期至 ${expiresDate}`,
      });
      setCode('');
    } catch {
      setResult({ type: 'error', message: '网络错误，请重试' });
    } finally {
      setLoading(false);
    }
  }

  const isValid = code.replace(/-/g, '').length === 16;

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-[--radius-md] border border-border bg-bg-card p-8 shadow-sm">
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue/10">
            <KeyRound size={24} className="text-blue" />
          </div>
          <h1
            className="text-2xl font-semibold text-text-primary"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            激活码兑换
          </h1>
          <p className="text-sm text-text-secondary">
            输入您的激活码，立即开通高级会员
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="activation-code"
              className="mb-1.5 block text-sm font-medium text-text-primary"
            >
              激活码
            </label>
            <input
              id="activation-code"
              type="text"
              value={code}
              onChange={handleChange}
              placeholder="XXXX-XXXX-XXXX-XXXX"
              className="w-full rounded-[8px] border border-border bg-bg px-4 py-3 text-center text-lg font-mono tracking-widest text-text-primary placeholder:text-text-tertiary focus:border-blue focus:outline-none focus:ring-2 focus:ring-blue/20"
              autoComplete="off"
              spellCheck={false}
              maxLength={19}
            />
          </div>

          <button
            type="submit"
            disabled={!isValid || loading}
            className="w-full rounded-[--radius-pill] bg-blue py-3 text-[15px] font-medium text-white transition-all hover:bg-blue/90 active:scale-[0.97] disabled:opacity-50 disabled:active:scale-100"
          >
            {loading ? '激活中...' : '激活'}
          </button>
        </form>

        {/* Result message */}
        {result && (
          <div
            className={`mt-5 flex items-start gap-2.5 rounded-[8px] p-4 text-sm ${
              result.type === 'success'
                ? 'bg-ket-light text-ket'
                : 'bg-red-50 text-red-600'
            }`}
          >
            {result.type === 'success' ? (
              <CheckCircle size={18} className="mt-0.5 shrink-0" />
            ) : (
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
            )}
            <span>{result.message}</span>
          </div>
        )}
      </div>
    </div>
  );
}
