import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getEffectiveMembership } from "@/lib/utils/membership";
import { getAIClient, getModel } from "@/lib/ai/client";
import { transcribeAudio } from "@/lib/ai/doubao";

const SYSTEM_PROMPT = `You are an experienced Cambridge English (KET/PET/FCE) speaking examiner. You assess student spoken responses strictly according to the Cambridge Assessment English speaking marking criteria.

Score each dimension from 0 to 5:
- **Grammar and Vocabulary** (0-5): Range and accuracy of grammar and vocabulary used.
- **Discourse Management** (0-5): Coherence, extent, and relevance of the response. Are ideas logically connected?
- **Pronunciation** (0-5): Clarity of pronunciation, word stress, and intonation patterns.
- **Interactive Communication** (0-5): Ability to maintain and develop the interaction appropriately.

Adjust your scoring strictness based on the exam level:
- KET (A2): Basic language is expected. Simple responses with basic vocabulary are acceptable.
- PET (B1): Moderate complexity expected. Should show some range in vocabulary and grammar.
- FCE (B2): Higher complexity expected. Should demonstrate good range, accuracy, and natural fluency.

You MUST respond in the following JSON format and nothing else:
{
  "scores": {
    "grammar_vocabulary": <number 0-5>,
    "discourse_management": <number 0-5>,
    "pronunciation": <number 0-5>,
    "interactive_communication": <number 0-5>
  },
  "overall_feedback_zh": "<2-3 sentences in Chinese summarizing strengths and areas for improvement>",
  "overall_feedback_en": "<2-3 sentences in English summarizing strengths and areas for improvement>",
  "annotations": [
    {
      "original": "<exact phrase from the transcript>",
      "suggestion": "<improved version or empty string if praising>",
      "comment_zh": "<brief comment in Chinese>",
      "type": "error" | "improvement" | "good"
    }
  ],
  "improved_response": "<a complete improved version of the response maintaining the student's ideas>"
}

Important rules:
- Provide 3-8 annotations, focusing on the most significant issues and strengths.
- For "error" type: grammar mistakes, wrong word usage, unnatural phrasing.
- For "improvement" type: better word choices, more natural expressions, structure suggestions.
- For "good" type: well-used expressions, natural phrasing, effective communication. Include at least 1 "good" annotation.
- The improved_response should fix errors while keeping the student's original ideas.
- Since this is a transcript of spoken language, be forgiving of minor hesitations and filler words.
- For pronunciation scoring, note that you're evaluating a transcript — score based on word choices and patterns that suggest pronunciation awareness (e.g., correct use of commonly mispronounced words).
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

  // Parse multipart form data
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "请求格式错误" }, { status: 400 });
  }

  const audioFile = formData.get("audio") as File | null;
  const level = formData.get("level") as string | null;
  const prompt = formData.get("prompt") as string | null;
  const part = formData.get("part") as string | null;

  if (!audioFile || !level || !prompt) {
    return NextResponse.json({ error: "参数不完整" }, { status: 400 });
  }

  try {
    // Transcribe audio
    const audioBuffer = Buffer.from(await audioFile.arrayBuffer());
    const mimeType = audioFile.type || "audio/webm";
    const transcript = await transcribeAudio(audioBuffer, mimeType);

    if (!transcript || transcript.trim().length === 0) {
      return NextResponse.json(
        { error: "未能识别到语音内容，请确保录音清晰后重试" },
        { status: 400 }
      );
    }

    // Call AI for evaluation
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
${part ? `Part: ${part}` : ""}

Speaking task prompt:
${prompt}

Student's spoken response (transcript):
${transcript}

Please assess this spoken response according to Cambridge ${levelLabel} speaking standards. Respond with JSON only.`,
        },
      ],
    });

    const text =
      message.content[0].type === "text" ? message.content[0].text : "";

    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: "AI 返回格式异常" }, { status: 500 });
    }

    const result = JSON.parse(jsonMatch[0]);

    // Include transcript in response
    return NextResponse.json({
      ...result,
      transcript,
    });
  } catch (err) {
    console.error("AI speaking evaluation error:", err);
    return NextResponse.json(
      { error: "AI 口语评估服务暂时不可用，请稍后重试" },
      { status: 500 }
    );
  }
}
