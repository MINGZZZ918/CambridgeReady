"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CheckCircle, X } from "lucide-react";

export default function PaymentSuccessBanner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (searchParams.get("payment") === "success") {
      setVisible(true);
      // Clean up the URL
      const url = new URL(window.location.href);
      url.searchParams.delete("payment");
      router.replace(url.pathname, { scroll: false });
    }
  }, [searchParams, router]);

  if (!visible) return null;

  return (
    <div className="mb-6 flex items-center gap-3 rounded-[--radius-md] border border-ket/30 bg-ket-light p-4">
      <CheckCircle size={20} className="shrink-0 text-ket" />
      <p className="flex-1 text-sm font-medium text-ket">
        支付成功！你的高级会员已开通，现在可以使用全部功能了。
      </p>
      <button
        onClick={() => setVisible(false)}
        className="shrink-0 text-ket/60 hover:text-ket"
      >
        <X size={16} />
      </button>
    </div>
  );
}
