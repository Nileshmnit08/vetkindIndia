import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { createServerClient } from '@/lib/supabase/client';
import Razorpay from 'razorpay';

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { order_id } = await request.json();
  if (!order_id) {
    return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
  }

  const supabase = createServerClient();

  // 1. Validate the order belongs to the user and is PENDING
  const { data: order } = await supabase
    .from('orders')
    .select('id, total_amount, status')
    .eq('id', order_id)
    .eq('user_id', session.user.id)
    .eq('status', 'PENDING')
    .single();

  if (!order) {
    return NextResponse.json({ error: 'Invalid or expired order context' }, { status: 400 });
  }

  // 2. Initialize Razorpay Server SDK
  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!
  });

  try {
    // 3. Create Gateway Request using AUTHORITATIVE backend amount
    const options = {
      amount: order.total_amount, // Amount in paisa
      currency: "INR",
      receipt: order.id.replace(/-/g, '').substring(0, 40) // Razorpay receipt max length is 40
    };
    const razorpayOrder = await razorpay.orders.create(options);

    // 4. Link Gateway Order to our DB
    const { error: paymentError } = await supabase
      .from('payments')
      .insert({
        order_id: order.id,
        razorpay_order_id: razorpayOrder.id,
        amount: order.total_amount,
        status: 'PENDING'
      });

    if (paymentError) {
      console.error('Failed to register payment intent:', paymentError);
      return NextResponse.json({ error: 'Failed to initialize payment gateway' }, { status: 500 });
    }

    // 5. Return ONLY safe parameters to the client
    return NextResponse.json({
      success: true,
      razorpay_order_id: razorpayOrder.id,
      amount: order.total_amount,
      currency: razorpayOrder.currency,
      key_id: process.env.RAZORPAY_KEY_ID // Safe to expose public key
    });
  } catch (error) {
    console.error('Razorpay Error:', error);
    return NextResponse.json({ error: 'Payment gateway error' }, { status: 500 });
  }
}
