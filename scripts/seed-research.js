const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
globalThis.WebSocket = require('ws');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

const dummyData = [
  {
    title: 'Phytogenic Additives on Dairy Cattle Rumen Fermentation',
    slug: 'phytogenic-additives-dairy-cattle-rumen',
    category: 'dairy',
    excerpt: 'An investigation into how essential oils and tannins modulate rumen fermentation and reduce methane emissions in lactating dairy cows.',
    cover_image: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=800&q=80',
    article_content: `<p>Recent field studies show that phytogenic feed additives (PFAs) containing oregano essential oil and tannins can significantly alter rumen VFA profiles. <strong>Methods:</strong> A 90-day trial with 200 Holstein cows. <strong>Results:</strong> Observed a 15% reduction in enteric methane emissions without compromising milk yield. <em>Reference: J. Dairy Sci. (2025). "Modulation of rumen fermentation by plant extracts".</em></p>`,
    author: 'Dr. Sarah Jenkins',
    published_at: new Date().toISOString(),
    status: 'PUBLISHED',
    seo_title: 'Phytogenics in Dairy Cattle | VetKind Research',
    seo_description: 'Research on how phytogenic additives reduce methane and improve rumen health in dairy cattle.'
  },
  {
    title: 'Essential Oils as Alternatives to AGPs in Broiler Diets',
    slug: 'essential-oils-agp-alternative-poultry',
    category: 'poultry',
    excerpt: 'Evaluating the efficacy of clove and eucalyptus extracts on gut morphology and growth performance in broilers under heat stress.',
    cover_image: 'https://images.unsplash.com/photo-1548509925-0e7e16bfd209?w=800&q=80',
    article_content: `<p>With the phase-out of antibiotic growth promoters, essential oils offer a natural alternative. <strong>Study Design:</strong> 500 Cobb 500 broilers were subjected to summer stress conditions. <strong>Findings:</strong> The inclusion of 200ppm clove/eucalyptus extract significantly improved villus height and reduced FCR by 4%. <em>Reference: Poultry Science (2024). "Efficacy of essential oils in heat-stressed broilers".</em></p>`,
    author: 'Prof. Alok Sharma',
    published_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    status: 'PUBLISHED',
    seo_title: 'Essential Oils for Poultry Broilers | VetKind',
    seo_description: 'Research showing improved FCR and gut morphology in broilers using essential oil feed additives.'
  },
  {
    title: 'Impact of Yucca Schidigera Extract on Swine Ammonia Emissions',
    slug: 'yucca-extract-swine-ammonia',
    category: 'swine',
    excerpt: 'A comprehensive study on the reduction of aerial ammonia levels in swine housing environments using saponin-rich plant extracts.',
    cover_image: 'https://images.unsplash.com/photo-1604859899175-9e66d48c8b4f?w=800&q=80',
    article_content: `<p>Ammonia emissions represent a major environmental and animal welfare challenge in commercial swine production. <strong>Approach:</strong> Yucca extract was supplemented at 150g/ton of feed. <strong>Conclusion:</strong> Aerial ammonia was reduced by up to 26% over a 4-week period, improving respiratory health markers in grower pigs. <em>Reference: J. Anim. Sci. (2025). "Saponins and ammonia mitigation in swine".</em></p>`,
    author: 'Dr. Emily Chen',
    published_at: new Date(Date.now() - 86400000 * 12).toISOString(),
    status: 'PUBLISHED',
    seo_title: 'Yucca Extract in Swine Feed | VetKind',
    seo_description: 'Discover how Yucca Schidigera extract reduces ammonia emissions in swine operations.'
  },
  {
    title: 'Phytochemicals for Managing Equine Gastric Ulcer Syndrome',
    slug: 'phytochemicals-equine-gastric-ulcers',
    category: 'equine',
    excerpt: 'Exploring the protective effects of pectin-lecithin complexes and herbal antioxidants on the gastric mucosa of performance horses.',
    cover_image: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=800&q=80',
    article_content: `<p>Equine Gastric Ulcer Syndrome (EGUS) affects up to 90% of racehorses. <strong>Research Focus:</strong> A proprietary blend of pectin, lecithin, and chamomile extract was administered daily. <strong>Outcome:</strong> Endoscopic evaluations revealed a significant decrease in ulcer severity scores after 28 days compared to the control group. <em>Reference: Equine Vet J. (2025). "Nutritional management of EGUS".</em></p>`,
    author: 'Dr. Marcus Thorne',
    published_at: new Date(Date.now() - 86400000 * 20).toISOString(),
    status: 'PUBLISHED',
    seo_title: 'Equine Gastric Ulcer Phytochemical Treatment | VetKind',
    seo_description: 'Research on using herbal antioxidants and pectin-lecithin to manage EGUS in horses.'
  },
  {
    title: 'Dietary Functional Fiber and Canine Microbiome Diversity',
    slug: 'functional-fiber-canine-microbiome',
    category: 'pet-care',
    excerpt: 'How novel plant-derived functional fibers influence gut microbiome diversity and fecal score in adult domestic dogs.',
    cover_image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800&q=80',
    article_content: `<p>Gut health is critical for overall companion animal longevity. <strong>Methodology:</strong> 30 adult Beagles were fed diets containing varying levels of novel plant oligosaccharides. <strong>Results:</strong> Sequencing of fecal DNA showed a higher abundance of Bifidobacterium and improved optimal fecal scores. <em>Reference: Front. Vet. Sci. (2024). "Functional fibers and canine gut microbiota".</em></p>`,
    author: 'Dr. Anna Petrova',
    published_at: new Date(Date.now() - 86400000 * 35).toISOString(),
    status: 'PUBLISHED',
    seo_title: 'Canine Microbiome and Functional Fiber | VetKind',
    seo_description: 'Study on the positive effects of plant oligosaccharides on dog microbiome diversity.'
  },
  {
    title: 'Herbal Immunostimulants in Tilapia Aquaculture',
    slug: 'herbal-immunostimulants-tilapia',
    category: 'aquaculture',
    excerpt: 'Evaluating the role of dietary garlic and turmeric extracts on the immune response and disease resistance of Nile Tilapia.',
    cover_image: 'https://images.unsplash.com/photo-1522069169874-c58ced4e69d7?w=800&q=80',
    article_content: `<p>Disease outbreaks remain a major bottleneck in intensive aquaculture. <strong>Trial:</strong> Nile Tilapia were fed diets enriched with 1% garlic and turmeric extract for 60 days, followed by an Aeromonas hydrophila challenge. <strong>Findings:</strong> Enhanced lysozyme activity and significantly higher survival rates (85% vs 50% in control). <em>Reference: Aquaculture (2025). "Phytogenic immunostimulants in Oreochromis niloticus".</em></p>`,
    author: 'Prof. Kenji Yamamoto',
    published_at: new Date(Date.now() - 86400000 * 40).toISOString(),
    status: 'PUBLISHED',
    seo_title: 'Herbal Immunostimulants for Tilapia | VetKind',
    seo_description: 'Research evaluating garlic and turmeric extracts for improving disease resistance in aquaculture.'
  }
];

async function run() {
  const { data, error } = await supabase.from('research_articles').upsert(dummyData, { onConflict: 'slug' });
  
  if (error) {
    console.error('Error inserting research articles:', error);
  } else {
    console.log('Successfully seeded 6 research articles across all species.');
  }
}

run();
