import { ChevronRight } from "lucide-react";

const STEPS = [
  {
    level: "KET",
    cefr: "A2",
    label: "入门基础",
    color: "#10B981",
    lightBg: "#ECFDF5",
  },
  {
    level: "PET",
    cefr: "B1",
    label: "中级提升",
    color: "#F59E0B",
    lightBg: "#FFFBEB",
  },
  {
    level: "FCE",
    cefr: "B2",
    label: "高级突破",
    color: "#8B5CF6",
    lightBg: "#F5F3FF",
  },
  {
    level: "IELTS",
    cefr: "B2+",
    label: "衔接雅思",
    color: "#2563EB",
    lightBg: "#EFF6FF",
  },
];

export default function Journey() {
  return (
    <section className="py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium tracking-wide text-blue uppercase">
            进阶路线
          </p>
          <h2
            className="mt-3 text-[clamp(1.75rem,3.5vw,2.75rem)] leading-tight tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            一条清晰的英语进阶之路
          </h2>
          <p className="mt-4 text-lg text-text-secondary leading-relaxed">
            从 A2 到 B2，每通过一个级别都在为下一步打下坚实基础
          </p>
        </div>

        {/* Journey path */}
        <div className="mx-auto mt-16 flex max-w-4xl flex-col items-center gap-3 sm:flex-row sm:gap-0">
          {STEPS.map((step, i) => (
            <div key={step.level} className="flex items-center sm:flex-1">
              {/* Step card */}
              <div
                className="group relative flex w-full flex-col items-center rounded-[--radius-md] border border-border bg-bg-card p-6 text-center transition-all hover:shadow-md hover:-translate-y-0.5 sm:p-8"
                style={{ borderTopWidth: "3px", borderTopColor: step.color }}
              >
                {/* CEFR badge */}
                <div
                  className="inline-flex items-center justify-center rounded-[--radius-pill] px-3 py-1 text-xs font-bold"
                  style={{
                    backgroundColor: step.lightBg,
                    color: step.color,
                  }}
                >
                  {step.cefr}
                </div>

                {/* Level name */}
                <div
                  className="mt-3 text-2xl font-bold tracking-tight"
                  style={{
                    fontFamily: "var(--font-display)",
                    color: step.color,
                  }}
                >
                  {step.level}
                </div>

                <div className="mt-1.5 text-sm text-text-secondary">
                  {step.label}
                </div>
              </div>

              {/* Arrow connector */}
              {i < STEPS.length - 1 && (
                <div className="hidden shrink-0 px-2 text-text-tertiary sm:block">
                  <ChevronRight size={20} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
