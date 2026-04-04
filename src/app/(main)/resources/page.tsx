import { Download, BookOpen, Headphones, FileText, ExternalLink } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "备考资料下载 — CambridgeReady",
  description: "免费下载剑桥英语 KET、PET、FCE 备考资料，包括阅读练习 PDF、听力音频和核心词汇表。",
};

// 资料文件的 base URL，后续替换为真实服务器地址
const FILE_BASE_URL = "http://testtubebeta.serveblog.net:81";

const LEVELS = [
  {
    key: "ket",
    name: "KET",
    cefr: "A2 Key",
    color: "#10B981",
    lightBg: "#ECFDF5",
    resources: [
      { icon: BookOpen, label: "阅读练习 PDF", desc: "KET Reading Part 1-5 分项练习材料，含答案和解析", file: "/files/Ket教材.zip" },
      { icon: Headphones, label: "听力练习音频", desc: "KET Listening Part 1-4 配套音频文件 (MP3)", file: "/files/Ket真题.zip" },
      { icon: FileText, label: "核心词汇表", desc: "KET 考试 1500+ 高频词汇 PDF，含中文释义", file: "/files/Ket词汇.zip" },
    ],
  },
  {
    key: "pet",
    name: "PET",
    cefr: "B1 Preliminary",
    color: "#F59E0B",
    lightBg: "#FFFBEB",
    resources: [
      { icon: BookOpen, label: "阅读练习 PDF", desc: "PET Reading Part 1-6 分项练习材料，含答案和解析", file: "/pet/pet-reading-practice.pdf" },
      { icon: Headphones, label: "听力练习音频", desc: "PET Listening Part 1-4 配套音频文件 (MP3)", file: "/pet/pet-listening-audio.zip" },
      { icon: FileText, label: "核心词汇表", desc: "PET 考试 3000+ 高频词汇 PDF，含中文释义", file: "/pet/pet-vocabulary.pdf" },
    ],
  },
  {
    key: "fce",
    name: "FCE",
    cefr: "B2 First",
    color: "#8B5CF6",
    lightBg: "#F5F3FF",
    resources: [
      { icon: BookOpen, label: "阅读练习 PDF", desc: "FCE Reading Part 1-4 分项练习材料，含答案和解析", file: "/fce/fce-reading-practice.pdf" },
      { icon: Headphones, label: "听力练习音频", desc: "FCE Listening Part 1-4 配套音频文件 (MP3)", file: "/fce/fce-listening-audio.zip" },
      { icon: FileText, label: "核心词汇表", desc: "FCE 考试 5000+ 高频词汇 PDF，含中文释义", file: "/fce/fce-vocabulary.pdf" },
    ],
  },
];

export default function ResourcesPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8 lg:py-14">
      {/* Header */}
      <div>
        <h1
          className="text-3xl tracking-tight lg:text-4xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          备考资料下载
        </h1>
        <p className="mt-2 text-text-secondary">
          免费下载阅读练习、听力音频和核心词汇表，覆盖 KET、PET、FCE 三个级别
        </p>
      </div>

      {/* Level sections */}
      <div className="mt-12 space-y-12">
        {LEVELS.map((level) => (
          <section key={level.key}>
            {/* Level header */}
            <div className="flex items-center gap-3">
              <span
                className="inline-flex rounded-[--radius-pill] px-4 py-1.5 text-sm font-bold"
                style={{ backgroundColor: level.lightBg, color: level.color }}
              >
                {level.name}
              </span>
              <span className="text-sm text-text-tertiary">{level.cefr}</span>
            </div>

            {/* Resources grid */}
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {level.resources.map((resource) => (
                <a
                  key={resource.label}
                  href={`${FILE_BASE_URL}${resource.file}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-4 rounded-[--radius-md] border border-border bg-bg-card p-6 transition-all hover:shadow-sm hover:border-border/80"
                >
                  <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                    style={{ backgroundColor: level.lightBg }}
                  >
                    <resource.icon size={20} style={{ color: level.color }} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-[15px] font-medium text-text-primary">
                      {resource.label}
                    </h3>
                    <p className="mt-1 text-sm text-text-secondary">
                      {resource.desc}
                    </p>
                  </div>
                  <Download
                    size={16}
                    className="mt-1 shrink-0 text-text-tertiary transition-colors group-hover:text-text-secondary"
                    style={{ color: level.color }}
                  />
                </a>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Tips */}
      <div className="mt-14 space-y-4">
        <div className="rounded-[--radius-md] border border-border bg-bg-card p-6">
          <h3 className="text-sm font-medium text-text-primary">使用说明</h3>
          <ul className="mt-3 space-y-2 text-sm text-text-secondary">
            <li className="flex items-start gap-2">
              <ExternalLink size={14} className="mt-0.5 shrink-0 text-text-tertiary" />
              点击卡片即可下载对应资料，PDF 文件建议使用电脑或平板打开
            </li>
            <li className="flex items-start gap-2">
              <ExternalLink size={14} className="mt-0.5 shrink-0 text-text-tertiary" />
              听力音频为 ZIP 压缩包，下载后解压即可使用
            </li>
            <li className="flex items-start gap-2">
              <ExternalLink size={14} className="mt-0.5 shrink-0 text-text-tertiary" />
              如需 AI 写作批改和口语评估，请升级为高级会员
            </li>
          </ul>
        </div>
        <div className="rounded-[--radius-md] border border-border bg-bg-card p-6 text-center">
          <p className="text-sm text-text-secondary">
            更多资料持续更新中，如有资料需求请联系我们
          </p>
        </div>
      </div>
    </div>
  );
}
