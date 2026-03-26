import {
  BookOpen,
  ClipboardList,
  PenLine,
  Mic,
  BarChart3,
  Sparkles,
} from "lucide-react";

const FEATURES = [
  {
    icon: BookOpen,
    title: "分项刷题",
    description:
      "按 Reading、Listening、Writing、Speaking 分项练习，逐一突破每个 Part。",
    accent: "bg-blue-light text-blue",
  },
  {
    icon: ClipboardList,
    title: "完整模考",
    description:
      "还原真实考试的时间与题量，实时计时，交卷后立即出分并查看详细解析。",
    accent: "bg-ket-light text-ket",
  },
  {
    icon: PenLine,
    title: "AI 写作批改",
    description:
      "按剑桥官方 4 维标准评分：内容、交际、组织、语言，逐句批注加范文对比。",
    tag: "高级会员",
    accent: "bg-pet-light text-pet",
  },
  {
    icon: Mic,
    title: "AI 口语模拟",
    description:
      "AI 考官全真模拟口语考试流程，语音识别 + 实时评分，随时随地练口语。",
    tag: "高级会员",
    accent: "bg-fce-light text-fce",
  },
  {
    icon: BarChart3,
    title: "学习报告",
    description:
      "各技能正确率、模考成绩趋势、连续学习天数，全方位追踪备考进度。",
    accent: "bg-blue-light text-blue",
  },
  {
    icon: Sparkles,
    title: "AI 智能出题",
    description:
      "基于你的错题数据，识别薄弱知识点，自动生成针对性练习题，精准提分。",
    tag: "高级会员",
    accent: "bg-pet-light text-pet",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 lg:py-32 bg-bg-card">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium tracking-wide text-blue uppercase">
            平台功能
          </p>
          <h2
            className="mt-3 text-[clamp(1.75rem,3.5vw,2.75rem)] leading-tight tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            一站式备考，比线下培训更高效
          </h2>
          <p className="mt-4 text-lg text-text-secondary leading-relaxed">
            年费 ¥199 起，价格仅为线下培训的 1/20
          </p>
        </div>

        {/* Feature grid */}
        <div className="mx-auto mt-16 grid max-w-5xl gap-px overflow-hidden rounded-[--radius-md] border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="group relative flex flex-col bg-bg-card p-8 transition-colors hover:bg-bg"
            >
              {/* Icon */}
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl ${feature.accent}`}
              >
                <feature.icon size={22} />
              </div>

              {/* Title + tag */}
              <div className="mt-5 flex items-center gap-2">
                <h3 className="text-base font-semibold text-text-primary">
                  {feature.title}
                </h3>
                {feature.tag && (
                  <span className="rounded-[--radius-pill] bg-fce-light px-2.5 py-0.5 text-[11px] font-medium text-fce">
                    {feature.tag}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="mt-2.5 flex-1 text-[15px] leading-relaxed text-text-secondary">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
