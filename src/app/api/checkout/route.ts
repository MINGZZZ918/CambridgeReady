import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { PLANS, type PlanKey } from '@/lib/payment/config';
import { createPayment } from '@/lib/payment/xunhupay';
import type { PaymentMethod } from '@/types';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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

    const { error: insertError } = await supabase.from('payment_orders').insert({
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
        { error: 'Failed to create order' },
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
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
