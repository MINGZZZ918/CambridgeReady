"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { href: "#levels", label: "选择级别" },
  { href: "#features", label: "平台功能" },
  { href: "#pricing", label: "会员方案" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
          <Link href="/" className="flex items-center gap-2 group">
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
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-[15px] text-text-secondary rounded-[--radius-pill] transition-colors hover:text-text-primary hover:bg-black/[0.03]"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden items-center gap-3 lg:flex">
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
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="px-4 py-3 text-[15px] text-text-secondary rounded-xl transition-colors hover:text-text-primary hover:bg-black/[0.03]"
              >
                {link.label}
              </a>
            ))}
            <hr className="my-3 border-border-light" />
            <Link
              href="/login"
              className="px-4 py-3 text-[15px] text-text-secondary rounded-xl"
            >
              登录
            </Link>
            <Link
              href="/register"
              className="mt-1 flex items-center justify-center px-6 py-3 text-[15px] font-medium text-white bg-blue rounded-[--radius-pill]"
            >
              免费开始
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
