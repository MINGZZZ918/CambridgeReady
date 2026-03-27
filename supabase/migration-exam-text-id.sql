-- Migration: Change exam_id columns from UUID to TEXT
-- This allows storing string IDs like "pet-mock-1" instead of UUIDs.
-- Run this in the Supabase SQL Editor.

ALTER TABLE exam_results DROP CONSTRAINT IF EXISTS exam_results_exam_id_fkey;
ALTER TABLE user_answers DROP CONSTRAINT IF EXISTS user_answers_exam_id_fkey;
ALTER TABLE exam_results ALTER COLUMN exam_id TYPE TEXT USING exam_id::TEXT;
ALTER TABLE user_answers ALTER COLUMN exam_id TYPE TEXT USING exam_id::TEXT;
