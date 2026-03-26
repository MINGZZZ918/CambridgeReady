"use client";

import { useState } from "react";
import { Languages } from "lucide-react";

interface Props {
  explanationZh: string | null;
  explanationEn: string | null;
}

export default function ExplanationPanel({ explanationZh, explanationEn }: Props) {
  const [lang, setLang] = useState<"zh" | "en">("zh");

  if (!explanationZh && !explanationEn) return null;

  const text = lang === "zh" ? explanationZh : explanationEn;

  return (
    <div className="rounded-[--radius-md] border border-blue/20 bg-blue-light/50 p-6">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-blue">解析</h4>
        <button
          onClick={() => setLang(lang === "zh" ? "en" : "zh")}
          className="inline-flex items-center gap-1.5 rounded-[--radius-pill] border border-blue/20 px-3 py-1 text-xs font-medium text-blue transition-colors hover:bg-blue/10"
        >
          <Languages size={13} />
          {lang === "zh" ? "English" : "中文"}
        </button>
      </div>
      <p className="text-[15px] leading-relaxed text-text-primary">
        {text || "暂无解析"}
      </p>
    </div>
  );
}
