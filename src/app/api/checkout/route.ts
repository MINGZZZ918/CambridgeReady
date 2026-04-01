import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { PLANS, type PlanKey } from '@/lib/payment/config';
import { createPayment } from '@/lib/payment/xunhupay';
import type { PaymentMethod } from '@/types';

export async function POST(request: Request) {
  try {
    // Auth check with user's session
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: '请先登录' }, { status: 401 });
    }

    const { plan, paymentMethod } = (await request.json()) as {
      plan: string;
      paymentMethod: string;
    };

    const planConfig = PLANS[plan as PlanKey];
    if (!planConfig) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    if (paymentMethod !== 'wechat' && paymentMethod !== 'alipay') {
      return NextResponse.json(
        { error: 'Invalid payment method' },
        { status: 400 }
      );
    }

    const orderId = `CR${Date.now()}${Math.random().toString(36).slice(2, 8)}`;

    // Use service role client to bypass RLS for order insertion
    const adminClient = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { error: insertError } = await adminClient.from('payment_orders').insert({
      order_id: orderId,
      user_id: user.id,
      plan,
      amount: planConfig.price,
      payment_method: paymentMethod as PaymentMethod,
      status: 'pending',
    });

    if (insertError) {
      console.error('Insert order error:', insertError);
      return NextResponse.json(
        { error: '创建订单失败，请重试' },
        { status: 500 }
      );
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    const result = await createPayment({
      trade_order_id: orderId,
      total_fee: planConfig.price,
      title: `CambridgeReady ${planConfig.name}`,
      type: paymentMethod as PaymentMethod,
      notify_url: `${siteUrl}/api/payment/notify`,
      return_url: `${siteUrl}/dashboard?payment=success`,
    });

    return NextResponse.json({ url: result.url });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: '支付创建失败，请重试' },
      { status: 500 }
    );
  }
}
