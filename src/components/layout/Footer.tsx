import Link from "next/link";

const FOOTER_LINKS = {
  产品: [
    { label: "KET 备考", href: "/levels/ket" },
    { label: "PET 备考", href: "/levels/pet" },
    { label: "FCE 备考", href: "/levels/fce" },
    { label: "会员方案", href: "/pricing" },
  ],
  资源: [
    { label: "备考资料下载", href: "/resources" },
    { label: "核心词汇", href: "/vocabulary" },
    { label: "写作模板", href: "/writing-templates" },
    { label: "常见问题", href: "/faq" },
    { label: "联系方式", href: "/contact" },
  ],
  关于: [
    { label: "关于我们", href: "/about" },
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
              <img src="/logo.png" alt="CambridgeReady" className="h-9 w-9 rounded-[10px] object-contain" />
              <span
                className="text-lg tracking-tight"
                style={{ fontFamily: "var(--font-display)" }}
              >
                CambridgeReady
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-[15px] leading-relaxed text-text-secondary">
              AI 驱动的剑桥英语备考平台，提供写作批改、口语评估和免费备考资料。覆盖 KET、PET、FCE 三个级别。
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
