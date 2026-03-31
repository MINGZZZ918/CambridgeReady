import Link from "next/link";
import { ArrowRight, BookOpen, Headphones, PenLine, Mic } from "lucide-react";

const LEVELS = [
  {
    key: "ket",
    name: "KET",
    cefr: "A2 Key",
    description: "剑桥英语入门级考试，适合小学高年级到初一学生。测试基础英语沟通能力。",
    skills: ["阅读与写作", "听力", "口语"],
    color: "#10B981",
    lightBg: "#ECFDF5",
    borderColor: "border-ket/20",
  },
  {
    key: "pet",
    name: "PET",
    cefr: "B1 Preliminary",
    description: "中级英语考试，适合初中学生。证明能够在日常情境中使用英语进行有效交流。",
    skills: ["阅读", "写作", "听力", "口语"],
    color: "#F59E0B",
    lightBg: "#FFFBEB",
    borderColor: "border-pet/20",
    featured: true,
  },
  {
    key: "fce",
    name: "FCE",
    cefr: "B2 First",
    description: "中高级英语考试，适合高中学生。达到 B2 水平后可衔接雅思备考。",
    skills: ["阅读与英语运用", "写作", "听力", "口语"],
    color: "#8B5CF6",
    lightBg: "#F5F3FF",
    borderColor: "border-fce/20",
  },
];

const SKILL_ICONS = [BookOpen, Headphones, PenLine, Mic];

export default function LevelCards() {
  return (
    <section id="levels" className="py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section header */}
        <div className="max-w-2xl">
          <p className="text-sm font-medium tracking-wide text-blue uppercase">
            三大级别
          </p>
          <h2
            className="mt-3 text-[clamp(1.75rem,3.5vw,2.75rem)] leading-tight tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            选择你的备考级别
          </h2>
          <p className="mt-4 text-lg text-text-secondary leading-relaxed">
            从 KET 到 FCE，每个级别都有免费备考资料和 AI 写作/口语评估
          </p>
        </div>

        {/* Cards grid */}
        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {LEVELS.map((level) => (
            <Link
              key={level.key}
              href={`/levels/${level.key}`}
              className={`group relative flex flex-col rounded-[--radius-md] border bg-bg-card p-8 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${level.borderColor}`}
              style={{
                borderTopWidth: "3px",
                borderTopColor: level.color,
              }}
            >
              {/* Badge */}
              <div className="flex items-center justify-between">
                <div
                  className="inline-flex items-center gap-2 rounded-[--radius-pill] px-3.5 py-1.5 text-sm font-semibold"
                  style={{
                    backgroundColor: level.lightBg,
                    color: level.color,
                  }}
                >
                  {level.name}
                </div>
                <span className="text-sm text-text-tertiary">{level.cefr}</span>
              </div>

              {/* Content */}
              <p className="mt-5 flex-1 text-[15px] leading-relaxed text-text-secondary">
                {level.description}
              </p>

              {/* Skills */}
              <div className="mt-6 flex flex-wrap gap-2">
                {level.skills.map((skill, i) => {
                  const Icon = SKILL_ICONS[i % SKILL_ICONS.length];
                  return (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1.5 rounded-[--radius-sm] bg-bg px-3 py-1.5 text-xs text-text-secondary"
                    >
                      <Icon size={13} />
                      {skill}
                    </span>
                  );
                })}
              </div>

              {/* Bottom */}
              <div className="mt-8 flex items-center justify-between border-t border-border-light pt-6">
                <span className="text-sm text-text-secondary">
                  免费资料 + AI 评估
                </span>
                <span
                  className="inline-flex items-center gap-1 text-sm font-medium transition-all group-hover:gap-2"
                  style={{ color: level.color }}
                >
                  查看详情
                  <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
