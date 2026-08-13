const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
globalThis.WebSocket = require('ws');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const generateSlug = (title) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

const newsItems = [
  // Dairy
  { title: "Breakthrough in Bovine Mastitis Prevention Using Plant Extracts", type: "NEWS", species: "Dairy" },
  { title: "New Study Shows Link Between Heat Stress and Milk Quality", type: "NEWS", species: "Dairy" },
  { title: "Managing Rumen Acidosis with Novel Phytogenic Buffers", type: "NEWS", species: "Dairy" },
  { title: "Calf Scours: Early Intervention Strategies Improve Survival Rates", type: "NEWS", species: "Dairy" },
  
  // Poultry
  { title: "Avian Influenza Update: New Vaccination Protocols Explored", type: "NEWS", species: "Poultry" },
  { title: "Improving Broiler Gut Health Without Antibiotics", type: "NEWS", species: "Poultry" },
  { title: "Necrotic Enteritis in Poultry: Identifying Early Warning Signs", type: "NEWS", species: "Poultry" },
  { title: "Essential Oils Show Promise in Reducing Heat Stress in Layers", type: "NEWS", species: "Poultry" },
  
  // Swine
  { title: "African Swine Fever: Global Outbreak Status and Biosecurity", type: "NEWS", species: "Swine" },
  { title: "Reducing Weaning Stress in Piglets with Herbal Supplements", type: "NEWS", species: "Swine" },
  { title: "Porcine Reproductive and Respiratory Syndrome (PRRS) Management", type: "NEWS", species: "Swine" },
  
  // Equine
  { title: "Equine Gastric Ulcer Syndrome: New Dietary Approaches", type: "NEWS", species: "Equine" },
  { title: "Understanding Laminitis Risk Factors in Spring Pastures", type: "NEWS", species: "Equine" },
  { title: "Joint Supplements for Senior Horses: What the Latest Science Says", type: "NEWS", species: "Equine" },
  
  // Pet Care
  { title: "Canine Obesity Epidemic: Nutritional Strategies for Weight Loss", type: "NEWS", species: "Pet Care" },
  { title: "Feline Chronic Kidney Disease: Early Detection and Diet Changes", type: "NEWS", species: "Pet Care" },
  { title: "The Rise of Grain-Free Diets and Canine Dilated Cardiomyopathy", type: "NEWS", species: "Pet Care" },
  { title: "Probiotics in Pet Food: Separating Fact from Fiction", type: "NEWS", species: "Pet Care" },
  
  // Aquaculture
  { title: "Preventing Streptococcus Outbreaks in Tilapia Farms", type: "NEWS", species: "Aquaculture" },
  { title: "Sustainable Aquafeed: Replacing Fish Meal with Plant Proteins", type: "NEWS", species: "Aquaculture" },
  { title: "Managing Water Quality to Reduce Disease in Shrimp Aquaculture", type: "NEWS", species: "Aquaculture" }
];

const dummyData = newsItems.map((item, index) => {
  const date = new Date();
  date.setDate(date.getDate() - (index * 3)); // Stagger dates
  
  return {
    title: item.title,
    slug: generateSlug(item.title),
    summary: `Recent developments in ${item.species.toLowerCase()} health highlight new approaches to managing common challenges and improving overall animal welfare.`,
    cover_image: `https://picsum.photos/seed/${generateSlug(item.title)}/800/600`, // Valid deterministic placeholder image
    content: `<p>This is a detailed news report concerning <strong>${item.species}</strong> health and nutrition. As the veterinary and agricultural industries continue to evolve, new research sheds light on alternative therapies, better biosecurity measures, and advanced nutritional strategies to tackle endemic diseases.</p><p>Veterinary professionals are increasingly looking towards preventative care and natural feed additives to support immune function and reduce the reliance on traditional pharmaceuticals. Stay tuned for more updates on this developing story in the ${item.species} sector.</p>`,
    type: item.type,
    published_at: date.toISOString(),
    status: 'PUBLISHED',
    featured: index % 5 === 0, // Feature every 5th item
    seo_title: `${item.title} | VetKind News`,
    seo_description: `Latest news and updates on ${item.species} health and veterinary management.`
  };
});

async function run() {
  const { data, error } = await supabase.from('news_events').upsert(dummyData, { onConflict: 'slug' });
  
  if (error) {
    console.error('Error inserting news articles:', error);
  } else {
    console.log(`Successfully seeded ${dummyData.length} news articles across all species.`);
  }
}

run();
