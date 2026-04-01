"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeft, Loader2, Mail } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email,
      {
        redirectTo: `${window.location.origin}/api/auth/callback?next=/reset-password`,
      }
    );

    if (resetError) {
      const errorMessages: Record<string, string> = {
        "Unable to validate email address: invalid format": "邮箱格式不正确",
        "For security purposes, you can only request this once every 60 seconds": "出于安全考虑，每 60 秒只能请求一次",
      };
      setError(errorMessages[resetError.message] || resetError.message);
      setLoading(false);
      return;
    }

    setSent(true);
    setLoading(false);
  }

  return (
    <div className="flex min-h-screen">
      {/* Left decorative panel */}
      <div className="hidden w-[45%] bg-cta-bg lg:flex lg:flex-col lg:justify-between lg:p-12">
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="CambridgeReady" className="h-9 w-9 rounded-[10px] object-contain" />
          <span
            className="text-lg tracking-tight text-white"
            style={{ fontFamily: "var(--font-display)" }}
          >
            CambridgeReady
          </span>
        </Link>

        <div>
          <h2
            className="text-4xl leading-tight tracking-tight text-white"
            style={{ fontFamily: "var(--font-display)" }}
          >
            找回你的
            <br />
            账号密码
          </h2>
          <p className="mt-4 max-w-sm text-base leading-relaxed text-white/50">
            输入注册邮箱，我们会发送密码重置链接
          </p>
        </div>

        <p className="text-sm text-white/30">
          © {new Date().getFullYear()} CambridgeReady
        </p>
      </div>

      {/* Right form */}
      <div className="flex flex-1 flex-col justify-center px-6 py-12 sm:px-12 lg:px-20">
        <div className="mx-auto w-full max-w-sm">
          <Link href="/" className="mb-10 flex items-center gap-2 lg:hidden">
            <img src="/logo.png" alt="CambridgeReady" className="h-9 w-9 rounded-[10px] object-contain" />
            <span className="text-lg tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
              CambridgeReady
            </span>
          </Link>

          {sent ? (
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-ket-light">
                <Mail size={28} className="text-ket" />
              </div>
              <h1
                className="mt-6 text-3xl tracking-tight"
                style={{ fontFamily: "var(--font-display)" }}
              >
                邮件已发送
              </h1>
              <p className="mt-3 text-[15px] leading-relaxed text-text-secondary">
                我们已向 <span className="font-medium text-text-primary">{email}</span> 发送了密码重置链接，请查收邮件并点击链接重置密码。
              </p>
              <p className="mt-4 text-sm text-text-tertiary">
                没有收到？请检查垃圾邮件文件夹，或稍后重试。
              </p>
              <Link
                href="/login"
                className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-blue hover:text-blue-dark"
              >
                <ArrowLeft size={14} />
                返回登录
              </Link>
            </div>
          ) : (
            <>
              <h1
                className="text-3xl tracking-tight"
                style={{ fontFamily: "var(--font-display)" }}
              >
                忘记密码
              </h1>
              <p className="mt-2 text-[15px] text-text-secondary">
                输入你的注册邮箱，我们会发送重置链接
              </p>

              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                {error && (
                  <div className="rounded-[--radius-sm] bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                  </div>
                )}

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-text-primary">
                    邮箱
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    placeholder="your@email.com"
                    className="mt-1.5 block w-full rounded-[--radius-sm] border border-border bg-bg-card px-4 py-3 text-[15px] text-text-primary placeholder:text-text-tertiary outline-none transition-colors focus:border-blue focus:ring-2 focus:ring-blue/10"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-[--radius-pill] bg-blue py-3.5 text-[15px] font-medium text-white transition-all hover:bg-blue-dark active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none"
                >
                  {loading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    "发送重置链接"
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 text-sm font-medium text-blue hover:text-blue-dark"
                >
                  <ArrowLeft size={14} />
                  返回登录
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
