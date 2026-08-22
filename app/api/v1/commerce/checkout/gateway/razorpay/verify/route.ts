import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { createServerClient } from '@/lib/supabase/client';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await request.json();

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return NextResponse.json({ error: 'Missing payment signature details' }, { status: 400 });
  }

  // Bypass stale Database types
  const supabase = createServerClient() as any;
  const userId = session.user.id;

  // 1. Verify Signature Cryptographically (NEVER trust client boolean flags)
  const secret = process.env.RAZORPAY_KEY_SECRET!;
  const generatedSignature = crypto
    .createHmac('sha256', secret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  if (generatedSignature !== razorpay_signature) {
    console.error(`Invalid Razorpay signature for order: ${razorpay_order_id}`);
    
    // Mark payment as FAILED
    await supabase
      .from('payments')
      .update({ status: 'FAILED' })
      .eq('razorpay_order_id', razorpay_order_id);

    return NextResponse.json({ error: 'Payment verification failed' }, { status: 400 });
  }

  // 2. Locate the linked Database Order
  const { data: payment } = await supabase
    .from('payments')
    .select('order_id, status')
    .eq('razorpay_order_id', razorpay_order_id)
    .single();

  if (!payment) {
    return NextResponse.json({ error: 'Payment intent not found' }, { status: 404 });
  }

  if (payment.status === 'SUCCESS') {
    return NextResponse.json({ success: true, message: 'Already processed' });
  }

  // 3. Mark successful transactions
  const { error: paymentUpdateError } = await supabase
    .from('payments')
    .update({ 
      status: 'SUCCESS',
      razorpay_payment_id: razorpay_payment_id,
      razorpay_signature: razorpay_signature
    })
    .eq('razorpay_order_id', razorpay_order_id);

  const { error: orderUpdateError } = await supabase
    .from('orders')
    .update({ status: 'PAID' })
    .eq('id', payment.order_id);

  if (paymentUpdateError || orderUpdateError) {
    console.error('Failed to commit payment success to DB');
    return NextResponse.json({ error: 'Internal sync failure' }, { status: 500 });
  }

  // 4. Consume Physical Inventory (Atomic transition from RESERVED -> CONSUMED)
  const { data: cart } = await supabase.from('carts').select('id').eq('user_id', userId).single();
  
  if (cart) {
    const { error: consumeError } = await supabase.rpc('consume_cart_reservations', {
      p_cart_id: cart.id
    });
    
    if (consumeError) {
       // High severity alert: Money was taken, but stock consumption failed. 
       // Needs manual ops intervention, but we must return success to user since payment cleared.
       console.error('CRITICAL: Payment cleared but inventory consumption failed for cart:', cart.id, consumeError);
    }
  }

  return NextResponse.json({
    success: true,
    message: 'Payment verified and order finalized'
  });
}
