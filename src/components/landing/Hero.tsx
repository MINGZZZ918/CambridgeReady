import Link from "next/link";
import { ArrowRight, PenLine, Mic, Award, Download } from "lucide-react";

const STATS = [
  { icon: PenLine, value: "AI", label: "写作批改" },
  { icon: Mic, value: "AI", label: "口语评估" },
  { icon: Award, value: "3", label: "级别覆盖" },
  { icon: Download, value: "免费", label: "备考资料" },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 lg:pt-44 lg:pb-32">
      {/* Subtle decorative elements */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-blue/[0.04] blur-3xl" />
        <div className="absolute top-1/2 -left-60 h-[400px] w-[400px] rounded-full bg-fce/[0.04] blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Eyebrow */}
        <div className="animate-fade-in-up">
          <div className="inline-flex items-center gap-2 rounded-[--radius-pill] border border-border bg-bg-card px-4 py-1.5 text-sm text-text-secondary shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-ket animate-pulse" />
            AI 驱动的剑桥英语备考平台
          </div>
        </div>

        {/* Headline */}
        <h1
          className="mt-8 max-w-3xl text-[clamp(2.25rem,5vw,4rem)] leading-[1.1] tracking-tight animate-fade-in-up stagger-1"
          style={{ fontFamily: "var(--font-display)" }}
        >
          用 AI 备考剑桥英语，
          <br />
          <span className="text-blue">聪明地拿高分</span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-text-secondary animate-fade-in-up stagger-2">
          AI 写作批改 · AI 口语评估 · 免费备考资料下载
          <br className="hidden sm:block" />
          覆盖 KET、PET、FCE 全级别，助你从 A2 进阶到 B2
        </p>

        {/* CTA buttons */}
        <div className="mt-10 flex flex-wrap items-center gap-4 animate-fade-in-up stagger-3">
          <Link
            href="/register"
            className="group inline-flex items-center gap-2 rounded-[--radius-pill] bg-blue px-7 py-3.5 text-[15px] font-medium text-white transition-all hover:bg-blue-dark active:scale-[0.97]"
          >
            免费注册
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-0.5"
            />
          </Link>
          <a
            href="#levels"
            className="inline-flex items-center gap-2 rounded-[--radius-pill] border border-border px-7 py-3.5 text-[15px] font-medium text-text-primary transition-all hover:border-text-tertiary hover:bg-bg-card active:scale-[0.97]"
          >
            了解更多
          </a>
        </div>

        {/* Stats strip */}
        <div className="mt-20 grid grid-cols-2 gap-px overflow-hidden rounded-[--radius-md] border border-border bg-border sm:grid-cols-4 animate-fade-in-up stagger-4">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="flex items-center gap-4 bg-bg-card p-6"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-light">
                <stat.icon size={20} className="text-blue" />
              </div>
              <div>
                <div
                  className="text-2xl font-semibold tracking-tight text-text-primary"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {stat.value}
                </div>
                <div className="text-sm text-text-secondary">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
