import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ examId: string }> }
) {
  try {
    const { examId } = await params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch the latest exam result for this exam + user
    const { data: examResult, error: resultError } = await supabase
      .from("exam_results")
      .select("id, exam_id, total_score, max_score, time_used_seconds, section_scores, created_at")
      .eq("user_id", user.id)
      .eq("exam_id", examId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (resultError || !examResult) {
      return NextResponse.json({ error: "No exam result found" }, { status: 404 });
    }

    // Fetch associated user_answers
    const { data: answers } = await supabase
      .from("user_answers")
      .select("question_id, answer, user_answer, is_correct, question_snapshot")
      .eq("user_id", user.id)
      .eq("exam_id", examId)
      .order("created_at", { ascending: true });

    return NextResponse.json({
      examResult,
      answers: answers ?? [],
    });
  } catch (error) {
    console.error("Exam result fetch error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
