import type { SupabaseClient } from "@supabase/supabase-js";

export interface ReportData {
  profile: {
    display_name: string | null;
    membership: string;
    membership_expires_at: string | null;
  } | null;
  totalQuestions: number;
  totalCorrect: number;
  streakDays: number;
  evaluations: {
    id: string;
    skill: string;
    level: string;
    part: number | null;
    scores: Record<string, number>;
    total_score: number;
    feedback_zh: string | null;
    created_at: string;
  }[];
  weeklyData: { date: string; count: number }[];
  skillStats: Record<string, { total: number; correct: number }>;
  levelStats: Record<string, { total: number; correct: number }>;
}

export async function fetchReportData(
  supabase: SupabaseClient,
  userId: string
): Promise<ReportData> {
  const skillStats: Record<string, { total: number; correct: number }> = {
    reading: { total: 0, correct: 0 },
    listening: { total: 0, correct: 0 },
    writing: { total: 0, correct: 0 },
    speaking: { total: 0, correct: 0 },
  };
  const levelStats: Record<string, { total: number; correct: number }> = {
    ket: { total: 0, correct: 0 },
    pet: { total: 0, correct: 0 },
    fce: { total: 0, correct: 0 },
  };

  // Run queries in parallel
  const [profileRes, progressRes, evalsRes, answersRes] = await Promise.all([
    supabase
      .from("profiles")
      .select("display_name, membership, membership_expires_at")
      .eq("id", userId)
      .single(),
    supabase
      .from("learning_progress")
      .select("level, skill, total_questions, correct_count")
      .eq("user_id", userId),
    supabase
      .from("ai_evaluations")
      .select("id, skill, level, part, scores, total_score, feedback_zh, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(50),
    supabase
      .from("user_answers")
      .select("created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(500),
  ]);

  let totalQuestions = 0;
  let totalCorrect = 0;

  if (progressRes.data) {
    for (const row of progressRes.data) {
      totalQuestions += row.total_questions;
      totalCorrect += row.correct_count;
      if (levelStats[row.level]) {
        levelStats[row.level].total += row.total_questions;
        levelStats[row.level].correct += row.correct_count;
      }
      if (skillStats[row.skill]) {
        skillStats[row.skill].total += row.total_questions;
        skillStats[row.skill].correct += row.correct_count;
      }
    }
  }

  // Streak calculation
  let streakDays = 0;
  let weeklyData: { date: string; count: number }[] = [];
  const recentAnswers = answersRes.data;

  if (recentAnswers && recentAnswers.length > 0) {
    const practiceDays = new Set(
      recentAnswers.map((a: { created_at: string }) =>
        new Date(a.created_at).toLocaleDateString("en-CA")
      )
    );

    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      if (practiceDays.has(d.toLocaleDateString("en-CA"))) {
        streakDays++;
      } else {
        break;
      }
    }

    // Weekly data
    const dayCounts: Record<string, number> = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      dayCounts[d.toLocaleDateString("en-CA")] = 0;
    }
    for (const a of recentAnswers) {
      const day = new Date(a.created_at).toLocaleDateString("en-CA");
      if (day in dayCounts) {
        dayCounts[day]++;
      }
    }
    weeklyData = Object.entries(dayCounts).map(([date, count]) => ({
      date: date.slice(5),
      count,
    }));
  }

  return {
    profile: profileRes.data,
    totalQuestions,
    totalCorrect,
    streakDays,
    evaluations: evalsRes.data ?? [],
    weeklyData,
    skillStats,
    levelStats,
  };
}
