"use client";

import { useState } from "react";
import type { FillBlankContent } from "@/types";

interface Props {
  content: FillBlankContent;
  userAnswer: string;
  submitted: boolean;
  onChange: (answer: string) => void;
}

export default function FillBlank({ content, userAnswer, submitted, onChange }: Props) {
  const isCorrect =
    submitted &&
    content.accept_answers.some(
      (a) => a.toLowerCase() === userAnswer.trim().toLowerCase()
    );

  return (
    <div className="space-y-6">
      {/* Stem */}
      <p className="text-base font-medium text-text-primary">{content.stem}</p>

      {/* Passage with blank */}
      <div className="rounded-[--radius-md] border border-border-light bg-bg p-6">
        <p className="text-[15px] leading-loose text-text-primary whitespace-pre-line">
          {content.passage}
        </p>
      </div>

      {/* Input */}
      <div>
        <label className="block text-sm font-medium text-text-secondary mb-2">
          你的答案
        </label>
        <input
          type="text"
          value={userAnswer}
          onChange={(e) => !submitted && onChange(e.target.value)}
          disabled={submitted}
          placeholder="输入一个单词"
          className={`block w-full max-w-xs rounded-[--radius-sm] border px-4 py-3 text-[15px] outline-none transition-colors ${
            submitted
              ? isCorrect
                ? "border-ket bg-ket-light text-ket"
                : "border-red-400 bg-red-50 text-red-600"
              : "border-border bg-bg-card text-text-primary focus:border-blue focus:ring-2 focus:ring-blue/10"
          }`}
        />
        {submitted && !isCorrect && (
          <p className="mt-2 text-sm text-ket font-medium">
            正确答案：{content.correct_answer}
          </p>
        )}
      </div>
    </div>
  );
}
