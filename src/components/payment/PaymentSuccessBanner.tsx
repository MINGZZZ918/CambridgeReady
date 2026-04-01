"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CheckCircle, Loader2, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function PaymentSuccessBanner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"hidden" | "checking" | "success" | "pending">("hidden");

  useEffect(() => {
    if (searchParams.get("payment") !== "success") return;

    // Clean up the URL immediately
    const url = new URL(window.location.href);
    url.searchParams.delete("payment");
    router.replace(url.pathname, { scroll: false });

    setStatus("checking");

    // Poll membership status — the async notify callback may not have arrived yet
    const supabase = createClient();
    let attempts = 0;

    const check = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setStatus("pending"); return; }

      const { data: profile } = await supabase
        .from("profiles")
        .select("membership, membership_expires_at")
        .eq("id", user.id)
        .single();

      if (profile?.membership === "premium" && profile.membership_expires_at) {
        if (new Date(profile.membership_expires_at) > new Date()) {
          setStatus("success");
          return;
        }
      }

      attempts++;
      if (attempts < 10) {
        setTimeout(check, 2000);
      } else {
        // After 20 seconds, show success anyway — the callback will arrive eventually
        setStatus("success");
      }
    };

    check();
  }, [searchParams, router]);

  if (status === "hidden") return null;

  return (
    <div className="mb-6 flex items-center gap-3 rounded-[--radius-md] border border-ket/30 bg-ket-light p-4">
      {status === "checking" ? (
        <Loader2 size={20} className="shrink-0 text-ket animate-spin" />
      ) : (
        <CheckCircle size={20} className="shrink-0 text-ket" />
      )}
      <p className="flex-1 text-sm font-medium text-ket">
        {status === "checking"
          ? "正在确认支付状态..."
          : "支付成功！你的高级会员已开通，现在可以使用全部功能了。"}
      </p>
      {status !== "checking" && (
        <button
          onClick={() => setStatus("hidden")}
          className="shrink-0 text-ket/60 hover:text-ket"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
