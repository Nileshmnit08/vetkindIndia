import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { createServerClient } from '@/lib/supabase/client';

interface MinimalCart {
  id: string;
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createServerClient() as any;
  const userId = session.user.id;

  // 1. Get user cart
  const { data: cart } = await supabase
    .from('carts')
    .select('id')
    .eq('user_id', userId)
    .single() as { data: MinimalCart | null };
    
  if (!cart) {
    return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
  }

  // 2. Call the Atomic Reserve RPC
  const { data: success, error } = await supabase.rpc('reserve_cart_inventory', {
    p_cart_id: cart.id,
    p_user_id: userId,
    p_hold_minutes: 15
  });

  if (error) {
    console.error('Reservation failed:', error);
    // Usually implies insufficient inventory or a deadlock trigger
    return NextResponse.json({ error: error.message || 'Failed to reserve inventory' }, { status: 409 });
  }

  // 3. (Optional) Create an order in PENDING state here, or return success to proceed to payment gateway
  return NextResponse.json({ 
    success: true, 
    message: 'Inventory reserved for 15 minutes', 
    cart_id: cart.id 
  });
}
