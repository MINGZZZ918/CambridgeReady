import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Clock, FileText, Lock, ArrowRight } from "lucide-react";
import { LEVELS } from "@/lib/utils/constants";
import { getEffectiveMembership } from "@/lib/utils/membership";
import { PAST_PAPERS, getPastPapersByLevel, getPastPaperYears } from "@/data/past-papers";
import type { Level } from "@/types";

export default async function PastPapersPage({
  searchParams,
}: {
  searchParams: Promise<{ level?: string }>;
}) {
  const { level: levelParam } = await searchParams;
  const activeLevel: Level =
    levelParam === "ket" || levelParam === "pet" || levelParam === "fce"
      ? levelParam
      : "pet";

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let isPremium = false;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("membership, membership_expires_at")
      .eq("id", user.id)
      .single();
    if (profile) {
      isPremium = getEffectiveMembership(profile) === "premium";
    }
  }

  const papers = getPastPapersByLevel(activeLevel);
  const years = getPastPaperYears(activeLevel);

  const levelInfo = LEVELS.find((l) => l.key === activeLevel)!;

  return (
    <div className="mx-auto max-w-5xl px-6 py-10 lg:py-14">
      <div>
        <h1
          className="text-3xl tracking-tight lg:text-4xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          真题专区
        </h1>
        <p className="mt-2 text-text-secondary">
          历年剑桥英语真题，还原考场真实体验
        </p>
      </div>

      {/* Level tabs */}
      <div className="mt-8 flex gap-2">
        {LEVELS.map((level) => {
          const isActive = level.key === activeLevel;
          const count = getPastPapersByLevel(level.key).length;
          return (
            <Link
              key={level.key}
              href={`/past-papers?level=${level.key}`}
              className={`rounded-[--radius-pill] px-5 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "text-white"
                  : "border border-border text-text-secondary hover:bg-bg-card"
              }`}
              style={isActive ? { backgroundColor: level.color } : undefined}
            >
              {level.label}
              {count > 0 && (
                <span
                  className={`ml-1.5 text-xs ${
                    isActive ? "opacity-80" : "text-text-tertiary"
                  }`}
                >
                  ({count})
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Papers by year */}
      {papers.length === 0 ? (
        <div className="mt-16 text-center">
          <FileText size={40} className="mx-auto text-text-tertiary" />
          <p className="mt-4 text-text-secondary">
            {levelInfo.label} 真题即将上线，敬请期待
          </p>
        </div>
      ) : (
        <div className="mt-8 space-y-10">
          {years.map((year) => {
            const yearPapers = papers.filter((p) => p.year === year);
            return (
              <div key={year}>
                <h2
                  className="text-lg font-semibold tracking-tight"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {year} 年
                </h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {yearPapers.map((paper) => {
                    const locked = !paper.isFree && !isPremium;
                    const totalQuestions = paper.sections.reduce(
                      (sum, s) => sum + s.questionCount,
                      0
                    );

                    return (
                      <div
                        key={paper.id}
                        className="group relative rounded-[--radius-md] border border-border bg-bg-card p-6 transition-all hover:shadow-sm"
                        style={{
                          borderTopWidth: "3px",
                          borderTopColor: levelInfo.color,
                        }}
                      >
                        {locked && (
                          <div className="absolute right-4 top-4">
                            <Lock size={16} className="text-text-tertiary" />
                          </div>
                        )}

                        <h3 className="font-medium text-text-primary">
                          {paper.title}
                        </h3>
                        <p className="mt-1.5 text-sm text-text-secondary">
                          {paper.description}
                        </p>

                        <div className="mt-4 flex items-center gap-4 text-xs text-text-tertiary">
                          <span className="flex items-center gap-1">
                            <FileText size={12} />
                            {totalQuestions} 题
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={12} />
                            {paper.timeLimitMinutes} 分钟
                          </span>
                          {paper.isFree && (
                            <span
                              className="rounded-[--radius-pill] px-2 py-0.5 text-xs font-medium"
                              style={{
                                backgroundColor: levelInfo.lightBg,
                                color: levelInfo.color,
                              }}
                            >
                              免费
                            </span>
                          )}
                        </div>

                        <div className="mt-5">
                          {locked ? (
                            <Link
                              href="/pricing"
                              className="inline-flex items-center gap-1.5 text-sm font-medium text-blue hover:underline"
                            >
                              升级解锁
                              <ArrowRight size={14} />
                            </Link>
                          ) : (
                            <Link
                              href={`/past-papers/${paper.id}`}
                              className="inline-flex items-center gap-1.5 text-sm font-medium hover:underline"
                              style={{ color: levelInfo.color }}
                            >
                              开始做题
                              <ArrowRight size={14} />
                            </Link>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
