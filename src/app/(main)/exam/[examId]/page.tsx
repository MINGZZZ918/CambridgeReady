import { notFound } from "next/navigation";
import { getExamById } from "@/data/mock-exams";
import ExamClient from "./ExamClient";
import type { Question } from "@/types";

async function loadQuestions(level: string, skill: string, part: number): Promise<Question[]> {
  try {
    const data = await import(
      `@/data/questions/${level}-${skill}-part${part}.json`
    );
    return data.default as Question[];
  } catch {
    return [];
  }
}

export default async function ExamPage({ params }: { params: Promise<{ examId: string }> }) {
  const { examId } = await params;
  const exam = getExamById(examId);
  if (!exam) notFound();

  // Load all questions for each section
  const sections: { label: string; skill: string; part: number; questions: Question[] }[] = [];
  for (const section of exam.sections) {
    const questions = await loadQuestions(exam.level, section.skill, section.part);
    sections.push({ label: section.label, skill: section.skill, part: section.part, questions });
  }

  const allQuestions = sections.flatMap((s) => s.questions);

  if (allQuestions.length === 0) {
    notFound();
  }

  return (
    <ExamClient
      examId={exam.id}
      title={exam.title}
      timeLimitMinutes={exam.timeLimitMinutes}
      sections={sections}
      level={exam.level}
    />
  );
}
