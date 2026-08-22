import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Requires service role to bypass RLS for data migration

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in environment.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runDataMigration() {
  console.log("Starting Product -> Product Variant data migration...");

  // Fetch all existing products
  const { data: products, error } = await supabase.from('products').select('id, name, slug, pack_size, price');
  
  if (error) {
    console.error("Error fetching products:", error);
    process.exit(1);
  }

  console.log(`Found ${products.length} products to migrate.`);

  let successCount = 0;
  let errorCount = 0;

  for (const product of products) {
    // Determine fallback values for missing pack_size or price
    const fallbackPackSize = product.pack_size || "1 Unit";
    // Convert DOUBLE PRECISION price to BIGINT (Paisa)
    const pricePaisa = product.price ? Math.round(product.price * 100) : 0;
    
    // Generate a SKU
    const sku = `SKU-${product.slug}-${fallbackPackSize.replace(/\s+/g, '').toUpperCase()}`;

    const { error: insertError } = await supabase.from('product_variants').insert({
      product_id: product.id,
      sku: sku,
      variant_name: fallbackPackSize,
      pack_size: fallbackPackSize,
      price: pricePaisa,
      sort_order: 1,
      is_active: true
    });

    if (insertError) {
      console.error(`Failed to migrate product ${product.id} (${product.name}):`, insertError.message);
      errorCount++;
    } else {
      successCount++;
    }
  }

  console.log("Data migration complete.");
  console.log(`Successfully migrated: ${successCount} products.`);
  console.log(`Failed to migrate: ${errorCount} products.`);
}

runDataMigration();
