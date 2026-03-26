import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { BookOpen, Target, Clock, ArrowRight, TrendingUp, Zap } from "lucide-react";
import { LEVELS } from "@/lib/utils/constants";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user?.id)
    .single();

  const displayName = profile?.display_name || user?.user_metadata?.display_name || "同学";

  // Fetch real stats
  let totalQuestions = 0;
  let totalCorrect = 0;
  let streakDays = 0;

  if (user) {
    const { data: progress } = await supabase
      .from("learning_progress")
      .select("total_questions, correct_count")
      .eq("user_id", user.id);

    if (progress) {
      for (const row of progress) {
        totalQuestions += row.total_questions;
        totalCorrect += row.correct_count;
      }
    }

    // Calculate streak
    const { data: recentAnswers } = await supabase
      .from("user_answers")
      .select("created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(500);

    if (recentAnswers && recentAnswers.length > 0) {
      const practiceDays = new Set(
        recentAnswers.map((a) =>
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
    }
  }

  const accuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8 lg:py-14">
      {/* Welcome */}
      <div>
        <h1
          className="text-3xl tracking-tight lg:text-4xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          你好，{displayName} 👋
        </h1>
        <p className="mt-2 text-text-secondary">
          继续你的剑桥英语备考之旅
        </p>
      </div>

      {/* Quick stats */}
      <div className="mt-10 grid gap-px overflow-hidden rounded-[--radius-md] border border-border bg-border sm:grid-cols-3">
        {[
          { icon: BookOpen, label: "已做题目", value: totalQuestions.toString(), sub: "道" },
          { icon: Target, label: "正确率", value: totalQuestions > 0 ? accuracy.toString() : "--", sub: "%" },
          { icon: Clock, label: "连续学习", value: streakDays.toString(), sub: "天" },
        ].map((stat) => (
          <div key={stat.label} className="flex items-center gap-4 bg-bg-card p-6">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-light">
              <stat.icon size={20} className="text-blue" />
            </div>
            <div>
              <div className="text-sm text-text-secondary">{stat.label}</div>
              <div className="flex items-baseline gap-1">
                <span
                  className="text-2xl font-semibold tracking-tight"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {stat.value}
                </span>
                <span className="text-sm text-text-tertiary">{stat.sub}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Level cards */}
      <div className="mt-12">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
            选择级别
          </h2>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {LEVELS.map((level) => (
            <Link
              key={level.key}
              href={`/levels/${level.key}`}
              className="group flex flex-col rounded-[--radius-md] border border-border bg-bg-card p-7 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
              style={{ borderTopWidth: "3px", borderTopColor: level.color }}
            >
              <div className="flex items-center justify-between">
                <span
                  className="inline-flex rounded-[--radius-pill] px-3 py-1 text-sm font-bold"
                  style={{ backgroundColor: level.lightBg, color: level.color }}
                >
                  {level.label}
                </span>
                <span className="text-sm text-text-tertiary">{level.cefr}</span>
              </div>

              <p className="mt-3 text-[15px] text-text-secondary">{level.labelZh}</p>

              <div className="mt-6 flex items-center gap-1 text-sm font-medium transition-all group-hover:gap-2" style={{ color: level.color }}>
                开始练习
                <ArrowRight size={14} />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Quick actions */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
          快速开始
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Link
            href="/levels/pet"
            className="group flex items-center gap-5 rounded-[--radius-md] border border-border bg-bg-card p-6 transition-all hover:shadow-sm hover:border-pet/30"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-pet-light">
              <Zap size={22} className="text-pet" />
            </div>
            <div className="flex-1">
              <div className="font-medium">PET 阅读练习</div>
              <div className="mt-0.5 text-sm text-text-secondary">最热门的备考起点</div>
            </div>
            <ArrowRight size={16} className="text-text-tertiary transition-transform group-hover:translate-x-1" />
          </Link>

          <Link
            href="/mistakes"
            className="group flex items-center gap-5 rounded-[--radius-md] border border-border bg-bg-card p-6 transition-all hover:shadow-sm hover:border-blue/30"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-light">
              <TrendingUp size={22} className="text-blue" />
            </div>
            <div className="flex-1">
              <div className="font-medium">错题本</div>
              <div className="mt-0.5 text-sm text-text-secondary">复习答错的题目</div>
            </div>
            <ArrowRight size={16} className="text-text-tertiary transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}
