-- Migration: Update user_answers for local-question practice
-- Run this in Supabase SQL Editor

BEGIN;

-- Drop FK constraint so we can store string question IDs from local JSON
ALTER TABLE user_answers DROP CONSTRAINT IF EXISTS user_answers_question_id_fkey;

-- Change question_id from UUID to TEXT to support local IDs like "pet-r1-001"
ALTER TABLE user_answers ALTER COLUMN question_id TYPE TEXT USING question_id::TEXT;

-- Add columns for self-contained answer records
ALTER TABLE user_answers ADD COLUMN IF NOT EXISTS user_answer JSONB;
ALTER TABLE user_answers ADD COLUMN IF NOT EXISTS question_snapshot JSONB;
ALTER TABLE user_answers ADD COLUMN IF NOT EXISTS level TEXT;
ALTER TABLE user_answers ADD COLUMN IF NOT EXISTS skill TEXT;
ALTER TABLE user_answers ADD COLUMN IF NOT EXISTS part INTEGER;

COMMIT;
