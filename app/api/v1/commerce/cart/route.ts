import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { createServerClient } from '@/lib/supabase/client';

interface CommerceCart {
  id: string;
  user_id?: string;
  cart_items?: any[];
}

interface MinimalCart {
  id: string;
}

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createServerClient() as any;
  const userId = session.user.id;

  const { data: cart, error: cartError } = await supabase
    .from('carts')
    .select(`
      id,
      cart_items (
        id,
        quantity,
        product_variants (
          id,
          name,
          pack_size,
          price,
          is_active,
          inventory_levels (
            on_hand,
            reserved
          )
        )
      )
    `)
    .eq('user_id', userId)
    .single() as { data: CommerceCart | null, error: any };

  if (cartError && cartError.code !== 'PGRST116') {
    return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 });
  }

  if (!cart) {
    return NextResponse.json({ items: [], total_amount: 0 });
  }

  let totalAmount = 0;
  const items = (cart.cart_items || []).map((item: any) => {
    const variant = item.product_variants;
    const inventory = variant.inventory_levels?.[0] || { on_hand: 0, reserved: 0 };
    const availableQty = inventory.on_hand - inventory.reserved;
    
    // Cap at what's available
    const finalQuantity = Math.min(item.quantity, availableQty > 0 ? availableQty : 0);
    const subtotal = variant.price * finalQuantity;
    
    if (variant.is_active && finalQuantity > 0) {
      totalAmount += subtotal;
    }

    return {
      id: item.id,
      variant_id: variant.id,
      name: variant.name,
      pack_size: variant.pack_size,
      unit_price: variant.price,
      quantity: finalQuantity,
      requested_quantity: item.quantity,
      is_active: variant.is_active,
      is_available: finalQuantity > 0,
      subtotal: variant.is_active ? subtotal : 0
    };
  });

  return NextResponse.json({
    cart_id: cart.id,
    items,
    total_amount: totalAmount,
  });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { variant_id, quantity } = body;
  
  if (!variant_id || !quantity || quantity < 1) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  const supabase = createServerClient() as any;
  const userId = session.user.id;

  let { data: cart } = await supabase.from('carts').select('id').eq('user_id', userId).single() as { data: MinimalCart | null };
  
  if (!cart) {
    const { data: newCart, error } = await supabase.from('carts').insert({ user_id: userId }).select().single() as { data: MinimalCart | null, error: any };
    if (error) return NextResponse.json({ error: 'Failed to create cart' }, { status: 500 });
    cart = newCart;
  }

  // Fetch current item to add onto it
  const { data: existingItem } = await supabase
    .from('cart_items')
    .select('id, quantity')
    .eq('cart_id', cart!.id)
    .eq('variant_id', variant_id)
    .single() as { data: { id: string; quantity: number } | null };

  const newQuantity = (existingItem?.quantity || 0) + quantity;

  if (existingItem) {
    await supabase.from('cart_items').update({ quantity: newQuantity }).eq('id', existingItem.id);
  } else {
    await supabase.from('cart_items').insert({ cart_id: cart!.id, variant_id, quantity: newQuantity });
  }

  return NextResponse.json({ success: true, message: 'Cart updated' });
}

export async function PUT(request: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { variant_id, quantity } = body;
  
  if (!variant_id || quantity < 0) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });

  const supabase = createServerClient() as any;
  
  const { data: cart } = await supabase.from('carts').select('id').eq('user_id', session.user.id).single() as { data: MinimalCart | null };
  if (!cart) return NextResponse.json({ error: 'Cart not found' }, { status: 404 });

  if (quantity === 0) {
    await supabase.from('cart_items').delete().eq('cart_id', cart.id).eq('variant_id', variant_id);
  } else {
    await supabase.from('cart_items').update({ quantity }).eq('cart_id', cart.id).eq('variant_id', variant_id);
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(request: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const url = new URL(request.url);
  const variantId = url.searchParams.get('variant_id');
  
  const supabase = createServerClient() as any;
  const { data: cart } = await supabase.from('carts').select('id').eq('user_id', session.user.id).single() as { data: MinimalCart | null };
  
  if (!cart) return NextResponse.json({ success: true });

  if (variantId) {
    await supabase.from('cart_items').delete().eq('cart_id', cart.id).eq('variant_id', variantId);
  } else {
    // Clear whole cart
    await supabase.from('cart_items').delete().eq('cart_id', cart.id);
  }

  return NextResponse.json({ success: true });
}
