const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
globalThis.WebSocket = require('ws');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const speciesImages = {
  'dairy': 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=800&q=80',
  'poultry': 'https://images.unsplash.com/photo-1548509925-0e7e16bfd209?w=800&q=80',
  'swine': 'https://images.unsplash.com/photo-1604859899175-9e66d48c8b4f?w=800&q=80',
  'equine': 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=800&q=80',
  'pet-care': 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800&q=80',
  'aquaculture': 'https://images.unsplash.com/photo-1522069169874-c58ced4e69d7?w=800&q=80'
};

async function run() {
  for (const [slug, image] of Object.entries(speciesImages)) {
    const { error } = await supabase
      .from('species')
      .update({ image })
      .eq('slug', slug);
      
    if (error) {
      console.error(`Failed to update image for ${slug}:`, error);
    } else {
      console.log(`Successfully updated image for ${slug}`);
    }
  }
}

run();
