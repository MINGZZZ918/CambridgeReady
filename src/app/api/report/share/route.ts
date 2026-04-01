import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import crypto from "crypto";

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  // Check for existing unexpired token
  const { data: existing } = await supabase
    .from("report_share_tokens")
    .select("token, expires_at")
    .eq("user_id", user.id)
    .gt("expires_at", new Date().toISOString())
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (existing) {
    return NextResponse.json({ token: existing.token });
  }

  // Generate new token
  const token = crypto.randomBytes(16).toString("hex");
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);

  const { error } = await supabase.from("report_share_tokens").insert({
    user_id: user.id,
    token,
    expires_at: expiresAt.toISOString(),
  });

  if (error) {
    console.error("Create share token error:", error);
    return NextResponse.json({ error: "生成链接失败" }, { status: 500 });
  }

  return NextResponse.json({ token });
}
