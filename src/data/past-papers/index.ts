import type { Level, PastPaperDef } from "@/types";

export const PAST_PAPERS: PastPaperDef[] = [
  {
    id: "pet-2023-paper1",
    level: "pet",
    year: 2023,
    session: "Paper 1",
    title: "2023 PET 真题卷 1",
    description: "PET 阅读 Part 1（示例）",
    timeLimitMinutes: 15,
    isFree: true,
    sections: [
      { skill: "reading", part: 1, label: "Part 1 · 短文匹配", questionCount: 5 },
    ],
  },
];

export function getPastPaperById(id: string): PastPaperDef | undefined {
  return PAST_PAPERS.find((p) => p.id === id);
}

export function getPastPapersByLevel(level: Level): PastPaperDef[] {
  return PAST_PAPERS.filter((p) => p.level === level);
}

export function getPastPaperYears(level: Level): number[] {
  const years = new Set(
    PAST_PAPERS.filter((p) => p.level === level).map((p) => p.year)
  );
  return Array.from(years).sort((a, b) => b - a);
}
