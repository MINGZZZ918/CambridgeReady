import { notFound, redirect } from "next/navigation";
import { LEVEL_MAP, SKILL_MAP } from "@/lib/utils/constants";
import { getPartsForLevel } from "@/lib/utils/levels";
import { createClient } from "@/lib/supabase/server";
import { getEffectiveMembership } from "@/lib/utils/membership";
import PracticeClient from "./PracticeClient";
import type { Level, Skill, Question } from "@/types";

// Load questions from local JSON files
async function loadQuestions(level: string, skill: string, part: string): Promise<Question[]> {
  try {
    const data = await import(
      `@/data/questions/${level}-${skill}-part${part}.json`
    );
    return data.default as Question[];
  } catch {
    return [];
  }
}

export default async function PracticePage({
  params,
}: {
  params: Promise<{ level: string; skill: string; part: string }>;
}) {
  const { level, skill, part } = await params;

  const levelInfo = LEVEL_MAP[level as Level];
  const skillInfo = SKILL_MAP[skill as Skill];
  if (!levelInfo || !skillInfo) notFound();

  const parts = getPartsForLevel(level, skill as Skill);
  const partInfo = parts.find((p) => p.part === parseInt(part));
  if (!partInfo) notFound();

  // Check membership for content gating
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let membership: "free" | "premium" = "free";
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("membership, membership_expires_at")
      .eq("id", user.id)
      .single();
    if (profile) {
      membership = getEffectiveMembership(profile) as "free" | "premium";
    }
  }

  // Free users can only access Part 1 of each skill
  if (membership === "free" && parseInt(part) > 1) {
    redirect("/pricing");
  }

  let questions = await loadQuestions(level, skill, part);

  // Filter to free questions only for free users
  if (membership === "free") {
    questions = questions.filter((q) => q.is_free);
  }

  return (
    <PracticeClient
      questions={questions}
      levelInfo={levelInfo}
      skillInfo={skillInfo}
      partInfo={partInfo}
      level={level}
      skill={skill}
      part={part}
      isPremium={membership === "premium"}
    />
  );
}
