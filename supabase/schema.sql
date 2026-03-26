-- CambridgeReady Database Schema
-- Run this in Supabase SQL Editor

-- 用户 Profile（扩展 Supabase Auth）
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  display_name TEXT,
  avatar_url TEXT,
  current_level TEXT DEFAULT 'pet' CHECK (current_level IN ('ket', 'pet', 'fce')),
  membership TEXT DEFAULT 'free' CHECK (membership IN ('free', 'premium')),
  membership_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 题目表
CREATE TABLE questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  level TEXT NOT NULL CHECK (level IN ('ket', 'pet', 'fce')),
  skill TEXT NOT NULL CHECK (skill IN ('reading', 'listening', 'writing', 'speaking')),
  part INTEGER NOT NULL,
  question_type TEXT NOT NULL CHECK (question_type IN ('multiple_choice', 'fill_blank', 'matching', 'open_write')),
  sort_order INTEGER DEFAULT 0,
  content JSONB NOT NULL,
  explanation_zh TEXT,
  explanation_en TEXT,
  audio_url TEXT,
  is_free BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 模拟考试表
CREATE TABLE mock_exams (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  level TEXT NOT NULL CHECK (level IN ('ket', 'pet', 'fce')),
  title TEXT NOT NULL,
  description TEXT,
  question_ids UUID[] NOT NULL,
  time_limit_minutes INTEGER NOT NULL,
  is_free BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 用户答题记录
CREATE TABLE user_answers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  question_id TEXT NOT NULL,
  answer JSONB NOT NULL,
  user_answer JSONB,
  question_snapshot JSONB,
  level TEXT,
  skill TEXT,
  part INTEGER,
  is_correct BOOLEAN,
  time_spent_seconds INTEGER,
  exam_id UUID REFERENCES mock_exams(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 学习进度表
CREATE TABLE learning_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  level TEXT NOT NULL,
  skill TEXT NOT NULL,
  part INTEGER NOT NULL,
  total_questions INTEGER DEFAULT 0,
  correct_count INTEGER DEFAULT 0,
  last_practiced_at TIMESTAMPTZ,
  UNIQUE(user_id, level, skill, part)
);

-- 模考成绩表
CREATE TABLE exam_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  exam_id UUID REFERENCES mock_exams(id) NOT NULL,
  total_score NUMERIC,
  max_score NUMERIC,
  time_used_seconds INTEGER,
  section_scores JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===== RLS Policies =====

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE mock_exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_results ENABLE ROW LEVEL SECURITY;

-- Profiles
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Questions (public read)
CREATE POLICY "Anyone can read questions" ON questions FOR SELECT USING (true);

-- Mock exams (public read)
CREATE POLICY "Anyone can read mock exams" ON mock_exams FOR SELECT USING (true);

-- User answers
CREATE POLICY "Users can insert own answers" ON user_answers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view own answers" ON user_answers FOR SELECT USING (auth.uid() = user_id);

-- Learning progress
CREATE POLICY "Users can manage own progress" ON learning_progress FOR ALL USING (auth.uid() = user_id);

-- Exam results
CREATE POLICY "Users can manage own results" ON exam_results FOR ALL USING (auth.uid() = user_id);

-- ===== Auto-create profile on signup =====
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (new.id, new.raw_user_meta_data->>'display_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ===== Indexes =====
CREATE INDEX idx_questions_level_skill_part ON questions(level, skill, part);
CREATE INDEX idx_user_answers_user_id ON user_answers(user_id);
CREATE INDEX idx_user_answers_question_id ON user_answers(question_id);
CREATE INDEX idx_learning_progress_user_id ON learning_progress(user_id);
CREATE INDEX idx_exam_results_user_id ON exam_results(user_id);

-- 支付订单表
CREATE TABLE payment_orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  plan TEXT NOT NULL,
  amount TEXT NOT NULL,
  payment_method TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed')),
  transaction_id TEXT,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE payment_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own orders" ON payment_orders FOR SELECT USING (auth.uid() = user_id);

CREATE INDEX idx_payment_orders_user_id ON payment_orders(user_id);
CREATE INDEX idx_payment_orders_order_id ON payment_orders(order_id);

-- 激活码表
CREATE TABLE activation_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  plan TEXT NOT NULL DEFAULT 'premium',
  duration_days INTEGER NOT NULL DEFAULT 365,
  is_used BOOLEAN DEFAULT FALSE,
  used_by UUID REFERENCES profiles(id),
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

ALTER TABLE activation_codes ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_activation_codes_code ON activation_codes(code);
