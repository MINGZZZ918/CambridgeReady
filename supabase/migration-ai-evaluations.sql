-- AI Evaluations: persist writing/speaking AI scores for learning reports
CREATE TABLE ai_evaluations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  skill TEXT NOT NULL CHECK (skill IN ('writing', 'speaking')),
  level TEXT NOT NULL CHECK (level IN ('ket', 'pet', 'fce')),
  part INTEGER,
  scores JSONB NOT NULL,
  total_score INTEGER NOT NULL,
  feedback_zh TEXT,
  prompt_text TEXT,
  user_input TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE ai_evaluations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own evaluations" ON ai_evaluations
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own evaluations" ON ai_evaluations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_ai_evaluations_user ON ai_evaluations(user_id, created_at DESC);

-- Report share tokens: allow parents to view reports without login
CREATE TABLE report_share_tokens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE report_share_tokens ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own tokens" ON report_share_tokens
  FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Anyone can read by token" ON report_share_tokens
  FOR SELECT USING (true);

CREATE INDEX idx_report_tokens_token ON report_share_tokens(token);
