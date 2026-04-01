"use client";

import { useState } from "react";
import { Share2, Check, Loader2 } from "lucide-react";

export default function ShareButton() {
  const [status, setStatus] = useState<"idle" | "loading" | "copied" | "error">("idle");

  const handleShare = async () => {
    setStatus("loading");
    try {
      const res = await fetch("/api/report/share", { method: "POST" });
      if (!res.ok) throw new Error("Failed to generate link");
      const { token } = await res.json();
      const url = `${window.location.origin}/r/${token}`;
      await navigator.clipboard.writeText(url);
      setStatus("copied");
      setTimeout(() => setStatus("idle"), 3000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  return (
    <button
      onClick={handleShare}
      disabled={status === "loading"}
      className="inline-flex items-center gap-2 rounded-[--radius-pill] border border-border bg-bg-card px-5 py-2.5 text-sm font-medium text-text-primary transition-colors hover:bg-bg disabled:opacity-60"
    >
      {status === "loading" ? (
        <Loader2 size={16} className="animate-spin" />
      ) : status === "copied" ? (
        <Check size={16} className="text-ket" />
      ) : (
        <Share2 size={16} />
      )}
      {status === "copied" ? "链接已复制" : status === "error" ? "生成失败" : "生成分享链接"}
    </button>
  );
}
