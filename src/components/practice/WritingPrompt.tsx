"use client";

import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import type { OpenWriteContent } from "@/types";

interface Annotation {
  original: string;
  suggestion: string;
  comment_zh: string;
  type: "error" | "improvement" | "good";
}

interface CorrectionResult {
  scores: {
    content: number;
    communicative_achievement: number;
    organisation: number;
    language: number;
  };
  overall_feedback_zh: string;
  overall_feedback_en: string;
  annotations: Annotation[];
  improved_essay: string;
}

interface Props {
  content: OpenWriteContent;
  userAnswer: string;
  submitted: boolean;
  onChange: (answer: string) => void;
  level?: string;
  isPremium?: boolean;
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

export default function WritingPrompt({ content, userAnswer, submitted, onChange, level, isPremium }: Props) {
  const [showSample, setShowSample] = useState(false);
  const [correction, setCorrection] = useState<CorrectionResult | null>(null);
  const [correcting, setCorrecting] = useState(false);
  const [correctionError, setCorrectionError] = useState<string | null>(null);

  const wordCount = userAnswer.trim() === "" ? 0 : userAnswer.trim().split(/\s+/).length;

  const handleCorrection = async () => {
    setCorrecting(true);
    setCorrectionError(null);
    try {
      const res = await fetch("/api/ai/writing-correction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          level: level ?? "pet",
          prompt: `${content.stem}\n\n${content.prompt}`,
          essay: userAnswer,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "批改失败");
      }
      const result: CorrectionResult = await res.json();
      setCorrection(result);
    } catch (err) {
      setCorrectionError(err instanceof Error ? err.message : "批改失败，请稍后重试");
    } finally {
      setCorrecting(false);
    }
  };

  const DIMENSION_LABELS: { key: keyof CorrectionResult["scores"]; label: string; desc: string }[] = [
    { key: "content", label: "内容", desc: "Content" },
    { key: "communicative_achievement", label: "交际目标", desc: "Communicative Achievement" },
    { key: "organisation", label: "组织结构", desc: "Organisation" },
    { key: "language", label: "语言运用", desc: "Language" },
  ];

