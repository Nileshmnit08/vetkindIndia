-- ============================================
-- VetKind Commerce Database Schema & Security Overhaul
-- Migration: 20260822154500_create_commerce_schema
-- ============================================

-- ============================================
-- 1. DROP EXISTING PERMISSIVE RLS POLICIES
-- ============================================
DROP POLICY IF EXISTS "Allow all operations" ON users;
DROP POLICY IF EXISTS "Allow all operations" ON distributor_profiles;
DROP POLICY IF EXISTS "Allow all operations" ON species;
DROP POLICY IF EXISTS "Allow all operations" ON products;
DROP POLICY IF EXISTS "Allow all operations" ON product_resources;
DROP POLICY IF EXISTS "Allow all operations" ON inquiries;
DROP POLICY IF EXISTS "Allow all operations" ON solutions_admin;
DROP POLICY IF EXISTS "Allow all operations" ON knowledge_articles;
DROP POLICY IF EXISTS "Allow all operations" ON research_articles;
DROP POLICY IF EXISTS "Allow all operations" ON news_events;
DROP POLICY IF EXISTS "Allow all operations" ON blog_articles;

-- Recreate standard secure baseline for public readable tables (Admin handles mutations)
DROP POLICY IF EXISTS "Enable read access for all users" ON products;
CREATE POLICY "Enable read access for all users" ON products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Enable read access for all users" ON species;
CREATE POLICY "Enable read access for all users" ON species FOR SELECT USING (true);

DROP POLICY IF EXISTS "Enable read access for all users" ON product_resources;
CREATE POLICY "Enable read access for all users" ON product_resources FOR SELECT USING (true);

DROP POLICY IF EXISTS "Enable read access for all users" ON solutions_admin;
CREATE POLICY "Enable read access for all users" ON solutions_admin FOR SELECT USING (true);

DROP POLICY IF EXISTS "Enable read access for all users" ON knowledge_articles;
CREATE POLICY "Enable read access for all users" ON knowledge_articles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Enable read access for all users" ON research_articles;
CREATE POLICY "Enable read access for all users" ON research_articles FOR SELECT USING (true);



DROP POLICY IF EXISTS "Enable read access for all users" ON news_events;
CREATE POLICY "Enable read access for all users" ON news_events FOR SELECT USING (true);

DROP POLICY IF EXISTS "Enable read access for all users" ON blog_articles;
CREATE POLICY "Enable read access for all users" ON blog_articles FOR SELECT USING (true);

-- Users can only read/update their own data
DROP POLICY IF EXISTS "Users can view own record" ON users;
CREATE POLICY "Users can view own record" ON users FOR SELECT USING (auth.uid()::text = id);

DROP POLICY IF EXISTS "Users can update own record" ON users;
CREATE POLICY "Users can update own record" ON users FOR UPDATE USING (auth.uid()::text = id);

DROP POLICY IF EXISTS "Users can view own profile" ON distributor_profiles;
CREATE POLICY "Users can view own profile" ON distributor_profiles FOR SELECT USING (auth.uid()::text = user_id);

DROP POLICY IF EXISTS "Users can update own profile" ON distributor_profiles;
CREATE POLICY "Users can update own profile" ON distributor_profiles FOR UPDATE USING (auth.uid()::text = user_id);

-- ============================================
-- 2. CREATE COMMERCE TABLES
-- ============================================

