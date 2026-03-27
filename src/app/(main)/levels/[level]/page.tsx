import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, BookOpen, Headphones, PenLine, Mic, Lock, FileText } from "lucide-react";
import { LEVEL_MAP } from "@/lib/utils/constants";
import { getPartsForLevel } from "@/lib/utils/levels";
import { createClient } from "@/lib/supabase/server";
import { getEffectiveMembership } from "@/lib/utils/membership";
import { getExamsByLevel } from "@/data/mock-exams";
import type { Skill } from "@/types";

const SKILL_META: Record<Skill, { icon: typeof BookOpen; label: string; labelZh: string }> = {
  reading: { icon: BookOpen, label: "Reading", labelZh: "阅读" },
  listening: { icon: Headphones, label: "Listening", labelZh: "听力" },
  writing: { icon: PenLine, label: "Writing", labelZh: "写作" },
  speaking: { icon: Mic, label: "Speaking", labelZh: "口语" },
};

export default async function LevelPage({ params }: { params: Promise<{ level: string }> }) {
  const { level } = await params;

  const levelInfo = LEVEL_MAP[level as keyof typeof LEVEL_MAP];
  if (!levelInfo) notFound();

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

  const isFreeUser = membership === "free";
  const skills: Skill[] = ["reading", "listening", "writing", "speaking"];

  // Fetch user progress for this level
  const partProgress: Record<string, { total: number; correct: number }> = {};
  if (user) {
    const { data: progressData } = await supabase
      .from("learning_progress")
      .select("skill, part, total_questions, correct_count")
      .eq("user_id", user.id)
      .eq("level", level);

    if (progressData) {
      for (const row of progressData) {
        partProgress[`${row.skill}:${row.part}`] = {
          total: row.total_questions,
          correct: row.correct_count,
        };
      }
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8 lg:py-14">
      {/* Header */}
      <div className="flex items-center gap-3">
        <span
          className="inline-flex rounded-[--radius-pill] px-4 py-1.5 text-sm font-bold"
          style={{ backgroundColor: levelInfo.lightBg, color: levelInfo.color }}
        >
          {levelInfo.label}
        </span>
        <span className="text-sm text-text-tertiary">{levelInfo.cefr}</span>
      </div>
      <h1
        className="mt-4 text-3xl tracking-tight lg:text-4xl"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {levelInfo.labelZh} 备考
      </h1>
      <p className="mt-2 text-text-secondary">
        选择技能和 Part，开始分项练习
      </p>

      {/* Skills sections */}
      <div className="mt-12 space-y-14">
        {skills.map((skill) => {
          const meta = SKILL_META[skill];
          const parts = getPartsForLevel(level, skill);
          const Icon = meta.icon;

          return (
            <section key={skill}>
              {/* Skill header */}
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{ backgroundColor: levelInfo.lightBg }}
                >
                  <Icon size={20} style={{ color: levelInfo.color }} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold tracking-tight">
                    {meta.label}
                  </h2>
                  <p className="text-sm text-text-secondary">{meta.labelZh}</p>
                </div>
              </div>

              {/* Parts grid */}
              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {parts.map((part) => {
                  const isAvailable = skill === "reading" || skill === "listening" || skill === "writing" || skill === "speaking";
                  const isLocked = isFreeUser && part.part > 1 && isAvailable;
                  const progress = partProgress[`${skill}:${part.part}`];
                  const progressPct = progress && progress.total > 0
                    ? Math.round((progress.correct / progress.total) * 100)
                    : 0;
                  return (
                    <div
                      key={part.part}
                      className={`group relative flex flex-col rounded-[--radius-md] border border-border bg-bg-card p-6 transition-all ${
                        isAvailable && !isLocked ? "hover:shadow-sm hover:border-border/80" : "opacity-60"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-text-primary">
                          Part {part.part}
                        </span>
                        {(!isAvailable || isLocked) && (
                          <Lock size={14} className="text-text-tertiary" />
                        )}
                        {isAvailable && !isLocked && part.part === 1 && isFreeUser && (
                          <span className="rounded-[--radius-pill] bg-ket-light px-2 py-0.5 text-xs font-medium text-ket">
                            免费
                          </span>
                        )}
                      </div>

                      <h3 className="mt-2 text-[15px] font-medium text-text-primary">
                        {part.nameZh}
                      </h3>
                      <p className="mt-1 flex-1 text-sm text-text-secondary">
                        {part.name}
                      </p>

                      {progress && progress.total > 0 && (
                        <div className="mt-3">
                          <p className="text-xs text-text-tertiary">
                            已做 {progress.total} 题 · 正确率 {progressPct}%
                          </p>
                          <div className="mt-1.5 h-1 w-full rounded-full bg-border-light">
                            <div
                              className="h-full rounded-full transition-all"
                              style={{ width: `${progressPct}%`, backgroundColor: levelInfo.color }}
                            />
                          </div>
                        </div>
                      )}

                      <div className="mt-5 flex items-center justify-between">
                        <span className="text-sm text-text-tertiary">
                          {part.count} 题
                        </span>

                        {isAvailable && !isLocked ? (
                          <Link
                            href={`/practice/${level}/${skill}/${part.part}`}
                            className="inline-flex items-center gap-1 text-sm font-medium transition-all group-hover:gap-2"
                            style={{ color: levelInfo.color }}
                          >
                            开始练习
                            <ArrowRight size={14} />
                          </Link>
                        ) : isLocked ? (
                          <Link
                            href="/pricing"
                            className="text-sm text-text-tertiary hover:text-blue transition-colors"
                          >
                            升级解锁 →
                          </Link>
                        ) : (
                          <span className="text-sm text-text-tertiary">即将开放</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      {/* Mock exams section */}
      {(() => {
        const exams = getExamsByLevel(level);
        if (exams.length === 0) return null;
        return (
          <div className="mt-14">
            <div className="flex items-center gap-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl"
                style={{ backgroundColor: levelInfo.lightBg }}
              >
                <FileText size={20} style={{ color: levelInfo.color }} />
              </div>
              <div>
                <h2 className="text-lg font-semibold tracking-tight">Mock Exams</h2>
                <p className="text-sm text-text-secondary">模拟考试</p>
              </div>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {exams.map((exam) => (
                <Link
                  key={exam.id}
                  href={`/exam/${exam.id}`}
                  className="group flex flex-col rounded-[--radius-md] border border-border bg-bg-card p-6 transition-all hover:shadow-sm hover:border-border/80"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-text-primary">{exam.title}</span>
                    {exam.isFree && (
                      <span className="rounded-[--radius-pill] bg-ket-light px-2 py-0.5 text-xs font-medium text-ket">
                        免费
                      </span>
                    )}
                  </div>
                  <p className="mt-2 flex-1 text-sm text-text-secondary">{exam.description}</p>
                  <div className="mt-5 flex items-center justify-between">
                    <span className="text-sm text-text-tertiary">{exam.timeLimitMinutes} 分钟</span>
                    <span
                      className="inline-flex items-center gap-1 text-sm font-medium transition-all group-hover:gap-2"
                      style={{ color: levelInfo.color }}
                    >
                      开始考试
                      <ArrowRight size={14} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        );
      })()}
    </div>
  );
}
