import type { Question, MultipleChoiceContent, FillBlankContent, MatchingContent } from "@/types";

export function checkAnswer(question: Question, userAnswer: unknown): boolean {
  const content = question.content;

  switch (question.question_type) {
    case "multiple_choice": {
      const mc = content as MultipleChoiceContent;
      return (
        typeof userAnswer === "string" &&
        userAnswer.toUpperCase() === mc.correct_answer.toUpperCase()
      );
    }

    case "fill_blank": {
      const fb = content as FillBlankContent;
      if (typeof userAnswer !== "string") return false;
      const normalized = userAnswer.trim().toLowerCase();
      return fb.accept_answers.some(
        (ans) => ans.toLowerCase() === normalized
      );
    }

    case "matching": {
      const mt = content as MatchingContent;
      if (typeof userAnswer !== "object" || userAnswer === null) return false;
      const answers = userAnswer as Record<string, string>;
      return Object.entries(mt.correct_matches).every(
        ([key, val]) => answers[key]?.toUpperCase() === val.toUpperCase()
      );
    }

    case "open_write":
    case "speaking":
      return false; // Open-ended, needs manual or AI grading

    default:
      return false;
  }
}

export function calculateScore(
  questions: Question[],
  answers: Record<string, unknown>
): { correct: number; total: number; percentage: number } {
  let correct = 0;
  const total = questions.length;

  for (const q of questions) {
    if (answers[q.id] !== undefined && checkAnswer(q, answers[q.id])) {
      correct++;
    }
  }

  return {
    correct,
    total,
    percentage: total > 0 ? Math.round((correct / total) * 100) : 0,
  };
}
