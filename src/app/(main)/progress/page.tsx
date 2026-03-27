import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { BarChart3, ArrowRight, Target, Flame, TrendingUp, FileText, Clock } from "lucide-react";
import { getExamById } from "@/data/mock-exams";
import SkillRadarChart from "@/components/progress/SkillRadarChart";
import WeeklyChart from "@/components/progress/WeeklyChart";

const LEVEL_STYLES = [
  { key: "ket", label: "KET", color: "#10B981", lightBg: "#ECFDF5" },
  { key: "pet", label: "PET", color: "#F59E0B", lightBg: "#FFFBEB" },
  { key: "fce", label: "FCE", color: "#8B5CF6", lightBg: "#F5F3FF" },
];

export default async function ProgressPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let totalQuestions = 0;
  let totalCorrect = 0;
  const levelStats: Record<string, { total: number; correct: number }> = {
    ket: { total: 0, correct: 0 },
    pet: { total: 0, correct: 0 },
    fce: { total: 0, correct: 0 },
  };

  let streakDays = 0;
  const skillStats: Record<string, { total: number; correct: number }> = {
    reading: { total: 0, correct: 0 },
    listening: { total: 0, correct: 0 },
    writing: { total: 0, correct: 0 },
    speaking: { total: 0, correct: 0 },
  };
  let weeklyData: { date: string; count: number }[] = [];
  let examHistory: {
    id: string;
    exam_id: string;
    total_score: number;
    max_score: number;
    time_used_seconds: number;
    section_scores: Record<string, number> | null;
    created_at: string;
  }[] = [];

  if (user) {
    // Fetch learning progress
    const { data: progress } = await supabase
      .from("learning_progress")
      .select("level, skill, total_questions, correct_count, last_practiced_at")
      .eq("user_id", user.id);

    if (progress) {
      for (const row of progress) {
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

    // Calculate streak: count consecutive days with practice (from today backwards)
    const { data: recentAnswers } = await supabase
      .from("user_answers")
      .select("created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(500);

    if (recentAnswers && recentAnswers.length > 0) {
      const practiceDays = new Set(
        recentAnswers.map((a) =>
          new Date(a.created_at).toLocaleDateString("en-CA") // YYYY-MM-DD
        )
      );

      const today = new Date();
      for (let i = 0; i < 365; i++) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const key = d.toLocaleDateString("en-CA");
        if (practiceDays.has(key)) {
          streakDays++;
        } else {
          break;
        }
      }

      // Compute 7-day daily counts
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
        date: date.slice(5), // MM-DD
        count,
      }));
    }

    // Fetch exam history
    const { data: examData } = await supabase
      .from("exam_results")
      .select("id, exam_id, total_score, max_score, time_used_seconds, section_scores, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20);

    if (examData) {
      examHistory = examData;
    }
  }

  const avgAccuracy =
    totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
  const hasData = totalQuestions > 0;

  return (
    <div className="mx-auto max-w-4xl px-6 py-10 lg:px-8 lg:py-14">
      <h1
        className="text-3xl tracking-tight lg:text-4xl"
        style={{ fontFamily: "var(--font-display)" }}
      >
        学习进度
      </h1>
      <p className="mt-2 text-text-secondary">
        追踪你的备考进度，全方位了解学习情况
      </p>

      {/* Stats overview */}
      <div className="mt-10 grid gap-px overflow-hidden rounded-[--radius-md] border border-border bg-border sm:grid-cols-3">
        {[
          {
            icon: Target,
            label: "总做题数",
            value: totalQuestions.toString(),
            color: "text-blue",
          },
          {
            icon: TrendingUp,
            label: "平均正确率",
            value: hasData ? `${avgAccuracy}%` : "--",
            color: "text-ket",
          },
          {
            icon: Flame,
            label: "连续学习",
            value: `${streakDays} 天`,
            color: "text-pet",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col items-center bg-bg-card p-6 text-center"
          >
            <stat.icon size={22} className={stat.color} />
            <div
              className="mt-3 text-2xl font-semibold tracking-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {stat.value}
            </div>
            <div className="mt-1 text-sm text-text-secondary">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Skill analysis charts */}
      {hasData && (
        <div className="mt-12">
          <h2
            className="text-xl font-semibold tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            技能分析
          </h2>
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div className="rounded-[--radius-md] border border-border bg-bg-card p-6">
              <h3 className="text-sm font-medium text-text-secondary mb-4">各技能正确率</h3>
              <SkillRadarChart
                data={[
                  { skill: "reading", skillZh: "阅读", accuracy: skillStats.reading.total > 0 ? Math.round((skillStats.reading.correct / skillStats.reading.total) * 100) : 0 },
                  { skill: "listening", skillZh: "听力", accuracy: skillStats.listening.total > 0 ? Math.round((skillStats.listening.correct / skillStats.listening.total) * 100) : 0 },
                  { skill: "writing", skillZh: "写作", accuracy: skillStats.writing.total > 0 ? Math.round((skillStats.writing.correct / skillStats.writing.total) * 100) : 0 },
                  { skill: "speaking", skillZh: "口语", accuracy: skillStats.speaking.total > 0 ? Math.round((skillStats.speaking.correct / skillStats.speaking.total) * 100) : 0 },
                ]}
                color="#2563EB"
              />
            </div>
            {weeklyData.length > 0 && (
              <div className="rounded-[--radius-md] border border-border bg-bg-card p-6">
                <h3 className="text-sm font-medium text-text-secondary mb-4">近7天做题量</h3>
                <WeeklyChart data={weeklyData} color="#2563EB" />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Level progress */}
      <div className="mt-12">
        <h2
          className="text-xl font-semibold tracking-tight"
          style={{ fontFamily: "var(--font-display)" }}
        >
          各级别进度
        </h2>
        <div className="mt-6 space-y-4">
          {LEVEL_STYLES.map((level) => {
            const stats = levelStats[level.key];
            const accuracy =
              stats.total > 0
                ? Math.round((stats.correct / stats.total) * 100)
                : 0;
            return (
              <div
                key={level.key}
                className="rounded-[--radius-md] border border-border bg-bg-card p-6"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span
                      className="rounded-[--radius-pill] px-3 py-1 text-sm font-bold"
                      style={{
                        backgroundColor: level.lightBg,
                        color: level.color,
                      }}
                    >
                      {level.label}
                    </span>
                    <span className="text-sm text-text-secondary">
                      {stats.total > 0
                        ? `${stats.total} 题 · 正确率 ${accuracy}%`
                        : "暂无数据"}
                    </span>
                  </div>
                  <Link
                    href={`/levels/${level.key}`}
                    className="text-sm font-medium transition-colors hover:text-blue"
                    style={{ color: level.color }}
                  >
                    去练习 →
                  </Link>
                </div>
                <div className="mt-4 h-2 w-full rounded-full bg-border-light">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${accuracy}%`,
                      backgroundColor: level.color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Exam history */}
      {examHistory.length > 0 && (
        <div className="mt-12">
          <h2
            className="text-xl font-semibold tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            模拟考试记录
          </h2>
          <div className="mt-6 space-y-4">
            {examHistory.map((result) => {
              const examDef = getExamById(result.exam_id);
              const examTitle = examDef?.title ?? result.exam_id;
              const examLevel = examDef?.level ?? "pet";
              const levelStyle = LEVEL_STYLES.find((l) => l.key === examLevel) ?? LEVEL_STYLES[1];
              const percentage =
                result.max_score > 0
                  ? Math.round((result.total_score / result.max_score) * 100)
                  : 0;
              const minutes = result.time_used_seconds
                ? Math.floor(result.time_used_seconds / 60)
                : 0;
              const seconds = result.time_used_seconds
                ? result.time_used_seconds % 60
                : 0;
              const dateStr = new Date(result.created_at).toLocaleDateString(
                "zh-CN",
                { year: "numeric", month: "long", day: "numeric" }
              );

              return (
                <div
                  key={result.id}
                  className="rounded-[--radius-md] border border-border bg-bg-card p-6"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <span
                        className="rounded-[--radius-pill] px-3 py-1 text-sm font-bold"
                        style={{
                          backgroundColor: levelStyle.lightBg,
                          color: levelStyle.color,
                        }}
                      >
                        {levelStyle.label}
                      </span>
                      <div>
                        <div className="text-sm font-medium text-text-primary">
                          {examTitle}
                        </div>
                        <div className="mt-0.5 flex items-center gap-3 text-xs text-text-secondary">
                          <span className="flex items-center gap-1">
                            <Clock size={12} />
                            {minutes}:{seconds.toString().padStart(2, "0")}
                          </span>
                          <span>{dateStr}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className="text-lg font-semibold tracking-tight"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {result.total_score}/{result.max_score}
                      </div>
                      <div className="text-xs text-text-secondary">
                        {percentage}%
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 h-2 w-full rounded-full bg-border-light">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: levelStyle.color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty state CTA */}
      {!hasData && (
        <div className="mt-16 rounded-[--radius-md] border border-border-light bg-bg p-10 text-center">
          <BarChart3 size={32} className="mx-auto text-text-tertiary" />
          <h3
            className="mt-4 text-lg tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            开始练习后可查看详细数据
          </h3>
          <p className="mt-2 text-sm text-text-secondary">
            包括各技能正确率、连续学习天数等
          </p>
          <Link
            href="/levels/pet"
            className="mt-6 inline-flex items-center gap-2 rounded-[--radius-pill] bg-blue px-6 py-3 text-[15px] font-medium text-white hover:bg-blue-dark"
          >
            开始练习
            <ArrowRight size={16} />
          </Link>
        </div>
      )}
    </div>
  );
}
