import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getEffectiveMembership } from "@/lib/utils/membership";
import { getAIClient, getModel } from "@/lib/ai/client";

const SYSTEM_PROMPT = `You are an experienced Cambridge English (KET/PET/FCE) writing examiner. You assess student essays strictly according to the Cambridge Assessment English writing marking criteria.

Score each dimension from 0 to 5:
- **Content** (0-5): Does the essay fully address all parts of the task? Are all required points covered?
- **Communicative Achievement** (0-5): Is the tone and register appropriate for the task type (email, article, story)? Does it achieve its communicative purpose?
- **Organisation** (0-5): Is the text well-organised with clear paragraphing and logical flow? Are linking words used effectively?
- **Language** (0-5): Is there a good range of vocabulary and grammar? How accurate is the language?

Adjust your scoring strictness based on the exam level:
- KET (A2): Basic language is expected. Simple sentences are acceptable.
- PET (B1): Moderate complexity expected. Should use some linking words and varied vocabulary.
- FCE (B2): Higher complexity expected. Should demonstrate range and accuracy.

You MUST respond in the following JSON format and nothing else:
{
  "scores": {
    "content": <number 0-5>,
    "communicative_achievement": <number 0-5>,
    "organisation": <number 0-5>,
    "language": <number 0-5>
  },
  "overall_feedback_zh": "<2-3 sentences in Chinese summarizing strengths and areas for improvement>",
  "overall_feedback_en": "<2-3 sentences in English summarizing strengths and areas for improvement>",
  "annotations": [
    {
      "original": "<exact phrase or sentence from the essay>",
      "suggestion": "<improved version or empty string if praising>",
      "comment_zh": "<brief comment in Chinese>",
      "type": "error" | "improvement" | "good"
    }
  ],
  "improved_essay": "<a complete improved version of the essay maintaining the student's ideas>"
}

Important rules:
- Provide 3-8 annotations, focusing on the most significant issues and strengths.
- For "error" type: grammar mistakes, spelling errors, wrong word usage.
- For "improvement" type: awkward phrasing, better word choices, structure suggestions.
- For "good" type: well-used expressions, good structure, effective language. Include at least 1 "good" annotation.
- The improved_essay should fix errors while keeping the student's original ideas and structure.
- Be encouraging but honest. Students learn best from specific, actionable feedback.`;

export async function POST(request: Request) {
  // Auth check
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  // Premium check
  const { data: profile } = await supabase
    .from("profiles")
    .select("membership, membership_expires_at")
    .eq("id", user.id)
    .single();

  if (!profile || getEffectiveMembership(profile) !== "premium") {
    return NextResponse.json({ error: "需要高级会员" }, { status: 403 });
  }

  const body = await request.json();
  const { level, prompt, essay } = body as {
    level: string;
    prompt: string;
    essay: string;
  };

  if (!level || !prompt || !essay) {
    return NextResponse.json({ error: "参数不完整" }, { status: 400 });
  }

  if (essay.trim().split(/\s+/).length < 10) {
    return NextResponse.json({ error: "作文内容太短" }, { status: 400 });
  }

  try {
    const client = getAIClient();
    const model = getModel();

    const levelLabel =
      level === "ket" ? "KET (A2)" : level === "pet" ? "PET (B1)" : "FCE (B2)";

    const message = await client.messages.create({
      model,
      max_tokens: 2000,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Exam level: ${levelLabel}

Writing task prompt:
${prompt}

Student's essay:
${essay}

Please assess this essay according to Cambridge ${levelLabel} writing standards. Respond with JSON only.`,
        },
      ],
    });

    const text =
      message.content[0].type === "text" ? message.content[0].text : "";

    // Extract JSON from response (handle potential markdown code blocks)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: "AI 返回格式异常" }, { status: 500 });
    }

    const result = JSON.parse(jsonMatch[0]);

    // Persist evaluation scores (fire-and-forget)
    const totalScore = (result.scores.content + result.scores.communicative_achievement
      + result.scores.organisation + result.scores.language);
    supabase.from("ai_evaluations").insert({
      user_id: user.id,
      skill: "writing",
      level,
      scores: result.scores,
      total_score: totalScore,
      feedback_zh: result.overall_feedback_zh,
      prompt_text: prompt,
      user_input: essay,
    }).then(({ error }) => { if (error) console.error("Save eval error:", error); });

    return NextResponse.json(result);
  } catch (err) {
    console.error("AI writing correction error:", err);
    return NextResponse.json(
      { error: "AI 批改服务暂时不可用，请稍后重试" },
      { status: 500 }
    );
  }
}
