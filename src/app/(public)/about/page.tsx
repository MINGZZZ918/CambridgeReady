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
    description: "所有内容严格对标剑桥英语官方题型与难度，提供 Writing 和 Speaking 在线练习，帮助学生有针对性地提升。",
  },
  {
    icon: Sparkles,
    title: "AI 驱动",
    description: "AI 写作批改按剑桥 4 维标准评分，AI 口语评估提供语音转写和 4 维评分，让每位学生都能获得专业级的学习反馈。",
  },
  {
    icon: BookOpen,
    title: "免费资料",
    description: "阅读练习 PDF、听力音频、核心词汇表免费下载，降低备考门槛，让优质资源触手可及。",
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
          我们提供免费备考资料下载，以及 AI 写作批改和口语评估，让每个孩子都能获得专业级的学习反馈。
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

    </div>
  );
}
