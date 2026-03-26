import type { Skill } from "@/types";

export interface PartInfo {
  part: number;
  name: string;
  nameZh: string;
  questionType: string;
  count: number;
}

// PET Reading structure
const PET_READING: PartInfo[] = [
  { part: 1, name: "Short text matching", nameZh: "短文匹配", questionType: "matching", count: 5 },
  { part: 2, name: "Sentence matching", nameZh: "句子匹配", questionType: "matching", count: 5 },
  { part: 3, name: "Multiple choice comprehension", nameZh: "多选理解", questionType: "multiple_choice", count: 5 },
  { part: 4, name: "Cloze (multiple choice)", nameZh: "完形填空", questionType: "multiple_choice", count: 5 },
  { part: 5, name: "Word selection", nameZh: "选词填空", questionType: "multiple_choice", count: 6 },
  { part: 6, name: "Open cloze", nameZh: "开放式填空", questionType: "fill_blank", count: 6 },
];

const PET_LISTENING: PartInfo[] = [
  { part: 1, name: "Short dialogue picture", nameZh: "短对话选图", questionType: "multiple_choice", count: 7 },
  { part: 2, name: "Information matching", nameZh: "信息匹配", questionType: "matching", count: 6 },
  { part: 3, name: "Multiple choice comprehension", nameZh: "多选理解", questionType: "multiple_choice", count: 6 },
  { part: 4, name: "Gap fill", nameZh: "填空", questionType: "fill_blank", count: 6 },
];

const PET_WRITING: PartInfo[] = [
  { part: 1, name: "Email", nameZh: "邮件写作", questionType: "open_write", count: 1 },
  { part: 2, name: "Article or Story", nameZh: "文章/故事写作", questionType: "open_write", count: 1 },
];

const PET_SPEAKING: PartInfo[] = [
  { part: 1, name: "Personal questions", nameZh: "个人信息问答", questionType: "open_write", count: 1 },
  { part: 2, name: "Situation discussion", nameZh: "情景讨论", questionType: "open_write", count: 1 },
  { part: 3, name: "Picture description", nameZh: "图片描述", questionType: "open_write", count: 1 },
  { part: 4, name: "Topic discussion", nameZh: "话题讨论", questionType: "open_write", count: 1 },
];

const LEVEL_PARTS: Record<string, Record<Skill, PartInfo[]>> = {
  ket: {
    reading: [
      { part: 1, name: "Multiple choice signs", nameZh: "标识理解", questionType: "multiple_choice", count: 6 },
      { part: 2, name: "Sentence matching", nameZh: "句子匹配", questionType: "matching", count: 5 },
      { part: 3, name: "Multiple choice comprehension", nameZh: "多选理解", questionType: "multiple_choice", count: 5 },
      { part: 4, name: "Cloze fill", nameZh: "完形填空", questionType: "fill_blank", count: 6 },
      { part: 5, name: "Open cloze", nameZh: "开放式填空", questionType: "fill_blank", count: 6 },
    ],
    listening: PET_LISTENING,
    writing: PET_WRITING,
    speaking: PET_SPEAKING,
  },
  pet: {
    reading: PET_READING,
    listening: PET_LISTENING,
    writing: PET_WRITING,
    speaking: PET_SPEAKING,
  },
  fce: {
    reading: [
      { part: 1, name: "Multiple choice", nameZh: "多项选择", questionType: "multiple_choice", count: 8 },
      { part: 2, name: "Gapped text", nameZh: "句子填空", questionType: "matching", count: 6 },
      { part: 3, name: "Multiple matching", nameZh: "多重匹配", questionType: "matching", count: 10 },
      { part: 4, name: "Key word transformation", nameZh: "关键词转换", questionType: "fill_blank", count: 6 },
    ],
    listening: PET_LISTENING,
    writing: PET_WRITING,
    speaking: PET_SPEAKING,
  },
};

export function getPartsForLevel(level: string, skill: Skill): PartInfo[] {
  return LEVEL_PARTS[level]?.[skill] ?? [];
}
