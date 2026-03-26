import type { Level, Skill } from '@/types';

export const LEVELS: { key: Level; label: string; labelZh: string; cefr: string; color: string; lightBg: string }[] = [
  { key: 'ket', label: 'KET', labelZh: 'A2 Key', cefr: 'A2', color: '#10B981', lightBg: '#ECFDF5' },
  { key: 'pet', label: 'PET', labelZh: 'B1 Preliminary', cefr: 'B1', color: '#F59E0B', lightBg: '#FFFBEB' },
  { key: 'fce', label: 'FCE', labelZh: 'B2 First', cefr: 'B2', color: '#8B5CF6', lightBg: '#F5F3FF' },
];

export const SKILLS: { key: Skill; label: string; labelZh: string }[] = [
  { key: 'reading', label: 'Reading', labelZh: '阅读' },
  { key: 'listening', label: 'Listening', labelZh: '听力' },
  { key: 'writing', label: 'Writing', labelZh: '写作' },
  { key: 'speaking', label: 'Speaking', labelZh: '口语' },
];

export const LEVEL_MAP = Object.fromEntries(LEVELS.map((l) => [l.key, l])) as Record<Level, (typeof LEVELS)[number]>;
export const SKILL_MAP = Object.fromEntries(SKILLS.map((s) => [s.key, s])) as Record<Skill, (typeof SKILLS)[number]>;
