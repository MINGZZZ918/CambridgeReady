"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Trophy, RotateCcw, ArrowRight, Check, X, ChevronDown, Loader2 } from "lucide-react";
import ExplanationPanel from "@/components/practice/ExplanationPanel";

interface QuestionData {
  id: string;
  question_type: string;
  content: {
    stem?: string;
    passage?: string;
    options?: { label: string; text: string }[];
    correct_answer?: string;
    accept_answers?: string[];
    people?: { id: number; description: string }[];
    texts?: { label: string; text: string }[];
    correct_matches?: Record<string, string>;
  };
  explanation_zh: string | null;
  explanation_en: string | null;
}

interface SectionData {
  label: string;
  questions: QuestionData[];
}

interface ResultData {
  examId: string;
  title: string;
  level: string;
  sections: SectionData[];
  answers: Record<number, string>;
  timeUsed: number;
}

function checkCorrect(q: QuestionData, answer: string | undefined): boolean {
  if (!answer) return false;
  if (q.question_type === "fill_blank") {
    const acceptAnswers = q.content.accept_answers ?? [];
    const correct = q.content.correct_answer ?? "";
    const all = [correct, ...acceptAnswers];
    return all.some((a) => a.toLowerCase() === answer.trim().toLowerCase());
  }
  if (q.question_type === "matching") {
    try {
      const userMatches = JSON.parse(answer) as Record<string, string>;
      const correctMatches = q.content.correct_matches ?? {};
      return Object.entries(correctMatches).every(
        ([key, val]) => userMatches[key]?.toUpperCase() === val.toUpperCase()
      );
    } catch {
      return false;
    }
  }
  return answer.toUpperCase() === (q.content.correct_answer ?? "").toUpperCase();
}

