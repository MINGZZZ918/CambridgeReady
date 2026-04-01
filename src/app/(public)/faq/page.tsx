import { ChevronDown } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "常见问题 — CambridgeReady",
  description: "CambridgeReady 常见问题解答，涵盖平台使用、会员服务、AI 批改、备考资料等。",
};

const FAQ_SECTIONS = [
  {
    title: "平台介绍",
    items: [
      {
        q: "CambridgeReady 是什么？",
        a: "CambridgeReady 是专为 K12 学生打造的剑桥英语 (KET / PET / FCE) 在线备考平台。我们提供免费备考资料下载，以及 AI 写作批改和口语评估服务，帮助学生高效备考。",
      },
      {
        q: "平台覆盖哪些考试级别？",
        a: "目前覆盖三个级别：KET (A2 Key)、PET (B1 Preliminary) 和 FCE (B2 First)。每个级别包含阅读、听力、写作和口语四个技能的备考内容。",
      },
      {
        q: "CambridgeReady 与剑桥官方有关系吗？",
        a: "CambridgeReady 是独立的第三方备考平台，与 Cambridge Assessment English 无官方关联。所有考试名称及商标归其各自所有者所有。",
      },
      {
        q: "适合什么年龄段的学生使用？",
        a: "平台主要面向 K12 学生，即小学高年级到高中阶段。KET 适合小学高年级和初中低年级；PET 适合初中生；FCE 适合高中生和英语能力较强的初中生。",
      },
    ],
  },
  {
    title: "免费内容与高级会员",
    items: [
      {
        q: "免费用户可以使用哪些功能？",
        a: "免费用户可以：下载阅读练习 PDF、听力音频和核心词汇表；使用在线写作练习和口语录音练习（不含 AI 评估）。每个技能的 Part 1 练习题免费开放。",
      },
      {
        q: "高级会员有什么额外功能？",
        a: "高级会员可以使用 AI 写作批改（剑桥四维评分 + 逐句批注 + 改进版范文）和 AI 口语评估（语音转写 + 四维评分 + 改进版回答），同时解锁所有 Part 的练习题。",
      },
      {
        q: "高级会员的价格是多少？",
        a: "高级会员年费 ¥499，支持微信支付和支付宝。也可以通过激活码开通会员。",
      },
      {
        q: "会员到期后会怎样？",
        a: "会员到期后自动降级为免费用户，之前的练习记录和进度数据都会保留。你可以随时续费恢复高级会员功能。",
      },
    ],
  },
  {
    title: "AI 写作批改",
    items: [
      {
        q: "AI 写作批改是如何评分的？",
        a: "AI 按照剑桥英语官方写作评分标准进行四维评分：内容 (Content)、交际达成 (Communicative Achievement)、组织结构 (Organisation) 和语言 (Language)，每个维度 0-5 分。",
      },
      {
        q: "AI 批改会给出具体的修改建议吗？",
        a: "会的。AI 会提供：四维评分和总体反馈（中英双语）、逐句批注（标注错误、改进建议和亮点）、以及一篇保留你原意的改进版范文。",
      },
      {
        q: "AI 批改的结果准确吗？",
        a: "AI 批改基于最先进的大语言模型，按照剑桥官方标准进行评估。它能提供专业级的反馈，但建议将 AI 评分作为参考，与老师指导结合使用效果更佳。",
      },
    ],
  },
  {
    title: "AI 口语评估",
    items: [
      {
        q: "AI 口语评估是怎么工作的？",
        a: "你先根据考试题目录制口语回答，系统会自动将语音转为文字，然后 AI 按剑桥口语评分标准进行四维评估：语法词汇、话语管理、发音和互动交际，每个维度 0-5 分。",
      },
      {
        q: "口语评估支持什么格式的录音？",
        a: "支持通过浏览器直接录音（推荐使用 Chrome 或 Edge 浏览器），系统自动处理音频格式。请确保在安静环境下录音，说话清晰，以获得最佳识别效果。",
      },
      {
        q: "AI 能准确评估发音吗？",
        a: "AI 通过语音转写文本来间接评估发音准确度。它可以发现发音不清导致的识别错误，并分析用词和表达的自然度。但对于语音语调的细微差别，建议配合老师的面对面指导。",
      },
    ],
  },
  {
    title: "备考资料",
    items: [
      {
        q: "备考资料是免费的吗？",
        a: "是的，所有备考资料（阅读练习 PDF、听力音频、核心词汇表）完全免费下载，注册登录后即可使用。",
      },
      {
        q: "资料包含哪些内容？",
        a: "每个级别提供三类资料：阅读分项练习 PDF（含答案和解析）、听力配套音频文件 (MP3)、考试高频词汇表（含中文释义）。",
      },
      {
        q: "资料会更新吗？",
        a: "我们会持续更新和补充备考资料。有新资料上线时会在资料下载页面更新，建议定期查看。",
      },
    ],
  },
  {
    title: "账号与支付",
    items: [
      {
        q: "如何注册账号？",
        a: "点击页面右上角的「注册」按钮，使用邮箱注册即可。注册后可以立即使用免费功能。",
      },
      {
        q: "忘记密码怎么办？",
        a: "在登录页面点击「忘记密码」，输入注册邮箱后会收到密码重置邮件。点击邮件中的链接即可设置新密码。",
      },
      {
        q: "支持哪些支付方式？",
        a: "支持微信支付和支付宝两种支付方式。也可以通过激活码开通会员（激活码可从授权渠道获取）。",
      },
      {
        q: "可以退款吗？",
        a: "购买后 7 天内如未使用 AI 批改和口语评估功能，可以申请全额退款。请联系客服处理退款事宜。",
      },
      {
        q: "激活码怎么使用？",
        a: "登录后进入「激活码」页面，输入格式为 XXXX-XXXX-XXXX-XXXX 的激活码即可开通会员。如果你已经是会员，使用激活码会在原到期日基础上延长。",
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-8">
      {/* Header */}
      <section className="py-16 lg:py-20 text-center">
        <p className="text-sm font-medium uppercase tracking-widest text-blue">
          FAQ
        </p>
        <h1
          className="mt-4 text-3xl font-semibold tracking-tight text-text-primary lg:text-4xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          常见问题
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-text-secondary">
          关于 CambridgeReady 平台使用的常见问题解答
        </p>
      </section>

      {/* FAQ sections */}
      <section className="pb-24 lg:pb-32">
        <div className="space-y-12">
          {FAQ_SECTIONS.map((section) => (
            <div key={section.title}>
              <h2
                className="text-xl font-semibold tracking-tight text-text-primary"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {section.title}
              </h2>
              <div className="mt-5 space-y-3">
                {section.items.map((item) => (
                  <details
                    key={item.q}
                    className="group rounded-[--radius-md] border border-border bg-bg-card"
                  >
                    <summary className="flex cursor-pointer items-center justify-between gap-4 p-5 text-[15px] font-medium text-text-primary [&::-webkit-details-marker]:hidden list-none">
                      {item.q}
                      <ChevronDown
                        size={16}
                        className="shrink-0 text-text-tertiary transition-transform group-open:rotate-180"
                      />
                    </summary>
                    <div className="border-t border-border px-5 pb-5 pt-4">
                      <p className="text-[15px] leading-relaxed text-text-secondary">
                        {item.a}
                      </p>
                    </div>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-16 rounded-[--radius-md] border border-border bg-bg-card p-8 text-center">
          <h3
            className="text-lg font-semibold text-text-primary"
            style={{ fontFamily: "var(--font-display)" }}
          >
            还有其他问题？
          </h3>
          <p className="mt-2 text-sm text-text-secondary">
            如果以上内容没有解答你的问题，请随时联系我们
          </p>
          <Link
            href="/contact"
            className="mt-5 inline-flex rounded-[--radius-pill] bg-blue px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-dark"
          >
            联系我们
          </Link>
        </div>
      </section>
    </div>
  );
}
