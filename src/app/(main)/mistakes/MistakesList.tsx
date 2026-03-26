"use client";

import { useState } from "react";
import { ChevronDown, Filter } from "lucide-react";
import ExplanationPanel from "@/components/practice/ExplanationPanel";

interface MistakeRecord {
  id: string;
  question_id: string;
  user_answer: { value: string } | null;
  is_correct: boolean;
  question_snapshot: {
    question_type: string;
    content: Record<string, unknown>;
    explanation_zh: string | null;
    explanation_en: string | null;
  } | null;
  level: string | null;
  skill: string | null;
  part: number | null;
  created_at: string;
}

const LEVEL_STYLES: Record<string, { label: string; color: string; lightBg: string }> = {
  ket: { label: "KET", color: "#10B981", lightBg: "#ECFDF5" },
  pet: { label: "PET", color: "#F59E0B", lightBg: "#FFFBEB" },
  fce: { label: "FCE", color: "#8B5CF6", lightBg: "#F5F3FF" },
};

const SKILL_LABELS: Record<string, string> = {
  reading: "阅读",
  listening: "听力",
  writing: "写作",
  speaking: "口语",
};

const FILTERS = ["全部", "KET", "PET", "FCE"] as const;

export default function MistakesList({ mistakes }: { mistakes: MistakeRecord[] }) {
  const [filter, setFilter] = useState<string>("全部");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = filter === "全部"
    ? mistakes
    : mistakes.filter((m) => m.level?.toUpperCase() === filter);

  return (
    <>
      {/* Filters */}
      <div className="mt-8 flex flex-wrap items-center gap-2">
        {FILTERS.map((label) => (
          <button
            key={label}
            onClick={() => setFilter(label)}
            className={`rounded-[--radius-pill] px-4 py-2 text-sm font-medium transition-colors ${
              filter === label
                ? "bg-blue text-white"
                : "border border-border text-text-secondary hover:bg-bg"
            }`}
          >
            {label}
          </button>
        ))}
        <span className="ml-auto text-sm text-text-tertiary">
          <Filter size={14} className="mr-1 inline" />
          {filtered.length} 道
        </span>
      </div>

      {/* Mistakes list */}
      <div className="mt-6 space-y-3">
        {filtered.map((mistake) => {
          const snapshot = mistake.question_snapshot;
          const levelStyle = LEVEL_STYLES[mistake.level ?? ""] ?? { label: "?", color: "#6B6B6B", lightBg: "#F5F5F5" };
          const content = snapshot?.content as {
            stem?: string;
            passage?: string;
            options?: { label: string; text: string }[];
            correct_answer?: string;
          } | undefined;
          const isExpanded = expandedId === mistake.id;

          return (
            <div
              key={mistake.id}
              className="rounded-[--radius-md] border border-border bg-bg-card overflow-hidden"
            >
              {/* Header — clickable */}
              <button
                onClick={() => setExpandedId(isExpanded ? null : mistake.id)}
                className="flex w-full items-center gap-3 p-5 text-left transition-colors hover:bg-bg"
              >
                <span
                  className="shrink-0 rounded-[--radius-pill] px-2.5 py-0.5 text-xs font-bold"
                  style={{ backgroundColor: levelStyle.lightBg, color: levelStyle.color }}
                >
                  {levelStyle.label}
                </span>
                <span className="text-xs text-text-tertiary">
                  {SKILL_LABELS[mistake.skill ?? ""] ?? mistake.skill} · Part {mistake.part}
                </span>
                <span className="flex-1 truncate text-[15px] text-text-primary">
                  {content?.stem ?? "题目"}
                </span>
                <ChevronDown
                  size={16}
                  className={`shrink-0 text-text-tertiary transition-transform ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Expanded content */}
              {isExpanded && content && (
                <div className="border-t border-border-light px-5 pb-5 pt-4">
                  {/* Passage */}
                  {content.passage && (
                    <div className="mb-4 rounded-[8px] bg-bg p-4 text-[14px] leading-relaxed text-text-secondary whitespace-pre-line">
                      {content.passage}
                    </div>
                  )}

                  {/* Options with highlighting */}
                  {content.options && (
                    <div className="space-y-2">
                      {content.options.map((opt) => {
                        const isCorrect = opt.label === content.correct_answer;
                        const isUserAnswer = opt.label === mistake.user_answer?.value;
                        return (
                          <div
                            key={opt.label}
                            className={`flex items-start gap-3 rounded-[8px] p-3 text-[14px] ${
                              isCorrect
                                ? "bg-ket-light text-ket font-medium"
                                : isUserAnswer
                                ? "bg-red-50 text-red-600 line-through"
                                : "text-text-secondary"
                            }`}
                          >
                            <span className="shrink-0 font-semibold">{opt.label}.</span>
                            <span>{opt.text}</span>
                            {isCorrect && <span className="ml-auto shrink-0 text-xs">正确答案</span>}
                            {isUserAnswer && !isCorrect && <span className="ml-auto shrink-0 text-xs">你的答案</span>}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* For fill_blank type */}
                  {snapshot?.question_type === "fill_blank" && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 rounded-[8px] bg-red-50 p-3 text-[14px] text-red-600">
                        <span className="font-medium">你的答案：</span>
                        <span className="line-through">{mistake.user_answer?.value ?? "—"}</span>
                      </div>
                      <div className="flex items-center gap-2 rounded-[8px] bg-ket-light p-3 text-[14px] text-ket">
                        <span className="font-medium">正确答案：</span>
                        <span>{content.correct_answer ?? "—"}</span>
                      </div>
                    </div>
                  )}

                  {/* Explanation */}
                  {snapshot && (
                    <div className="mt-4">
                      <ExplanationPanel
                        explanationZh={snapshot.explanation_zh}
                        explanationEn={snapshot.explanation_en}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
