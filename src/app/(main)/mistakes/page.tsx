import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { BookX, ArrowRight } from "lucide-react";
import MistakesList from "./MistakesList";

export default async function MistakesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let mistakes: Array<{
    id: string;
    question_id: string;
    user_answer: { value: string } | null;
    is_correct: boolean;
    question_snapshot: {
      question_type: string;
      content: Record<string, unknown>;
      explanation_zh: string | null;
      explanation_en: string | null;
    } | null;
    level: string | null;
    skill: string | null;
    part: number | null;
    created_at: string;
  }> = [];

  if (user) {
    const { data } = await supabase
      .from("user_answers")
      .select("id, question_id, user_answer, is_correct, question_snapshot, level, skill, part, created_at")
      .eq("user_id", user.id)
      .eq("is_correct", false)
      .order("created_at", { ascending: false })
      .limit(100);

    if (data) {
      mistakes = data as typeof mistakes;
    }
  }

  if (mistakes.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-10 lg:px-8 lg:py-14">
        <h1
          className="text-3xl tracking-tight lg:text-4xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          错题本
        </h1>
        <p className="mt-2 text-text-secondary">
          自动收录你答错的题目，方便复习巩固
        </p>

        <div className="mt-20 flex flex-col items-center text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-bg">
            <BookX size={32} className="text-text-tertiary" />
          </div>
          <h3
            className="mt-6 text-xl tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            还没有错题
          </h3>
          <p className="mt-2 max-w-sm text-[15px] text-text-secondary">
            开始做题后，答错的题目会自动出现在这里，方便你集中复习薄弱环节
          </p>
          <Link
            href="/levels/pet"
            className="mt-8 inline-flex items-center gap-2 rounded-[--radius-pill] bg-blue px-6 py-3 text-[15px] font-medium text-white hover:bg-blue-dark"
          >
            开始练习
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-10 lg:px-8 lg:py-14">
      <h1
        className="text-3xl tracking-tight lg:text-4xl"
        style={{ fontFamily: "var(--font-display)" }}
      >
        错题本
      </h1>
      <p className="mt-2 text-text-secondary">
        共 {mistakes.length} 道错题，点击展开查看解析
      </p>

      <MistakesList mistakes={mistakes} />
    </div>
  );
}
