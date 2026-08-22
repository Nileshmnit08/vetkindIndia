import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { createServerClient } from '@/lib/supabase/client';

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Bypass stale Database types for new commerce tables
  const supabase = createServerClient() as any;
  const userId = session.user.id;
  const body = await request.json();
  const { shipping_address_id, billing_address_id } = body;

  if (!shipping_address_id) {
    return NextResponse.json({ error: 'Shipping address is required' }, { status: 400 });
  }

  // 1. Fetch and validate addresses
  const { data: shippingAddress } = await supabase
    .from('addresses')
    .select('*')
    .eq('id', shipping_address_id)
    .eq('user_id', userId)
    .single();

  if (!shippingAddress) {
    return NextResponse.json({ error: 'Invalid shipping address' }, { status: 400 });
  }

  const { data: billingAddress } = billing_address_id && billing_address_id !== shipping_address_id
    ? await supabase.from('addresses').select('*').eq('id', billing_address_id).eq('user_id', userId).single()
    : { data: shippingAddress };

  if (!billingAddress) {
    return NextResponse.json({ error: 'Invalid billing address' }, { status: 400 });
  }

  // 2. Validate Serviceability
  const { data: pincodeInfo } = await supabase
    .from('serviceable_pincodes')
    .select('is_active')
    .eq('pincode', shippingAddress.pincode)
    .single();

  if (!pincodeInfo || !pincodeInfo.is_active) {
    return NextResponse.json({ error: `Pincode ${shippingAddress.pincode} is not serviceable` }, { status: 400 });
  }

  // 3. Fetch Cart and Prepare Pricing Snapshot
  const { data: cart } = await supabase
    .from('carts')
    .select(`
      id,
      cart_items (
        id,
        quantity,
        variant_id,
        product_variants (
          id,
          price,
          tax_rate_percent,
          hsn_code,
          is_active
        )
      )
    `)
    .eq('user_id', userId)
    .single();

  if (!cart || !cart.cart_items || cart.cart_items.length === 0) {
    return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
  }

  // 4. Reserve Inventory (Atomic RPC)
  const { error: reserveError } = await supabase.rpc('reserve_cart_inventory', {
    p_cart_id: cart.id,
    p_user_id: userId,
    p_hold_minutes: 15
  });

  if (reserveError) {
    console.error('Reservation failed:', reserveError);
    return NextResponse.json({ error: reserveError.message || 'Failed to reserve inventory' }, { status: 409 });
  }

  // GST Routing Logic
  const sellerState = (process.env.SELLER_ORIGIN_STATE || 'Haryana').trim().toLowerCase();
  const customerState = shippingAddress.state.trim().toLowerCase();
  const isInterState = sellerState !== customerState;

  // 5. Calculate Totals (Authoritative Snapshot using BigInt)
  let subtotalAmount = 0n;
  let cgstAmount = 0n;
  let sgstAmount = 0n;
  let igstAmount = 0n;
  const orderItemsData = [];

  for (const item of cart.cart_items) {
    const variant = item.product_variants;
    if (!variant.is_active) {
       await supabase.rpc('release_cart_reservations', { p_cart_id: cart.id });
       return NextResponse.json({ error: 'An item in your cart is no longer active' }, { status: 400 });
    }

    const price = BigInt(variant.price);
    const qty = BigInt(item.quantity);
    const taxRate = BigInt(variant.tax_rate_percent || 18);
    
    const itemSubtotal = price * qty;
    // Exact deterministic rounding to nearest paisa: (val * rate + 50) / 100
    const itemTotalTax = (itemSubtotal * taxRate + 50n) / 100n;
    
    let itemCgst = 0n;
    let itemSgst = 0n;
    let itemIgst = 0n;

    if (isInterState) {
      itemIgst = itemTotalTax;
    } else {
      // Split evenly. To avoid dropping a paisa if odd, cgst = half rounded, sgst = remainder
      itemCgst = itemTotalTax / 2n; 
      itemSgst = itemTotalTax - itemCgst;
    }
    
    subtotalAmount += itemSubtotal;
    cgstAmount += itemCgst;
    sgstAmount += itemSgst;
    igstAmount += itemIgst;

    orderItemsData.push({
      variant_id: variant.id,
      quantity: item.quantity,
      unit_price_at_purchase: Number(price), 
      cgst_at_purchase: Number(itemCgst),
      sgst_at_purchase: Number(itemSgst),
      igst_at_purchase: Number(itemIgst),
      hsn_at_purchase: variant.hsn_code
    });
  }

  const shippingAmount = 0n; 
  const totalAmount = subtotalAmount + cgstAmount + sgstAmount + igstAmount + shippingAmount;

  // 6. Create Transaction Context (Orders)
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: userId,
      status: 'PENDING',
      subtotal_amount: Number(subtotalAmount),
      cgst_amount: Number(cgstAmount),
      sgst_amount: Number(sgstAmount),
      igst_amount: Number(igstAmount),
      shipping_amount: Number(shippingAmount),
      total_amount: Number(totalAmount),
      shipping_address_json: shippingAddress,
      billing_address_json: billingAddress
    })
    .select('id')
    .single();

  if (orderError) {
    console.error('Order creation failed:', orderError);
    await supabase.rpc('release_cart_reservations', { p_cart_id: cart.id });
    return NextResponse.json({ error: 'Failed to initialize order context' }, { status: 500 });
  }

  // 7. Insert Order Items
  const orderItemsWithOrderId = orderItemsData.map(item => ({ ...item, order_id: order.id }));
  const { error: itemsError } = await supabase.from('order_items').insert(orderItemsWithOrderId);

  if (itemsError) {
    console.error('Order items creation failed:', itemsError);
    await supabase.from('orders').delete().eq('id', order.id);
    await supabase.rpc('release_cart_reservations', { p_cart_id: cart.id });
    return NextResponse.json({ error: 'Failed to initialize order items' }, { status: 500 });
  }

  // 8. Success: Return Context to client
  return NextResponse.json({
    success: true,
    order_id: order.id,
    amount: Number(totalAmount),
    currency: 'INR'
  });
}
