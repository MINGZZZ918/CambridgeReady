export interface MockExamDef {
  id: string;
  level: string;
  title: string;
  description: string;
  timeLimitMinutes: number;
  isFree: boolean;
  sections: {
    skill: string;
    part: number;
    label: string;
  }[];
}

export const MOCK_EXAMS: MockExamDef[] = [
  {
    id: "pet-mock-1",
    level: "pet",
    title: "PET 阅读模拟卷 1",
    description: "包含 Part 1-6 共 32 道阅读题",
    timeLimitMinutes: 45,
    isFree: true,
    sections: [
      { skill: "reading", part: 1, label: "Part 1 · 短文匹配" },
      { skill: "reading", part: 2, label: "Part 2 · 句子匹配" },
      { skill: "reading", part: 3, label: "Part 3 · 多选理解" },
      { skill: "reading", part: 4, label: "Part 4 · 完形填空" },
      { skill: "reading", part: 5, label: "Part 5 · 选词填空" },
      { skill: "reading", part: 6, label: "Part 6 · 开放式填空" },
    ],
  },
  {
    id: "ket-mock-1",
    level: "ket",
    title: "KET 阅读模拟卷 1",
    description: "包含 Part 1-5 共 28 道阅读题",
    timeLimitMinutes: 30,
    isFree: true,
    sections: [
      { skill: "reading", part: 1, label: "Part 1 · 标识理解" },
      { skill: "reading", part: 2, label: "Part 2 · 句子匹配" },
      { skill: "reading", part: 3, label: "Part 3 · 多选理解" },
      { skill: "reading", part: 4, label: "Part 4 · 完形填空" },
      { skill: "reading", part: 5, label: "Part 5 · 开放式填空" },
    ],
  },
  {
    id: "fce-mock-1",
    level: "fce",
    title: "FCE 阅读模拟卷 1",
    description: "包含 Part 1-4 共 30 道阅读题",
    timeLimitMinutes: 75,
    isFree: true,
    sections: [
      { skill: "reading", part: 1, label: "Part 1 · 多项选择" },
      { skill: "reading", part: 2, label: "Part 2 · 句子填空" },
      { skill: "reading", part: 3, label: "Part 3 · 多重匹配" },
      { skill: "reading", part: 4, label: "Part 4 · 关键词转换" },
    ],
  },
];

export function getExamById(id: string): MockExamDef | undefined {
  return MOCK_EXAMS.find((e) => e.id === id);
}

export function getExamsByLevel(level: string): MockExamDef[] {
  return MOCK_EXAMS.filter((e) => e.level === level);
}
