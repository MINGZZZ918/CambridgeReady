"use client";

import { BookOpen, Target, Flame, Brain, PenLine, Mic } from "lucide-react";
import type { ReportData } from "@/lib/report/fetchReportData";
import ScoreTrendChart from "./ScoreTrendChart";
import DimensionChart from "./DimensionChart";
import SkillRadarChart from "@/components/progress/SkillRadarChart";
import WeeklyChart from "@/components/progress/WeeklyChart";

const LEVEL_LABELS: Record<string, string> = { ket: "KET", pet: "PET", fce: "FCE" };

const WRITING_DIMS: Record<string, string> = {
  content: "内容",
  communicative_achievement: "交际",
  organisation: "组织",
  language: "语言",
};

const SPEAKING_DIMS: Record<string, string> = {
  grammar_vocabulary: "语法词汇",
  discourse_management: "话语管理",
  pronunciation: "发音",
  interactive_communication: "交际",
};

const LEVEL_STYLES = [
  { key: "ket", label: "KET", color: "#10B981", lightBg: "#ECFDF5" },
  { key: "pet", label: "PET", color: "#F59E0B", lightBg: "#FFFBEB" },
  { key: "fce", label: "FCE", color: "#8B5CF6", lightBg: "#F5F3FF" },
];

interface Props {
  data: ReportData;
  showShareButton?: React.ReactNode;
}

