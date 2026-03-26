import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

interface AnswerRecord {
  question_id: string;
  user_answer: string;
  is_correct: boolean;
  question_snapshot: {
    question_type: string;
    content: unknown;
    explanation_zh: string | null;
    explanation_en: string | null;
  };
}

interface PracticeSubmission {
  level: string;
  skill: string;
  part: number;
  answers: AnswerRecord[];
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { level, skill, part, answers } = (await request.json()) as PracticeSubmission;

    if (!level || !skill || !part || !answers?.length) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    // Insert all answer records
    const rows = answers.map((a) => ({
      user_id: user.id,
      question_id: a.question_id,
      answer: { value: a.user_answer },
      user_answer: { value: a.user_answer },
      is_correct: a.is_correct,
      question_snapshot: a.question_snapshot,
      level,
      skill,
      part,
    }));

    const { error: insertError } = await supabase
      .from('user_answers')
      .insert(rows);

    if (insertError) {
      console.error('Insert answers error:', insertError);
      return NextResponse.json(
        { error: 'Failed to save answers' },
        { status: 500 }
      );
    }

    // Update learning_progress (upsert)
    const correctCount = answers.filter((a) => a.is_correct).length;
    const totalCount = answers.length;

    // Try to get existing progress
    const { data: existing } = await supabase
      .from('learning_progress')
      .select('id, total_questions, correct_count')
      .eq('user_id', user.id)
      .eq('level', level)
      .eq('skill', skill)
      .eq('part', part)
      .single();

    if (existing) {
      await supabase
        .from('learning_progress')
        .update({
          total_questions: existing.total_questions + totalCount,
          correct_count: existing.correct_count + correctCount,
          last_practiced_at: new Date().toISOString(),
        })
        .eq('id', existing.id);
    } else {
      await supabase.from('learning_progress').insert({
        user_id: user.id,
        level,
        skill,
        part,
        total_questions: totalCount,
        correct_count: correctCount,
        last_practiced_at: new Date().toISOString(),
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Practice save error:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}
