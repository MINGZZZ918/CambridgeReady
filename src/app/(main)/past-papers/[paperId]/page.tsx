import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getEffectiveMembership } from "@/lib/utils/membership";
import { getPastPaperById } from "@/data/past-papers";
import ExamClient from "@/app/(main)/exam/[examId]/ExamClient";
import type { Question } from "@/types";

async function loadPastPaperQuestions(
  paperId: string,
  skill: string,
  part: number
): Promise<Question[]> {
  try {
    const data = await import(
      `@/data/past-papers/${paperId}/${skill}-part${part}.json`
    );
    return data.default as Question[];
  } catch {
    return [];
  }
}

export default async function PastPaperExamPage({
  params,
}: {
  params: Promise<{ paperId: string }>;
}) {
  const { paperId } = await params;
  const paper = getPastPaperById(paperId);
  if (!paper) notFound();

  // Check membership for non-free papers
  if (!paper.isFree) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("membership, membership_expires_at")
        .eq("id", user.id)
        .single();

      if (!profile || getEffectiveMembership(profile) !== "premium") {
        redirect("/pricing");
      }
    }
  }

  // Load all questions for each section
  const sections: {
    label: string;
    skill: string;
    part: number;
    questions: Question[];
  }[] = [];

  for (const section of paper.sections) {
    const questions = await loadPastPaperQuestions(
      paperId,
      section.skill,
      section.part
    );
    sections.push({
      label: section.label,
      skill: section.skill,
      part: section.part,
      questions,
    });
  }

  const allQuestions = sections.flatMap((s) => s.questions);
  if (allQuestions.length === 0) {
    notFound();
  }

  return (
    <ExamClient
      examId={paper.id}
      title={paper.title}
      timeLimitMinutes={paper.timeLimitMinutes}
      sections={sections}
      level={paper.level}
      resultBasePath="/past-papers"
    />
  );
}
