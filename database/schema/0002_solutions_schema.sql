-- Phase 5: Solutions Architecture
-- Create articles table for knowledge center
CREATE TABLE public.articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT,
    author TEXT,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create solutions table
CREATE TABLE public.solutions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    hero_headline TEXT NOT NULL,
    hero_image_url TEXT,
    problem_explanation TEXT NOT NULL,
    common_signs JSONB, -- Array of strings
    management_considerations JSONB, -- Array of strings
    vetkind_approach TEXT NOT NULL,
    seo_title TEXT,
    seo_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create solution FAQs
CREATE TABLE public.solution_faqs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    solution_id UUID REFERENCES public.solutions(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0
);

-- Junction table for Solution <-> Articles
CREATE TABLE public.solution_articles_link (
    solution_id UUID REFERENCES public.solutions(id) ON DELETE CASCADE,
    article_id UUID REFERENCES public.articles(id) ON DELETE CASCADE,
    PRIMARY KEY (solution_id, article_id)
);

-- Junction table for Solution <-> Products
CREATE TABLE public.solution_products_link (
    solution_id UUID REFERENCES public.solutions(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    PRIMARY KEY (solution_id, product_id)
);

-- Setup RLS Policies (Allow Public Read)
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.solutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.solution_faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.solution_articles_link ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.solution_products_link ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read-only access." ON public.articles FOR SELECT USING (true);
CREATE POLICY "Allow public read-only access." ON public.solutions FOR SELECT USING (true);
CREATE POLICY "Allow public read-only access." ON public.solution_faqs FOR SELECT USING (true);
CREATE POLICY "Allow public read-only access." ON public.solution_articles_link FOR SELECT USING (true);
CREATE POLICY "Allow public read-only access." ON public.solution_products_link FOR SELECT USING (true);
