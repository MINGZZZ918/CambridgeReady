import { NextResponse } from 'next/server';
import { createClient as createBrowserClient } from '@/lib/supabase/server';
import { createClient } from '@supabase/supabase-js';

const CODE_PATTERN = /^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;

export async function POST(request: Request) {
  try {
    // Verify user is logged in
    const supabase = await createBrowserClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: '请先登录' }, { status: 401 });
    }

    const { code } = (await request.json()) as { code: string };

    if (!code || !CODE_PATTERN.test(code.trim().toUpperCase())) {
      return NextResponse.json(
        { error: '激活码格式不正确，请输入 XXXX-XXXX-XXXX-XXXX 格式的激活码' },
        { status: 400 }
      );
    }

    const normalizedCode = code.trim().toUpperCase();

    // Use service role client for activation_codes (no RLS)
    const adminClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Look up the activation code
    const { data: codeRecord, error: lookupError } = await adminClient
      .from('activation_codes')
      .select('*')
      .eq('code', normalizedCode)
      .single();

    if (lookupError || !codeRecord) {
      return NextResponse.json({ error: '激活码不存在' }, { status: 404 });
    }

    if (codeRecord.is_used) {
      return NextResponse.json({ error: '该激活码已被使用' }, { status: 400 });
    }

    if (codeRecord.expires_at && new Date(codeRecord.expires_at) < new Date()) {
      return NextResponse.json({ error: '该激活码已过期' }, { status: 400 });
    }

    // Mark code as used with optimistic concurrency control
    const { data: updatedCode, error: updateCodeError } = await adminClient
      .from('activation_codes')
      .update({
        is_used: true,
        used_by: user.id,
        used_at: new Date().toISOString(),
      })
      .eq('code', normalizedCode)
      .eq('is_used', false) // Prevent race condition
      .select()
      .single();

    if (updateCodeError || !updatedCode) {
      return NextResponse.json(
        { error: '该激活码已被使用' },
        { status: 400 }
      );
    }

    // Calculate new expiration date
    // If user already has active premium, extend from current expiry
    const { data: profile } = await adminClient
      .from('profiles')
      .select('membership, membership_expires_at')
      .eq('id', user.id)
      .single();

    let newExpiresAt: Date;
    if (
      profile?.membership === 'premium' &&
      profile.membership_expires_at &&
      new Date(profile.membership_expires_at) > new Date()
    ) {
      // Extend from current expiry date
      newExpiresAt = new Date(profile.membership_expires_at);
    } else {
      // Start from now
      newExpiresAt = new Date();
    }
    newExpiresAt.setDate(newExpiresAt.getDate() + codeRecord.duration_days);

    // Update user profile
    const { error: updateProfileError } = await adminClient
      .from('profiles')
      .update({
        membership: codeRecord.plan,
        membership_expires_at: newExpiresAt.toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (updateProfileError) {
      console.error('Activate: profile update failed', updateProfileError);
      return NextResponse.json(
        { error: '激活失败，请重试' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      membership: codeRecord.plan,
      expiresAt: newExpiresAt.toISOString(),
    });
  } catch (error) {
    console.error('Activate error:', error);
    return NextResponse.json(
      { error: '服务器错误，请重试' },
      { status: 500 }
    );
  }
}
