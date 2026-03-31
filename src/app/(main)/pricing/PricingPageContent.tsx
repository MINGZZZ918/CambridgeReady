"use client";

import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import CheckoutButtons from "@/components/payment/CheckoutButtons";
import type { MembershipInfo } from "./page";

const FREE_FEATURES = [
  "PDF 资料下载",
  "听力音频",
  "核心词汇表",
  "Writing / Speaking 在线练习（无 AI 评估）",
];

const PREMIUM_FEATURES = [
  "AI 写作批改（剑桥 4 维评分）",
  "AI 口语评估（语音转写 + 4 维评分）",
  "逐句批注与改进建议",
  "中英双语反馈",
  "AI 改进版范文 / 回答",
  "全部免费资料",
];

interface Props {
  membershipInfo: MembershipInfo;
}

export default function PricingPageContent({ membershipInfo }: Props) {
  const { status, daysUntilExpiry, expiryDateStr } = membershipInfo;
  const isActivePremium = status === "premium_active";
  const isExpiring = status === "premium_expiring";
  const isExpired = status === "premium_expired";

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

        {/* Pricing grid */}
        <div className="mx-auto mt-14 grid max-w-4xl items-start gap-6 lg:grid-cols-2">
          {/* Free tier */}
          <div className="relative flex flex-col rounded-[--radius-md] border border-border bg-bg-card p-8 transition-all">
            <h3 className="text-base font-semibold text-text-primary">免费体验</h3>
            <p className="mt-1.5 text-sm text-text-secondary">
              快速体验平台核心功能
            </p>

            <div className="mt-6 flex items-baseline gap-1">
              <span className="text-sm text-text-secondary">¥</span>
              <span
                className="text-5xl font-semibold tracking-tight text-text-primary"
                style={{ fontFamily: "var(--font-display)" }}
              >
                0
              </span>
            </div>

            <Link
              href="/register"
              className="mt-8 flex items-center justify-center gap-2 rounded-[--radius-pill] border border-border py-3 text-[15px] font-medium text-text-primary transition-all hover:border-text-tertiary hover:bg-bg active:scale-[0.97]"
            >
              免费注册
              <ArrowRight size={15} />
            </Link>

            <ul className="mt-8 space-y-3.5 border-t border-border-light pt-8">
              {FREE_FEATURES.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-3 text-[15px] text-text-secondary"
                >
                  <Check size={17} className="mt-0.5 shrink-0 text-ket" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* Premium tier */}
          <div className="relative flex flex-col rounded-[--radius-md] border border-blue bg-bg-card shadow-xl shadow-blue/[0.08] p-8 lg:-mt-4 lg:pb-12 transition-all">
            {/* Badge */}
            {isActivePremium ? (
              <div className="absolute -top-3.5 left-8 rounded-[--radius-pill] bg-ket px-4 py-1 text-xs font-medium text-white">
                当前方案
              </div>
            ) : isExpiring ? (
              <div className="absolute -top-3.5 left-8 rounded-[--radius-pill] bg-amber-500 px-4 py-1 text-xs font-medium text-white">
                即将到期
              </div>
            ) : isExpired ? (
              <div className="absolute -top-3.5 left-8 rounded-[--radius-pill] bg-red-500 px-4 py-1 text-xs font-medium text-white">
                已过期
              </div>
            ) : (
              <div className="absolute -top-3.5 left-8 rounded-[--radius-pill] bg-blue px-4 py-1 text-xs font-medium text-white">
                推荐
              </div>
            )}

            <h3 className="text-base font-semibold text-text-primary">高级会员</h3>
            <p className="mt-1.5 text-sm text-text-secondary">
              AI 写作批改 + AI 口语评估
            </p>

            <div className="mt-6 flex items-baseline gap-1">
              <span className="text-sm text-text-secondary">¥</span>
              <span
                className="text-5xl font-semibold tracking-tight text-text-primary"
                style={{ fontFamily: "var(--font-display)" }}
              >
                499
              </span>
              <span className="text-sm text-text-secondary">/年</span>
            </div>

            {/* CTA area based on membership status */}
            {isActivePremium ? (
              <div className="mt-8 rounded-[--radius-md] bg-ket-light p-4 text-center">
                <p className="text-sm font-medium text-ket">你已是高级会员</p>
                {expiryDateStr && (
                  <p className="mt-1 text-sm text-text-secondary">
                    到期日: {expiryDateStr}
                    {daysUntilExpiry !== null && ` (剩余 ${daysUntilExpiry} 天)`}
                  </p>
                )}
              </div>
            ) : isExpiring ? (
              <div className="mt-8 space-y-3">
                <div className="rounded-[--radius-md] bg-amber-50 p-3 text-center">
                  <p className="text-sm font-medium text-amber-700">
                    将在 {daysUntilExpiry} 天后到期
                  </p>
                </div>
                <CheckoutButtons plan="premium" />
              </div>
            ) : isExpired ? (
              <div className="mt-8 space-y-3">
                <div className="rounded-[--radius-md] bg-red-50 p-3 text-center">
                  <p className="text-sm font-medium text-red-600">会员已过期，续费恢复全部权益</p>
                </div>
                <CheckoutButtons plan="premium" />
              </div>
            ) : (
              <CheckoutButtons plan="premium" />
            )}

            <ul className="mt-8 space-y-3.5 border-t border-border-light pt-8">
              {PREMIUM_FEATURES.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-3 text-[15px] text-text-secondary"
                >
                  <Check size={17} className="mt-0.5 shrink-0 text-blue" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
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
