import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { BarChart3, ArrowRight, Target, Flame, TrendingUp } from "lucide-react";

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

  if (user) {
    // Fetch learning progress
    const { data: progress } = await supabase
      .from("learning_progress")
      .select("level, total_questions, correct_count, last_practiced_at")
      .eq("user_id", user.id);

    if (progress) {
      for (const row of progress) {
        totalQuestions += row.total_questions;
        totalCorrect += row.correct_count;
        if (levelStats[row.level]) {
          levelStats[row.level].total += row.total_questions;
          levelStats[row.level].correct += row.correct_count;
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
