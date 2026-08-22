-- Seed File for Integration Tests
-- Note: It is assumed that the database is reset before running tests.

-- 1. Create Test Users in auth.users (Bypass password hashing for tests by just providing dummy hash)
INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, 
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at
) VALUES 
('00000000-0000-0000-0000-000000000000', 'aaaa0000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'buyer_a@test.com', 'dummy_hash', now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
('00000000-0000-0000-0000-000000000000', 'bbbb0000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'buyer_b@test.com', 'dummy_hash', now(), '{"provider":"email","providers":["email"]}', '{}', now(), now())
ON CONFLICT (id) DO NOTHING;

-- 2. Create matching public.users
INSERT INTO public.users (id, email, name, role)
VALUES 
('aaaa0000-0000-0000-0000-000000000000', 'buyer_a@test.com', 'Buyer A', 'USER'),
('bbbb0000-0000-0000-0000-000000000000', 'buyer_b@test.com', 'Buyer B', 'USER')
ON CONFLICT (id) DO NOTHING;

-- 3. Create Addresses
INSERT INTO public.addresses (id, user_id, type, address_line_1, city, state, pincode, is_default)
VALUES
('addr-a', 'aaaa0000-0000-0000-0000-000000000000', 'SHIPPING', 'Test Address A', 'Gurugram', 'Haryana', '122002', true),
('addr-b', 'bbbb0000-0000-0000-0000-000000000000', 'SHIPPING', 'Test Address B', 'Mumbai', 'Maharashtra', '400001', true),
('addr-invalid', 'aaaa0000-0000-0000-0000-000000000000', 'SHIPPING', 'Bad Address', 'Remote', 'Somewhere', '000000', false)
ON CONFLICT (id) DO NOTHING;

-- 4. Create Serviceable Pincodes
INSERT INTO public.serviceable_pincodes (pincode, state, city, is_active)
VALUES
('122002', 'Haryana', 'Gurugram', true),
('400001', 'Maharashtra', 'Mumbai', true),
('000000', 'Somewhere', 'Remote', false)
ON CONFLICT (pincode) DO NOTHING;

-- 5. Create Catalogue Entities
INSERT INTO public.species (id, name, slug, is_active) VALUES ('spec-1', 'Dogs', 'dogs', true) ON CONFLICT DO NOTHING;
INSERT INTO public.products (id, name, slug, species_id, published) 
VALUES ('prod-1', 'Test Product', 'test-product', 'spec-1', true) ON CONFLICT DO NOTHING;

-- 6. Create Product Variants
INSERT INTO public.product_variants (id, product_id, sku, variant_name, price, tax_rate_percent, hsn_code, is_active)
VALUES 
('var-plentiful', 'prod-1', 'SKU-PLENTIFUL', '100ml', 50000, 18, 'HSN100', true),
('var-final-unit', 'prod-1', 'SKU-FINAL', '500ml', 100000, 18, 'HSN500', true)
ON CONFLICT DO NOTHING;

-- 7. Create Inventory Levels
INSERT INTO public.inventory_levels (variant_id, on_hand, reserved)
VALUES 
('var-plentiful', 100, 0),
('var-final-unit', 1, 0)
ON CONFLICT (variant_id) DO UPDATE SET on_hand = EXCLUDED.on_hand, reserved = EXCLUDED.reserved;
