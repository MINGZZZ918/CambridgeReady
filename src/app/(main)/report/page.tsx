import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { fetchReportData } from "@/lib/report/fetchReportData";
import ReportContent from "@/components/report/ReportContent";
import ShareButton from "@/components/report/ShareButton";

export default async function ReportPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/report");
  }

  const data = await fetchReportData(supabase, user.id);

  return (
    <ReportContent
      data={data}
      showShareButton={<ShareButton />}
    />
  );
}