export default function PastPaperResultPage() {
  const { paperId } = useParams<{ paperId: string }>();
  const [data, setData] = useState<ResultData | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem(`exam-result-${paperId}`);
    if (stored) {
      setData(JSON.parse(stored));
    }
    setLoading(false);
  }, [paperId]);

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-20 text-center">
        <Loader2 size={32} className="mx-auto animate-spin text-blue" />
        <p className="mt-4 text-text-secondary">加载考试记录中...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-20 text-center">
        <h1
          className="text-2xl tracking-tight"
          style={{ fontFamily: "var(--font-display)" }}
        >
          没有找到考试记录
        </h1>
        <p className="mt-3 text-text-secondary">请重新参加考试</p>
        <Link
          href="/past-papers"
          className="mt-8 inline-flex items-center gap-2 rounded-[--radius-pill] bg-blue px-6 py-3 text-[15px] font-medium text-white hover:bg-blue-dark"
        >
          返回真题专区
          <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  const allQuestions = data.sections.flatMap((s) => s.questions);
  const total = allQuestions.length;
  let correct = 0;
  allQuestions.forEach((q, i) => {
    if (checkCorrect(q, data.answers[i])) correct++;
  });
  const percentage = Math.round((correct / total) * 100);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m} 分 ${s} 秒`;
  };

  // Per-section stats
  let globalIndex = 0;
  const sectionStats = data.sections.map((section) => {
    let sCorrect = 0;
    const sTotal = section.questions.length;
    section.questions.forEach((q, i) => {
      if (checkCorrect(q, data.answers[globalIndex + i])) sCorrect++;
    });
    const startIdx = globalIndex;
    globalIndex += sTotal;
    return { ...section, correct: sCorrect, total: sTotal, startIndex: startIdx };
  });

  const LEVEL_COLORS: Record<string, string> = {
    ket: "#10B981",
    pet: "#F59E0B",
    fce: "#8B5CF6",
  };
  const color = LEVEL_COLORS[data.level] ?? "#2563EB";

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 lg:py-14">
      {/* Score card */}
      <div className="rounded-[--radius-md] border border-border bg-bg-card p-8 text-center lg:p-12">
        <div
          className="mx-auto flex h-20 w-20 items-center justify-center rounded-full"
          style={{ backgroundColor: `${color}15` }}
        >
          <Trophy size={36} style={{ color }} />
        </div>

        <h1
          className="mt-6 text-3xl tracking-tight"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {data.title}
        </h1>

        <div className="mt-8 flex items-center justify-center gap-12">
          <div>
            <div
              className="text-4xl font-bold"
              style={{ fontFamily: "var(--font-display)", color }}
            >
              {percentage}%
            </div>
            <div className="mt-1 text-sm text-text-secondary">正确率</div>
          </div>
          <div className="h-12 w-px bg-border" />
          <div>
            <div
              className="text-4xl font-bold"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {correct}/{total}
            </div>
            <div className="mt-1 text-sm text-text-secondary">答对题数</div>
          </div>
          <div className="h-12 w-px bg-border" />
          <div>
            <div
              className="text-4xl font-bold"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {formatTime(data.timeUsed)}
            </div>
            <div className="mt-1 text-sm text-text-secondary">用时</div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href={`/past-papers/${paperId}`}
            className="inline-flex items-center justify-center gap-2 rounded-[--radius-pill] border border-border px-6 py-3 text-[15px] font-medium hover:bg-bg"
          >
            <RotateCcw size={16} />
            重新做一遍
          </Link>
          <Link
            href="/past-papers"
            className="inline-flex items-center justify-center gap-2 rounded-[--radius-pill] bg-blue px-6 py-3 text-[15px] font-medium text-white hover:bg-blue-dark"
          >
            返回真题专区
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* Section breakdown */}
      <div className="mt-10">
        <h2
          className="text-xl font-semibold tracking-tight"
          style={{ fontFamily: "var(--font-display)" }}
        >
          各部分得分
        </h2>
        <div className="mt-4 space-y-3">
          {sectionStats.map((section) => {
            const pct = Math.round((section.correct / section.total) * 100);
            return (
              <div
                key={section.label}
                className="rounded-[--radius-md] border border-border bg-bg-card p-5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[15px] font-medium">{section.label}</span>
                  <span className="text-sm text-text-secondary">
                    {section.correct}/{section.total} ({pct}%)
                  </span>
                </div>
                <div className="mt-3 h-2 rounded-full bg-border-light">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${pct}%`, backgroundColor: color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Question review */}
      <div className="mt-10">
        <h2
          className="text-xl font-semibold tracking-tight"
          style={{ fontFamily: "var(--font-display)" }}
        >
          逐题回顾
        </h2>
        <div className="mt-4 space-y-2">
          {allQuestions.map((q, i) => {
            const userAnswer = data.answers[i];
            const isCorrect = checkCorrect(q, userAnswer);
            const isExpanded = expandedIndex === i;

            return (
              <div
                key={q.id}
                className="rounded-[--radius-md] border border-border bg-bg-card overflow-hidden"
              >
                <button
                  onClick={() => setExpandedIndex(isExpanded ? null : i)}
                  className="flex w-full items-center gap-3 p-4 text-left hover:bg-bg transition-colors"
                >
                  <div
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white ${
                      isCorrect ? "bg-ket" : "bg-red-400"
                    }`}
                  >
                    {isCorrect ? <Check size={14} /> : <X size={14} />}
                  </div>
                  <span className="text-sm text-text-secondary">第 {i + 1} 题</span>
                  <span className="flex-1 truncate text-[14px] text-text-primary">
                    {q.content.stem}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`shrink-0 text-text-tertiary transition-transform ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isExpanded && (
                  <div className="border-t border-border-light px-4 pb-4 pt-3">
                    {q.content.passage && (
                      <div className="mb-3 rounded-[8px] bg-bg p-3 text-[13px] text-text-secondary whitespace-pre-line">
                        {q.content.passage}
                      </div>
                    )}

                    {q.content.options && (
                      <div className="space-y-1.5">
                        {q.content.options.map((opt) => {
                          const optIsCorrect = opt.label === q.content.correct_answer;
                          const optIsUser = opt.label === userAnswer;
                          return (
                            <div
                              key={opt.label}
                              className={`flex items-start gap-2 rounded-[8px] p-2.5 text-[13px] ${
                                optIsCorrect
                                  ? "bg-ket-light text-ket font-medium"
                                  : optIsUser
                                  ? "bg-red-50 text-red-600 line-through"
                                  : "text-text-secondary"
                              }`}
                            >
                              <span className="shrink-0 font-semibold">{opt.label}.</span>
                              <span>{opt.text}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {q.question_type === "fill_blank" && (
                      <div className="space-y-1.5">
                        <div className="rounded-[8px] bg-red-50 p-2.5 text-[13px] text-red-600">
                          你的答案：{userAnswer ?? "未作答"}
                        </div>
                        <div className="rounded-[8px] bg-ket-light p-2.5 text-[13px] text-ket">
                          正确答案：{q.content.correct_answer}
                        </div>
                      </div>
                    )}

                    <div className="mt-3">
                      <ExplanationPanel
                        explanationZh={q.explanation_zh}
                        explanationEn={q.explanation_en}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
