"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, X, RotateCcw, Trophy } from "lucide-react";
import MultipleChoice from "@/components/practice/MultipleChoice";
import FillBlank from "@/components/practice/FillBlank";
import WritingPrompt from "@/components/practice/WritingPrompt";
import MatchingQuestion from "@/components/practice/MatchingQuestion";
import SpeakingPrompt from "@/components/practice/SpeakingPrompt";
import ListeningPlayer from "@/components/practice/ListeningPlayer";
import ExplanationPanel from "@/components/practice/ExplanationPanel";
import { checkAnswer } from "@/lib/utils/scoring";
import type { Question, MultipleChoiceContent, FillBlankContent, OpenWriteContent, MatchingContent, SpeakingContent } from "@/types";
import type { PartInfo } from "@/lib/utils/levels";

interface Props {
  questions: Question[];
  levelInfo: { key: string; label: string; labelZh: string; color: string; lightBg: string };
  skillInfo: { key: string; label: string; labelZh: string };
  partInfo: PartInfo;
  level: string;
  skill: string;
  part: string;
  isPremium?: boolean;
}

export default function PracticeClient({
  questions,
  levelInfo,
  skillInfo,
  partInfo,
  level,
  skill,
  part,
  isPremium,
}: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string | Record<string, string>>>({});
  const [submitted, setSubmitted] = useState<Record<number, boolean>>({});
  const [showSummary, setShowSummary] = useState(false);

  const currentQuestion = questions[currentIndex];
  const total = questions.length;
  const progress = total > 0 ? ((currentIndex + 1) / total) * 100 : 0;
  const isAllSelfEval = questions.every((q) => q.question_type === "open_write" || q.question_type === "speaking");
  const hasSpeaking = questions.some((q) => q.question_type === "speaking");

  const results = useMemo(() => {
    if (!showSummary) return null;
    if (isAllSelfEval) {
      return { correct: 0, total, percentage: 0 };
    }
    let correct = 0;
    questions.forEach((q, i) => {
      if (answers[i] !== undefined && checkAnswer(q, answers[i])) {
        correct++;
      }
    });
    return { correct, total, percentage: Math.round((correct / total) * 100) };
  }, [showSummary, questions, answers, total, isAllSelfEval]);

  // Save results to Supabase when practice is completed
  const savedRef = useRef(false);
  useEffect(() => {
    if (!showSummary || savedRef.current) return;
    savedRef.current = true;

    const answerRecords = questions.map((q, i) => {
      const raw = answers[i];
      const serialized = typeof raw === "object" && raw !== null ? JSON.stringify(raw) : (raw ?? "");
      return {
        question_id: q.id,
        user_answer: serialized,
        is_correct: raw !== undefined && checkAnswer(q, raw),
        question_snapshot: {
          question_type: q.question_type,
          content: q.content,
          explanation_zh: q.explanation_zh,
          explanation_en: q.explanation_en,
        },
      };
    });

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

          {isAllSelfEval ? (
            <div className="mt-8 rounded-[--radius-sm] bg-bg p-6">
              <p className="text-[15px] text-text-secondary leading-relaxed">
                {hasSpeaking
                  ? "口语练习完成！请对照每道题的参考回答进行自我评估。注意检查：发音是否清晰、内容是否完整、语法是否正确。"
                  : "写作练习完成！请对照每道题的参考范文进行自我评估。注意检查：内容是否完整回答了所有问题、语法和拼写是否正确、用词是否恰当。"}
              </p>
            </div>
          ) : (
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
          )}

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
  const currentAnswer = answers[currentIndex];
  const isMatching = currentQuestion?.question_type === "matching";
  const hasAnswer = isMatching
    ? typeof currentAnswer === "object" && currentAnswer !== null && Object.keys(currentAnswer).length > 0
    : currentAnswer !== undefined && currentAnswer !== "";
  const isOpenWrite = currentQuestion?.question_type === "open_write";
  const isSpeaking = currentQuestion?.question_type === "speaking";
  const openWriteWordCount = isOpenWrite && typeof currentAnswer === "string"
    ? currentAnswer.trim().split(/\s+/).filter(Boolean).length
    : 0;
  const canSubmit = isSpeaking
    ? currentAnswer === "recorded"
    : isOpenWrite
      ? openWriteWordCount >= 10
      : hasAnswer;
  const isCorrect = isSubmitted && currentQuestion && checkAnswer(currentQuestion, currentAnswer);

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
            {/* Listening player */}
            {currentQuestion.audio_url && (
              <div className="mb-6">
                <ListeningPlayer
                  audioUrl={currentQuestion.audio_url}
                  levelColor={levelInfo.color}
                />
              </div>
            )}

            {/* Question type renderer */}
            {currentQuestion.question_type === "multiple_choice" && (
              <MultipleChoice
                content={currentQuestion.content as MultipleChoiceContent}
                selectedAnswer={(answers[currentIndex] as string) ?? null}
                submitted={isSubmitted}
                onSelect={(answer) =>
                  setAnswers((prev) => ({ ...prev, [currentIndex]: answer }))
                }
              />
            )}
            {currentQuestion.question_type === "fill_blank" && (
              <FillBlank
                content={currentQuestion.content as FillBlankContent}
                userAnswer={(answers[currentIndex] as string) ?? ""}
                submitted={isSubmitted}
                onChange={(answer) =>
                  setAnswers((prev) => ({ ...prev, [currentIndex]: answer }))
                }
              />
            )}
            {currentQuestion.question_type === "open_write" && (
              <WritingPrompt
                content={currentQuestion.content as OpenWriteContent}
                userAnswer={(answers[currentIndex] as string) ?? ""}
                submitted={isSubmitted}
                onChange={(answer) =>
                  setAnswers((prev) => ({ ...prev, [currentIndex]: answer }))
                }
                level={level}
                isPremium={isPremium}
              />
            )}
            {currentQuestion.question_type === "matching" && (
              <MatchingQuestion
                content={currentQuestion.content as MatchingContent}
                userMatches={(answers[currentIndex] as Record<string, string>) ?? {}}
                submitted={isSubmitted}
                onChange={(matches) =>
                  setAnswers((prev) => ({ ...prev, [currentIndex]: matches }))
                }
              />
            )}
            {currentQuestion.question_type === "speaking" && (
              <SpeakingPrompt
                content={currentQuestion.content as SpeakingContent}
                submitted={isSubmitted}
                onRecordingComplete={() =>
                  setAnswers((prev) => ({ ...prev, [currentIndex]: "recorded" }))
                }
                levelColor={levelInfo.color}
                level={level}
                isPremium={isPremium}
              />
            )}

            {/* Result indicator */}
            {isSubmitted && currentQuestion.question_type !== "open_write" && currentQuestion.question_type !== "speaking" && (
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
            {isSubmitted && currentQuestion.question_type === "open_write" && (
              <div className="mt-6 flex items-center gap-3 rounded-[--radius-md] bg-blue-light p-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue text-white">
                  <Check size={16} />
                </div>
                <span className="text-[15px] font-medium text-blue">
                  已提交，请对照范文自评
                </span>
              </div>
            )}
            {isSubmitted && currentQuestion.question_type === "speaking" && (
              <div className="mt-6 flex items-center gap-3 rounded-[--radius-md] bg-blue-light p-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue text-white">
                  <Check size={16} />
                </div>
                <span className="text-[15px] font-medium text-blue">
                  已提交，请对照参考回答自评
                </span>
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
            disabled={!canSubmit}
            className="inline-flex items-center gap-2 rounded-[--radius-pill] px-6 py-2.5 text-sm font-medium text-white transition-all active:scale-[0.97] disabled:opacity-40 disabled:pointer-events-none"
            style={{ backgroundColor: canSubmit ? levelInfo.color : undefined }}
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
