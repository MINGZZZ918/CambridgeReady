import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-light">
        <span
          className="text-4xl font-bold text-blue"
          style={{ fontFamily: "var(--font-display)" }}
        >
          404
        </span>
      </div>
      <h1
        className="mt-6 text-2xl font-semibold tracking-tight text-text-primary lg:text-3xl"
        style={{ fontFamily: "var(--font-display)" }}
      >
        页面未找到
      </h1>
      <p className="mt-3 max-w-md text-text-secondary">
        你访问的页面不存在或已被移除。请检查网址是否正确，或返回首页继续浏览。
      </p>
      <div className="mt-8 flex items-center gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-[--radius-pill] bg-blue px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-dark"
        >
          <Home size={16} />
          返回首页
        </Link>
        <Link
          href="/faq"
          className="inline-flex items-center gap-2 rounded-[--radius-pill] border border-border px-6 py-2.5 text-sm font-medium text-text-primary transition-colors hover:bg-bg-card"
        >
          <ArrowLeft size={16} />
          常见问题
        </Link>
      </div>
    </div>
  );
}
