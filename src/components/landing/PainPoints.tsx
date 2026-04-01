import { X, Check, PenLine, Mic, Wallet } from "lucide-react";

const PAIN_POINTS = [
  {
    icon: PenLine,
    pain: "写作没人改",
    painDetail: "写完作文不知道哪里错、为什么错，家长看不懂英文也帮不上忙。请外教一对一批改，一次就要上百元。",
    solution: "AI 秒级批改",
    solutionDetail: "提交作文后立即获得剑桥官方四维评分、逐句批注和改进版范文，中英双语反馈，孩子和家长都看得懂。",
    color: "#F59E0B",
  },
  {
    icon: Mic,
    pain: "口语没人练",
    painDetail: "没有语伴，录完音不知道说得好不好。发音、语法、流利度全凭感觉，考场上才发现问题。",
    solution: "AI 即时评估",
    solutionDetail: "录音后 AI 自动转写文本，从语法词汇、话语管理、发音、互动交际四个维度评分，还生成改进版回答供参考。",
    color: "#8B5CF6",
  },
  {
    icon: Wallet,
    pain: "培训班太贵",
    painDetail: "线下剑桥英语培训动辄上万元一期，名师课更贵。家长花了钱，孩子练习量却很有限。",
    solution: "年费 ¥499 无限练",
    solutionDetail: "不到一节外教课的价格，全年无限次 AI 写作批改和口语评估，随时随地反复练习。",
    color: "#2563EB",
  },
];

export default function PainPoints() {
  return (
    <section className="py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-blue">
            为什么选择我们
          </p>
          <h2
            className="mt-3 text-[clamp(1.75rem,3.5vw,2.75rem)] leading-tight tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            备考路上，这些问题你一定遇到过
          </h2>
        </div>

        {/* Pain point cards */}
        <div className="mt-16 space-y-6">
          {PAIN_POINTS.map((item) => (
            <div
              key={item.pain}
              className="overflow-hidden rounded-[--radius-md] border border-border"
            >
              <div className="grid md:grid-cols-2">
                {/* Pain side */}
                <div className="flex gap-4 bg-bg-card p-7 md:p-8">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50">
                    <X size={20} className="text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-text-primary">
                      {item.pain}
                    </h3>
                    <p className="mt-2 text-[15px] leading-relaxed text-text-secondary">
                      {item.painDetail}
                    </p>
                  </div>
                </div>

                {/* Solution side */}
                <div className="flex gap-4 bg-white p-7 md:border-l md:border-border md:p-8">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                    style={{ backgroundColor: `${item.color}15` }}
                  >
                    <Check size={20} style={{ color: item.color }} />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold" style={{ color: item.color }}>
                      {item.solution}
                    </h3>
                    <p className="mt-2 text-[15px] leading-relaxed text-text-secondary">
                      {item.solutionDetail}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
