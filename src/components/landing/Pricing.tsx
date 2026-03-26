import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import CheckoutButtons from "@/components/payment/CheckoutButtons";

const TIERS = [
  {
    name: "免费体验",
    price: "0",
    period: "",
    description: "快速体验平台核心功能",
    features: [
      "每级别 1 套样卷",
      "考纲解读与 FAQ",
      "核心词汇表",
      "每周推送 3 道题",
    ],
    cta: "免费注册",
    href: "/register",
    style: "default" as const,
    plan: null,
  },
  {
    name: "高级会员",
    price: "499",
    period: "/年",
    description: "全量题库 + 系统备考，一站式搞定",
    features: [
      "全部 2300+ 练习题",
      "21 套完整模拟卷",
      "中英双语详细解析",
      "错题本自动收录",
      "全部听力音频",
      "学习报告",
    ],
    cta: "立即订阅",
    href: "/pricing",
    style: "featured" as const,
    badge: "推荐",
    plan: "premium" as const,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 lg:py-32 bg-bg-card">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium tracking-wide text-blue uppercase">
            会员方案
          </p>
          <h2
            className="mt-3 text-[clamp(1.75rem,3.5vw,2.75rem)] leading-tight tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            简单透明的定价
          </h2>
          <p className="mt-4 text-lg text-text-secondary leading-relaxed">
            仅为线下培训费用的 1/20，让优质备考资源触手可及
          </p>
        </div>

        {/* Pricing grid — 2 columns */}
        <div className="mx-auto mt-14 grid max-w-4xl items-start gap-6 lg:grid-cols-2">
          {TIERS.map((tier) => {
            const isFeatured = tier.style === "featured";
            return (
              <div
                key={tier.name}
                className={`relative flex flex-col rounded-[--radius-md] border p-8 transition-all ${
                  isFeatured
                    ? "border-blue bg-bg-card shadow-xl shadow-blue/[0.08] lg:-mt-4 lg:pb-12"
                    : "border-border bg-bg-card"
                }`}
              >
                {/* Badge */}
                {tier.badge && (
                  <div className="absolute -top-3.5 left-8 rounded-[--radius-pill] bg-blue px-4 py-1 text-xs font-medium text-white">
                    {tier.badge}
                  </div>
                )}

                {/* Header */}
                <h3 className="text-base font-semibold text-text-primary">
                  {tier.name}
                </h3>
                <p className="mt-1.5 text-sm text-text-secondary">
                  {tier.description}
                </p>

                {/* Price */}
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-sm text-text-secondary">¥</span>
                  <span
                    className="text-5xl font-semibold tracking-tight text-text-primary"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {tier.price}
                  </span>
                  {tier.period && (
                    <span className="text-sm text-text-secondary">
                      {tier.period}
                    </span>
                  )}
                </div>

                {/* CTA */}
                {tier.plan ? (
                  <CheckoutButtons plan={tier.plan} />
                ) : (
                  <Link
                    href={tier.href}
                    className="mt-8 flex items-center justify-center gap-2 rounded-[--radius-pill] border border-border py-3 text-[15px] font-medium text-text-primary transition-all hover:border-text-tertiary hover:bg-bg active:scale-[0.97]"
                  >
                    {tier.cta}
                    <ArrowRight size={15} />
                  </Link>
                )}

                {/* Features list */}
                <ul className="mt-8 space-y-3.5 border-t border-border-light pt-8">
                  {tier.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 text-[15px] text-text-secondary"
                    >
                      <Check
                        size={17}
                        className={`mt-0.5 shrink-0 ${
                          isFeatured ? "text-blue" : "text-ket"
                        }`}
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Activation code link */}
        <div className="mx-auto mt-10 max-w-4xl text-center">
          <Link
            href="/activate"
            className="inline-flex items-center gap-1.5 text-sm text-text-secondary transition-colors hover:text-blue"
          >
            已有激活码？点击这里激活
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
