const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
globalThis.WebSocket = require('ws');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const generateSlug = (title) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

const knowledgeData = [
  // Dairy (5)
  {
    title: "Transition Cow Management: Preventing Metabolic Disorders",
    category: "dairy",
    excerpt: "Nutritional strategies for the transition period to minimize the risk of ketosis, fatty liver, and hypocalcemia.",
    read_time: "7 min read",
    article_content: `<p>The transition period is the most critical phase in the dairy cow's lactation cycle. Providing a well-balanced DCAD (Dietary Cation-Anion Difference) diet pre-calving significantly reduces the incidence of metabolic disorders.</p><p><em>Reference: "Transition cow nutrition and management", Journal of Dairy Science, 2021.</em></p>`
  },
  {
    title: "Hypocalcemia (Milk Fever) Prevention Strategies",
    category: "dairy",
    excerpt: "Current best practices for managing calcium levels around parturition.",
    read_time: "5 min read",
    article_content: `<p>Strategic calcium supplementation and monitoring magnesium levels can drastically reduce clinical and subclinical milk fever, directly impacting early lactation yields.</p><p><em>Reference: "Calcium homeostasis in periparturient dairy cows", Vet Clinics of NA, 2022.</em></p>`
  },
  {
    title: "Heat Stress Alleviation in Lactating Cows",
    category: "dairy",
    excerpt: "How functional feed additives and electrolytes mitigate the severe impacts of summer heat stress on milk yield.",
    read_time: "6 min read",
    article_content: `<p>Beyond physical cooling systems, the addition of betaine, chromium, and specialized live yeast products helps maintain feed intake during high THI (Temperature-Humidity Index) periods.</p><p><em>Reference: "Nutritional interventions for heat-stressed dairy cows", Animal Science Reviews, 2023.</em></p>`
  },
  {
    title: "Colostrum Management and Calf Immunity",
    category: "dairy",
    excerpt: "The 3 Qs of Colostrum: Quality, Quantity, and Quickness.",
    read_time: "4 min read",
    article_content: `<p>Ensuring calves receive adequate IgG levels within the first 6 hours of life is paramount. Brix refractometers are now standard for rapid quality assessment.</p><p><em>Reference: "Advances in calf nutrition and colostrum management", JDS Communications, 2024.</em></p>`
  },
  {
    title: "Role of Essential Fatty Acids in Dairy Reproduction",
    category: "dairy",
    excerpt: "Supplementing Omega-3 and Omega-6 fatty acids to improve conception rates and embryo survival.",
    read_time: "8 min read",
    article_content: `<p>Targeted feeding of rumen-protected EPA and DHA improves follicular development and mitigates early embryonic loss in high-producing herds.</p><p><em>Reference: "Lipid supplementation and dairy cow reproduction", Theriogenology, 2023.</em></p>`
  },
  // Poultry (5)
  {
    title: "Managing Coccidiosis with Natural Alternatives",
    category: "poultry",
    excerpt: "Using saponins and essential oils to combat Eimeria species in broilers without ionophores.",
    read_time: "6 min read",
    article_content: `<p>With rising anticoccidial resistance, phytogenic blends containing Yucca and Quillaja saponins disrupt protozoal cell membranes effectively.</p><p><em>Reference: "Phytogenic alternatives for coccidiosis control", Poultry Science, 2022.</em></p>`
  },
  {
    title: "Optimizing Bone Health and Calcium Absorption in Layers",
    category: "poultry",
    excerpt: "Strategies to prevent cage layer fatigue and improve eggshell quality late in the laying cycle.",
    read_time: "7 min read",
    article_content: `<p>Combining highly available Vitamin D3 metabolites (like 25-OH-D3) with optimized calcium particle sizes ensures prolonged skeletal integrity.</p><p><em>Reference: "Calcium metabolism in modern laying hens", World's Poultry Science Journal, 2023.</em></p>`
  },
  {
    title: "Controlling Ammonia Levels in Broiler Houses",
    category: "poultry",
    excerpt: "Dietary adjustments and extracts to reduce atmospheric ammonia and prevent respiratory issues.",
    read_time: "5 min read",
    article_content: `<p>Reducing crude protein alongside the use of Yucca Schidigera extract significantly binds ammonia in the litter, improving overall flock welfare.</p><p><em>Reference: "Dietary strategies to reduce ammonia emissions in poultry", Avian Pathology, 2021.</em></p>`
  },
  {
    title: "Phytase Supplementation for Phosphorus Utilization",
    category: "poultry",
    excerpt: "Super-dosing phytase to eliminate inorganic phosphorus reliance and boost performance.",
    read_time: "6 min read",
    article_content: `<p>High doses of exogenous phytase not only release bound phosphorus but also destroy anti-nutritional phytic acid, releasing critical amino acids.</p><p><em>Reference: "Super-dosing phytase in broiler diets", Animal Feed Science, 2024.</em></p>`
  },
  {
    title: "Reducing Wet Litter Syndrome in Commercial Flocks",
    category: "poultry",
    excerpt: "Nutritional approaches to improve water absorption and gut transit times.",
    read_time: "5 min read",
    article_content: `<p>Balancing dietary electrolytes (Na, K, Cl) and utilizing NSP (Non-Starch Polysaccharide) enzymes drastically reduces water excretion and pododermatitis.</p><p><em>Reference: "Managing wet litter in poultry production", Poultry Welfare Journal, 2023.</em></p>`
  },
  // Swine (5)
  {
    title: "Maximizing Sow Longevity and Litter Size",
    category: "swine",
    excerpt: "Trace mineral nutrition and its impact on structural soundness and reproductive lifespan.",
    read_time: "7 min read",
    article_content: `<p>Replacing inorganic minerals with highly bioavailable organic chelates improves hoof health, directly correlating with lower culling rates in hyper-prolific sows.</p><p><em>Reference: "Trace mineral nutrition in modern sows", Swine Health and Production, 2022.</em></p>`
  },
  {
    title: "Gastric Ulcers in Pigs: Nutritional Prevention",
    category: "swine",
    excerpt: "The role of feed particle size and pelleted diets in the prevalence of pars esophagea ulcers.",
    read_time: "6 min read",
    article_content: `<p>While finely ground pelleted feed improves feed conversion, it drastically increases ulcer risk. Strategic inclusion of coarse fiber maintains stomach stratification.</p><p><em>Reference: "Dietary factors influencing porcine gastric ulcers", Vet Medicine, 2023.</em></p>`
  },
  {
    title: "Creep Feeding Strategies for Piglets",
    category: "swine",
    excerpt: "Introducing complex diets early to facilitate a smoother weaning transition.",
    read_time: "5 min read",
    article_content: `<p>Providing highly palatable, easily digestible creep feed starting at day 10 encourages early enzymatic development and gut maturation.</p><p><em>Reference: "Creep feeding and weaning success", Journal of Animal Science, 2021.</em></p>`
  },
  {
    title: "Phytogenic Additives for Swine Respiratory Health",
    category: "swine",
    excerpt: "Using eucalyptus and thyme extracts to support mucociliary clearance during PRRS outbreaks.",
    read_time: "6 min read",
    article_content: `<p>Essential oils exhibiting expectorant and antimicrobial properties can alleviate clinical respiratory symptoms and secondary bacterial infections.</p><p><em>Reference: "Phytogenics in swine respiratory disease", Porcine Health Management, 2024.</em></p>`
  },
  {
    title: "Managing Mycotoxin Contamination in Pig Feed",
    category: "swine",
    excerpt: "Broad-spectrum toxin binders and biotransformation strategies to protect herd health.",
    read_time: "8 min read",
    article_content: `<p>Pigs are highly susceptible to DON and Zearalenone. Modern mitigation relies on enzymatic deactivation rather than simple clay binders.</p><p><em>Reference: "Mycotoxin mitigation in swine", Toxins, 2023.</em></p>`
  },
  // Equine (5)
  {
    title: "Nutritional Management of Equine Metabolic Syndrome (EMS)",
    category: "equine",
    excerpt: "Dietary protocols for managing insulin dysregulation and preventing laminitis.",
    read_time: "7 min read",
    article_content: `<p>Controlling Non-Structural Carbohydrates (NSC) to below 10% of the total diet and soaking hay are cornerstones of managing EMS horses.</p><p><em>Reference: "Equine Metabolic Syndrome: Nutritional management", Vet Clinics of NA: Equine Practice, 2022.</em></p>`
  },
  {
    title: "Omega-3 Supplements for Equine Joint Health",
    category: "equine",
    excerpt: "The anti-inflammatory benefits of marine-derived DHA and EPA in osteoarthritis.",
    read_time: "5 min read",
    article_content: `<p>Supplementing with microalgae-derived Omega-3s shows superior bioavailability and anti-inflammatory action compared to flaxseed (ALA) in performance horses.</p><p><em>Reference: "Omega-3 fatty acids and equine osteoarthritis", Equine Vet Journal, 2024.</em></p>`
  },
  {
    title: "Managing Forage Quality for Performance Horses",
    category: "equine",
    excerpt: "Balancing energy needs with gut health through high-quality super fibers.",
    read_time: "6 min read",
    article_content: `<p>Replacing starch calories with highly fermentable fibers like beet pulp and soy hulls provides safe, slow-release energy for endurance and eventing.</p><p><em>Reference: "Fiber utilization in the equine athlete", Journal of Equine Vet Science, 2023.</em></p>`
  },
  {
    title: "Prebiotics vs Probiotics in the Equine Diet",
    category: "equine",
    excerpt: "Understanding the difference and knowing when to use which for hindgut stability.",
    read_time: "5 min read",
    article_content: `<p>While probiotics supply live yeast, prebiotics like MOS provide the substrate for existing beneficial bacteria to outcompete pathogens.</p><p><em>Reference: "Equine hindgut microbiome modulators", Animal Microbiome, 2021.</em></p>`
  },
  {
    title: "Electrolyte Replenishment for Endurance Horses",
    category: "equine",
    excerpt: "Formulating isotonic solutions for rapid recovery during intense exercise.",
    read_time: "6 min read",
    article_content: `<p>Horse sweat is hypertonic. Providing plain water without immediate sodium, potassium, and chloride replenishment can lead to dangerous metabolic imbalances.</p><p><em>Reference: "Electrolyte dynamics in endurance horses", Comp. Exercise Physiology, 2022.</em></p>`
  },
  // Pet Care (5)
  {
    title: "Nutritional Support for Canine Osteoarthritis",
    category: "pet-care",
    excerpt: "Combining EPA, Glucosamine, and Chondroitin for multimodal pain management.",
    read_time: "7 min read",
    article_content: `<p>Therapeutic joint diets have proven effective in reducing the required dosage of NSAIDs in senior dogs suffering from chronic DJD.</p><p><em>Reference: "Dietary management of canine osteoarthritis", Vet Record, 2023.</em></p>`
  },
  {
    title: "Dietary Management of Feline Lower Urinary Tract Disease",
    category: "pet-care",
    excerpt: "Manipulating urine pH and specific gravity to dissolve struvite and prevent calcium oxalate stones.",
    read_time: "6 min read",
    article_content: `<p>Increasing dietary moisture content (canned food) and precise mineral balancing are critical to preventing idiopathic cystitis and crystal formation.</p><p><em>Reference: "Feline FLUTD nutritional guidelines", Journal of Feline Medicine, 2022.</em></p>`
  },
  {
    title: "The Role of Antioxidants in Cognitive Decline in Senior Dogs",
    category: "pet-care",
    excerpt: "Using Vitamin E, L-carnitine, and botanical extracts to support brain aging.",
    read_time: "5 min read",
    article_content: `<p>Canine Cognitive Dysfunction (CCD) progression can be slowed significantly with diets rich in medium-chain triglycerides (MCTs) and antioxidants.</p><p><em>Reference: "Nutritional interventions for canine cognitive dysfunction", Frontiers in Vet Science, 2024.</em></p>`
  },
  {
    title: "Hypoallergenic Diets: Novel Proteins vs Hydrolyzed",
    category: "pet-care",
    excerpt: "Choosing the right dietary trial for dogs with suspected cutaneous adverse food reactions.",
    read_time: "6 min read",
    article_content: `<p>Hydrolyzed protein diets, where proteins are broken down below the allergenic threshold (typically < 10 kDa), remain the gold standard for elimination trials.</p><p><em>Reference: "Food allergies in dogs and cats", Vet Dermatology, 2021.</em></p>`
  },
  {
    title: "Feline Obesity: Safe Weight Reduction Protocols",
    category: "pet-care",
    excerpt: "Preventing hepatic lipidosis while achieving steady weight loss in overweight cats.",
    read_time: "7 min read",
    article_content: `<p>High-protein, low-carbohydrate diets preserve lean muscle mass, while L-carnitine supplementation facilitates fat metabolism during calorie restriction.</p><p><em>Reference: "Feline obesity management", Journal of Vet Internal Medicine, 2023.</em></p>`
  },
  // Aquaculture (5)
  {
    title: "Vitamin C Supplementation for Stress Resistance in Fish",
    category: "aquaculture",
    excerpt: "Ascorbic acid's role in mitigating crowding stress and improving wound healing.",
    read_time: "5 min read",
    article_content: `<p>Unlike many terrestrial animals, most teleost fish cannot synthesize Vitamin C. Stabilized forms in aquafeeds are essential for collagen formation and immunity.</p><p><em>Reference: "Vitamin C in aquaculture nutrition", Aquaculture Nutrition, 2022.</em></p>`
  },
  {
    title: "Optimizing Feed Conversion Ratio in Salmon Farming",
    category: "aquaculture",
    excerpt: "The impact of feed extrusion technology and lipid levels on FCR.",
    read_time: "6 min read",
    article_content: `<p>High-energy extruded diets maximize nutrient digestibility and minimize waste, dropping commercial salmon FCRs to near 1.1:1.</p><p><em>Reference: "Advances in salmonid feed technology", Aquaculture, 2023.</em></p>`
  },
  {
    title: "Astaxanthin and Pigmentation in Farmed Shrimp",
    category: "aquaculture",
    excerpt: "Natural vs synthetic carotenoids for achieving premium market coloration.",
    read_time: "4 min read",
    article_content: `<p>Astaxanthin is not just for color; it serves as a potent antioxidant, significantly improving survival rates under thermal and osmotic stress.</p><p><em>Reference: "Carotenoids in crustacean aquaculture", Reviews in Aquaculture, 2024.</em></p>`
  },
  {
    title: "Controlling Sea Lice with Functional Feeds",
    category: "aquaculture",
    excerpt: "In-feed glucosinolates and immunostimulants to thicken the mucosal barrier.",
    read_time: "7 min read",
    article_content: `<p>Functional feeds designed to enhance mucosal immunity and alter the skin mucus profile are proving to be viable deterrents against Lepeophtheirus salmonis attachment.</p><p><em>Reference: "Functional feeds for sea lice control", Fish & Shellfish Immunology, 2021.</em></p>`
  },
  {
    title: "Prebiotics for Gut Health in Nile Tilapia",
    category: "aquaculture",
    excerpt: "Using Fructooligosaccharides (FOS) to boost growth and disease resistance.",
    read_time: "5 min read",
    article_content: `<p>FOS supplementation in intensive tilapia farming alters the gut morphometry (increasing villus height) and upregulates immune gene expression.</p><p><em>Reference: "Prebiotics in tilapia aquaculture", Aquaculture Reports, 2023.</em></p>`
  }
];

const mappedData = knowledgeData.map((item, index) => ({
  ...item,
  slug: generateSlug(item.title),
  cover_image: `https://picsum.photos/seed/${generateSlug(item.title)}/800/600`, // Valid deterministic placeholder image
  published_at: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
  status: 'PUBLISHED',
  seo_title: `${item.title} | VetKind Knowledge Base`,
  seo_description: item.excerpt
}));

async function run() {
  const { data, error } = await supabase.from('knowledge_articles').upsert(mappedData, { onConflict: 'slug' });
  
  if (error) {
    console.error('Error inserting extended knowledge articles:', error);
  } else {
    console.log(`Successfully seeded ${mappedData.length} extended knowledge articles across all species.`);
  }
}

run();
