-- Migration: Simplify pricing tiers (3-tier → 2-tier)
-- Run this in Supabase SQL Editor

BEGIN;

-- 1. Upgrade existing basic users to premium
UPDATE profiles
SET membership = 'premium',
    updated_at = NOW()
WHERE membership = 'basic';

-- 2. Drop old CHECK constraint and add new one
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_membership_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_membership_check
  CHECK (membership IN ('free', 'premium'));

-- 3. Create activation_codes table
CREATE TABLE IF NOT EXISTS activation_codes (
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

CREATE INDEX IF NOT EXISTS idx_activation_codes_code ON activation_codes(code);

COMMIT;
