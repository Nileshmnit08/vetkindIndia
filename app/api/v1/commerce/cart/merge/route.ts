import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { createServerClient } from '@/lib/supabase/client';

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const items = body.items as { variant_id: string, quantity: number }[];
  
  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ success: true, message: 'Nothing to merge' });
  }

  const supabase = createServerClient();
  const userId = session.user.id;

  // 1. Get or create cart for user
  let { data: cart } = await supabase.from('carts').select('id').eq('user_id', userId).single();
  
  if (!cart) {
    const { data: newCart, error } = await supabase.from('carts').insert({ user_id: userId }).select().single();
    if (error) return NextResponse.json({ error: 'Failed to create cart' }, { status: 500 });
    cart = newCart;
  }

  // 2. Fetch existing items to calculate the new sum
  const { data: existingItems } = await supabase
    .from('cart_items')
    .select('id, variant_id, quantity')
    .eq('cart_id', cart.id);
    
  const existingMap = new Map(existingItems?.map(item => [item.variant_id, item]) || []);

  // 3. Process each incoming item
  for (const item of items) {
    if (!item.variant_id || !item.quantity || item.quantity < 1) continue;
    
    const existing = existingMap.get(item.variant_id);
    const newQuantity = (existing?.quantity || 0) + item.quantity;
    
    if (existing) {
      await supabase.from('cart_items').update({ quantity: newQuantity }).eq('id', existing.id);
    } else {
      await supabase.from('cart_items').insert({ 
        cart_id: cart.id, 
        variant_id: item.variant_id, 
        quantity: newQuantity 
      });
    }
  }

  return NextResponse.json({ success: true, message: 'Cart merged successfully' });
}
