import { supabase } from "../supabase/client";
import { Database } from "@/types/database.types";
import { ProductWithRelations } from "../products";

const isDummySupabase = process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('xyzcompany');

export type SolutionRow = Database['public']['Tables']['solutions']['Row'];
export type SolutionFaqRow = Database['public']['Tables']['solution_faqs']['Row'];
export type ArticleRow = Database['public']['Tables']['articles']['Row'];

export interface SolutionWithRelations extends SolutionRow {
  faqs: SolutionFaqRow[];
  articles: ArticleRow[];
  products: ProductWithRelations[];
}

export async function getSolutions(): Promise<SolutionWithRelations[]> {
  if (isDummySupabase) {
    return MOCK_SOLUTIONS;
  }

  const query = supabase
    .from('solutions')
    .select(`
      *,
      faqs:solution_faqs(*),
      solution_articles_link(articles(*)),
      solution_products_link(products(
        *,
        category:categories(*),
        images:product_images(*),
        product_species_link(animal_species(*)),
        product_benefits_link(product_benefits(*))
      ))
    `);
    
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (query as any);

  if (error) {
    console.error('Supabase query error:', error);
    return [];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data || []).map((item: any) => ({
    ...item,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    articles: item.solution_articles_link?.map((link: any) => link.articles) || [],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    products: item.solution_products_link?.map((link: any) => {
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
}

export async function getSolutionBySlug(slug: string): Promise<SolutionWithRelations | null> {
  if (isDummySupabase) {
    const solution = MOCK_SOLUTIONS.find(s => s.slug === slug) || null;
    if (solution) {
      // Fetch some products from Prisma dynamically to prevent MOCK_PRODUCTS dependency
      const { PrismaClient } = await import('@prisma/client');
      const prisma = new PrismaClient();
      const products = await prisma.product.findMany({ where: { published: true }, take: 3 });
      solution.products = products as unknown as ProductWithRelations[];
    }
    return solution;
  }

  const query = supabase
    .from('solutions')
    .select(`
      *,
      faqs:solution_faqs(*),
      solution_articles_link(articles(*)),
      solution_products_link(products(
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
    articles: data.solution_articles_link?.map((link: any) => link.articles) || [],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    products: data.solution_products_link?.map((link: any) => {
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

// --- MOCK DATA ---

const MOCK_ARTICLES: ArticleRow[] = [
  {
    id: 'a1',
    title: 'The impact of heat stress on dairy cow milk yield',
    slug: 'heat-stress-milk-yield',
    excerpt: 'Learn how seasonal temperature changes affect your herd and what to do about it.',
    content: 'Full article content...',
    author_id: 'a1',
    category_id: 'c1',
    published_at: '2025-05-10T00:00:00Z',
    featured_image: null,
    seo_title: 'Heat Stress on Dairy Cows',
    seo_description: 'Impact of heat stress',
    status: 'published',
    created_at: '2025-05-10T00:00:00Z',
  },
  {
    id: 'a2',
    title: 'Optimizing Rumen Function',
    slug: 'optimizing-rumen-function',
    excerpt: 'Key strategies for maximizing feed efficiency in ruminants.',
    content: 'Full article content...',
    author_id: 'a2',
    category_id: 'c1',
    published_at: '2025-06-15T00:00:00Z',
    featured_image: null,
    seo_title: 'Optimizing Rumen Function',
    seo_description: 'Strategies for rumen function',
    status: 'published',
    created_at: '2025-06-15T00:00:00Z',
  }
];

export const MOCK_SOLUTIONS: SolutionWithRelations[] = [
  {
    id: 's1',
    name: 'Milk Production',
    slug: 'milk-production',
    hero_headline: 'Support Better Milk Production Through Better Nutrition',
    hero_image_url: '/cow-field.jpg',
    problem_explanation: 'Suboptimal milk production is often linked to nutritional imbalances, poor rumen health, and environmental stressors. Addressing these factors at the core allows the animal to reach its genetic potential naturally and sustainably.',
    common_signs: [
      'Sudden drop in daily milk yield',
      'Lower fat and SNF percentages',
      'Poor feed conversion ratio',
      'Lethargy or reduced dry matter intake'
    ],
    management_considerations: [
      'Ensure constant access to clean, fresh water',
      'Balance rations according to lactation stage',
      'Minimize heat stress with proper ventilation',
      'Monitor body condition scores regularly'
    ],
    vetkind_approach: 'Our approach focuses on optimizing rumen fermentation and maximizing nutrient absorption. By utilizing targeted phytogenic supplements and high-quality mineral mixtures, we help dairy farmers improve both the quantity and quality of milk output without compromising the animal\'s long-term health.',
    seo_title: 'Improve Milk Production | VetKind Solutions',
    seo_description: 'Discover science-backed nutritional solutions to optimize milk yield and quality in dairy cattle.',
    created_at: '2026-08-01T00:00:00Z',
    updated_at: '2026-08-01T00:00:00Z',
    faqs: [
      {
        id: 'f1',
        solution_id: 's1',
        question: 'How quickly can I expect to see improvements in milk yield?',
        answer: 'While individual results vary, many farmers observe improvements in fat/SNF percentages within 7-10 days, with overall yield increases becoming apparent over a 3-4 week period of consistent supplementation.',
        sort_order: 1
      },
      {
        id: 'f2',
        solution_id: 's1',
        question: 'Are these supplements safe for continuous use?',
        answer: 'Yes, our nutritional supplements are designed for long-term use across the lactation cycle to maintain optimal performance.',
        sort_order: 2
      }
    ],
    articles: MOCK_ARTICLES,
    products: []
  },
  {
    id: 's2',
    name: 'Rumen Health',
    slug: 'rumen-health',
    hero_headline: 'Optimize Rumen Function for Maximum Feed Efficiency',
    hero_image_url: '/cow-eating.jpg',
    problem_explanation: 'The rumen is the engine of a dairy cow. Poor rumen health leads to acidosis, reduced fiber digestion, and ultimately, lower farm profitability. Maintaining a stable rumen pH and healthy microbiome is critical.',
    common_signs: [
      'Loose manure or undigested grain in feces',
      'Decreased rumination (cud-chewing)',
      'Variable or depressed feed intake',
      'Drop in milk butterfat'
    ],
    management_considerations: [
      'Provide adequate effective fiber',
      'Avoid sudden ration changes',
      'Ensure proper mixing of TMR to prevent sorting',
      'Use rumen buffers during high-concentrate feeding'
    ],
    vetkind_approach: 'VetKind offers specialized prebiotics and herbal extracts that stabilize rumen pH and promote the growth of beneficial fiber-digesting bacteria, leading to better nutrient extraction and overall animal vitality.',
    seo_title: 'Rumen Health Solutions | VetKind',
    seo_description: 'Protect against acidosis and improve feed efficiency with our rumen health solutions.',
    created_at: '2026-08-01T00:00:00Z',
    updated_at: '2026-08-01T00:00:00Z',
    faqs: [],
    articles: [MOCK_ARTICLES[1]],
    products: []
  },
  {
    id: 's3',
    name: 'Fertility',
    slug: 'fertility',
    hero_headline: 'Enhance Reproductive Performance and Herd Longevity',
    hero_image_url: '/cow-field.jpg',
    problem_explanation: 'Poor fertility is a leading cause of economic loss in dairy operations, often resulting from negative energy balance, mineral deficiencies, or hormonal imbalances. Optimizing reproductive health ensures regular calving intervals and sustained milk production.',
    common_signs: [
      'Delayed return to estrus post-calving',
      'Low conception rates',
      'Silent heats or irregular cycles',
      'Increased incidence of retained placenta'
    ],
    management_considerations: [
      'Maintain appropriate body condition score during dry period',
      'Ensure adequate trace mineral supplementation',
      'Implement accurate heat detection protocols',
      'Minimize stress during the transition period'
    ],
    vetkind_approach: 'Our nutritional solutions provide bioavailable trace minerals and specific vitamins essential for reproductive tissue repair and hormonal balance. This targeted support helps reduce days open and improves overall conception rates.',
    seo_title: 'Improve Herd Fertility | VetKind Solutions',
    seo_description: 'Discover nutritional strategies to enhance reproductive performance and reduce days open in dairy cattle.',
    created_at: '2026-08-01T00:00:00Z',
    updated_at: '2026-08-01T00:00:00Z',
    faqs: [],
    articles: [],
    products: []
  },
  {
    id: 's4',
    name: 'Mastitis & Udder Health',
    slug: 'mastitis-udder-health',
    hero_headline: 'Protect Udder Health for Quality Milk Production',
    hero_image_url: '/cow-eating.jpg',
    problem_explanation: 'Mastitis remains the most costly disease in the dairy industry, causing milk discard, treatment expenses, and potential culling. A strong immune system and proper udder tissue integrity are the first lines of defense.',
    common_signs: [
      'Elevated Somatic Cell Count (SCC)',
      'Swollen, hot, or painful quarters',
      'Clots or flakes in milk',
      'Drop in milk production'
    ],
    management_considerations: [
      'Maintain strict milking hygiene and pre/post-dipping',
      'Ensure clean and dry bedding areas',
      'Regularly service and check milking equipment',
      'Monitor individual cow SCC data'
    ],
    vetkind_approach: 'VetKind focuses on building robust immunity from within. Our specialized formulations include antioxidants and trace minerals that strengthen the keratin plug and support white blood cell function, helping to lower SCC naturally.',
    seo_title: 'Mastitis & Udder Health | VetKind',
    seo_description: 'Nutritional support to lower somatic cell counts and maintain optimal udder health in dairy herds.',
    created_at: '2026-08-01T00:00:00Z',
    updated_at: '2026-08-01T00:00:00Z',
    faqs: [],
    articles: [],
    products: []
  },
  {
    id: 's5',
    name: 'Liver & Metabolism',
    slug: 'liver-metabolism',
    hero_headline: 'Support Hepatic Function During High Demand Periods',
    hero_image_url: '/cow-field.jpg',
    problem_explanation: 'The transition period places immense metabolic strain on the liver. Fatty liver and ketosis can compromise the entire lactation cycle, leading to secondary diseases and reduced feed intake.',
    common_signs: [
      'Ketosis (sweet-smelling breath)',
      'Rapid body condition loss post-calving',
      'Depressed appetite',
      'Increased susceptibility to infections'
    ],
    management_considerations: [
      'Avoid over-conditioning cows before drying off',
      'Maximize dry matter intake in the close-up period',
      'Provide easily fermentable carbohydrates post-calving',
      'Monitor blood ketone levels in at-risk cows'
    ],
    vetkind_approach: 'Our metabolic support products deliver targeted lipotropic agents and energy precursors. This helps the liver efficiently process mobilized body fat, preventing ketosis and ensuring a smooth transition into peak lactation.',
    seo_title: 'Liver & Metabolism Support | VetKind',
    seo_description: 'Prevent transition cow diseases and support liver function with advanced metabolic nutrition.',
    created_at: '2026-08-01T00:00:00Z',
    updated_at: '2026-08-01T00:00:00Z',
    faqs: [],
    articles: [],
    products: []
  },
  {
    id: 's6',
    name: 'Immunity',
    slug: 'immunity',
    hero_headline: 'Build Resilient Herds with Strong Immune Systems',
    hero_image_url: '/cow-eating.jpg',
    problem_explanation: 'A compromised immune system leaves animals vulnerable to a host of pathogens, leading to increased treatment costs and reduced performance. Stress, poor nutrition, and environmental factors all suppress immunity.',
    common_signs: [
      'High incidence of respiratory or enteric diseases',
      'Poor response to vaccinations',
      'Slow recovery from illness',
      'High calf mortality rates'
    ],
    management_considerations: [
      'Ensure colostrum quality and timely feeding for calves',
      'Implement strict biosecurity measures',
      'Reduce overcrowding and environmental stress',
      'Provide balanced nutrition year-round'
    ],
    vetkind_approach: 'We utilize a blend of potent antioxidants, vitamins, and immunomodulatory phytogenics to fortify the animal\'s natural defense mechanisms. A stronger immune system means fewer treatments and healthier, more productive animals.',
    seo_title: 'Enhance Animal Immunity | VetKind Solutions',
    seo_description: 'Strengthen herd immunity naturally with science-backed nutritional and phytogenic solutions.',
    created_at: '2026-08-01T00:00:00Z',
    updated_at: '2026-08-01T00:00:00Z',
    faqs: [],
    articles: [MOCK_ARTICLES[0]],
    products: []
  },
  {
    id: 's7',
    name: 'Heat Stress',
    slug: 'heat-stress',
    hero_headline: 'Mitigate the Impact of High Temperatures',
    hero_image_url: '/cow-field.jpg',
    problem_explanation: 'Heat stress severely impacts dry matter intake, milk yield, and fertility. As temperatures and humidity rise, animals divert energy from production to thermoregulation, leading to significant economic losses.',
    common_signs: [
      'Panting and increased respiration rate',
      'Reduced feed intake and selective feeding',
      'Drop in milk production and butterfat',
      'Lethargy and crowding around water sources'
    ],
    management_considerations: [
      'Provide ample clean, cool drinking water',
      'Install shade, fans, and sprinklers where possible',
      'Feed during the cooler parts of the day',
      'Increase the nutrient density of the ration'
    ],
    vetkind_approach: 'Our heat stress solutions focus on restoring electrolyte balance, supporting rumen stability, and providing specific antioxidants. This helps maintain feed intake and cellular integrity during periods of high environmental temperature.',
    seo_title: 'Heat Stress Management | VetKind',
    seo_description: 'Nutritional strategies to minimize the effects of heat stress on dairy and poultry performance.',
    created_at: '2026-08-01T00:00:00Z',
    updated_at: '2026-08-01T00:00:00Z',
    faqs: [],
    articles: [MOCK_ARTICLES[0]],
    products: [] // Will render the fallback "Speak with an expert" state
  },
  {
    id: 's8',
    name: 'Mineral Nutrition',
    slug: 'mineral-nutrition',
    hero_headline: 'Foundational Minerals for Structural and Cellular Health',
    hero_image_url: '/cow-eating.jpg',
    problem_explanation: 'Macro and micro-minerals are the building blocks of animal health, vital for bone development, enzyme function, and reproduction. Subclinical deficiencies often go unnoticed until major performance drops occur.',
    common_signs: [
      'Pica (chewing on non-food objects)',
      'Poor coat condition or hoof issues',
      'Suboptimal growth rates in young stock',
      'Increased incidence of metabolic disorders like milk fever'
    ],
    management_considerations: [
      'Routinely test forage for mineral content',
      'Provide free-choice mineral blocks or loose salt',
      'Adjust supplementation based on production stage',
      'Ensure proper calcium-to-phosphorus ratios'
    ],
    vetkind_approach: 'VetKind provides highly bioavailable chelated trace minerals and balanced macro-mineral blends. Our formulations ensure optimal absorption, addressing deficiencies at the cellular level to support robust structural and functional health.',
    seo_title: 'Advanced Mineral Nutrition | VetKind',
    seo_description: 'Bioavailable mineral supplements designed to support bone health, immunity, and overall performance.',
    created_at: '2026-08-01T00:00:00Z',
    updated_at: '2026-08-01T00:00:00Z',
    faqs: [],
    articles: [],
    products: []
  }
];
