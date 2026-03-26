"use client";

import type { MultipleChoiceContent } from "@/types";

interface Props {
  content: MultipleChoiceContent;
  selectedAnswer: string | null;
  submitted: boolean;
  onSelect: (answer: string) => void;
}

export default function MultipleChoice({ content, selectedAnswer, submitted, onSelect }: Props) {
  const isCorrect = (label: string) => submitted && label === content.correct_answer;
  const isWrong = (label: string) => submitted && label === selectedAnswer && label !== content.correct_answer;

  return (
    <div className="space-y-6">
      {/* Passage */}
      {content.passage && (
        <div className="rounded-[--radius-md] border border-border-light bg-bg p-6">
          <p className="text-[15px] leading-relaxed text-text-primary whitespace-pre-line">
            {content.passage}
          </p>
        </div>
      )}

      {/* Stem */}
      <p className="text-base font-medium text-text-primary">{content.stem}</p>

      {/* Options */}
      <div className="space-y-3">
        {content.options.map((option) => {
          const selected = selectedAnswer === option.label;
          const correct = isCorrect(option.label);
          const wrong = isWrong(option.label);

          let borderColor = "border-border";
          let bg = "bg-bg-card";

          if (correct) {
            borderColor = "border-ket";
            bg = "bg-ket-light";
          } else if (wrong) {
            borderColor = "border-red-400";
            bg = "bg-red-50";
          } else if (selected && !submitted) {
            borderColor = "border-blue";
            bg = "bg-blue-light";
          }

          return (
            <button
              key={option.label}
              onClick={() => !submitted && onSelect(option.label)}
              disabled={submitted}
              className={`flex w-full items-start gap-4 rounded-[--radius-md] border p-4 text-left transition-all ${borderColor} ${bg} ${
                !submitted ? "hover:border-blue/40 active:scale-[0.99]" : ""
              }`}
            >
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                  correct
                    ? "bg-ket text-white"
                    : wrong
                    ? "bg-red-400 text-white"
                    : selected && !submitted
                    ? "bg-blue text-white"
                    : "bg-bg text-text-secondary border border-border"
                }`}
              >
                {option.label}
              </span>
              <span className="pt-1 text-[15px] leading-relaxed text-text-primary">
                {option.text}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
