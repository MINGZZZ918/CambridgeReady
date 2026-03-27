"use client";

import { useState } from "react";
import type { OpenWriteContent } from "@/types";

interface Props {
  content: OpenWriteContent;
  userAnswer: string;
  submitted: boolean;
  onChange: (answer: string) => void;
}

export default function WritingPrompt({ content, userAnswer, submitted, onChange }: Props) {
  const [showSample, setShowSample] = useState(false);

  const wordCount = userAnswer.trim() === "" ? 0 : userAnswer.trim().split(/\s+/).length;

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

      {/* Sample answer panel */}
      {submitted && content.sample_answer && (
        <div className="rounded-[--radius-md] border-2 border-ket/30 bg-ket-light/50 p-6">
          <button
            onClick={() => setShowSample(!showSample)}
            className="flex w-full items-center justify-between text-left"
          >
            <h4 className="text-[15px] font-semibold text-ket">
              📝 参考范文
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
    </div>
  );
}
