"use client";

import { useState } from "react";
import { Sparkles, Loader2, ChevronDown } from "lucide-react";
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

export default function WritingPrompt({ content, userAnswer, submitted, onChange, level, isPremium }: Props) {
  const [showSample, setShowSample] = useState(false);
  const [correction, setCorrection] = useState<CorrectionResult | null>(null);
  const [correcting, setCorrecting] = useState(false);
  const [correctionError, setCorrectionError] = useState<string | null>(null);
  const [showImproved, setShowImproved] = useState(false);

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

  const ANNOTATION_STYLES = {
    error: { bg: "bg-red-50", border: "border-red-200", dot: "bg-red-400", label: "错误" },
    improvement: { bg: "bg-amber-50", border: "border-amber-200", dot: "bg-amber-400", label: "建议" },
    good: { bg: "bg-ket-light", border: "border-ket/30", dot: "bg-ket", label: "亮点" },
  };

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
            <div className="space-y-4">
              {/* Score card */}
              <div className="rounded-[--radius-md] border-2 border-fce/30 bg-fce-light/50 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles size={18} className="text-fce" />
                  <h4 className="text-[15px] font-semibold text-fce">AI 评分</h4>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {DIMENSION_LABELS.map(({ key, label, desc }) => {
                    const score = correction.scores[key];
                    return (
                      <div
                        key={key}
                        className="rounded-[--radius-sm] bg-white/70 p-3 text-center"
                      >
                        <div
                          className="text-2xl font-bold"
                          style={{ fontFamily: "var(--font-display)", color: "#8B5CF6" }}
                        >
                          {score}
                          <span className="text-sm font-normal text-text-tertiary">/5</span>
                        </div>
                        <div className="mt-1 text-xs font-medium text-text-primary">{label}</div>
                        <div className="text-[10px] text-text-tertiary">{desc}</div>
                      </div>
                    );
                  })}
                </div>

                {/* Total */}
                <div className="mt-4 flex items-center justify-center gap-2 rounded-[--radius-sm] bg-white/70 py-3">
                  <span className="text-sm font-medium text-text-secondary">总分</span>
                  <span
                    className="text-3xl font-bold"
                    style={{ fontFamily: "var(--font-display)", color: "#8B5CF6" }}
                  >
                    {Object.values(correction.scores).reduce((a, b) => a + b, 0)}
                  </span>
                  <span className="text-sm text-text-tertiary">/ 20</span>
                </div>
              </div>

              {/* Overall feedback */}
              <div className="rounded-[--radius-md] border border-border bg-bg-card p-5">
                <h4 className="text-[15px] font-semibold text-text-primary mb-3">总体评价</h4>
                <p className="text-[14px] leading-relaxed text-text-primary">
                  {correction.overall_feedback_zh}
                </p>
                <p className="mt-2 text-[13px] leading-relaxed text-text-secondary italic">
                  {correction.overall_feedback_en}
                </p>
              </div>

              {/* Annotations */}
              {correction.annotations.length > 0 && (
                <div className="rounded-[--radius-md] border border-border bg-bg-card p-5">
                  <h4 className="text-[15px] font-semibold text-text-primary mb-3">逐句批注</h4>
                  <div className="space-y-2.5">
                    {correction.annotations.map((ann, i) => {
                      const style = ANNOTATION_STYLES[ann.type];
                      return (
                        <div
                          key={i}
                          className={`rounded-[--radius-sm] border ${style.border} ${style.bg} p-3`}
                        >
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className={`h-2 w-2 rounded-full ${style.dot}`} />
                            <span className="text-xs font-medium text-text-secondary">
                              {style.label}
                            </span>
                          </div>
                          <p className="text-[13px] text-text-primary">
                            &ldquo;{ann.original}&rdquo;
                          </p>
                          {ann.suggestion && (
                            <p className="mt-1 text-[13px] text-ket font-medium">
                              → {ann.suggestion}
                            </p>
                          )}
                          <p className="mt-1 text-[12px] text-text-secondary">
                            {ann.comment_zh}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Improved essay */}
              {correction.improved_essay && (
                <div className="rounded-[--radius-md] border-2 border-ket/30 bg-ket-light/50 p-5">
                  <button
                    onClick={() => setShowImproved(!showImproved)}
                    className="flex w-full items-center justify-between text-left"
                  >
                    <h4 className="text-[15px] font-semibold text-ket">
                      AI 改进版范文
                    </h4>
                    <ChevronDown
                      size={16}
                      className={`text-ket transition-transform ${showImproved ? "rotate-180" : ""}`}
                    />
                  </button>
                  {showImproved && (
                    <div className="mt-3 rounded-[--radius-sm] bg-white/70 p-4">
                      <p className="text-[15px] leading-relaxed text-text-primary whitespace-pre-line">
                        {correction.improved_essay}
                      </p>
                    </div>
                  )}
                </div>
              )}
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
