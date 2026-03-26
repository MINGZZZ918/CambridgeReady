import { NextResponse } from "next/server";
import type { Question } from "@/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const level = searchParams.get("level");
  const skill = searchParams.get("skill");
  const part = searchParams.get("part");

  if (!level || !skill || !part) {
    return NextResponse.json(
      { error: "Missing required parameters: level, skill, part" },
      { status: 400 }
    );
  }

  try {
    const data = await import(
      `@/data/questions/${level}-${skill}-part${part}.json`
    );
    const questions: Question[] = data.default;
    return NextResponse.json(questions);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}
