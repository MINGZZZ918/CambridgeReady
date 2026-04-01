"use client";

import { useState } from "react";
import { PenLine, Mic, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";

const WRITING_SCORES = [
  { dimension: "Content", dimensionZh: "内容", score: 4, max: 5, tip: "覆盖了所有要点，但部分论述不够深入" },
  { dimension: "Communicative Achievement", dimensionZh: "交际目标", score: 3, max: 5, tip: "语气和格式基本恰当，需更贴合目标读者" },
  { dimension: "Organisation", dimensionZh: "组织结构", score: 4, max: 5, tip: "段落清晰，建议增加衔接词让过渡更自然" },
  { dimension: "Language", dimensionZh: "语言运用", score: 3, max: 5, tip: "存在基础语法错误，词汇多样性需提升" },
];

const WRITING_ANNOTATIONS = [
  {
    original: "I think the internet is very good for students.",
    annotation: "表达过于简单，建议使用更具体的论述",
    improved: "I believe the internet offers significant educational benefits for students.",
  },
  {
    original: "They can find many informations online.",
    annotation: "\"information\" 是不可数名词，不能加 s",
    improved: "They can find a wealth of information online.",
  },
  {
    original: "Also it help them to study at home.",
    annotation: "主谓一致错误：it helps",
    improved: "Furthermore, it enables them to study effectively from home.",
  },
];

const SPEAKING_SCORES = [
  { dimension: "Grammar & Vocabulary", dimensionZh: "语法词汇", score: 4, max: 5, tip: "语法基本正确，尝试使用更多高级词汇" },
  { dimension: "Discourse Management", dimensionZh: "话语管理", score: 3, max: 5, tip: "回答缺少连接词，逻辑衔接需加强" },
  { dimension: "Pronunciation", dimensionZh: "发音", score: 4, max: 5, tip: "发音清晰，注意个别单词的重音" },
  { dimension: "Interactive Communication", dimensionZh: "互动交际", score: 3, max: 5, tip: "回答偏简短，需主动拓展内容" },
];

type Tab = "writing" | "speaking";

export default function ProductDemo() {
  const [activeTab, setActiveTab] = useState<Tab>("writing");

  return (
    <section className="py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-blue">
            产品效果
          </p>
          <h2
            className="mt-3 text-[clamp(1.75rem,3.5vw,2.75rem)] leading-tight tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            剑桥官方标准，AI 精准评估
          </h2>
          <p className="mt-4 text-lg text-text-secondary leading-relaxed">
            按照 Cambridge Assessment 官方评分维度逐项打分，精确指出每个维度的改进方向
          </p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-[--radius-pill] border border-ket/30 bg-ket-light/50 px-4 py-1.5 text-sm font-medium text-ket">
            <ShieldCheck size={15} />
            基于 Cambridge Assessment 官方评分标准
          </div>
        </div>

        {/* Tab switcher */}
        <div className="mx-auto mt-12 flex max-w-xs rounded-[--radius-pill] border border-border bg-bg-card p-1">
          <button
            onClick={() => setActiveTab("writing")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-[--radius-pill] py-2.5 text-sm font-medium transition-all ${
              activeTab === "writing"
                ? "bg-blue text-white shadow-sm"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            <PenLine size={15} />
            写作批改
          </button>
          <button
            onClick={() => setActiveTab("speaking")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-[--radius-pill] py-2.5 text-sm font-medium transition-all ${
              activeTab === "speaking"
                ? "bg-blue text-white shadow-sm"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            <Mic size={15} />
            口语评估
          </button>
        </div>

        {/* Demo content */}
        <div className="mx-auto mt-10 max-w-5xl">
          {activeTab === "writing" ? <WritingDemo /> : <SpeakingDemo />}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link
            href="/register"
            className="group inline-flex items-center gap-2 rounded-[--radius-pill] bg-blue px-7 py-3.5 text-[15px] font-medium text-white transition-all hover:bg-blue-dark active:scale-[0.97]"
          >
            免费注册体验
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function ScoreBar({ score, max, color }: { score: number; max: number; color: string }) {
  const pct = (score / max) * 100;
  return (
    <div className="h-2 flex-1 rounded-full bg-gray-100">
      <div
        className="h-full rounded-full transition-all duration-700"
        style={{ width: `${pct}%`, backgroundColor: color }}
      />
    </div>
  );
}

function WritingDemo() {
  return (
    <div className="grid gap-6 lg:grid-cols-5">
      {/* Score card — left */}
      <div className="rounded-[--radius-md] border border-border bg-bg-card p-6 lg:col-span-2">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-pet" />
          <h3 className="text-sm font-semibold text-pet">AI 评分</h3>
        </div>
        <p className="mt-1.5 flex items-center gap-1.5 text-[11px] text-text-tertiary">
          <ShieldCheck size={12} className="text-ket" />
          Cambridge Writing 官方评分维度
        </p>

        {/* Total score */}
        <div className="mt-5 text-center">
          <div
            className="text-5xl font-bold text-text-primary"
            style={{ fontFamily: "var(--font-display)" }}
          >
            14
            <span className="text-lg font-normal text-text-tertiary"> / 20</span>
          </div>
          <p className="mt-1 text-sm text-text-secondary">PET Writing Part 1</p>
        </div>

        {/* Dimension scores with tips */}
        <div className="mt-6 space-y-4">
          {WRITING_SCORES.map((s) => (
            <div key={s.dimension}>
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-secondary">{s.dimensionZh}</span>
                <span className="font-medium text-text-primary">
                  {s.score}/{s.max}
                </span>
              </div>
              <div className="mt-1.5">
                <ScoreBar score={s.score} max={s.max} color="#F59E0B" />
              </div>
              <p className="mt-1 text-[11px] leading-snug text-text-tertiary">
                {s.tip}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-6 rounded-lg bg-pet-light/60 p-3 text-xs leading-relaxed text-text-secondary">
          总体评价：文章基本完成了任务要求，但部分表达过于简单，建议使用更丰富的连接词和高级词汇来提升语言分。
        </p>
      </div>

      {/* Annotations — right */}
      <div className="rounded-[--radius-md] border border-border bg-bg-card p-6 lg:col-span-3">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-pet" />
          <h3 className="text-sm font-semibold text-pet">逐句批注</h3>
        </div>

        <div className="mt-5 space-y-5">
          {WRITING_ANNOTATIONS.map((a, i) => (
            <div key={i} className="rounded-lg border border-border-light bg-bg p-4">
              {/* Original */}
              <p className="text-[15px] text-text-primary">
                <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-[11px] font-bold text-red-500">
                  {i + 1}
                </span>
                <span className="line-through decoration-red-300/60">{a.original}</span>
              </p>
              {/* Annotation */}
              <p className="mt-2 pl-7 text-sm text-pet font-medium">
                {a.annotation}
              </p>
              {/* Improved */}
              <p className="mt-1.5 pl-7 text-sm text-ket">
                {a.improved}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SpeakingDemo() {
  return (
    <div className="grid gap-6 lg:grid-cols-5">
      {/* Score card — left */}
      <div className="rounded-[--radius-md] border border-border bg-bg-card p-6 lg:col-span-2">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-fce" />
          <h3 className="text-sm font-semibold text-fce">AI 评分</h3>
        </div>
        <p className="mt-1.5 flex items-center gap-1.5 text-[11px] text-text-tertiary">
          <ShieldCheck size={12} className="text-ket" />
          Cambridge Speaking 官方评分维度
        </p>

        {/* Total score */}
        <div className="mt-5 text-center">
          <div
            className="text-5xl font-bold text-text-primary"
            style={{ fontFamily: "var(--font-display)" }}
          >
            14
            <span className="text-lg font-normal text-text-tertiary"> / 20</span>
          </div>
          <p className="mt-1 text-sm text-text-secondary">PET Speaking Part 2</p>
        </div>

        {/* Dimension scores with tips */}
        <div className="mt-6 space-y-4">
          {SPEAKING_SCORES.map((s) => (
            <div key={s.dimension}>
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-secondary">{s.dimensionZh}</span>
                <span className="font-medium text-text-primary">
                  {s.score}/{s.max}
                </span>
              </div>
              <div className="mt-1.5">
                <ScoreBar score={s.score} max={s.max} color="#8B5CF6" />
              </div>
              <p className="mt-1 text-[11px] leading-snug text-text-tertiary">
                {s.tip}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-6 rounded-lg bg-fce-light/60 p-3 text-xs leading-relaxed text-text-secondary">
          总体评价：回答内容切题，但语句之间缺少衔接，建议多使用 however, on the other hand 等连接词，让回答更流畅自然。
        </p>
      </div>

      {/* Transcript + improved — right */}
      <div className="space-y-6 lg:col-span-3">
        {/* Transcript */}
        <div className="rounded-[--radius-md] border border-border bg-bg-card p-6">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-fce" />
            <h3 className="text-sm font-semibold text-fce">语音转写</h3>
          </div>
          <div className="mt-4 rounded-lg bg-bg p-4">
            <p className="text-[15px] leading-relaxed text-text-primary">
              &quot;I think... uh... for the party, we should
              <span className="mx-1 rounded bg-red-100 px-1 text-red-500">choosed</span>
              the beach because... it&apos;s more fun. And also,
              <span className="mx-1 rounded bg-red-100 px-1 text-red-500">the weathers</span>
              is good in summer. But the park is
              <span className="mx-1 rounded bg-pet-light px-1 text-pet">also a good option</span>
              because it&apos;s closer to everyone.&quot;
            </p>
            <div className="mt-3 flex gap-4 text-xs text-text-tertiary">
              <span>时长: 32 秒</span>
              <span>语速: 适中</span>
              <span>填充词: 2 个</span>
            </div>
          </div>
        </div>

        {/* Improved version */}
        <div className="rounded-[--radius-md] border border-border bg-bg-card p-6">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-ket" />
            <h3 className="text-sm font-semibold text-ket">AI 改进版回答</h3>
          </div>
          <div className="mt-4 rounded-lg bg-ket-light/40 p-4">
            <p className="text-[15px] leading-relaxed text-text-primary">
              &quot;I think the beach would be an excellent choice for the party because it offers more
              activities and entertainment. Additionally, the weather tends to be wonderful during
              summer, which would make it even more enjoyable. Having said that, the park is also
              worth considering since it&apos;s more conveniently located for everyone.&quot;
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
