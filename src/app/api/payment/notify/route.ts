import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifySign } from '@/lib/payment/xunhupay';

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const params: Record<string, string> = {};
    for (const pair of body.split('&')) {
      const [key, ...rest] = pair.split('=');
      params[decodeURIComponent(key)] = decodeURIComponent(rest.join('='));
    }

    const appsecret = process.env.XUNHUPAY_APPSECRET!;
    if (!verifySign(params, appsecret)) {
      console.error('Payment notify: invalid signature');
      return new NextResponse('fail', { status: 400 });
    }

    if (params.status !== 'OD') {
      return new NextResponse('success', { status: 200 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const orderId = params.trade_order_id;

    const { data: order, error: fetchError } = await supabase
      .from('payment_orders')
      .select('*')
      .eq('order_id', orderId)
      .single();

    if (fetchError || !order) {
      console.error('Payment notify: order not found', orderId);
      return new NextResponse('fail', { status: 400 });
    }

    if (order.status === 'paid') {
      return new NextResponse('success', { status: 200 });
    }

    // Check existing membership expiry for renewal
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('membership, membership_expires_at')
      .eq('id', order.user_id)
      .single();

    const expiresAt = new Date();
    if (
      existingProfile &&
      existingProfile.membership === 'premium' &&
      existingProfile.membership_expires_at
    ) {
      const currentExpiry = new Date(existingProfile.membership_expires_at);
      if (currentExpiry > expiresAt) {
        // Extend from current expiry date
        currentExpiry.setFullYear(currentExpiry.getFullYear() + 1);
        expiresAt.setTime(currentExpiry.getTime());
      } else {
        expiresAt.setFullYear(expiresAt.getFullYear() + 1);
      }
    } else {
      expiresAt.setFullYear(expiresAt.getFullYear() + 1);
    }

    const { error: updateProfileError } = await supabase
      .from('profiles')
      .update({
        membership: order.plan,
        membership_expires_at: expiresAt.toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', order.user_id);

    if (updateProfileError) {
      console.error('Payment notify: profile update failed', updateProfileError);
      return new NextResponse('fail', { status: 500 });
    }

    await supabase
      .from('payment_orders')
      .update({
        status: 'paid',
        transaction_id: params.transaction_id || null,
        paid_at: new Date().toISOString(),
      })
      .eq('order_id', orderId);

    return new NextResponse('success', { status: 200 });
  } catch (error) {
    console.error('Payment notify error:', error);
    return new NextResponse('fail', { status: 500 });
  }
}