  return (
    <div className="space-y-6">
      {/* Stem */}
      <p className="text-base font-medium text-text-primary">{content.stem}</p>

      {/* Prompt box */}
      <div className="rounded-[--radius-md] border border-border-light bg-bg p-6">
        <p className="text-[15px] leading-relaxed text-text-primary whitespace-pre-line">
          {content.prompt}
        </p>
        {content.word_limit && (
          <p className="mt-3 text-sm text-text-tertiary">
            建议字数：{content.word_limit} 词左右
          </p>
        )}
      </div>

      {/* Textarea */}
      <div>
        <label className="block text-sm font-medium text-text-secondary mb-2">
          你的作文
        </label>
        <textarea
          value={userAnswer}
          onChange={(e) => !submitted && onChange(e.target.value)}
          disabled={submitted}
          placeholder="在此输入你的作文..."
          rows={10}
          className={`block w-full rounded-[--radius-sm] border px-4 py-3 text-[15px] leading-relaxed outline-none transition-colors resize-y ${
            submitted
              ? "border-border bg-bg text-text-secondary"
              : "border-border bg-bg-card text-text-primary focus:border-blue focus:ring-2 focus:ring-blue/10"
          }`}
        />
        <div className="mt-2 flex items-center justify-between">
          <span className={`text-sm ${wordCount < 10 ? "text-text-tertiary" : "text-text-secondary"}`}>
            已写 {wordCount} 词
            {wordCount < 10 && !submitted && (
              <span className="ml-2 text-text-tertiary">（至少 10 词才能提交）</span>
            )}
          </span>
          {content.word_limit && (
            <span className={`text-sm ${
              wordCount > content.word_limit * 1.2 ? "text-amber-500" : "text-text-tertiary"
            }`}>
              / {content.word_limit}
            </span>
          )}
        </div>
      </div>

      {/* AI Correction button + result (after submission) */}
      {submitted && (
        <>
          {/* AI Correction */}
          {!correction && (
            <div className="rounded-[--radius-md] border-2 border-fce/30 bg-fce-light/50 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles size={18} className="text-fce" />
                  <h4 className="text-[15px] font-semibold text-fce">AI 智能批改</h4>
                </div>
                {isPremium ? (
                  <button
                    onClick={handleCorrection}
                    disabled={correcting}
                    className="inline-flex items-center gap-2 rounded-[--radius-pill] bg-fce px-4 py-2 text-sm font-medium text-white hover:bg-fce/90 disabled:opacity-60"
                  >
                    {correcting ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        批改中...
                      </>
                    ) : (
                      "开始批改"
                    )}
                  </button>
                ) : (
                  <a
                    href="/pricing"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-fce hover:underline"
                  >
                    升级解锁
                  </a>
                )}
              </div>
              <p className="mt-2 text-sm text-text-secondary">
                {isPremium
                  ? "AI 将按剑桥官方评分标准，从内容、交际目标、组织结构、语言运用四个维度评分并给出批注"
                  : "高级会员可使用 AI 批改，获得剑桥标准四维评分和逐句批注"}
              </p>
              {correctionError && (
                <p className="mt-3 text-sm text-red-500">{correctionError}</p>
              )}
            </div>
          )}

          {/* AI Correction result */}
          {correction && (
            <div className="grid gap-6 lg:grid-cols-5">
              {/* Score card — left */}
              <div className="rounded-[--radius-md] border border-border bg-bg-card p-6 lg:col-span-2">
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-fce" />
                  <h4 className="text-sm font-semibold text-fce">AI 评分</h4>
                </div>

                {/* Total score */}
                <div className="mt-5 text-center">
                  <div
                    className="text-5xl font-bold text-text-primary"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {Object.values(correction.scores).reduce((a, b) => a + b, 0)}
                    <span className="text-lg font-normal text-text-tertiary"> / 20</span>
                  </div>
                  <p className="mt-1 text-sm text-text-secondary">
                    {(level ?? "pet").toUpperCase()} Writing
                  </p>
                </div>

                {/* Dimension scores with bars */}
                <div className="mt-6 space-y-3.5">
                  {DIMENSION_LABELS.map(({ key, label }) => {
                    const score = correction.scores[key];
                    return (
                      <div key={key}>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-text-secondary">{label}</span>
                          <span className="font-medium text-text-primary">
                            {score}/5
                          </span>
                        </div>
                        <div className="mt-1.5">
                          <ScoreBar score={score} max={5} color="#8B5CF6" />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Overall feedback */}
                <p className="mt-6 rounded-lg bg-fce-light/60 p-3 text-xs leading-relaxed text-text-secondary">
                  {correction.overall_feedback_zh}
                </p>
                {correction.overall_feedback_en && (
                  <p className="mt-2 rounded-lg bg-bg p-3 text-xs leading-relaxed text-text-tertiary italic">
                    {correction.overall_feedback_en}
                  </p>
                )}
              </div>

              {/* Annotations + improved — right */}
              <div className="space-y-6 lg:col-span-3">
                {/* Annotations */}
                {correction.annotations.length > 0 && (
                  <div className="rounded-[--radius-md] border border-border bg-bg-card p-6">
                    <div className="flex items-center gap-2">
                      <Sparkles size={16} className="text-fce" />
                      <h4 className="text-sm font-semibold text-fce">逐句批注</h4>
                    </div>

                    <div className="mt-5 space-y-4">
                      {correction.annotations.map((ann, i) => (
                        <div key={i} className="rounded-lg border border-border-light bg-bg p-4">
                          {/* Original with strikethrough */}
                          <p className="text-[15px] text-text-primary">
                            <span className={`mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold text-white ${
                              ann.type === "error" ? "bg-red-400" : ann.type === "improvement" ? "bg-amber-400" : "bg-ket"
                            }`}>
                              {i + 1}
                            </span>
                            {ann.type === "good" ? (
                              <span>{ann.original}</span>
                            ) : (
                              <span className="line-through decoration-red-300/60">{ann.original}</span>
                            )}
                          </p>
                          {/* Comment */}
                          <p className="mt-2 pl-7 text-sm font-medium text-fce">
                            {ann.comment_zh}
                          </p>
                          {/* Suggestion */}
                          {ann.suggestion && ann.type !== "good" && (
                            <p className="mt-1.5 pl-7 text-sm text-ket">
                              → {ann.suggestion}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Improved essay */}
                {correction.improved_essay && (
                  <div className="rounded-[--radius-md] border border-border bg-bg-card p-6">
                    <div className="flex items-center gap-2">
                      <Sparkles size={16} className="text-ket" />
                      <h4 className="text-sm font-semibold text-ket">AI 改进版范文</h4>
                    </div>
                    <div className="mt-4 rounded-lg bg-ket-light/40 p-4">
                      <p className="text-[15px] leading-relaxed text-text-primary whitespace-pre-line">
                        {correction.improved_essay}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Sample answer panel */}
          {content.sample_answer && (
            <div className="rounded-[--radius-md] border-2 border-ket/30 bg-ket-light/50 p-6">
              <button
                onClick={() => setShowSample(!showSample)}
                className="flex w-full items-center justify-between text-left"
              >
                <h4 className="text-[15px] font-semibold text-ket">
                  参考范文
                </h4>
                <span className="text-sm text-ket">
                  {showSample ? "收起" : "展开查看"}
                </span>
              </button>
              {showSample && (
                <div className="mt-4 rounded-[--radius-sm] bg-white/70 p-4">
                  <p className="text-[15px] leading-relaxed text-text-primary whitespace-pre-line">
                    {content.sample_answer}
                  </p>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
