import { Mail, MessageCircle, Clock } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "联系方式 — CambridgeReady",
  description: "联系 CambridgeReady 团队，获取帮助与支持。",
};

const CONTACTS = [
  {
    icon: Mail,
    title: "电子邮件",
    value: "support@cambridgeready.com",
    href: "mailto:support@cambridgeready.com",
    description: "一般咨询、合作洽谈、投诉建议",
  },
  {
    icon: MessageCircle,
    title: "微信客服",
    value: "CambridgeReady",
    description: "添加微信号获取一对一客服支持",
  },
  {
    icon: Clock,
    title: "客服时间",
    value: "周一至周五 9:00–18:00",
    description: "非工作时间的消息将在下一个工作日回复",
  },
];

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-8">
      {/* Header */}
      <section className="py-24 lg:py-32 text-center">
        <p className="text-sm font-medium uppercase tracking-widest text-blue">
          联系我们
        </p>
        <h1
          className="mt-4 text-4xl font-semibold tracking-tight text-text-primary lg:text-5xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          我们随时为你服务
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-text-secondary">
          有任何问题、建议或合作意向，欢迎通过以下方式联系我们。我们会尽快回复。
        </p>
      </section>

      {/* Contact Cards */}
      <section className="pb-24 lg:pb-32">
        <div className="grid gap-8 sm:grid-cols-3">
          {CONTACTS.map((item) => (
            <div
              key={item.title}
              className="rounded-[--radius-md] border border-border bg-bg-card p-8 text-center"
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-light">
                <item.icon className="h-6 w-6 text-blue" />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-text-primary">
                {item.title}
              </h3>
              <p className="mt-2 text-base font-medium text-text-primary">
                {"href" in item ? (
                  <a href={item.href} className="text-blue hover:text-blue-dark transition-colors">
                    {item.value}
                  </a>
                ) : (
                  item.value
                )}
              </p>
              <p className="mt-2 text-sm text-text-secondary">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Callout */}
      <section className="pb-24 lg:pb-32">
        <div className="rounded-[--radius-md] border border-border bg-bg-card p-8 text-center">
          <h3
            className="text-xl font-semibold text-text-primary"
            style={{ fontFamily: "var(--font-display)" }}
          >
            常见问题
          </h3>
          <p className="mt-3 text-text-secondary">
            在联系我们之前，你也可以查看常见问题页面，也许能找到你需要的答案。
          </p>
          <Link
            href="/faq"
            className="mt-5 inline-block rounded-[--radius-pill] bg-blue px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-dark"
          >
            查看常见问题
          </Link>
        </div>
      </section>
    </div>
  );
}
