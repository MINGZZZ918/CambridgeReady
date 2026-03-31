import {
  PenLine,
  Mic,
  Download,
  Award,
} from "lucide-react";

const FEATURES = [
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
    title: "AI 口语评估",
    description:
      "语音转写 + 四维评分（语法词汇、话语管理、发音、互动交际），AI 生成改进版回答。",
    tag: "高级会员",
    accent: "bg-fce-light text-fce",
  },
  {
    icon: Download,
    title: "免费资料下载",
    description:
      "阅读练习 PDF、听力音频、核心词汇表，覆盖三个级别，注册即可免费下载。",
    accent: "bg-blue-light text-blue",
  },
  {
    icon: Award,
    title: "覆盖三大级别",
    description:
      "KET (A2)、PET (B1)、FCE (B2) 三个级别全覆盖，Writing 和 Speaking 在线练习。",
    accent: "bg-ket-light text-ket",
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
            AI 驱动的剑桥英语备考
          </h2>
          <p className="mt-4 text-lg text-text-secondary leading-relaxed">
            免费资料 + AI 写作批改 + AI 口语评估
          </p>
        </div>

        {/* Feature grid */}
        <div className="mx-auto mt-16 grid max-w-5xl gap-px overflow-hidden rounded-[--radius-md] border border-border bg-border sm:grid-cols-2 lg:grid-cols-2">
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
