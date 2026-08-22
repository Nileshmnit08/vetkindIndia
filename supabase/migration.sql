-- ============================================
-- VetKind Database Schema for Supabase
-- Run in: Supabase Dashboard → SQL Editor
-- ============================================

-- 1. Users table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT,
  email TEXT UNIQUE,
  password TEXT,
  role TEXT NOT NULL DEFAULT 'USER',
  status TEXT NOT NULL DEFAULT 'ACTIVE',
  email_verified TIMESTAMPTZ,
  image TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Distributor Profiles
CREATE TABLE IF NOT EXISTS distributor_profiles (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  region TEXT,
  gst_number TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Species
CREATE TABLE IF NOT EXISTS species (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image TEXT,
  featured BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Products
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  species_id TEXT REFERENCES species(id) ON DELETE SET NULL,
  category TEXT,
  benefits TEXT,
  product_type TEXT,
  badges TEXT,
  pack_size TEXT,
  description TEXT,
  short_description TEXT,
  price DOUBLE PRECISION,
  image TEXT,
  featured BOOLEAN NOT NULL DEFAULT false,
  bestseller BOOLEAN NOT NULL DEFAULT false,
  published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. Product Resources
CREATE TABLE IF NOT EXISTS product_resources (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  file_url TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  visibility TEXT NOT NULL DEFAULT 'DISTRIBUTOR',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. Inquiries
CREATE TABLE IF NOT EXISTS inquiries (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  company TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'NEW',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. Solutions (admin-managed)
CREATE TABLE IF NOT EXISTS solutions_admin (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  short_summary TEXT,
  full_content TEXT,
  hero_image TEXT,
  icon_name TEXT,
  species_tags TEXT,
  benefits TEXT,
  related_products TEXT,
  featured BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'DRAFT',
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 8. Knowledge Articles
CREATE TABLE IF NOT EXISTS knowledge_articles (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category TEXT,
  excerpt TEXT,
  cover_image TEXT,
  article_content TEXT,
  author TEXT,
  read_time TEXT,
  published_at TIMESTAMPTZ,
  featured BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'DRAFT',
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 9. Research Articles
CREATE TABLE IF NOT EXISTS research_articles (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category TEXT,
  excerpt TEXT,
  cover_image TEXT,
  article_content TEXT,
  author TEXT,
  published_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'DRAFT',
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 10. News & Events
CREATE TABLE IF NOT EXISTS news_events (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  summary TEXT,
  cover_image TEXT,
  content TEXT,
  type TEXT NOT NULL DEFAULT 'NEWS',
  event_date TIMESTAMPTZ,
  location TEXT,
  published_at TIMESTAMPTZ,
  featured BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'DRAFT',
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 11. Blog Articles
CREATE TABLE IF NOT EXISTS blog_articles (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  cover_image TEXT,
  article_content TEXT,
  author TEXT,
  category TEXT,
  tags TEXT,
  published_at TIMESTAMPTZ,
  featured BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'DRAFT',
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- Row Level Security Policies
-- Permissive: allows all operations via anon key
-- (App handles auth in Next.js server actions)
-- ============================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE distributor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE species ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE solutions_admin ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE research_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations" ON users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON distributor_profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON species FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON product_resources FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON inquiries FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON solutions_admin FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON knowledge_articles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON research_articles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON news_events FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON blog_articles FOR ALL USING (true) WITH CHECK (true);

-- ============================================
-- Auto-update updated_at on row changes
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_distributor_profiles_updated_at BEFORE UPDATE ON distributor_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_species_updated_at BEFORE UPDATE ON species FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_product_resources_updated_at BEFORE UPDATE ON product_resources FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_inquiries_updated_at BEFORE UPDATE ON inquiries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_solutions_admin_updated_at BEFORE UPDATE ON solutions_admin FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_knowledge_articles_updated_at BEFORE UPDATE ON knowledge_articles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_research_articles_updated_at BEFORE UPDATE ON research_articles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_news_events_updated_at BEFORE UPDATE ON news_events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_blog_articles_updated_at BEFORE UPDATE ON blog_articles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Seed: Admin User
-- Email: admin@vetkind.com | Password: admin123
-- ============================================

INSERT INTO users (id, name, email, password, role, status)
VALUES (
  'admin-001',
  'Admin User',
  'admin@vetkind.com',
  '$2b$10$Zilw9r.WkfZqqm54xjnZDu3PyrtBj5CY3oMjUJ8.hS/hnHRxRYvdK',
  'ADMIN',
  'ACTIVE'
) ON CONFLICT (email) DO UPDATE SET
  role = 'ADMIN',
  name = 'Admin User';

-- ============================================
-- Seed: Distributor User
-- Email: distributor@vetkind.com | Password: distributor123
-- ============================================

INSERT INTO users (id, name, email, password, role, status)
VALUES (
  'dist-001',
  'John Distributor',
  'distributor@vetkind.com',
  '$2b$10$.iME8G9FkWDQY/QtLLhXO.KffjJss6Piljd/UuDXTwkD1jGcH2bbq',
  'DISTRIBUTOR',
  'ACTIVE'
) ON CONFLICT (email) DO UPDATE SET
  role = 'DISTRIBUTOR',
  name = 'John Distributor';

INSERT INTO distributor_profiles (user_id, company_name, region)
VALUES ('dist-001', 'AgroVet Supplies', 'Rajasthan')
ON CONFLICT (user_id) DO NOTHING;

-- ============================================
-- Seed: Species
-- ============================================

INSERT INTO species (id, name, slug, image, featured, is_active, sort_order) VALUES
('sp-dairy', 'Dairy', 'dairy', 'https://images.unsplash.com/photo-1596733430284-f7437275218d?q=80&w=400&auto=format&fit=crop', true, true, 1),
('sp-poultry', 'Poultry', 'poultry', 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?q=80&w=400&auto=format&fit=crop', true, true, 2),
('sp-aqua', 'Aquaculture', 'aquaculture', NULL, true, true, 3),
('sp-swine', 'Swine', 'swine', NULL, true, true, 4),
('sp-equine', 'Equine', 'equine', NULL, true, true, 5),
('sp-pet', 'Pet Care', 'pet-care', NULL, false, true, 6)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- Seed: Sample Product
-- ============================================

INSERT INTO products (id, name, slug, category, species_id, description, short_description, price, published, featured)
VALUES (
  'prod-001',
  'VetKind Pro Milk',
  'vetkind-pro-milk',
  'Dairy Nutrition',
  'sp-dairy',
  'Premium phytogenic supplement to boost milk yield and improve fat/SNF ratios.',
  'Boost milk yield naturally with phytogenic nutrition.',
  1500,
  true,
  true
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO product_resources (product_id, title, file_url, resource_type, visibility)
VALUES (
  'prod-001',
  'Pro Milk Distributor Pricing',
  'https://example.com/pricing.pdf',
  'PRICING',
  'DISTRIBUTOR'
);
