import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/client';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    // 1. Extract Raw Body for HMAC
    const rawBody = await request.text();
    const signature = request.headers.get('x-razorpay-signature');
    const eventId = request.headers.get('x-razorpay-event-id');

    if (!signature || !eventId) {
      return NextResponse.json({ error: 'Missing webhook headers' }, { status: 400 });
    }

    // 2. Verify Signature
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET!;
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(rawBody)
      .digest('hex');

    if (expectedSignature !== signature) {
      console.error('Invalid Webhook Signature for event:', eventId);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Bypass stale Database types
    const supabase = createServerClient() as any;
    const payload = JSON.parse(rawBody);
    const eventType = payload.event;

    // 3. Idempotency Check & Audit Log
    const { error: insertError } = await supabase
      .from('razorpay_webhook_events')
      .insert({
        event_id: eventId,
        event_type: eventType,
        payload: payload
      });

    if (insertError) {
      // If it violates the UNIQUE constraint, it means we already processed this event.
      // Return 200 immediately to acknowledge to Razorpay without side effects.
      if (insertError.code === '23505') {
        return NextResponse.json({ success: true, message: 'Already processed' });
      }
      throw insertError;
    }

    // 4. Safe State Machine Execution
    if (eventType === 'order.paid') {
      const razorpayOrderId = payload.payload.payment.entity.order_id;
      const razorpayPaymentId = payload.payload.payment.entity.id;

      const { data: payment } = await supabase
        .from('payments')
        .select('order_id, status')
        .eq('razorpay_order_id', razorpayOrderId)
        .single();

      if (!payment) {
        // We received a webhook for an order we don't track.
        return NextResponse.json({ success: true, message: 'Untracked order' });
      }

      // No Regression Constraint
      if (payment.status === 'SUCCESS') {
        return NextResponse.json({ success: true, message: 'Payment already finalized by frontend callback' });
      }

      // Transition to SUCCESS
      await supabase.from('payments').update({ status: 'SUCCESS', razorpay_payment_id: razorpayPaymentId, razorpay_signature: 'WEBHOOK_OVERRIDE' }).eq('razorpay_order_id', razorpayOrderId);
      await supabase.from('orders').update({ status: 'PAID' }).eq('id', payment.order_id);

      // Consume Inventory
      const { data: orderData } = await supabase.from('orders').select('user_id').eq('id', payment.order_id).single();
      if (orderData) {
        const { data: cart } = await supabase.from('carts').select('id').eq('user_id', orderData.user_id).single();
        if (cart) {
          await supabase.rpc('consume_cart_reservations', { p_cart_id: cart.id });
        }
      }
    } 
    else if (eventType === 'payment.failed') {
      const razorpayOrderId = payload.payload.payment.entity.order_id;
      
      const { data: payment } = await supabase.from('payments').select('status').eq('razorpay_order_id', razorpayOrderId).single();
      
      if (payment) {
        // No Regression Constraint (prevent out-of-order failed event from reverting a SUCCESS)
        if (payment.status !== 'SUCCESS') {
           await supabase.from('payments').update({ status: 'FAILED' }).eq('razorpay_order_id', razorpayOrderId);
           // Inventory reservation will naturally expire and release itself; no action needed.
        }
      }
    }

    // 5. Success
    return NextResponse.json({ success: true });

  } catch (err) {
    console.error('Webhook processing error:', err);
    // Return 500 so Razorpay retries later if it was a network failure
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
