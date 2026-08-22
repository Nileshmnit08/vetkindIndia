import { createAuthenticatedClient, createAdminClient, createMockRequest, mockAuthSession } from '../utils/test-client';
import { POST as InitiateCheckout } from '@/app/api/v1/commerce/checkout/initiate/route';
import { POST as Webhook } from '@/app/api/v1/commerce/checkout/gateway/razorpay/webhook/route';
import { NextRequest } from 'next/server';
import crypto from 'crypto';

// Fixed identities from seed.sql
const BUYER_A = 'aaaa0000-0000-0000-0000-000000000000';
const BUYER_B = 'bbbb0000-0000-0000-0000-000000000000';
const ADDR_A = 'addr-a'; // Haryana (122002)
const ADDR_B = 'addr-b'; // Maharashtra (400001)
const ADDR_INVALID = 'addr-invalid'; // (000000)
const VAR_PLENTIFUL = 'var-plentiful'; // 100 units
const VAR_FINAL = 'var-final-unit'; // 1 unit

const clientA = createAuthenticatedClient(BUYER_A);
const clientB = createAuthenticatedClient(BUYER_B);
const admin = createAdminClient();

// Setup: Inject global mocks for auth and createServerClient
jest.mock('@/auth', () => ({
  auth: jest.fn()
}));
jest.mock('@/lib/supabase/client', () => ({
  createServerClient: jest.fn()
}));

const authMock = require('@/auth').auth;
const createServerClientMock = require('@/lib/supabase/client').createServerClient;

