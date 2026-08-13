import { supabase } from "../supabase/client";
import { Database } from "@/types/database.types";
import { ProductWithRelations } from "../products";

const isDummySupabase = process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('xyzcompany');

export type ArticleRow = any;
export type CategoryRow = any;
export type AuthorRow = any;
export type TagRow = any;

export interface ArticleWithRelations extends ArticleRow {
  category?: CategoryRow | null;
  author?: AuthorRow | null;
  tags?: TagRow[];
  products?: ProductWithRelations[];
}

export async function getArticles(categorySlug?: string): Promise<ArticleWithRelations[]> {
  if (isDummySupabase) {
    if (categorySlug) {
      return MOCK_ARTICLES.filter(a => a.category?.slug === categorySlug);
    }
    return MOCK_ARTICLES;
  }

  const query = supabase
    .from('articles')
    .select(`
      *,
      category:article_categories(*),
      author:authors(*),
      article_tags_link(article_tags(*)),
      article_products_link(products(
        *,
        category:categories(*),
        images:product_images(*),
        product_species_link(animal_species(*)),
        product_benefits_link(product_benefits(*))
      ))
    `)
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  if (categorySlug) {
    query.eq('category.slug', categorySlug); // In Supabase, filtering by a joined table might require inner join syntax or filtering after fetch depending on schema, but let's assume we fetch all and filter if it's complex, or use standard syntax
  }
    
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (query as any);

  if (error) {
    console.error('Supabase query error:', error);
    return [];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let results = (data || []).map((item: any) => ({
    ...item,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tags: item.article_tags_link?.map((link: any) => link.article_tags) || [],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    products: item.article_products_link?.map((link: any) => {
      const p = link.products;
      if (!p) return null;
      return {
        ...p,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        species: p.product_species_link?.map((l: any) => l.animal_species) || [],
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        benefits: p.product_benefits_link?.map((l: any) => l.product_benefits) || [],
      };
    }).filter(Boolean) || [],
  }));

  if (categorySlug) {
    // If Supabase didn't filter the joined table correctly without inner joins, we filter here
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    results = results.filter((r: any) => r.category?.slug === categorySlug);
  }

  return results;
}

export async function getArticleBySlug(slug: string): Promise<ArticleWithRelations | null> {
  if (isDummySupabase) {
    const article = MOCK_ARTICLES.find(a => a.slug === slug) || null;
    if (article) {
      const { data: products } = await supabase.from('products').select('*').eq('published', true).limit(2);
      article.products = products as unknown as ProductWithRelations[];
    }
    return article;
  }

  const query = supabase
    .from('articles')
    .select(`
      *,
      category:article_categories(*),
      author:authors(*),
      article_tags_link(article_tags(*)),
      article_products_link(products(
        *,
        category:categories(*),
        images:product_images(*),
        product_species_link(animal_species(*)),
        product_benefits_link(product_benefits(*))
      ))
    `)
    .eq('slug', slug)
    .single();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (query as any);

  if (error || !data) {
    return null;
  }

  return {
    ...data,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tags: data.article_tags_link?.map((link: any) => link.article_tags) || [],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    products: data.article_products_link?.map((link: any) => {
      const p = link.products;
      if (!p) return null;
      return {
        ...p,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        species: p.product_species_link?.map((l: any) => l.animal_species) || [],
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        benefits: p.product_benefits_link?.map((l: any) => l.product_benefits) || [],
      };
    }).filter(Boolean) || [],
  };
}

export async function getCategories(): Promise<CategoryRow[]> {
  if (isDummySupabase) {
    return MOCK_CATEGORIES;
  }
  const { data } = await supabase.from('article_categories').select('*');
  return data || [];
}


// --- MOCK DATA ---

const MOCK_CATEGORIES: CategoryRow[] = [
  { id: 'c1', name: 'Dairy Nutrition', slug: 'dairy-nutrition', description: 'Insights on feeding dairy cattle.' },
  { id: 'c2', name: 'Animal Health', slug: 'animal-health', description: 'General veterinary health.' },
  { id: 'c3', name: 'Herbal Nutrition', slug: 'herbal-nutrition', description: 'Phytogenic and natural solutions.' },
  { id: 'c4', name: 'Farmer Education', slug: 'farmer-education', description: 'Farm management practices.' },
  { id: 'c5', name: 'Research', slug: 'research', description: 'Scientific updates.' },
];

const MOCK_AUTHORS: AuthorRow[] = [
  {
    id: 'a1',
    name: 'Dr. Rajesh Kumar',
    slug: 'rajesh-kumar',
    bio: 'Lead Veterinary Nutritionist at VetKind with 15 years of field experience in dairy management across the Indian subcontinent.',
    avatar_url: null,
    role: 'Lead Veterinary Nutritionist',
  },
  {
    id: 'a2',
    name: 'VetKind Research Team',
    slug: 'vetkind-research',
    bio: 'The collective expertise of our laboratory and field researchers.',
    avatar_url: null,
    role: 'Research Division',
  }
];

const MOCK_TAGS: TagRow[] = [
  { id: 't1', name: 'Heat Stress', slug: 'heat-stress' },
  { id: 't2', name: 'Milk Yield', slug: 'milk-yield' },
  { id: 't3', name: 'Rumen Flora', slug: 'rumen-flora' },
  { id: 't4', name: 'Mastitis', slug: 'mastitis' },
];

export const MOCK_ARTICLES: ArticleWithRelations[] = [
  {
    id: 'art1',
    title: 'Managing Heat Stress in High-Yielding Dairy Cows',
    slug: 'managing-heat-stress-dairy-cows',
    excerpt: 'Practical nutritional strategies to mitigate the effects of summer heat on milk production and herd health.',
    content: `
      <h2>The Impact of Heat Stress</h2>
      <p>Heat stress is one of the leading causes of economic loss in the dairy industry during summer months. When the Temperature-Humidity Index (THI) exceeds 68, high-yielding dairy cows begin to experience physiological stress. This manifests as reduced dry matter intake, altered endocrine profiles, and a significant drop in milk yield and quality.</p>
      
      <h2>Nutritional Interventions</h2>
      <p>While environmental modifications like fans and sprinklers are crucial, nutrition plays a vital role in internal temperature regulation and maintaining energy balance.</p>
      <ul>
        <li><strong>Ration Density:</strong> Since feed intake drops, increasing the nutrient density of the ration ensures the cow still receives necessary energy and protein.</li>
        <li><strong>Mineral Balance:</strong> Heat-stressed cows lose significant amounts of potassium and sodium through sweating and panting. Dietary Cation-Anion Difference (DCAD) must be carefully managed.</li>
        <li><strong>Phytogenic Additives:</strong> Certain herbal extracts can improve feed palatability and support the immune system during periods of environmental stress.</li>
      </ul>
      
      <h2>Water Availability</h2>
      <p>A lactating dairy cow's water requirement can double during heat stress. Ensuring constant access to clean, cool water (around 20°C) is the most critical management step a farmer can take.</p>
      
      <blockquote>"Prevention is always more cost-effective than intervention when dealing with seasonal heat stress."</blockquote>
    `,
    category_id: 'c1',
    author_id: 'a1',
    published_at: '2025-05-10T10:00:00Z',
    featured_image: null,
    seo_title: 'Heat Stress Management for Dairy Cows | VetKind',
    seo_description: 'Learn how to manage heat stress in dairy cows through nutritional interventions and farm management.',
    status: 'published',
    created_at: '2025-05-01T00:00:00Z',
    category: MOCK_CATEGORIES[0],
    author: MOCK_AUTHORS[0],
    tags: [MOCK_TAGS[0], MOCK_TAGS[1]],
    products: [],
  },
  {
    id: 'art2',
    title: 'The Role of Phytogenics in Modern Veterinary Nutrition',
    slug: 'role-of-phytogenics-veterinary-nutrition',
    excerpt: 'How plant-based additives are revolutionizing animal health and reducing reliance on synthetic compounds.',
    content: `
      <h2>What are Phytogenics?</h2>
      <p>Phytogenics, or plant-derived feed additives, utilize the natural bioactive compounds found in herbs, spices, and essential oils. These compounds have evolved over millennia to protect plants, and modern science is now harnessing them to support animal health.</p>
      
      <h2>Key Benefits</h2>
      <p>Unlike simple nutritional building blocks, phytogenics often work by modulating physiological functions:</p>
      <ol>
        <li><strong>Appetite Stimulation:</strong> Essential oils can improve the olfactory and gustatory appeal of feed, encouraging higher dry matter intake.</li>
        <li><strong>Gut Health:</strong> Many botanical extracts possess natural antimicrobial and anti-inflammatory properties that help maintain a healthy microbiome.</li>
        <li><strong>Antioxidant Protection:</strong> Compounds like flavonoids and polyphenols neutralize free radicals, reducing oxidative stress at the cellular level.</li>
      </ol>
    `,
    category_id: 'c3',
    author_id: 'a2',
    published_at: '2025-06-15T09:00:00Z',
    featured_image: null,
    seo_title: 'Phytogenics in Veterinary Nutrition | VetKind',
    seo_description: 'Discover the science behind plant-based feed additives in modern animal agriculture.',
    status: 'published',
    created_at: '2025-06-01T00:00:00Z',
    category: MOCK_CATEGORIES[2],
    author: MOCK_AUTHORS[1],
    tags: [MOCK_TAGS[2]],
    products: [],
  },
  {
    id: 'art3',
    title: 'Understanding Subclinical Mastitis',
    slug: 'understanding-subclinical-mastitis',
    excerpt: 'Identifying the hidden threat to dairy farm profitability before it becomes a clinical problem.',
    content: '<p>Subclinical mastitis is the presence of an infection without visible signs of local inflammation or systemic involvement. It is characterized by an elevated somatic cell count (SCC) in the milk. Managing this requires a combination of excellent milking hygiene, proper milking machine maintenance, and supporting the cow\'s natural immune defenses through targeted trace mineral nutrition.</p>',
    category_id: 'c2',
    author_id: 'a1',
    published_at: '2025-07-20T14:30:00Z',
    featured_image: null,
    seo_title: 'Subclinical Mastitis Management | VetKind',
    seo_description: 'How to detect and manage subclinical mastitis in dairy herds.',
    status: 'published',
    created_at: '2025-07-10T00:00:00Z',
    category: MOCK_CATEGORIES[1],
    author: MOCK_AUTHORS[0],
    tags: [MOCK_TAGS[3]],
    products: [],
  },
  {
    id: 'art4',
    title: 'Optimizing Rumen Function for Maximum Efficiency',
    slug: 'optimizing-rumen-function',
    excerpt: 'Key strategies for maintaining a stable rumen pH and healthy microbiome.',
    content: '<p>The rumen is the engine of the dairy cow. Maintaining optimal fermentation requires a delicate balance between rapidly fermentable carbohydrates and physically effective fiber. A stable pH prevents acidosis and maximizes fiber digestion, leading to better feed efficiency and higher butterfat.</p>',
    category_id: 'c1',
    author_id: 'a2',
    published_at: '2025-08-05T11:15:00Z',
    featured_image: null,
    seo_title: 'Rumen Function Optimization | VetKind',
    seo_description: 'Learn how to maintain a healthy rumen for better dairy feed efficiency.',
    status: 'published',
    created_at: '2025-08-01T00:00:00Z',
    category: MOCK_CATEGORIES[0],
    author: MOCK_AUTHORS[1],
    tags: [MOCK_TAGS[2]],
    products: [],
  },
  {
    id: 'art5',
    title: 'The Importance of Trace Minerals in Transition Cows',
    slug: 'trace-minerals-transition-cows',
    excerpt: 'Why the transition period is the most critical phase for mineral supplementation.',
    content: '<p>The transition period—typically defined as three weeks before to three weeks after calving—is a time of immense physiological stress. Proper supplementation of trace minerals like Zinc, Copper, and Selenium during this window is crucial for immune function, uterine health, and ensuring a successful start to the new lactation cycle.</p>',
    category_id: 'c1',
    author_id: 'a1',
    published_at: '2025-09-12T08:45:00Z',
    featured_image: null,
    seo_title: 'Trace Minerals for Transition Cows | VetKind',
    seo_description: 'The critical role of trace minerals during the dairy cow transition period.',
    status: 'published',
    created_at: '2025-09-01T00:00:00Z',
    category: MOCK_CATEGORIES[0],
    author: MOCK_AUTHORS[0],
    tags: [MOCK_TAGS[1]],
    products: [],
  },
  {
    id: 'art6',
    title: 'Evaluating Efficacy of Chelated Minerals in Poultry Diets',
    slug: 'evaluating-efficacy-chelated-minerals-poultry',
    excerpt: 'A comprehensive study on bioavailability and growth performance indicators in broilers.',
    content: '<p>Recent field trials indicate that substituting inorganic mineral salts with organic chelated forms significantly improves absorption rates in poultry. This research summary highlights the improvements in feed conversion ratios and bone density observed over a 42-day trial period.</p>',
    category_id: 'c5',
    author_id: 'a2',
    published_at: '2025-10-10T10:00:00Z',
    featured_image: null,
    seo_title: 'Chelated Minerals Research in Poultry | VetKind',
    seo_description: 'Research findings on the efficacy of chelated minerals in broiler diets.',
    status: 'published',
    created_at: '2025-10-01T00:00:00Z',
    category: MOCK_CATEGORIES[4],
    author: MOCK_AUTHORS[1],
    tags: [],
    products: [],
  },
  {
    id: 'art7',
    title: 'Clinical Trial: Phytogenic Additives vs. Conventional Promoters',
    slug: 'clinical-trial-phytogenic-additives-vs-conventional',
    excerpt: 'Comparing the long-term impact on rumen microbiome diversity in high-yielding dairy cattle.',
    content: '<p>This peer-reviewed clinical trial explores the shifts in rumen microbiota when transitioning from conventional growth promoters to phytogenic feed additives. Results demonstrate a more stable pH and increased prevalence of fiber-degrading bacteria.</p>',
    category_id: 'c5',
    author_id: 'a1',
    published_at: '2025-11-22T09:30:00Z',
    featured_image: null,
    seo_title: 'Phytogenics Clinical Trial | VetKind',
    seo_description: 'Clinical research on phytogenic additives and rumen microbiome diversity.',
    status: 'published',
    created_at: '2025-11-15T00:00:00Z',
    category: MOCK_CATEGORIES[4],
    author: MOCK_AUTHORS[0],
    tags: [MOCK_TAGS[2]],
    products: [],
  },
  {
    id: 'art8',
    title: 'Meta-Analysis: Heat Stress Impact on Fertility Rates in Buffaloes',
    slug: 'meta-analysis-heat-stress-fertility-buffaloes',
    excerpt: 'Aggregated data from 12 distinct field studies outlining the correlation between elevated THI and conception failure.',
    content: '<p>Our latest meta-analysis synthesizes data from multiple geographical zones across India. It definitively links the Temperature-Humidity Index (THI) thresholds to sharp declines in estrus expression and conception rates in water buffaloes, suggesting new targeted nutritional interventions.</p>',
    category_id: 'c5',
    author_id: 'a2',
    published_at: '2025-12-05T14:00:00Z',
    featured_image: null,
    seo_title: 'Heat Stress & Fertility Research | VetKind',
    seo_description: 'Meta-analysis of heat stress impacts on buffalo fertility.',
    status: 'published',
    created_at: '2025-12-01T00:00:00Z',
    category: MOCK_CATEGORIES[4],
    author: MOCK_AUTHORS[1],
    tags: [MOCK_TAGS[0]],
    products: [],
  }
];
