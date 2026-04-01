import { Star, Quote } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "小雨妈妈",
    role: "KET 考生家长",
    content:
      "女儿用 AI 写作批改练了两个月，每次都能看到具体哪里写得好、哪里需要改。比请家教方便多了，而且随时都能练。",
    rating: 5,
    level: "KET",
    color: "#10B981",
    lightBg: "#ECFDF5",
  },
  {
    name: "Leo",
    role: "PET 备考学生",
    content:
      "口语评估特别有用，录完音马上就能看到转写文本和评分，知道自己哪些表达不够自然。我 Speaking 从 3 分提到了 4 分。",
    rating: 5,
    level: "PET",
    color: "#F59E0B",
    lightBg: "#FFFBEB",
  },
  {
    name: "张老师",
    role: "英语培训机构教师",
    content:
      "我推荐学生用这个平台做课后练习。AI 的四维评分和剑桥官方标准一致，省去了我逐篇批改作文的时间，可以把精力放在课堂教学上。",
    rating: 5,
    level: "FCE",
    color: "#8B5CF6",
    lightBg: "#F5F3FF",
  },
  {
    name: "Mia 的爸爸",
    role: "FCE 考生家长",
    content:
      "免费资料的质量很高，PDF 练习和词汇表整理得很清楚。升级会员后 AI 批改的反馈非常详细，中英文都有，孩子看得懂。",
    rating: 5,
    level: "FCE",
    color: "#8B5CF6",
    lightBg: "#F5F3FF",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-bg-card/50 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-blue">
            Testimonials
          </p>
          <h2
            className="mt-3 text-3xl font-semibold tracking-tight text-text-primary lg:text-4xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            家长和学生怎么说
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-text-secondary">
            来自真实用户的备考体验分享
          </p>
        </div>

        {/* Cards */}
        <div className="mt-14 grid gap-6 sm:grid-cols-2">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="relative rounded-[--radius-md] border border-border bg-white p-7"
            >
              {/* Quote icon */}
              <Quote
                size={24}
                className="absolute right-6 top-6 text-border"
              />

              {/* Rating */}
              <div className="flex gap-0.5">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className="fill-amber-400 text-amber-400"
                  />
                ))}
              </div>

              {/* Content */}
              <p className="mt-4 text-[15px] leading-relaxed text-text-secondary">
                {t.content}
              </p>

              {/* Author */}
              <div className="mt-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white"
                    style={{ backgroundColor: t.color }}
                  >
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-primary">
                      {t.name}
                    </p>
                    <p className="text-xs text-text-tertiary">{t.role}</p>
                  </div>
                </div>
                <span
                  className="rounded-[--radius-pill] px-2.5 py-0.5 text-xs font-bold"
                  style={{ backgroundColor: t.lightBg, color: t.color }}
                >
                  {t.level}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
