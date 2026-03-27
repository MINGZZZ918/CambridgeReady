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
  level: string;
  skill: string;
  part: number;
}

interface ExamSubmission {
  examId: string;
  level: string;
  totalScore: number;
  maxScore: number;
  timeUsedSeconds: number;
  sectionScores: Record<string, number>;
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

    const {
      examId,
      level,
      totalScore,
      maxScore,
      timeUsedSeconds,
      sectionScores,
      answers,
    } = (await request.json()) as ExamSubmission;

    if (!examId || !level || !answers?.length) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    // Insert exam result
    const { error: examError } = await supabase.from('exam_results').insert({
      user_id: user.id,
      exam_id: examId,
      total_score: totalScore,
      max_score: maxScore,
      time_used_seconds: timeUsedSeconds,
      section_scores: sectionScores,
    });

    if (examError) {
      console.error('Insert exam result error:', examError);
      return NextResponse.json(
        { error: 'Failed to save exam result' },
        { status: 500 }
      );
    }

    // Insert all answer records
    const rows = answers.map((a) => ({
      user_id: user.id,
      question_id: a.question_id,
      answer: { value: a.user_answer },
      user_answer: { value: a.user_answer },
      is_correct: a.is_correct,
      question_snapshot: a.question_snapshot,
      exam_id: examId,
      level: a.level,
      skill: a.skill,
      part: a.part,
    }));

    const { error: insertError } = await supabase
      .from('user_answers')
      .insert(rows);

    if (insertError) {
      console.error('Insert exam answers error:', insertError);
    }

    // Update learning_progress per skill+part
    const grouped: Record<string, { total: number; correct: number }> = {};
    for (const a of answers) {
      const key = `${a.skill}:${a.part}`;
      if (!grouped[key]) grouped[key] = { total: 0, correct: 0 };
      grouped[key].total++;
      if (a.is_correct) grouped[key].correct++;
    }

    for (const [key, counts] of Object.entries(grouped)) {
      const [skill, partStr] = key.split(':');
      const part = parseInt(partStr, 10);

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
            total_questions: existing.total_questions + counts.total,
            correct_count: existing.correct_count + counts.correct,
            last_practiced_at: new Date().toISOString(),
          })
          .eq('id', existing.id);
      } else {
        await supabase.from('learning_progress').insert({
          user_id: user.id,
          level,
          skill,
          part,
          total_questions: counts.total,
          correct_count: counts.correct,
          last_practiced_at: new Date().toISOString(),
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Exam save error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
