import { PenLine } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "写作模板 — CambridgeReady",
  description: "剑桥英语 KET/PET/FCE 写作模板与范文，即将上线。",
};

export default function WritingTemplatesPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-8">
      <section className="flex min-h-[60vh] flex-col items-center justify-center py-24 lg:py-32 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-light">
          <PenLine className="h-8 w-8 text-blue" />
        </div>
        <h1
          className="mt-6 text-3xl font-semibold tracking-tight text-text-primary lg:text-4xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          写作模板
        </h1>
        <p className="mt-4 max-w-md text-lg text-text-secondary">
          各级别写作模板与高分范文正在整理中，即将上线。
        </p>
        <Link
          href="/"
          className="mt-8 rounded-[--radius-pill] bg-blue px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-dark"
        >
          返回首页
        </Link>
      </section>
    </div>
  );
}
