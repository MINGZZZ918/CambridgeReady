"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Eye, EyeOff, Loader2, CheckCircle } from "lucide-react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("密码至少需要 6 个字符");
      return;
    }

    if (password !== confirmPassword) {
      setError("两次输入的密码不一致");
      return;
    }

    setLoading(true);

    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({
      password,
    });

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);

    setTimeout(() => {
      router.push("/dashboard");
    }, 2000);
  }

  return (
    <div className="flex min-h-screen">
      {/* Left decorative panel */}
      <div className="hidden w-[45%] bg-cta-bg lg:flex lg:flex-col lg:justify-between lg:p-12">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-white text-cta-bg font-bold text-sm">
            CR
          </div>
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
            设置新密码
          </h2>
          <p className="mt-4 max-w-sm text-base leading-relaxed text-white/50">
            请输入你的新密码，至少 6 个字符
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
            <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-blue text-white font-bold text-sm">
              CR
            </div>
            <span className="text-lg tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
              CambridgeReady
            </span>
          </Link>

          {success ? (
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-ket-light">
                <CheckCircle size={28} className="text-ket" />
              </div>
              <h1
                className="mt-6 text-3xl tracking-tight"
                style={{ fontFamily: "var(--font-display)" }}
              >
                密码已更新
              </h1>
              <p className="mt-3 text-[15px] text-text-secondary">
                你的密码已成功重置，正在跳转到仪表板...
              </p>
            </div>
          ) : (
            <>
              <h1
                className="text-3xl tracking-tight"
                style={{ fontFamily: "var(--font-display)" }}
              >
                重置密码
              </h1>
              <p className="mt-2 text-[15px] text-text-secondary">
                请输入你的新密码
              </p>

              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                {error && (
                  <div className="rounded-[--radius-sm] bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                  </div>
                )}

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-text-primary">
                    新密码
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

                <div>
                  <label htmlFor="confirm-password" className="block text-sm font-medium text-text-primary">
                    确认新密码
                  </label>
                  <input
                    id="confirm-password"
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                    placeholder="再次输入新密码"
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
                    "确认重置"
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
