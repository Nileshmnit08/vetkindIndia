const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
globalThis.WebSocket = require('ws');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const generateSlug = (title) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

const knowledgeData = [
  // Dairy
  {
    title: "Understanding and Managing Subacute Ruminal Acidosis (SARA)",
    category: "dairy",
    excerpt: "SARA remains a leading cause of reduced milk fat and laminitis. Learn the latest nutritional strategies for early detection and buffer supplementation.",
    read_time: "6 min read",
    article_content: `<h3>The Hidden Cost of SARA in High-Yielding Herds</h3>
    <p>Subacute Ruminal Acidosis (SARA) is a widespread metabolic disorder in dairy herds characterized by extended periods of depressed rumen pH. Recent meta-analyses from the past five years underscore that traditional symptoms are often subtle, leading to significant economic losses before intervention occurs.</p>
    <h4>Nutritional Interventions</h4>
    <p>Replacing rapidly fermentable carbohydrates with highly digestible fibrous by-products has proven effective. Furthermore, the inclusion of live yeast (<em>Saccharomyces cerevisiae</em>) and phytogenic buffers has shown a marked improvement in stabilizing rumen pH.</p>
    <p><em>Reference: "Dietary strategies to mitigate subacute ruminal acidosis in lactating dairy cows", Journal of Dairy Science, 2022.</em></p>`,
  },
  {
    title: "Precision Dairy Farming: How Sensors are Changing Herd Health",
    category: "dairy",
    excerpt: "Wearable technologies and automated milking systems generate massive data. How can we use this data to predict diseases before clinical signs appear?",
    read_time: "8 min read",
    article_content: `<h3>From Data to Actionable Insights</h3>
    <p>The integration of IoT (Internet of Things) devices in dairy farming has accelerated rapidly since 2020. Wearable sensors (accelerometers) and rumination collars provide real-time behavioral data.</p>
    <h4>Predictive Health</h4>
    <p>Algorithms can now predict the onset of mastitis, ketosis, and lameness up to 48 hours before clinical symptoms manifest, allowing for targeted, individual cow treatment and reducing the reliance on whole-herd antibiotic therapy.</p>
    <p><em>Reference: "Machine learning applications in precision dairy farming", Computers and Electronics in Agriculture, 2023.</em></p>`,
  },
  // Poultry
  {
    title: "Navigating the Post-Antibiotic Era in Poultry Production",
    category: "poultry",
    excerpt: "With the global phase-out of AGPs, focus has shifted to the gut microbiome. A look at organic acids, essential oils, and probiotics.",
    read_time: "7 min read",
    article_content: `<h3>Maintaining Gut Health Without AGPs</h3>
    <p>Since the stringent bans on Antibiotic Growth Promoters (AGPs), maintaining flock uniformity and preventing necrotic enteritis have been major challenges. Research from 2021-2024 has solidified the concept of 'eubiosis'—a healthy balance of intestinal microbiota.</p>
    <h4>Effective Alternatives</h4>
    <p>Synergistic blends of organic acids (like butyrate) and phytogenic essential oils have demonstrated bactericidal effects against <em>Clostridium perfringens</em> while promoting villi growth.</p>
    <p><em>Reference: "Efficacy of plant-derived alternatives to antibiotics in broiler chickens", Poultry Science, 2024.</em></p>`,
  },
  {
    title: "Biosecurity and Highly Pathogenic Avian Influenza (HPAI)",
    category: "poultry",
    excerpt: "The unprecedented global spread of HPAI H5N1 requires stricter biosecurity. Reviewing the latest transmission vectors and mitigation protocols.",
    read_time: "5 min read",
    article_content: `<h3>The 2022-2024 HPAI Panzoonosis</h3>
    <p>The recent strains of H5N1 have shown unprecedented survival in wild bird populations, making seasonal outbreaks a year-round threat. Traditional biosecurity perimeters are no longer sufficient.</p>
    <h4>Updated Mitigation Strategies</h4>
    <p>Recent epidemiological studies emphasize the role of fomite transmission via vehicles and personnel. Upgraded sanitation protocols, strict zoning, and exploring emergency vaccination programs are currently the primary defenses.</p>
    <p><em>Reference: "Epidemiology and evolution of HPAI H5N1 (2020-2023)", Avian Pathology, 2023.</em></p>`,
  },
  // Swine
  {
    title: "Life After Zinc Oxide: Piglet Diet Formulations",
    category: "swine",
    excerpt: "Following the EU ban on pharmacological levels of Zinc Oxide in 2022, what are the most effective nutritional strategies to prevent post-weaning diarrhea?",
    read_time: "6 min read",
    article_content: `<h3>The Post-Weaning Challenge</h3>
    <p>Pharmacological zinc oxide (ZnO) was the industry standard for preventing post-weaning diarrhea (PWD) in piglets. With regulatory bans taking effect globally to prevent heavy metal environmental contamination, swine nutritionists have had to innovate.</p>
    <h4>Nutritional Alternatives</h4>
    <p>Lowering crude protein levels to reduce undigested protein in the hindgut, combined with highly fermentable fiber and specialized organic acid blends, has proven to be the most reliable strategy to maintain gut integrity post-weaning.</p>
    <p><em>Reference: "Nutritional strategies for weaning pigs without therapeutic zinc oxide", Animal Feed Science and Technology, 2022.</em></p>`,
  },
  {
    title: "African Swine Fever (ASF): Global Epidemiology",
    category: "swine",
    excerpt: "An overview of ASF transmission dynamics and the ongoing development of live-attenuated vaccines.",
    read_time: "9 min read",
    article_content: `<h3>ASF: A Continuous Global Threat</h3>
    <p>Since its spread into Asia and Europe, African Swine Fever has severely disrupted global pork supply chains. Unlike other viral diseases, ASF's complex DNA virus structure has made vaccine development notoriously difficult.</p>
    <h4>Vaccine Development Updates</h4>
    <p>Recent breakthroughs (2022-2024) in live-attenuated vaccines (LAVs) using gene-deletion techniques (e.g., ASFV-G-∆I177L) have shown high efficacy in controlled trials, though commercial rollout remains highly regulated and monitored for reversion to virulence.</p>
    <p><em>Reference: "Development and field testing of African Swine Fever vaccines", Pathogens, 2024.</em></p>`,
  },
  // Equine
  {
    title: "Equine Asthma Syndrome: Diagnosis and Management",
    category: "equine",
    excerpt: "Differentiating between mild and severe equine asthma, and the latest environmental and medical management techniques.",
    read_time: "5 min read",
    article_content: `<h3>A Spectrum of Respiratory Disease</h3>
    <p>Equine Asthma Syndrome encompasses what was formerly known as RAO (heaves) and IAD. Research over the last five years highlights that chronic airway inflammation is primarily driven by inhalation of organic dust, mold, and endotoxins.</p>
    <h4>Management Over Medicine</h4>
    <p>While inhaled corticosteroids remain the medical standard, environmental remediation—such as steaming hay, using low-dust bedding, and maximizing pasture turnout—is critical for long-term prognosis.</p>
    <p><em>Reference: "Consensus statement on Equine Asthma", Journal of Veterinary Internal Medicine, 2021.</em></p>`,
  },
  {
    title: "The Equine Hindgut Microbiome and Performance",
    category: "equine",
    excerpt: "How dietary shifts impact the equine hindgut microbiome, leading to behavioral changes and colic risk in performance horses.",
    read_time: "7 min read",
    article_content: `<h3>The Engine of the Horse</h3>
    <p>The equine hindgut relies on a delicate balance of fibrolytic bacteria. High-starch diets fed to performance horses often overflow the foregut, reaching the cecum and causing rapid shifts in the microbiome (dysbiosis).</p>
    <h4>Microbiome Therapeutics</h4>
    <p>Recent studies (2020-2024) utilizing 16S rRNA sequencing show that prebiotics (like FOS/MOS) can stabilize the microbiome during transport and intense training, reducing the risk of colic and improving nutrient utilization.</p>
    <p><em>Reference: "Impact of diet on the equine hindgut microbiome", Equine Veterinary Journal, 2023.</em></p>`,
  },
  // Pet Care
  {
    title: "Grain-Free Diets and Canine Dilated Cardiomyopathy (DCM)",
    category: "pet-care",
    excerpt: "Reviewing the FDA's investigation (2019-2023) into non-hereditary DCM and its link to diets high in pulses and legumes.",
    read_time: "8 min read",
    article_content: `<h3>Understanding the DCM Link</h3>
    <p>The veterinary community has closely followed the investigation into diet-associated Dilated Cardiomyopathy (DCM) in dogs. Data compiled from 2019 to 2023 suggests a complex interaction between genetics and diets formulated heavily with peas, lentils, and potatoes.</p>
    <h4>Taurine and Bioavailability</h4>
    <p>While some cases showed taurine deficiency, many dogs with diet-associated DCM had normal blood taurine levels. Current research suggests that high inclusion of certain legumes may bind bile acids or alter the microbiome, affecting overall cardiac metabolism.</p>
    <p><em>Reference: "Diet-associated dilated cardiomyopathy in dogs: What do we know?", Journal of the American Veterinary Medical Association, 2023.</em></p>`,
  },
  {
    title: "The Efficacy of CBD in Canine Osteoarthritis",
    category: "pet-care",
    excerpt: "Separating fact from fiction: A review of the clinical trials evaluating Cannabidiol (CBD) for pain management in dogs.",
    read_time: "6 min read",
    article_content: `<h3>CBD in Veterinary Medicine</h3>
    <p>With the legalization of hemp products, CBD has flooded the pet supplement market. However, rigorous clinical trials have only recently been published (2020-2024).</p>
    <h4>Clinical Findings</h4>
    <p>Double-blind, placebo-controlled studies have demonstrated that full-spectrum CBD oil (2 mg/kg twice daily) can significantly decrease pain scores and increase mobility in dogs with osteoarthritis, without severe hepatic side effects, though elevated alkaline phosphatase (ALP) is common.</p>
    <p><em>Reference: "Pharmacokinetics, safety, and clinical efficacy of cannabidiol treatment in osteoarthritic dogs", Frontiers in Veterinary Science, 2021.</em></p>`,
  },
  // Aquaculture
  {
    title: "Probiotics for Disease Resistance in Shrimp Farming",
    category: "aquaculture",
    excerpt: "Combating Early Mortality Syndrome (EMS) in shrimp using specific Bacillus strains to competitively exclude pathogens.",
    read_time: "5 min read",
    article_content: `<h3>The Fight Against EMS and Vibrio</h3>
    <p>Early Mortality Syndrome (Acute Hepatopancreatic Necrosis Disease, AHPND) caused by <em>Vibrio parahaemolyticus</em> has devastated shrimp aquaculture globally. Traditional antibiotics are largely ineffective and environmentally damaging.</p>
    <h4>Competitive Exclusion</h4>
    <p>Recent advances show that incorporating specific strains of <em>Bacillus subtilis</em> and <em>Lactobacillus</em> into the water column and feed successfully competitively excludes pathogenic Vibrio, improving survival rates by up to 40% in challenge trials.</p>
    <p><em>Reference: "Application of probiotics in shrimp aquaculture", Aquaculture Reports, 2022.</em></p>`,
  },
  {
    title: "Sustainable Aquafeeds: Insect Meal and Microalgae",
    category: "aquaculture",
    excerpt: "Reducing reliance on wild-caught fishmeal by innovating with Black Soldier Fly larvae and microalgae for essential fatty acids.",
    read_time: "7 min read",
    article_content: `<h3>The Future of Aquafeed</h3>
    <p>The aquaculture industry's heavy reliance on marine fishmeal and fish oil is ecologically unsustainable. Over the last five years, research into alternative protein and lipid sources has accelerated.</p>
    <h4>Insect Meal and Algae</h4>
    <p>Black Soldier Fly (BSF) larvae offer a highly sustainable protein source with a favorable amino acid profile. Concurrently, microalgae (such as <em>Schizochytrium</em> sp.) are being utilized as a direct, sustainable source of EPA and DHA, completely bypassing the need for forage fish.</p>
    <p><em>Reference: "Replacement of fishmeal with insect meal in aquaculture", Reviews in Aquaculture, 2023.</em></p>`,
  }
];

const mappedData = knowledgeData.map((item) => ({
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
    console.error('Error inserting knowledge articles:', error);
  } else {
    console.log(`Successfully seeded ${mappedData.length} knowledge articles across all species.`);
  }
}

run();
