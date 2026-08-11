-- Phase 7: Knowledge Centre Architecture

-- 1. Create categories table
CREATE TABLE public.article_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT
);

-- 2. Create authors table
CREATE TABLE public.authors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    bio TEXT,
    avatar_url TEXT,
    role TEXT
);

-- 3. Create tags table
CREATE TABLE public.article_tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL
);

-- 4. Alter existing articles table
-- We drop the simple text author column and add relational foreign keys.
ALTER TABLE public.articles
    DROP COLUMN author,
    RENAME COLUMN image_url TO featured_image;

ALTER TABLE public.articles
    ADD COLUMN category_id UUID REFERENCES public.article_categories(id) ON DELETE SET NULL,
    ADD COLUMN author_id UUID REFERENCES public.authors(id) ON DELETE SET NULL,
    ADD COLUMN seo_title TEXT,
    ADD COLUMN seo_description TEXT,
    ADD COLUMN status TEXT DEFAULT 'published';

-- 5. Junction table for Articles <-> Tags
CREATE TABLE public.article_tags_link (
    article_id UUID REFERENCES public.articles(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES public.article_tags(id) ON DELETE CASCADE,
    PRIMARY KEY (article_id, tag_id)
);

-- 6. Junction table for Articles <-> Products
CREATE TABLE public.article_products_link (
    article_id UUID REFERENCES public.articles(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    PRIMARY KEY (article_id, product_id)
);

-- Setup RLS Policies (Allow Public Read)
ALTER TABLE public.article_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_tags_link ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_products_link ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read-only access." ON public.article_categories FOR SELECT USING (true);
CREATE POLICY "Allow public read-only access." ON public.authors FOR SELECT USING (true);
CREATE POLICY "Allow public read-only access." ON public.article_tags FOR SELECT USING (true);
CREATE POLICY "Allow public read-only access." ON public.article_tags_link FOR SELECT USING (true);
CREATE POLICY "Allow public read-only access." ON public.article_products_link FOR SELECT USING (true);
