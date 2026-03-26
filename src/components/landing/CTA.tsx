import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CTA() {
  return (
    <section className="py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-cta-bg px-8 py-20 text-center sm:px-16 lg:py-28">
          {/* Decorative */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-32 -right-32 h-64 w-64 rounded-full bg-blue/10 blur-3xl" />
            <div className="absolute -bottom-32 -left-32 h-64 w-64 rounded-full bg-fce/10 blur-3xl" />
          </div>

          <div className="relative">
            <h2
              className="mx-auto max-w-2xl text-[clamp(1.75rem,4vw,3rem)] leading-tight tracking-tight text-white"
              style={{ fontFamily: "var(--font-display)" }}
            >
              开始你的剑桥英语备考之旅
            </h2>
            <p className="mx-auto mt-5 max-w-lg text-lg leading-relaxed text-white/60">
              免费注册即可体验样卷和核心功能，
              <br className="hidden sm:block" />
              用 AI 助力，让备考更高效
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/register"
                className="group inline-flex items-center gap-2 rounded-[--radius-pill] bg-white px-8 py-4 text-[15px] font-semibold text-cta-bg transition-all hover:bg-white/90 active:scale-[0.97]"
              >
                免费注册
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </Link>
              <a
                href="#pricing"
                className="inline-flex items-center gap-2 rounded-[--radius-pill] border border-white/20 px-8 py-4 text-[15px] font-medium text-white/80 transition-all hover:border-white/40 hover:text-white"
              >
                查看会员方案
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
