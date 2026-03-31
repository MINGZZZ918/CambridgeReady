"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

const GUEST_LINKS = [
  { href: "#levels", label: "选择级别" },
  { href: "#features", label: "平台功能" },
  { href: "#pricing", label: "会员方案" },
];

const AUTH_LINKS = [
  { href: "/dashboard", label: "首页" },
  { href: "/levels/pet", label: "练习" },
  { href: "/past-papers", label: "真题" },
  { href: "/mistakes", label: "错题本" },
  { href: "/progress", label: "学习进度" },
];

export default function Navbar() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setAuthLoading(false);
      if (data.user) {
        supabase
          .from("profiles")
          .select("membership, membership_expires_at")
          .eq("id", data.user.id)
          .single()
          .then(({ data: profile }) => {
            if (profile && profile.membership === "premium" && profile.membership_expires_at) {
              setIsPremium(new Date(profile.membership_expires_at) > new Date());
            }
          });
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
      if (!session?.user) setIsPremium(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setMobileOpen(false);
    router.push("/");
  };

  const navLinks = user ? AUTH_LINKS : GUEST_LINKS;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-bg/80 backdrop-blur-xl border-b border-border-light shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between lg:h-20">
          {/* Logo */}
          <Link href={user ? "/dashboard" : "/"} className="flex items-center gap-2 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-blue text-white font-bold text-sm tracking-tight">
              CR
            </div>
            <span
              className="text-lg tracking-tight text-text-primary"
              style={{ fontFamily: "var(--font-display)" }}
            >
              CambridgeReady
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) =>
              user ? (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2 text-[15px] text-text-secondary rounded-[--radius-pill] transition-colors hover:text-text-primary hover:bg-black/[0.03]"
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2 text-[15px] text-text-secondary rounded-[--radius-pill] transition-colors hover:text-text-primary hover:bg-black/[0.03]"
                >
                  {link.label}
                </a>
              )
            )}
            {user && isPremium && (
              <span className="ml-1 rounded-[--radius-pill] bg-blue/10 px-2.5 py-1 text-xs font-semibold text-blue">
                Premium
              </span>
            )}
          </div>

          {/* Desktop CTA */}
          <div className="hidden items-center gap-3 lg:flex">
            {authLoading ? (
              <div className="w-24" />
            ) : user ? (
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-5 py-2.5 text-[15px] text-text-secondary rounded-[--radius-pill] transition-colors hover:text-text-primary hover:bg-black/[0.03]"
              >
                <LogOut size={16} />
                退出登录
              </button>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-5 py-2.5 text-[15px] text-text-secondary rounded-[--radius-pill] transition-colors hover:text-text-primary"
                >
                  登录
                </Link>
                <Link
                  href="/register"
                  className="px-6 py-2.5 text-[15px] font-medium text-white bg-blue rounded-[--radius-pill] transition-all hover:bg-blue-dark active:scale-[0.97]"
                >
                  免费开始
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-text-secondary lg:hidden hover:bg-black/[0.04]"
            aria-label={mobileOpen ? "关闭菜单" : "打开菜单"}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-border-light bg-bg/95 backdrop-blur-xl px-6 pb-6 pt-4 lg:hidden animate-fade-in">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) =>
              user ? (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 text-[15px] text-text-secondary rounded-xl transition-colors hover:text-text-primary hover:bg-black/[0.03]"
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 text-[15px] text-text-secondary rounded-xl transition-colors hover:text-text-primary hover:bg-black/[0.03]"
                >
                  {link.label}
                </a>
              )
            )}
            <hr className="my-3 border-border-light" />
            {user && isPremium && (
              <div className="px-4 py-2">
                <span className="rounded-[--radius-pill] bg-blue/10 px-2.5 py-1 text-xs font-semibold text-blue">
                  Premium
                </span>
              </div>
            )}
            {authLoading ? null : user ? (
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-4 py-3 text-[15px] text-text-secondary rounded-xl transition-colors hover:text-text-primary hover:bg-black/[0.03]"
              >
                <LogOut size={16} />
                退出登录
              </button>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 text-[15px] text-text-secondary rounded-xl"
                >
                  登录
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileOpen(false)}
                  className="mt-1 flex items-center justify-center px-6 py-3 text-[15px] font-medium text-white bg-blue rounded-[--radius-pill]"
                >
                  免费开始
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