describe('Commerce Matrix Integration Suite', () => {

  beforeEach(async () => {
    // Reset databases (clean carts, orders, and reset inventory to seed baseline)
    await admin.from('carts').delete().neq('id', '0');
    await admin.from('orders').delete().neq('id', '0');
    await admin.from('razorpay_webhook_events').delete().neq('id', '0');
    await admin.from('inventory_levels').update({ on_hand: 100, reserved: 0 }).eq('variant_id', VAR_PLENTIFUL);
    await admin.from('inventory_levels').update({ on_hand: 1, reserved: 0 }).eq('variant_id', VAR_FINAL);
    await admin.from('inventory_reservations').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  });

  describe('Core Cart Logic', () => {
    it('Add valid variant -> Cart line created', async () => {
      // Direct RPC or API check for Cart API. Assuming we test via direct DB for cart logic as it's pure DB.
      const { data: cart } = await clientA.from('carts').insert({ user_id: BUYER_A }).select().single();
      const { error } = await clientA.from('cart_items').insert({ cart_id: cart.id, variant_id: VAR_PLENTIFUL, quantity: 2 });
      
      expect(error).toBeNull();
      const { data: items } = await clientA.from('cart_items').select('*').eq('cart_id', cart.id);
      expect(items!).toHaveLength(1);
      expect(items![0].quantity).toBe(2);
    });

    it('Customer A reads Customer B data -> Denied (RLS)', async () => {
      const { data: cartB } = await admin.from('carts').insert({ user_id: BUYER_B }).select().single();
      await admin.from('cart_items').insert({ cart_id: cartB.id, variant_id: VAR_PLENTIFUL, quantity: 5 });

      // Client A attempts to read Client B's cart items
      const { data: items } = await clientA.from('cart_items').select('*').eq('cart_id', cartB.id);
      expect(items!).toHaveLength(0); // RLS prevents visibility
    });
  });

  describe('Checkout Initiation Rules', () => {
    beforeEach(async () => {
      authMock.mockResolvedValue(mockAuthSession(BUYER_A));
      createServerClientMock.mockReturnValue(clientA);
      
      const { data: cart } = await clientA.from('carts').insert({ user_id: BUYER_A }).select().single();
      await clientA.from('cart_items').insert({ cart_id: cart.id, variant_id: VAR_PLENTIFUL, quantity: 1 });
    });

    it('Non-serviceable pincode -> Checkout blocked', async () => {
      const req = createMockRequest({ shipping_address_id: ADDR_INVALID, billing_address_id: ADDR_INVALID });
      const res = await InitiateCheckout(req);
      const json = await res.json();
      
      expect(res.status).toBe(400);
      expect(json.error).toMatch(/is not serviceable/);
    });

    it('Intra-state (Haryana -> Haryana) -> CGST + SGST', async () => {
      process.env.SELLER_ORIGIN_STATE = 'Haryana';
      const req = createMockRequest({ shipping_address_id: ADDR_A, billing_address_id: ADDR_A });
      const res = await InitiateCheckout(req);
      const json = await res.json();
      
      expect(res.status).toBe(200);
      
      const { data: order } = await clientA.from('orders').select('*').eq('id', json.order_id).single();
      expect(order!.cgst_amount).toBeGreaterThan(0);
      expect(order!.sgst_amount).toBeGreaterThan(0);
      expect(order!.igst_amount).toBe(0);
    });

    it('Inter-state (Haryana -> Maharashtra) -> IGST', async () => {
      process.env.SELLER_ORIGIN_STATE = 'Haryana';
      // Switch identity to Buyer B (Mumbai)
      authMock.mockResolvedValue(mockAuthSession(BUYER_B));
      createServerClientMock.mockReturnValue(clientB);
      
      const { data: cart } = await clientB.from('carts').insert({ user_id: BUYER_B }).select().single();
      await clientB.from('cart_items').insert({ cart_id: cart.id, variant_id: VAR_PLENTIFUL, quantity: 1 });

      const req = createMockRequest({ shipping_address_id: ADDR_B, billing_address_id: ADDR_B });
      const res = await InitiateCheckout(req);
      const json = await res.json();
      
      expect(res.status).toBe(200);
      
      const { data: order } = await clientB.from('orders').select('*').eq('id', json.order_id).single();
      expect(order!.cgst_amount).toBe(0);
      expect(order!.sgst_amount).toBe(0);
      expect(order!.igst_amount).toBeGreaterThan(0);
    });
  });

  describe('Concurrency & Webhooks', () => {
    it('Two buyers / final unit -> Exactly one succeeds', async () => {
      process.env.SELLER_ORIGIN_STATE = 'Haryana';
      
      // Setup Carts for both buyers competing for VAR_FINAL (1 unit left)
      const { data: cartA } = await admin.from('carts').insert({ user_id: BUYER_A }).select().single();
      await admin.from('cart_items').insert({ cart_id: cartA.id, variant_id: VAR_FINAL, quantity: 1 });
      
      const { data: cartB } = await admin.from('carts').insert({ user_id: BUYER_B }).select().single();
      await admin.from('cart_items').insert({ cart_id: cartB.id, variant_id: VAR_FINAL, quantity: 1 });

      // Buyer A Request
      const reqA = createMockRequest({ shipping_address_id: ADDR_A, billing_address_id: ADDR_A });
      // Buyer B Request
      const reqB = createMockRequest({ shipping_address_id: ADDR_B, billing_address_id: ADDR_B });

      // We need the API to use the right client internally based on who calls it.
      // Since our mock relies on global state, we have to mock it dynamically inside the route or use admin.
      // For race condition testing, it's safer to test the DB RPC directly via Promise.all.
      
      const race = await Promise.all([
        clientA.rpc('reserve_cart_inventory', { p_cart_id: cartA.id, p_user_id: BUYER_A, p_hold_minutes: 15 }),
        clientB.rpc('reserve_cart_inventory', { p_cart_id: cartB.id, p_user_id: BUYER_B, p_hold_minutes: 15 })
      ]);

      const successes = race.filter(r => !r.error);
      const failures = race.filter(r => r.error);
      
      expect(successes).toHaveLength(1);
      expect(failures).toHaveLength(1);
      expect(failures[0].error!.message).toMatch(/Insufficient inventory/);
    });

    it('Duplicate webhook -> No duplicate business effect', async () => {
      process.env.RAZORPAY_WEBHOOK_SECRET = 'secret';
      
      const payload = { event: 'order.paid', payload: { payment: { entity: { order_id: 'rzp_123', id: 'pay_123' } } } };
      const rawBody = JSON.stringify(payload);
      const sig = crypto.createHmac('sha256', 'secret').update(rawBody).digest('hex');

      const req1 = new Request('http://localhost', {
        method: 'POST',
        headers: { 'x-razorpay-event-id': 'evt_1', 'x-razorpay-signature': sig, 'content-type': 'application/json' },
        body: rawBody
      }) as NextRequest;

      const req2 = new Request('http://localhost', {
        method: 'POST',
        headers: { 'x-razorpay-event-id': 'evt_1', 'x-razorpay-signature': sig, 'content-type': 'application/json' },
        body: rawBody
      }) as NextRequest;

      // Ensure mock admin client is used for webhook parsing
      createServerClientMock.mockReturnValue(admin);

      const res1 = await Webhook(req1);
      const res2 = await Webhook(req2);
      
      // Both should succeed (idempotent), but second one says 'Already processed'
      expect(res1.status).toBe(200);
      expect(res2.status).toBe(200);
      
      const json2 = await res2.json();
      expect(json2.message).toBe('Already processed');
    });
  });
});
