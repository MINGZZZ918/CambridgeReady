"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Clock, AlertTriangle } from "lucide-react";
import MultipleChoice from "@/components/practice/MultipleChoice";
import FillBlank from "@/components/practice/FillBlank";
import MatchingQuestion from "@/components/practice/MatchingQuestion";
import { checkAnswer } from "@/lib/utils/scoring";
import type { Question, MultipleChoiceContent, FillBlankContent, MatchingContent } from "@/types";

interface Section {
  label: string;
  skill: string;
  part: number;
  questions: Question[];
}

interface Props {
  examId: string;
  title: string;
  timeLimitMinutes: number;
  sections: Section[];
  level: string;
}

export default function ExamClient({
  examId,
  title,
  timeLimitMinutes,
  sections,
  level,
}: Props) {
  const router = useRouter();
  const allQuestions = sections.flatMap((s) => s.questions);
  const total = allQuestions.length;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string | Record<string, string>>>({});
  const [secondsLeft, setSecondsLeft] = useState(timeLimitMinutes * 60);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  // Timer
  useEffect(() => {
    if (isFinished) return;
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isFinished]);

  // Auto-submit when time runs out
  useEffect(() => {
    if (secondsLeft === 0 && !isFinished) {
      handleSubmit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft, isFinished]);

  const handleSubmit = useCallback(() => {
    setIsFinished(true);

    // Save results to sessionStorage for the result page
    const resultData = {
      examId,
      title,
      level,
      sections: sections.map((section) => ({
        label: section.label,
        questions: section.questions.map((q) => ({
          id: q.id,
          question_type: q.question_type,
          content: q.content,
          explanation_zh: q.explanation_zh,
          explanation_en: q.explanation_en,
        })),
      })),
      answers,
      timeUsed: timeLimitMinutes * 60 - secondsLeft,
    };

    sessionStorage.setItem(`exam-result-${examId}`, JSON.stringify(resultData));

    // Persist to server (fire-and-forget)
    const timeUsed = timeLimitMinutes * 60 - secondsLeft;
    const answerRecords: {
      question_id: string;
      user_answer: string;
      is_correct: boolean;
      question_snapshot: {
        question_type: string;
        content: unknown;
        explanation_zh: string | null;
        explanation_en: string | null;
      };
      level: string;
      skill: string;
      part: number;
    }[] = [];

    const sectionScores: Record<string, number> = {};
    let totalScore = 0;

    for (const section of sections) {
      let sectionCorrect = 0;
      for (const q of section.questions) {
        const idx = allQuestions.indexOf(q);
        const raw = answers[idx];
        const userAns = typeof raw === "object" && raw !== null ? JSON.stringify(raw) : (raw ?? "");
        const correct = checkAnswer(q, raw ?? "");
        if (correct) {
          sectionCorrect++;
          totalScore++;
        }
        answerRecords.push({
          question_id: q.id,
          user_answer: userAns,
          is_correct: correct,
          question_snapshot: {
            question_type: q.question_type,
            content: q.content,
            explanation_zh: q.explanation_zh,
            explanation_en: q.explanation_en,
          },
          level,
          skill: section.skill,
          part: section.part,
        });
      }
      sectionScores[section.label] = sectionCorrect;
    }

    fetch("/api/exam", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        examId,
        level,
        totalScore,
        maxScore: total,
        timeUsedSeconds: timeUsed,
        sectionScores,
        answers: answerRecords,
      }),
    }).catch(() => {});

    router.push(`/exam/${examId}/result`);
  }, [examId, title, level, sections, answers, timeLimitMinutes, secondsLeft, router, allQuestions, total]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const isLowTime = secondsLeft < 300; // < 5 min
  const currentQuestion = allQuestions[currentIndex];
  const answeredCount = Object.keys(answers).length;

  // Find which section this question belongs to
  let sectionLabel = "";
  let offset = 0;
  for (const section of sections) {
    if (currentIndex < offset + section.questions.length) {
      sectionLabel = section.label;
      break;
    }
    offset += section.questions.length;
  }

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      {/* Top bar */}
      <div className="sticky top-0 z-10 border-b border-border bg-bg-card/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
          <div>
            <div className="text-sm font-medium text-text-primary">{title}</div>
            <div className="text-xs text-text-secondary">{sectionLabel}</div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-text-secondary">
              {answeredCount}/{total} 已答
            </span>
            <div
              className={`flex items-center gap-1.5 rounded-[--radius-pill] px-3 py-1.5 text-sm font-mono font-medium ${
                isLowTime
                  ? "bg-red-50 text-red-600 animate-pulse"
                  : "bg-bg text-text-primary"
              }`}
            >
              <Clock size={14} />
              {formatTime(secondsLeft)}
            </div>
            <button
              onClick={() => setShowConfirm(true)}
              className="rounded-[--radius-pill] bg-blue px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-dark"
            >
              交卷
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-5xl flex-1 gap-6 px-6 py-6">
        {/* Question number sidebar */}
        <div className="hidden w-48 shrink-0 lg:block">
          <div className="sticky top-20 rounded-[--radius-md] border border-border bg-bg-card p-4">
            <div className="text-xs font-medium text-text-secondary mb-3">题号导航</div>
            <div className="grid grid-cols-5 gap-1.5">
              {allQuestions.map((_, i) => {
                const isActive = i === currentIndex;
                const isAnswered = answers[i] !== undefined;
                return (
                  <button
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-medium transition-colors ${
                      isActive
                        ? "bg-blue text-white"
                        : isAnswered
                        ? "bg-ket-light text-ket"
                        : "bg-bg text-text-secondary hover:bg-border-light"
                    }`}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Question area */}
        <div className="flex-1">
          <div className="rounded-[--radius-md] border border-border bg-bg-card p-6 lg:p-8">
            <div className="mb-6 flex items-center justify-between">
              <span className="text-sm text-text-secondary">
                第 {currentIndex + 1} 题 / 共 {total} 题
              </span>
              <span className="text-xs text-text-tertiary">{sectionLabel}</span>
            </div>

            {currentQuestion && (
              <div key={currentIndex}>
                {currentQuestion.question_type === "multiple_choice" && (
                  <MultipleChoice
                    content={currentQuestion.content as MultipleChoiceContent}
                    selectedAnswer={(answers[currentIndex] as string) ?? null}
                    submitted={false}
                    onSelect={(answer) =>
                      setAnswers((prev) => ({ ...prev, [currentIndex]: answer }))
                    }
                  />
                )}
                {currentQuestion.question_type === "fill_blank" && (
                  <FillBlank
                    content={currentQuestion.content as FillBlankContent}
                    userAnswer={(answers[currentIndex] as string) ?? ""}
                    submitted={false}
                    onChange={(answer) =>
                      setAnswers((prev) => ({ ...prev, [currentIndex]: answer }))
                    }
                  />
                )}
                {currentQuestion.question_type === "matching" && (
                  <MatchingQuestion
                    content={currentQuestion.content as MatchingContent}
                    userMatches={(answers[currentIndex] as Record<string, string>) ?? {}}
                    submitted={false}
                    onChange={(matches) =>
                      setAnswers((prev) => ({ ...prev, [currentIndex]: matches }))
                    }
                  />
                )}
              </div>
            )}

            {/* Navigation */}
            <div className="mt-8 flex items-center justify-between border-t border-border-light pt-6">
              <button
                onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
                disabled={currentIndex === 0}
                className="rounded-[--radius-pill] border border-border px-5 py-2 text-sm font-medium text-text-secondary hover:bg-bg disabled:opacity-40"
              >
                上一题
              </button>
              <button
                onClick={() => setCurrentIndex(Math.min(total - 1, currentIndex + 1))}
                disabled={currentIndex === total - 1}
                className="rounded-[--radius-pill] bg-blue px-5 py-2 text-sm font-medium text-white hover:bg-blue-dark disabled:opacity-40"
              >
                下一题
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirm submit modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="mx-4 w-full max-w-md rounded-[--radius-md] bg-bg-card p-8 shadow-xl">
            <div className="flex items-center gap-3 text-pet">
              <AlertTriangle size={24} />
              <h3 className="text-lg font-semibold text-text-primary">确认交卷？</h3>
            </div>
            <p className="mt-3 text-sm text-text-secondary">
              你已完成 {answeredCount}/{total} 道题。
              {answeredCount < total && `还有 ${total - answeredCount} 道题未作答。`}
              交卷后无法修改答案。
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 rounded-[--radius-pill] border border-border py-2.5 text-sm font-medium text-text-secondary hover:bg-bg"
              >
                继续答题
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 rounded-[--radius-pill] bg-blue py-2.5 text-sm font-medium text-white hover:bg-blue-dark"
              >
                确认交卷
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