export default function ReportContent({ data, showShareButton }: Props) {
  const { profile, totalQuestions, totalCorrect, streakDays, evaluations, weeklyData, skillStats, levelStats } = data;

  const accuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
  const avgEvalScore = evaluations.length > 0
    ? Math.round(evaluations.reduce((sum, e) => sum + e.total_score, 0) / evaluations.length * 10) / 10
    : 0;

  const writingEvals = evaluations.filter(e => e.skill === "writing");
  const speakingEvals = evaluations.filter(e => e.skill === "speaking");

  const writingTrendData = writingEvals.slice().reverse().map(e => ({
    date: new Date(e.created_at).toLocaleDateString("zh-CN", { month: "short", day: "numeric" }),
    score: e.total_score,
  }));

  const speakingTrendData = speakingEvals.slice().reverse().map(e => ({
    date: new Date(e.created_at).toLocaleDateString("zh-CN", { month: "short", day: "numeric" }),
    score: e.total_score,
  }));

  const latestWriting = writingEvals[0];
  const latestSpeaking = speakingEvals[0];

  const recentEvals = evaluations.slice(0, 5);

  const reportDate = new Date().toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="mx-auto max-w-4xl px-6 py-10 lg:px-8 lg:py-14">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1
            className="text-3xl tracking-tight lg:text-4xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            学习报告
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <span className="text-text-secondary">
              {profile?.display_name || "同学"}
            </span>
            {profile?.membership === "premium" && (
              <span className="rounded-[--radius-pill] bg-blue/10 px-2.5 py-0.5 text-xs font-semibold text-blue">
                Premium
              </span>
            )}
            <span className="text-sm text-text-tertiary">{reportDate}</span>
          </div>
        </div>
        {showShareButton}
      </div>

      {/* Overview cards */}
      <div className="mt-10 grid gap-px overflow-hidden rounded-[--radius-md] border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: BookOpen, label: "总做题数", value: totalQuestions.toString(), sub: "道" },
          { icon: Target, label: "平均正确率", value: totalQuestions > 0 ? `${accuracy}` : "--", sub: "%" },
          { icon: Flame, label: "连续学习", value: streakDays.toString(), sub: "天" },
          { icon: Brain, label: "AI 评估", value: evaluations.length.toString(), sub: `次 · 均分 ${avgEvalScore}` },
        ].map((stat) => (
          <div key={stat.label} className="flex items-center gap-4 bg-bg-card p-5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-light">
              <stat.icon size={18} className="text-blue" />
            </div>
            <div>
              <div className="text-xs text-text-secondary">{stat.label}</div>
              <div className="flex items-baseline gap-1">
                <span
                  className="text-xl font-semibold tracking-tight"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {stat.value}
                </span>
                <span className="text-xs text-text-tertiary">{stat.sub}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* AI Evaluation Trends */}
      {evaluations.length > 0 ? (
        <div className="mt-12">
          <h2
            className="text-xl font-semibold tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            AI 评估趋势
          </h2>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            {/* Writing trend */}
            {writingTrendData.length > 0 && (
              <div className="rounded-[--radius-md] border border-border bg-bg-card p-6">
                <div className="mb-4 flex items-center gap-2">
                  <PenLine size={16} className="text-pet" />
                  <h3 className="text-sm font-medium text-text-secondary">写作评分趋势</h3>
                </div>
                <ScoreTrendChart data={writingTrendData} color="#F59E0B" label="写作总分" />
              </div>
            )}

            {/* Speaking trend */}
            {speakingTrendData.length > 0 && (
              <div className="rounded-[--radius-md] border border-border bg-bg-card p-6">
                <div className="mb-4 flex items-center gap-2">
                  <Mic size={16} className="text-fce" />
                  <h3 className="text-sm font-medium text-text-secondary">口语评分趋势</h3>
                </div>
                <ScoreTrendChart data={speakingTrendData} color="#8B5CF6" label="口语总分" />
              </div>
            )}

            {/* Latest writing dimensions */}
            {latestWriting && (
              <div className="rounded-[--radius-md] border border-border bg-bg-card p-6">
                <div className="mb-4 flex items-center gap-2">
                  <PenLine size={16} className="text-pet" />
                  <h3 className="text-sm font-medium text-text-secondary">最近写作四维得分</h3>
                </div>
                <DimensionChart
                  dimensions={Object.entries(latestWriting.scores).map(([key, score]) => ({
                    name: WRITING_DIMS[key] || key,
                    score,
                  }))}
                  color="#F59E0B"
                />
              </div>
            )}

            {/* Latest speaking dimensions */}
            {latestSpeaking && (
              <div className="rounded-[--radius-md] border border-border bg-bg-card p-6">
                <div className="mb-4 flex items-center gap-2">
                  <Mic size={16} className="text-fce" />
                  <h3 className="text-sm font-medium text-text-secondary">最近口语四维得分</h3>
                </div>
                <DimensionChart
                  dimensions={Object.entries(latestSpeaking.scores).map(([key, score]) => ({
                    name: SPEAKING_DIMS[key] || key,
                    score,
                  }))}
                  color="#8B5CF6"
                />
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="mt-12 rounded-[--radius-md] border border-border-light bg-bg p-10 text-center">
          <Brain size={32} className="mx-auto text-text-tertiary" />
          <h3
            className="mt-4 text-lg tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            暂无 AI 评估数据
          </h3>
          <p className="mt-2 text-sm text-text-secondary">
            完成写作或口语的 AI 评估后，分数趋势将显示在这里
          </p>
        </div>
      )}

      {/* Skill analysis */}
      {totalQuestions > 0 && (
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

            {/* Level progress */}
            <div className="rounded-[--radius-md] border border-border bg-bg-card p-6">
              <h3 className="text-sm font-medium text-text-secondary mb-4">各级别进度</h3>
              <div className="space-y-5">
                {LEVEL_STYLES.map((level) => {
                  const stats = levelStats[level.key];
                  const acc = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
                  return (
                    <div key={level.key}>
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className="rounded-[--radius-pill] px-2.5 py-0.5 text-xs font-bold"
                          style={{ backgroundColor: level.lightBg, color: level.color }}
                        >
                          {level.label}
                        </span>
                        <span className="text-sm text-text-secondary">
                          {stats.total > 0 ? `${stats.total} 题 · ${acc}%` : "暂无"}
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-border-light">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ width: `${acc}%`, backgroundColor: level.color }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent AI feedback */}
      {recentEvals.length > 0 && (
        <div className="mt-12">
          <h2
            className="text-xl font-semibold tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            近期 AI 反馈
          </h2>
          <div className="mt-6 space-y-3">
            {recentEvals.map((ev) => {
              const dateStr = new Date(ev.created_at).toLocaleDateString("zh-CN", {
                month: "short",
                day: "numeric",
              });
              return (
                <div
                  key={ev.id}
                  className="rounded-[--radius-md] border border-border bg-bg-card p-5"
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${ev.skill === "writing" ? "bg-pet-light" : "bg-fce-light"}`}>
                      {ev.skill === "writing" ? (
                        <PenLine size={15} className="text-pet" />
                      ) : (
                        <Mic size={15} className="text-fce" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          {ev.skill === "writing" ? "写作" : "口语"}
                        </span>
                        <span
                          className="rounded-[--radius-pill] px-2 py-0.5 text-xs font-bold"
                          style={{
                            backgroundColor: LEVEL_STYLES.find(l => l.key === ev.level)?.lightBg,
                            color: LEVEL_STYLES.find(l => l.key === ev.level)?.color,
                          }}
                        >
                          {LEVEL_LABELS[ev.level] || ev.level}
                        </span>
                        <span className="text-xs text-text-tertiary">{dateStr}</span>
                      </div>
                      {ev.feedback_zh && (
                        <p className="mt-1.5 text-sm text-text-secondary leading-relaxed line-clamp-2">
                          {ev.feedback_zh}
                        </p>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <div
                        className="text-lg font-semibold tracking-tight"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {ev.total_score}
                      </div>
                      <div className="text-xs text-text-tertiary">/20</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Weekly activity */}
      {weeklyData.length > 0 && (
        <div className="mt-12">
          <h2
            className="text-xl font-semibold tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            学习活跃度
          </h2>
          <div className="mt-6 rounded-[--radius-md] border border-border bg-bg-card p-6">
            <h3 className="text-sm font-medium text-text-secondary mb-4">近7天做题量</h3>
            <WeeklyChart data={weeklyData} color="#2563EB" />
          </div>
        </div>
      )}
    </div>
  );
}
