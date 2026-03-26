"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, X, RotateCcw, Trophy } from "lucide-react";
import MultipleChoice from "@/components/practice/MultipleChoice";
import FillBlank from "@/components/practice/FillBlank";
import ExplanationPanel from "@/components/practice/ExplanationPanel";
import { checkAnswer } from "@/lib/utils/scoring";
import type { Question, MultipleChoiceContent, FillBlankContent } from "@/types";
import type { PartInfo } from "@/lib/utils/levels";

interface Props {
  questions: Question[];
  levelInfo: { key: string; label: string; labelZh: string; color: string; lightBg: string };
  skillInfo: { key: string; label: string; labelZh: string };
  partInfo: PartInfo;
  level: string;
  skill: string;
  part: string;
}

export default function PracticeClient({
  questions,
  levelInfo,
  skillInfo,
  partInfo,
  level,
  skill,
  part,
}: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState<Record<number, boolean>>({});
  const [showSummary, setShowSummary] = useState(false);

  const currentQuestion = questions[currentIndex];
  const total = questions.length;
  const progress = total > 0 ? ((currentIndex + 1) / total) * 100 : 0;

  const results = useMemo(() => {
    if (!showSummary) return null;
    let correct = 0;
    questions.forEach((q, i) => {
      if (answers[i] !== undefined && checkAnswer(q, answers[i])) {
        correct++;
      }
    });
    return { correct, total, percentage: Math.round((correct / total) * 100) };
  }, [showSummary, questions, answers, total]);

  // Save results to Supabase when practice is completed
  const savedRef = useRef(false);
  useEffect(() => {
    if (!showSummary || savedRef.current) return;
    savedRef.current = true;

    const answerRecords = questions.map((q, i) => ({
      question_id: q.id,
      user_answer: answers[i] ?? "",
      is_correct: answers[i] !== undefined && checkAnswer(q, answers[i]),
      question_snapshot: {
        question_type: q.question_type,
        content: q.content,
        explanation_zh: q.explanation_zh,
        explanation_en: q.explanation_en,
      },
    }));

    fetch("/api/practice", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        level,
        skill,
        part: parseInt(part),
        answers: answerRecords,
      }),
    }).catch(() => {
      // Silently fail — user can still see their results
    });
  }, [showSummary, questions, answers, level, skill, part]);

  if (questions.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-20 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-bg" style={{ color: levelInfo.color }}>
          <Trophy size={28} />
        </div>
        <h2 className="text-2xl font-semibold tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
          题目即将上线
        </h2>
        <p className="mt-3 text-text-secondary">
          {levelInfo.label} {skillInfo.label} Part {part} 的题目正在准备中
        </p>
        <Link
          href={`/levels/${level}`}
          className="mt-8 inline-flex items-center gap-2 rounded-[--radius-pill] bg-blue px-6 py-3 text-[15px] font-medium text-white hover:bg-blue-dark"
        >
          <ArrowLeft size={16} />
          返回级别页
        </Link>
      </div>
    );
  }

  // Summary view
  if (showSummary && results) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-16 animate-fade-in-up">
        <div className="rounded-[--radius-md] border border-border bg-bg-card p-8 text-center lg:p-12">
          <div
            className="mx-auto flex h-20 w-20 items-center justify-center rounded-full"
            style={{ backgroundColor: levelInfo.lightBg }}
          >
            <Trophy size={36} style={{ color: levelInfo.color }} />
          </div>

          <h2
            className="mt-6 text-3xl tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            练习完成！
          </h2>

          <div className="mt-8 flex items-center justify-center gap-12">
            <div>
              <div
                className="text-4xl font-bold"
                style={{ fontFamily: "var(--font-display)", color: levelInfo.color }}
              >
                {results.percentage}%
              </div>
              <div className="mt-1 text-sm text-text-secondary">正确率</div>
            </div>
            <div className="h-12 w-px bg-border" />
            <div>
              <div className="text-4xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
                {results.correct}/{results.total}
              </div>
              <div className="mt-1 text-sm text-text-secondary">答对题数</div>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              onClick={() => {
                setCurrentIndex(0);
                setAnswers({});
                setSubmitted({});
                setShowSummary(false);
                savedRef.current = false;
              }}
              className="inline-flex items-center justify-center gap-2 rounded-[--radius-pill] border border-border px-6 py-3 text-[15px] font-medium transition-all hover:bg-bg"
            >
              <RotateCcw size={16} />
              重新练习
            </button>
            <Link
              href={`/levels/${level}`}
              className="inline-flex items-center justify-center gap-2 rounded-[--radius-pill] bg-blue px-6 py-3 text-[15px] font-medium text-white hover:bg-blue-dark"
            >
              返回级别页
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = () => {
    setSubmitted((prev) => ({ ...prev, [currentIndex]: true }));
  };

  const handleNext = () => {
    if (currentIndex < total - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setShowSummary(true);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const isSubmitted = !!submitted[currentIndex];
  const hasAnswer = answers[currentIndex] !== undefined && answers[currentIndex] !== "";
  const isCorrect = isSubmitted && currentQuestion && checkAnswer(currentQuestion, answers[currentIndex]);

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      {/* Top bar */}
      <div className="flex items-center gap-4">
        <Link
          href={`/levels/${level}`}
          className="flex h-10 w-10 items-center justify-center rounded-xl text-text-secondary hover:bg-bg transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <span
              className="rounded-[--radius-pill] px-2.5 py-0.5 text-xs font-bold"
              style={{ backgroundColor: levelInfo.lightBg, color: levelInfo.color }}
            >
              {levelInfo.label}
            </span>
            {skillInfo.labelZh} · Part {part}
          </div>
          {/* Progress bar */}
          <div className="mt-2 h-1.5 w-full rounded-full bg-border-light">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${progress}%`, backgroundColor: levelInfo.color }}
            />
          </div>
        </div>
        <span className="text-sm font-medium text-text-secondary tabular-nums">
          {currentIndex + 1} / {total}
        </span>
      </div>

      {/* Question area */}
      <div className="mt-8">
        {currentQuestion && (
          <div className="animate-fade-in" key={currentIndex}>
            {/* Question type renderer */}
            {currentQuestion.question_type === "multiple_choice" && (
              <MultipleChoice
                content={currentQuestion.content as MultipleChoiceContent}
                selectedAnswer={answers[currentIndex] ?? null}
                submitted={isSubmitted}
                onSelect={(answer) =>
                  setAnswers((prev) => ({ ...prev, [currentIndex]: answer }))
                }
              />
            )}
            {currentQuestion.question_type === "fill_blank" && (
              <FillBlank
                content={currentQuestion.content as FillBlankContent}
                userAnswer={answers[currentIndex] ?? ""}
                submitted={isSubmitted}
                onChange={(answer) =>
                  setAnswers((prev) => ({ ...prev, [currentIndex]: answer }))
                }
              />
            )}

            {/* Result indicator */}
            {isSubmitted && (
              <div
                className={`mt-6 flex items-center gap-3 rounded-[--radius-md] p-4 ${
                  isCorrect ? "bg-ket-light" : "bg-red-50"
                }`}
              >
                {isCorrect ? (
                  <>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-ket text-white">
                      <Check size={16} />
                    </div>
                    <span className="text-[15px] font-medium text-ket">
                      回答正确！
                    </span>
                  </>
                ) : (
                  <>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-400 text-white">
                      <X size={16} />
                    </div>
                    <span className="text-[15px] font-medium text-red-600">
                      回答错误
                    </span>
                  </>
                )}
              </div>
            )}

            {/* Explanation */}
            {isSubmitted && (
              <div className="mt-4">
                <ExplanationPanel
                  explanationZh={currentQuestion.explanation_zh}
                  explanationEn={currentQuestion.explanation_en}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom actions */}
      <div className="mt-10 flex items-center justify-between border-t border-border-light pt-6">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="inline-flex items-center gap-2 rounded-[--radius-pill] border border-border px-5 py-2.5 text-sm font-medium text-text-secondary transition-all hover:bg-bg disabled:opacity-40 disabled:pointer-events-none"
        >
          <ArrowLeft size={15} />
          上一题
        </button>

        {!isSubmitted ? (
          <button
            onClick={handleSubmit}
            disabled={!hasAnswer}
            className="inline-flex items-center gap-2 rounded-[--radius-pill] px-6 py-2.5 text-sm font-medium text-white transition-all active:scale-[0.97] disabled:opacity-40 disabled:pointer-events-none"
            style={{ backgroundColor: hasAnswer ? levelInfo.color : undefined }}
          >
            提交答案
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="inline-flex items-center gap-2 rounded-[--radius-pill] bg-blue px-6 py-2.5 text-sm font-medium text-white transition-all hover:bg-blue-dark active:scale-[0.97]"
          >
            {currentIndex < total - 1 ? "下一题" : "查看总结"}
            <ArrowRight size={15} />
          </button>
        )}
      </div>
    </div>
  );
}
