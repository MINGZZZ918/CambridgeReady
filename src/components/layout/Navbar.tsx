"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X, LogOut, ChevronDown, PenLine, Mic, Download, BookOpen, FileText, GraduationCap, HelpCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

interface DropdownItem {
  href: string;
  label: string;
  desc?: string;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
}

interface NavItem {
  label: string;
  href?: string;
  children?: DropdownItem[];
}

const GUEST_NAV: NavItem[] = [
  {
    label: "产品功能",
    children: [
      { href: "#features", label: "AI 写作批改", desc: "剑桥官方四维评分 + 逐句批注", icon: PenLine },
      { href: "#features", label: "AI 口语评估", desc: "语音转写 + 四维评分", icon: Mic },
    ],
  },
  {
    label: "考试级别",
    children: [
      { href: "#levels", label: "KET (A2 Key)", desc: "剑桥通用英语入门级" },
      { href: "#levels", label: "PET (B1 Preliminary)", desc: "剑桥通用英语中级" },
      { href: "#levels", label: "FCE (B2 First)", desc: "剑桥通用英语中高级" },
    ],
  },
  {
    label: "免费资源",
    children: [
      { href: "/resources", label: "备考资料下载", desc: "PDF、音频、词汇表", icon: Download },
      { href: "/vocabulary", label: "核心词汇", desc: "KET/PET/FCE 高频词汇", icon: BookOpen },
      { href: "/writing-templates", label: "写作模板", desc: "各题型写作框架", icon: FileText },
      { href: "/faq", label: "常见问题", desc: "使用帮助与解答", icon: HelpCircle },
    ],
  },
  { label: "会员方案", href: "#pricing" },
];

const AUTH_NAV: NavItem[] = [
  { label: "首页", href: "/dashboard" },
  {
    label: "练习",
    children: [
      { href: "/levels/ket", label: "KET 练习", desc: "A2 Key 写作 · 口语", icon: GraduationCap },
      { href: "/levels/pet", label: "PET 练习", desc: "B1 Preliminary 写作 · 口语", icon: GraduationCap },
      { href: "/levels/fce", label: "FCE 练习", desc: "B2 First 写作 · 口语", icon: GraduationCap },
    ],
  },
  {
    label: "备考资料",
    children: [
      { href: "/resources", label: "资料下载", desc: "PDF、音频、词汇表", icon: Download },
      { href: "/vocabulary", label: "核心词汇", desc: "KET/PET/FCE 高频词汇", icon: BookOpen },
      { href: "/writing-templates", label: "写作模板", desc: "各题型写作框架", icon: FileText },
    ],
  },
  { label: "学习进度", href: "/progress" },
];

function DropdownMenu({ items, onClose }: { items: DropdownItem[]; onClose: () => void }) {
  return (
    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2">
      <div className="w-72 rounded-[--radius-md] border border-border bg-bg-card p-2 shadow-lg animate-fade-in">
        {items.map((item) => {
          const isHash = item.href.startsWith("#");
          const Tag = isHash ? "a" : Link;
          return (
            <Tag
              key={item.label}
              href={item.href}
              onClick={onClose}
              className="flex items-start gap-3 rounded-[--radius-sm] px-3 py-2.5 transition-colors hover:bg-bg"
            >
              {item.icon && (
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-light">
                  <item.icon size={16} className="text-blue" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary">{item.label}</p>
                {item.desc && (
                  <p className="mt-0.5 text-xs text-text-tertiary leading-snug">{item.desc}</p>
                )}
              </div>
            </Tag>
          );
        })}
      </div>
    </div>
  );
}

export default function Navbar() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  const handleMouseEnter = (label: string) => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    setOpenDropdown(label);
  };

  const handleMouseLeave = () => {
    closeTimerRef.current = setTimeout(() => setOpenDropdown(null), 150);
  };

  const navItems = user ? AUTH_NAV : GUEST_NAV;

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
            <img src="/logo.png" alt="CambridgeReady" className="h-9 w-9 rounded-[10px] object-contain" />
            <span
              className="text-lg tracking-tight text-text-primary"
              style={{ fontFamily: "var(--font-display)" }}
            >
              CambridgeReady
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) =>
              item.children ? (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => handleMouseEnter(item.label)}
                  onMouseLeave={handleMouseLeave}
                >
                  <button
                    className={`flex items-center gap-1 px-4 py-2 text-[15px] rounded-[--radius-pill] transition-colors ${
                      openDropdown === item.label
                        ? "text-text-primary bg-black/[0.03]"
                        : "text-text-secondary hover:text-text-primary hover:bg-black/[0.03]"
                    }`}
                  >
                    {item.label}
                    <ChevronDown
                      size={14}
                      className={`transition-transform duration-200 ${openDropdown === item.label ? "rotate-180" : ""}`}
                    />
                  </button>
                  {openDropdown === item.label && (
                    <DropdownMenu items={item.children} onClose={() => setOpenDropdown(null)} />
                  )}
                </div>
              ) : item.href?.startsWith("#") ? (
                <a
                  key={item.label}
                  href={item.href}
                  className="px-4 py-2 text-[15px] text-text-secondary rounded-[--radius-pill] transition-colors hover:text-text-primary hover:bg-black/[0.03]"
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.label}
                  href={item.href!}
                  className="px-4 py-2 text-[15px] text-text-secondary rounded-[--radius-pill] transition-colors hover:text-text-primary hover:bg-black/[0.03]"
                >
                  {item.label}
                </Link>
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
            {navItems.map((item) =>
              item.children ? (
                <div key={item.label}>
                  <p className="px-4 pt-4 pb-1 text-xs font-medium uppercase tracking-wider text-text-tertiary">
                    {item.label}
                  </p>
                  {item.children.map((child) =>
                    child.href.startsWith("#") ? (
                      <a
                        key={child.label}
                        href={child.href}
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 rounded-xl transition-colors hover:bg-black/[0.03]"
                      >
                        {child.icon && (
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-blue-light">
                            <child.icon size={14} className="text-blue" />
                          </div>
                        )}
                        <div>
                          <p className="text-[15px] text-text-primary">{child.label}</p>
                          {child.desc && <p className="text-xs text-text-tertiary">{child.desc}</p>}
                        </div>
                      </a>
                    ) : (
                      <Link
                        key={child.label}
                        href={child.href}
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 rounded-xl transition-colors hover:bg-black/[0.03]"
                      >
                        {child.icon && (
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-blue-light">
                            <child.icon size={14} className="text-blue" />
                          </div>
                        )}
                        <div>
                          <p className="text-[15px] text-text-primary">{child.label}</p>
                          {child.desc && <p className="text-xs text-text-tertiary">{child.desc}</p>}
                        </div>
                      </Link>
                    )
                  )}
                </div>
              ) : item.href?.startsWith("#") ? (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 text-[15px] text-text-secondary rounded-xl transition-colors hover:text-text-primary hover:bg-black/[0.03]"
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.label}
                  href={item.href!}
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 text-[15px] text-text-secondary rounded-xl transition-colors hover:text-text-primary hover:bg-black/[0.03]"
                >
                  {item.label}
                </Link>
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
