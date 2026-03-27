"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X, AlertTriangle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { getDaysUntilExpiry, getMembershipStatus } from "@/lib/utils/membership";
import type { Profile } from "@/types";

export default function ExpiryBanner() {
  const [profile, setProfile] = useState<Pick<Profile, "membership" | "membership_expires_at"> | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem("expiry_banner_dismissed")) {
      setDismissed(true);
      return;
    }

    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) return;
      supabase
        .from("profiles")
        .select("membership, membership_expires_at")
        .eq("id", data.user.id)
        .single()
        .then(({ data: p }) => {
          if (p) setProfile(p);
        });
    });
  }, []);

  if (dismissed || !profile) return null;

  const status = getMembershipStatus(profile);
  if (status !== "premium_expiring" && status !== "premium_expired") return null;

  const days = getDaysUntilExpiry(profile);
  const isExpired = status === "premium_expired";

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem("expiry_banner_dismissed", "1");
  };

  return (
    <div
      className={`relative px-6 py-3 text-center text-sm font-medium ${
        isExpired
          ? "bg-red-50 text-red-700"
          : "bg-amber-50 text-amber-700"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-2">
        <AlertTriangle size={16} className="shrink-0" />
        <span>
          {isExpired
            ? "你的高级会员已过期，部分功能已受限"
            : `你的高级会员将在 ${days} 天后到期`}
        </span>
        <Link
          href="/pricing"
          className={`ml-2 inline-flex items-center gap-1 rounded-[--radius-pill] px-3 py-1 text-xs font-semibold text-white ${
            isExpired ? "bg-red-500 hover:bg-red-600" : "bg-amber-500 hover:bg-amber-600"
          }`}
        >
          立即续费
        </Link>
      </div>
      <button
        onClick={handleDismiss}
        className={`absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 transition-colors ${
          isExpired ? "hover:bg-red-100" : "hover:bg-amber-100"
        }`}
        aria-label="关闭"
      >
        <X size={16} />
      </button>
    </div>
  );
}
