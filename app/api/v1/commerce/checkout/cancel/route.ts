import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { createServerClient } from '@/lib/supabase/client';

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createServerClient();
  const userId = session.user.id;

  const { data: cart } = await supabase
    .from('carts')
    .select('id')
    .eq('user_id', userId)
    .single();
    
  if (!cart) {
    return NextResponse.json({ success: true, message: 'Nothing to cancel' });
  }

  // Release reservations immediately via RPC
  const { error } = await supabase.rpc('release_cart_reservations', {
    p_cart_id: cart.id
  });

  if (error) {
    console.error('Failed to release reservations:', error);
    return NextResponse.json({ error: 'Failed to release reservations' }, { status: 500 });
  }

  return NextResponse.json({ 
    success: true, 
    message: 'Reservations released'
  });
}
