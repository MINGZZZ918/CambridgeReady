import Link from "next/link";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { BookOpen, Target, Clock, ArrowRight, PenLine, Mic, Check, X, Crown, AlertTriangle, Download } from "lucide-react";
import { LEVELS } from "@/lib/utils/constants";
import { getMembershipStatus, getDaysUntilExpiry, formatExpiryDate } from "@/lib/utils/membership";
import PaymentSuccessBanner from "@/components/payment/PaymentSuccessBanner";

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
  let recentActivities: {
    id: string;
    is_correct: boolean | null;
    level: string | null;
    skill: string | null;
    part: number | null;
    created_at: string;
  }[] = [];

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

    // Fetch recent activities
    const { data: activities } = await supabase
      .from("user_answers")
      .select("id, is_correct, level, skill, part, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10);

    if (activities) {
      recentActivities = activities;
    }
  }

  const accuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

  const membershipStatus = profile ? getMembershipStatus(profile) : "free";
  const daysUntilExpiry = profile ? getDaysUntilExpiry(profile) : null;

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8 lg:py-14">
      {/* Payment success banner */}
      <Suspense fallback={null}>
        <PaymentSuccessBanner />
      </Suspense>

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

      {/* Membership status card */}
      {membershipStatus === "free" && (
        <Link
          href="/pricing"
          className="mt-8 flex items-center gap-4 rounded-[--radius-md] border border-blue/30 bg-blue-light/50 p-5 transition-all hover:bg-blue-light"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue/10">
            <Crown size={20} className="text-blue" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-text-primary">升级为高级会员</p>
            <p className="mt-0.5 text-sm text-text-secondary">解锁 AI 写作批改和口语评估</p>
          </div>
          <ArrowRight size={16} className="text-blue" />
        </Link>
      )}
      {membershipStatus === "premium_active" && (
        <div className="mt-8 flex items-center gap-4 rounded-[--radius-md] border border-blue/20 bg-blue-light/30 p-5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue/10">
            <Crown size={20} className="text-blue" />
          </div>
          <div>
            <p className="text-sm font-semibold text-blue">高级会员</p>
            <p className="mt-0.5 text-sm text-text-secondary">
              到期日: {profile?.membership_expires_at ? formatExpiryDate(profile.membership_expires_at) : "永久"}
              {daysUntilExpiry !== null && ` (剩余 ${daysUntilExpiry} 天)`}
            </p>
          </div>
        </div>
      )}
      {membershipStatus === "premium_expiring" && (
        <div className="mt-8 flex items-center gap-4 rounded-[--radius-md] border border-amber-300 bg-amber-50 p-5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100">
            <AlertTriangle size={20} className="text-amber-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-amber-700">会员即将到期</p>
            <p className="mt-0.5 text-sm text-amber-600">
              你的高级会员将在 {daysUntilExpiry} 天后到期
            </p>
          </div>
          <Link
            href="/pricing"
            className="rounded-[--radius-pill] bg-amber-500 px-4 py-2 text-sm font-medium text-white hover:bg-amber-600"
          >
            立即续费
          </Link>
        </div>
      )}
      {membershipStatus === "premium_expired" && (
        <div className="mt-8 flex items-center gap-4 rounded-[--radius-md] border border-red-300 bg-red-50 p-5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100">
            <AlertTriangle size={20} className="text-red-500" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-red-700">会员已过期</p>
            <p className="mt-0.5 text-sm text-red-600">你的高级会员已过期，部分功能已受限</p>
          </div>
          <Link
            href="/pricing"
            className="rounded-[--radius-pill] bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
          >
            立即续费
          </Link>
        </div>
      )}

      {/* New user onboarding */}
      {totalQuestions === 0 && (
        <div className="mt-10 rounded-[--radius-md] border-2 border-blue/20 bg-gradient-to-br from-blue-light/50 to-bg-card p-8">
          <h2
            className="text-xl font-semibold tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            欢迎来到 CambridgeReady！
          </h2>
          <p className="mt-2 text-[15px] text-text-secondary leading-relaxed">
            三步开始你的剑桥英语备考之旅：
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue text-sm font-bold text-white">
                1
              </div>
              <div>
                <p className="text-sm font-medium text-text-primary">选择级别</p>
                <p className="mt-0.5 text-xs text-text-secondary">KET / PET / FCE</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-pet text-sm font-bold text-white">
                2
              </div>
              <div>
                <p className="text-sm font-medium text-text-primary">练习写作 / 口语</p>
                <p className="mt-0.5 text-xs text-text-secondary">Part 1 免费体验</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-fce text-sm font-bold text-white">
                3
              </div>
              <div>
                <p className="text-sm font-medium text-text-primary">获取 AI 评估</p>
                <p className="mt-0.5 text-xs text-text-secondary">四维评分 + 逐句批注</p>
              </div>
            </div>
          </div>
        </div>
      )}

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
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/levels/pet"
            className="group flex items-center gap-5 rounded-[--radius-md] border border-border bg-bg-card p-6 transition-all hover:shadow-sm hover:border-pet/30"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-pet-light">
              <PenLine size={22} className="text-pet" />
            </div>
            <div className="flex-1">
              <div className="font-medium">AI 写作批改</div>
              <div className="mt-0.5 text-sm text-text-secondary">剑桥标准四维评分</div>
            </div>
            <ArrowRight size={16} className="text-text-tertiary transition-transform group-hover:translate-x-1" />
          </Link>

          <Link
            href="/levels/pet"
            className="group flex items-center gap-5 rounded-[--radius-md] border border-border bg-bg-card p-6 transition-all hover:shadow-sm hover:border-fce/30"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-fce-light">
              <Mic size={22} className="text-fce" />
            </div>
            <div className="flex-1">
              <div className="font-medium">AI 口语评估</div>
              <div className="mt-0.5 text-sm text-text-secondary">语音转写 + 四维评分</div>
            </div>
            <ArrowRight size={16} className="text-text-tertiary transition-transform group-hover:translate-x-1" />
          </Link>

          <Link
            href="/resources"
            className="group flex items-center gap-5 rounded-[--radius-md] border border-border bg-bg-card p-6 transition-all hover:shadow-sm hover:border-blue/30"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-light">
              <Download size={22} className="text-blue" />
            </div>
            <div className="flex-1">
              <div className="font-medium">备考资料下载</div>
              <div className="mt-0.5 text-sm text-text-secondary">PDF、音频、词汇表</div>
            </div>
            <ArrowRight size={16} className="text-text-tertiary transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>

      {/* Recent activity */}
      {recentActivities.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-semibold tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
            最近练习
          </h2>
          <div className="mt-6 space-y-2">
            {recentActivities.map((activity) => {
              const levelInfo = LEVELS.find((l) => l.key === activity.level);
              const skillLabels: Record<string, string> = {
                reading: "阅读",
                listening: "听力",
                writing: "写作",
                speaking: "口语",
              };
              const timeStr = new Date(activity.created_at).toLocaleString("zh-CN", {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <div
                  key={activity.id}
                  className="flex items-center gap-3 rounded-[--radius-md] border border-border bg-bg-card p-4"
                >
                  <div
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white ${
                      activity.is_correct ? "bg-ket" : "bg-red-400"
                    }`}
                  >
                    {activity.is_correct ? <Check size={14} /> : <X size={14} />}
                  </div>
                  {levelInfo && (
                    <span
                      className="shrink-0 rounded-[--radius-pill] px-2 py-0.5 text-xs font-bold"
                      style={{ backgroundColor: levelInfo.lightBg, color: levelInfo.color }}
                    >
                      {levelInfo.label}
                    </span>
                  )}
                  <span className="flex-1 text-sm text-text-primary">
                    {skillLabels[activity.skill ?? ""] ?? activity.skill} · Part {activity.part}
                  </span>
                  <span className="text-xs text-text-tertiary">{timeStr}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
