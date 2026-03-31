import { BookOpen, Target, Users, Sparkles } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "关于我们 — CambridgeReady",
  description: "CambridgeReady 是专为 K12 学生打造的剑桥英语备考平台，覆盖 KET、PET、FCE 三个级别。",
};

const VALUES = [
  {
    icon: Target,
    title: "精准备考",
    description: "所有题目严格对标剑桥英语官方题型与难度，按 Reading、Listening、Writing、Speaking 四项技能分类，帮助学生有针对性地提升。",
  },
  {
    icon: Sparkles,
    title: "AI 驱动",
    description: "利用 AI 技术提供写作批改、口语模拟等智能功能，让每位学生都能获得个性化的学习反馈。",
  },
  {
    icon: BookOpen,
    title: "体系化学习",
    description: "从分项刷题到完整模考，从错题本到学习报告，构建完整的备考闭环，让进步清晰可见。",
  },
  {
    icon: Users,
    title: "服务 K12 学生",
    description: "界面简洁友好，适合中小学生独立使用。家长也可以通过学习报告了解孩子的备考进度。",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-8">
      {/* Hero Section */}
      <section className="py-24 lg:py-32 text-center">
        <p className="text-sm font-medium uppercase tracking-widest text-blue">
          关于我们
        </p>
        <h1
          className="mt-4 text-4xl font-semibold tracking-tight text-text-primary lg:text-5xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          用 AI 备考剑桥英语
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-text-secondary">
          CambridgeReady 是专为 K12 学生打造的剑桥英语 (KET / PET / FCE) 在线备考平台。
          我们相信，优质的备考资源不应受限于地域和价格，每个孩子都值得更聪明的学习方式。
        </p>
      </section>

      {/* Values */}
      <section className="pb-24 lg:pb-32">
        <div className="grid gap-8 sm:grid-cols-2">
          {VALUES.map((item) => (
            <div
              key={item.title}
              className="rounded-[--radius-md] border border-border bg-bg-card p-8"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-light">
                <item.icon className="h-6 w-6 text-blue" />
              </div>
              <h3
                className="mt-5 text-xl font-semibold text-text-primary"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {item.title}
              </h3>
              <p className="mt-3 text-[15px] leading-relaxed text-text-secondary">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Levels */}
      <section className="pb-24 lg:pb-32">
        <h2
          className="text-center text-3xl font-semibold tracking-tight text-text-primary lg:text-4xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          覆盖三大级别
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-center text-text-secondary">
          从入门到进阶，满足不同阶段学生的备考需求
        </p>
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {[
            { name: "KET", full: "Key English Test", color: "bg-ket-light text-ket border-ket/20", desc: "A2 级别，适合小学高年级及初中低年级学生" },
            { name: "PET", full: "Preliminary English Test", color: "bg-pet-light text-pet border-pet/20", desc: "B1 级别，适合初中生及有一定基础的小学生" },
            { name: "FCE", full: "First Certificate in English", color: "bg-fce-light text-fce border-fce/20", desc: "B2 级别，适合高中生及英语能力较强的初中生" },
          ].map((level) => (
            <div
              key={level.name}
              className={`rounded-[--radius-md] border p-8 text-center ${level.color}`}
            >
              <span className="text-3xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
                {level.name}
              </span>
              <p className="mt-2 text-sm font-medium opacity-80">{level.full}</p>
              <p className="mt-4 text-sm leading-relaxed opacity-70">{level.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Disclaimer */}
      <section className="pb-24 lg:pb-32">
        <div className="rounded-[--radius-md] border border-border bg-bg-card p-8 text-center">
          <p className="text-sm text-text-tertiary">
            CambridgeReady 是独立的第三方备考平台，与 Cambridge Assessment English 无官方关联。
            所有考试名称及商标归其各自所有者所有。
          </p>
        </div>
      </section>
    </div>
  );
}
