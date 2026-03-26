// ===== Database Models =====

export interface Profile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  current_level: Level;
  membership: Membership;
  membership_expires_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Question {
  id: string;
  level: Level;
  skill: Skill;
  part: number;
  question_type: QuestionType;
  sort_order: number;
  content: MultipleChoiceContent | FillBlankContent | MatchingContent | OpenWriteContent;
  explanation_zh: string | null;
  explanation_en: string | null;
  audio_url: string | null;
  is_free: boolean;
  created_at: string;
}

export interface MockExam {
  id: string;
  level: Level;
  title: string;
  description: string | null;
  question_ids: string[];
  time_limit_minutes: number;
  is_free: boolean;
  created_at: string;
}

export interface UserAnswer {
  id: string;
  user_id: string;
  question_id: string;
  answer: unknown;
  is_correct: boolean | null;
  time_spent_seconds: number | null;
  exam_id: string | null;
  created_at: string;
}

export interface LearningProgress {
  id: string;
  user_id: string;
  level: Level;
  skill: Skill;
  part: number;
  total_questions: number;
  correct_count: number;
  last_practiced_at: string | null;
}

export interface ExamResult {
  id: string;
  user_id: string;
  exam_id: string;
  total_score: number | null;
  max_score: number | null;
  time_used_seconds: number | null;
  section_scores: Record<string, number> | null;
  created_at: string;
}

// ===== Enums & Union Types =====

export type Level = 'ket' | 'pet' | 'fce';
export type Skill = 'reading' | 'listening' | 'writing' | 'speaking';
export type QuestionType = 'multiple_choice' | 'fill_blank' | 'matching' | 'open_write';
export type Membership = 'free' | 'premium';
export type PaymentMethod = 'wechat' | 'alipay';
export type OrderStatus = 'pending' | 'paid' | 'failed';

// ===== Payment =====

export interface PaymentOrder {
  id: string;
  order_id: string;
  user_id: string;
  plan: string;
  amount: string;
  payment_method: PaymentMethod;
  status: OrderStatus;
  transaction_id: string | null;
  paid_at: string | null;
  created_at: string;
}

// ===== Question Content Shapes =====

export interface MultipleChoiceContent {
  stem: string;
  passage?: string;
  options: { label: string; text: string }[];
  correct_answer: string;
}

export interface FillBlankContent {
  stem: string;
  passage: string;
  correct_answer: string;
  accept_answers: string[];
}

export interface MatchingContent {
  stem: string;
  people: { id: number; description: string }[];
  texts: { label: string; text: string }[];
  correct_matches: Record<string, string>;
}

export interface OpenWriteContent {
  stem: string;
  prompt: string;
  word_limit?: number;
  sample_answer?: string;
}