-- PRODUCT VARIANTS
CREATE TABLE IF NOT EXISTS product_variants (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  sku TEXT UNIQUE NOT NULL,
  variant_name TEXT NOT NULL, -- e.g. "500ml", "1 Liter"
  pack_size TEXT,
  weight_grams INTEGER,
  price BIGINT NOT NULL, -- Stored in paisa
  tax_rate_percent INTEGER DEFAULT 18,
  hsn_code TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- INVENTORY
CREATE TABLE IF NOT EXISTS inventory_levels (
  variant_id TEXT PRIMARY KEY REFERENCES product_variants(id) ON DELETE CASCADE,
  on_hand INTEGER NOT NULL DEFAULT 0,
  reserved INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT chk_inventory_not_negative CHECK (on_hand - reserved >= 0)
);

CREATE TABLE IF NOT EXISTS inventory_transactions (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  variant_id TEXT NOT NULL REFERENCES product_variants(id),
  quantity_change INTEGER NOT NULL,
  transaction_type TEXT NOT NULL, -- 'INWARD', 'OUTWARD', 'RESERVE', 'RELEASE', 'CORRECTION'
  reference_id TEXT, -- e.g. Order ID
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);


-- SERVICEABLE PINCODES
CREATE TABLE IF NOT EXISTS serviceable_pincodes (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  pincode TEXT NOT NULL UNIQUE,
  state TEXT NOT NULL,
  city TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ADDRESSES
CREATE TABLE IF NOT EXISTS addresses (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'SHIPPING', 'BILLING'
  address_line_1 TEXT NOT NULL,
  address_line_2 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pincode TEXT NOT NULL,
  gst_number TEXT,
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- CARTS
CREATE TABLE IF NOT EXISTS carts (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS cart_items (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  cart_id TEXT NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
  variant_id TEXT NOT NULL REFERENCES product_variants(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(cart_id, variant_id)
);

CREATE TABLE IF NOT EXISTS inventory_reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  variant_id TEXT NOT NULL REFERENCES product_variants(id),
  user_id TEXT NOT NULL REFERENCES users(id),
  cart_id TEXT REFERENCES carts(id),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  status TEXT NOT NULL DEFAULT 'ACTIVE', -- ACTIVE, CONSUMED, EXPIRED, RELEASED
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ORDERS
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT NOT NULL REFERENCES users(id),
  status TEXT NOT NULL DEFAULT 'PENDING', -- PENDING, PAID, SHIPPED, DELIVERED, CANCELLED
  subtotal_amount BIGINT NOT NULL,
  cgst_amount BIGINT NOT NULL DEFAULT 0,
  sgst_amount BIGINT NOT NULL DEFAULT 0,
  igst_amount BIGINT NOT NULL DEFAULT 0,
  shipping_amount BIGINT NOT NULL,
  total_amount BIGINT NOT NULL,
  shipping_address_json JSONB NOT NULL,
  billing_address_json JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS order_items (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  variant_id TEXT NOT NULL REFERENCES product_variants(id),
  quantity INTEGER NOT NULL,
  unit_price_at_purchase BIGINT NOT NULL,
  cgst_at_purchase BIGINT NOT NULL DEFAULT 0,
  sgst_at_purchase BIGINT NOT NULL DEFAULT 0,
  igst_at_purchase BIGINT NOT NULL DEFAULT 0,
  hsn_at_purchase TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- PAYMENTS
CREATE TABLE IF NOT EXISTS payments (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  order_id TEXT NOT NULL UNIQUE REFERENCES orders(id),
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  razorpay_signature TEXT,
  status TEXT NOT NULL DEFAULT 'PENDING', -- PENDING, SUCCESS, FAILED
  amount BIGINT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- WEBHOOK EVENTS AUDIT
CREATE TABLE IF NOT EXISTS razorpay_webhook_events (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  event_id TEXT NOT NULL UNIQUE,
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- 3. COMMERCE TABLE TRIGGERS
-- ============================================
DROP TRIGGER IF EXISTS update_product_variants_updated_at ON product_variants;
CREATE TRIGGER update_product_variants_updated_at BEFORE UPDATE ON product_variants FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_inventory_levels_updated_at ON inventory_levels;
CREATE TRIGGER update_inventory_levels_updated_at BEFORE UPDATE ON inventory_levels FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_serviceable_pincodes_updated_at ON serviceable_pincodes;
CREATE TRIGGER update_serviceable_pincodes_updated_at BEFORE UPDATE ON serviceable_pincodes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_addresses_updated_at ON addresses;
CREATE TRIGGER update_addresses_updated_at BEFORE UPDATE ON addresses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_carts_updated_at ON carts;
CREATE TRIGGER update_carts_updated_at BEFORE UPDATE ON carts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_cart_items_updated_at ON cart_items;
CREATE TRIGGER update_cart_items_updated_at BEFORE UPDATE ON cart_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_payments_updated_at ON payments;
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 4. COMMERCE RLS POLICIES
-- ============================================
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE serviceable_pincodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE razorpay_webhook_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable read access for all users" ON product_variants;
CREATE POLICY "Enable read access for all users" ON product_variants FOR SELECT USING (true);

DROP POLICY IF EXISTS "Enable read access for all users" ON serviceable_pincodes;
CREATE POLICY "Enable read access for all users" ON serviceable_pincodes FOR SELECT USING (true);

DROP POLICY IF EXISTS "Inventory is strictly server-side" ON inventory_levels;
CREATE POLICY "Inventory is strictly server-side" ON inventory_levels FOR ALL USING (false); -- Blind to public

DROP POLICY IF EXISTS "Webhooks are strictly server-side" ON razorpay_webhook_events;
CREATE INDEX idx_razorpay_webhook_events_event_id ON razorpay_webhook_events(event_id);
CREATE INDEX idx_inventory_reservations_cart_status ON inventory_reservations(cart_id, status);
CREATE POLICY "Webhooks are strictly server-side" ON razorpay_webhook_events FOR ALL USING (false); -- Blind to public

DROP POLICY IF EXISTS "Users can manage own addresses" ON addresses;
CREATE POLICY "Users can manage own addresses" ON addresses FOR ALL USING (auth.uid()::text = user_id) WITH CHECK (auth.uid()::text = user_id);

DROP POLICY IF EXISTS "Users can manage own cart" ON carts;
CREATE POLICY "Users can manage own cart" ON carts FOR ALL USING (auth.uid()::text = user_id) WITH CHECK (auth.uid()::text = user_id);

DROP POLICY IF EXISTS "Users can manage own cart items" ON cart_items;
CREATE POLICY "Users can manage own cart items" ON cart_items FOR ALL USING (
  EXISTS (SELECT 1 FROM carts WHERE carts.id = cart_items.cart_id AND carts.user_id = auth.uid()::text)
);

DROP POLICY IF EXISTS "Users can view own orders" ON orders;
CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (auth.uid()::text = user_id);

DROP POLICY IF EXISTS "Users can view own order items" ON order_items;
CREATE POLICY "Users can view own order items" ON order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()::text)
);

DROP POLICY IF EXISTS "Users can view own payments" ON payments;
CREATE POLICY "Users can view own payments" ON payments FOR SELECT USING (
  EXISTS (SELECT 1 FROM orders WHERE orders.id = payments.order_id AND orders.user_id = auth.uid()::text)
);

-- ============================================
-- 5. INVENTORY RPC & CRON
-- ============================================

CREATE OR REPLACE FUNCTION reserve_inventory(p_variant_id TEXT, p_user_id TEXT, p_quantity INTEGER, p_hold_minutes INTEGER DEFAULT 15)
RETURNS UUID
LANGUAGE plpgsql
AS $$
DECLARE
    v_available INTEGER;
    v_reservation_id UUID;
BEGIN
    -- 1. ACQUIRE LOCK: Lock the inventory row for this transaction to prevent race conditions
    SELECT (on_hand - reserved) INTO v_available
    FROM inventory_levels
    WHERE variant_id = p_variant_id
    FOR UPDATE;
    
    IF v_available IS NULL THEN
        RAISE EXCEPTION 'Inventory level not found for variant %', p_variant_id;
    END IF;

    -- 2. EVALUATE INVARIANT: Enforce final-unit concurrency
    IF v_available < p_quantity THEN
        RAISE EXCEPTION 'Insufficient inventory. Requested: %, Available: %', p_quantity, v_available;
    END IF;

    -- 3. MUTATE: Safely increment reserved
    UPDATE inventory_levels 
    SET reserved = reserved + p_quantity
    WHERE variant_id = p_variant_id;

    -- 4. RECORD: Create time-bound reservation record
    INSERT INTO inventory_reservations (variant_id, user_id, quantity, expires_at)
    VALUES (p_variant_id, p_user_id, p_quantity, now() + (p_hold_minutes || ' minutes')::interval)
    RETURNING id INTO v_reservation_id;
    
    RETURN v_reservation_id;
END;
$$;

CREATE OR REPLACE FUNCTION release_expired_reservations()
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
    r RECORD;
BEGIN
    -- Find and lock active reservations that have expired
    FOR r IN SELECT id, variant_id, quantity FROM inventory_reservations 
             WHERE status = 'ACTIVE' AND expires_at < now() 
             FOR UPDATE SKIP LOCKED LOOP
             
        -- Release reserved quantity
        UPDATE inventory_levels SET reserved = reserved - r.quantity WHERE variant_id = r.variant_id;
        
        -- Mark as expired
        UPDATE inventory_reservations SET status = 'EXPIRED' WHERE id = r.id;
    END LOOP;
END;
$$;

-- Note: In Supabase, the pg_cron extension must be enabled by a superuser.
-- CREATE EXTENSION IF NOT EXISTS pg_cron;
-- SELECT cron.schedule('release-expired-reservations', '* * * * *', 'SELECT release_expired_reservations()');

-- ============================================
-- 6. ATOMIC CART RESERVATIONS
-- ============================================

CREATE OR REPLACE FUNCTION release_cart_reservations(p_cart_id TEXT)
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (
        SELECT id, variant_id, quantity FROM inventory_reservations 
        WHERE cart_id = p_cart_id AND status = 'ACTIVE' 
        ORDER BY variant_id ASC
    ) LOOP
        -- Acquire row lock and release
        PERFORM 1 FROM inventory_reservations WHERE id = r.id FOR UPDATE;
        
        UPDATE inventory_levels SET reserved = reserved - r.quantity WHERE variant_id = r.variant_id;
        UPDATE inventory_reservations SET status = 'RELEASED' WHERE id = r.id;
    END LOOP;
END;
$$;

CREATE OR REPLACE FUNCTION reserve_cart_inventory(p_cart_id TEXT, p_user_id TEXT, p_hold_minutes INTEGER DEFAULT 15)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    r RECORD;
    v_available INTEGER;
BEGIN
    -- 0. Idempotency Check: Release any existing active reservations for this cart first
    -- This prevents double-reserving if the user refreshes or retries the checkout endpoint
    PERFORM release_cart_reservations(p_cart_id);

    -- Loop through all items in the cart, explicitly ordering by variant_id to PREVENT DEADLOCKS
    FOR r IN (
        SELECT ci.variant_id, ci.quantity
        FROM cart_items ci
        WHERE ci.cart_id = p_cart_id
        ORDER BY ci.variant_id ASC
    ) LOOP
        -- 1. Lock the specific inventory row
        SELECT (on_hand - reserved) INTO v_available
        FROM inventory_levels
        WHERE variant_id = r.variant_id
        FOR UPDATE;

        IF v_available IS NULL THEN
            RAISE EXCEPTION 'Inventory level not found for variant %', r.variant_id;
        END IF;

        -- 2. Enforce invariant
        IF v_available < r.quantity THEN
            RAISE EXCEPTION 'Insufficient inventory for variant %. Requested: %, Available: %', r.variant_id, r.quantity, v_available;
        END IF;

        -- 3. Mutate
        UPDATE inventory_levels 
        SET reserved = reserved + r.quantity
        WHERE variant_id = r.variant_id;

        -- 4. Record Reservation
        INSERT INTO inventory_reservations (variant_id, user_id, cart_id, quantity, expires_at)
        VALUES (r.variant_id, p_user_id, p_cart_id, r.quantity, now() + (p_hold_minutes || ' minutes')::interval);
    END LOOP;
    
    RETURN TRUE;
END;
$$;

-- 8. CONSUME INVENTORY (POST-PAYMENT)
CREATE OR REPLACE FUNCTION consume_cart_reservations(p_cart_id TEXT) 
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    r RECORD;
BEGIN
    -- 1. Deduct from on_hand and reserved
    FOR r IN (
        SELECT variant_id, quantity 
        FROM inventory_reservations 
        WHERE cart_id = p_cart_id AND status = 'ACTIVE'
    ) LOOP
        UPDATE inventory_levels 
        SET 
            on_hand = on_hand - r.quantity,
            reserved = reserved - r.quantity
        WHERE variant_id = r.variant_id;
    END LOOP;

    -- 2. Mark as CONSUMED
    UPDATE inventory_reservations
    SET status = 'CONSUMED'
    WHERE cart_id = p_cart_id AND status = 'ACTIVE';

    -- 3. Clear the cart
    DELETE FROM cart_items WHERE cart_id = p_cart_id;
    
    RETURN TRUE;
END;
$$;

