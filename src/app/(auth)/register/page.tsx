"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password.length < 6) {
      setError("密码至少需要 6 个字符");
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: displayName },
      },
    });

    if (authError) {
      const errorMessages: Record<string, string> = {
        "User already registered": "该邮箱已注册，请直接登录",
        "Password should be at least 6 characters": "密码至少需要 6 个字符",
        "Unable to validate email address: invalid format": "邮箱格式不正确",
        "Signup requires a valid password": "请输入有效的密码",
      };
      setError(errorMessages[authError.message] || authError.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
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
            开始你的
            <br />
            备考之旅
          </h2>
          <p className="mt-4 max-w-sm text-base leading-relaxed text-white/50">
            免费注册即可下载备考资料，随时升级解锁 AI 写作批改和口语评估
          </p>

          {/* Social proof */}
          <div className="mt-10 grid grid-cols-3 gap-6">
            {[
              { value: "AI", label: "写作批改" },
              { value: "AI", label: "口语评估" },
              { value: "3级", label: "覆盖" },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-2xl font-semibold text-white" style={{ fontFamily: "var(--font-display)" }}>
                  {s.value}
                </div>
                <div className="mt-1 text-sm text-white/40">{s.label}</div>
              </div>
            ))}
          </div>
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

          <h1 className="text-3xl tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
            创建账号
          </h1>
          <p className="mt-2 text-[15px] text-text-secondary">
            已有账号？{" "}
            <Link href="/login" className="font-medium text-blue hover:text-blue-dark">
              立即登录
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {error && (
              <div className="rounded-[--radius-sm] bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-text-primary">
                昵称
              </label>
              <input
                id="name"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
                placeholder="你的昵称"
                className="mt-1.5 block w-full rounded-[--radius-sm] border border-border bg-bg-card px-4 py-3 text-[15px] text-text-primary placeholder:text-text-tertiary outline-none transition-colors focus:border-blue focus:ring-2 focus:ring-blue/10"
              />
            </div>

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

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text-primary">
                密码
              </label>
              <div className="relative mt-1.5">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  placeholder="至少 6 个字符"
                  className="block w-full rounded-[--radius-sm] border border-border bg-bg-card px-4 py-3 pr-11 text-[15px] text-text-primary placeholder:text-text-tertiary outline-none transition-colors focus:border-blue focus:ring-2 focus:ring-blue/10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-secondary"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-[--radius-pill] bg-blue py-3.5 text-[15px] font-medium text-white transition-all hover:bg-blue-dark active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  免费注册
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-text-tertiary leading-relaxed">
            注册即表示同意{" "}
            <Link href="/terms" className="text-text-secondary hover:text-text-primary">用户协议</Link>
            {" "}和{" "}
            <Link href="/privacy" className="text-text-secondary hover:text-text-primary">隐私政策</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
