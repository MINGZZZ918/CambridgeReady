import Link from "next/link";

const FOOTER_LINKS = {
  产品: [
    { label: "KET 备考", href: "/levels/ket" },
    { label: "PET 备考", href: "/levels/pet" },
    { label: "FCE 备考", href: "/levels/fce" },
    { label: "会员方案", href: "/pricing" },
  ],
  资源: [
    { label: "备考指南", href: "/guide" },
    { label: "核心词汇", href: "/vocabulary" },
    { label: "写作模板", href: "/writing-templates" },
    { label: "常见问题", href: "/faq" },
  ],
  关于: [
    { label: "关于我们", href: "/about" },
    { label: "联系方式", href: "/contact" },
    { label: "用户协议", href: "/terms" },
    { label: "隐私政策", href: "/privacy" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-border-light">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-4 lg:py-20">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-blue text-white font-bold text-sm">
                CR
              </div>
              <span
                className="text-lg tracking-tight"
                style={{ fontFamily: "var(--font-display)" }}
              >
                CambridgeReady
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-[15px] leading-relaxed text-text-secondary">
              用 AI 备考剑桥英语，聪明地拿高分。覆盖 KET、PET、FCE 三个级别。
            </p>
            <p className="mt-6 text-xs text-text-tertiary">
              本平台与 Cambridge Assessment English 无官方关联
            </p>
          </div>

          {/* Link groups */}
          {Object.entries(FOOTER_LINKS).map(([group, links]) => (
            <div key={group}>
              <h4 className="text-sm font-medium text-text-primary tracking-wide">
                {group}
              </h4>
              <ul className="mt-5 space-y-3.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[15px] text-text-secondary transition-colors hover:text-text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center gap-4 border-t border-border-light py-8 sm:flex-row sm:justify-between">
          <p className="text-sm text-text-tertiary">
            © {new Date().getFullYear()} CambridgeReady. All rights reserved.
          </p>
          <p className="text-sm text-text-tertiary">
            Made with care for Cambridge English learners
          </p>
        </div>
      </div>
    </footer>
  );
}
