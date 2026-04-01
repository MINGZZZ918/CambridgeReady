import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { fetchReportData } from "@/lib/report/fetchReportData";
import ReportContent from "@/components/report/ReportContent";
import { ArrowRight, AlertTriangle } from "lucide-react";

export default async function SharedReportPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Look up token
  const { data: tokenRecord } = await supabase
    .from("report_share_tokens")
    .select("user_id, expires_at")
    .eq("token", token)
    .single();

  if (!tokenRecord) {
    return (
      <div className="mx-auto max-w-md px-6 py-20 text-center">
        <AlertTriangle size={40} className="mx-auto text-text-tertiary" />
        <h1
          className="mt-6 text-2xl tracking-tight"
          style={{ fontFamily: "var(--font-display)" }}
        >
          链接无效
        </h1>
        <p className="mt-3 text-text-secondary">
          该分享链接不存在，请确认链接是否正确。
        </p>
      </div>
    );
  }

  if (new Date(tokenRecord.expires_at) < new Date()) {
    return (
      <div className="mx-auto max-w-md px-6 py-20 text-center">
        <AlertTriangle size={40} className="mx-auto text-pet" />
        <h1
          className="mt-6 text-2xl tracking-tight"
          style={{ fontFamily: "var(--font-display)" }}
        >
          链接已过期
        </h1>
        <p className="mt-3 text-text-secondary">
          该分享链接已超过 30 天有效期，请联系学生重新生成。
        </p>
      </div>
    );
  }

  const data = await fetchReportData(supabase, tokenRecord.user_id);

  return (
    <>
      <ReportContent data={data} />

      {/* CTA */}
      <div className="mx-auto max-w-4xl px-6 pb-16 lg:px-8">
        <div className="rounded-[--radius-md] border border-blue/20 bg-blue-light/30 p-8 text-center">
          <h3
            className="text-lg font-semibold tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            CambridgeReady — 剑桥英语智能备考平台
          </h3>
          <p className="mt-2 text-sm text-text-secondary">
            AI 写作批改 + AI 口语评估，剑桥官方标准四维评分
          </p>
          <Link
            href="/"
            className="mt-5 inline-flex items-center gap-2 rounded-[--radius-pill] bg-blue px-6 py-3 text-[15px] font-medium text-white hover:bg-blue-dark"
          >
            了解更多
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </>
  );
}
