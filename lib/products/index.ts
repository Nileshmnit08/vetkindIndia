import { supabase } from "../supabase/client";

// Define basic types based on Supabase schema
export type ProductRow = any; // Assuming you have proper generated types, using any for now to avoid type errors
export type SpeciesRow = any;

export type ProductWithRelations = ProductRow & {
  species: SpeciesRow | null;
};

export interface FetchProductsOptions {
  search?: string;
  category?: string;
  species?: string;
  benefit?: string;
  productType?: string;
  badge?: string;
  sortBy?: 'featured' | 'popular' | 'newest' | 'price_asc' | 'price_desc';
  page?: number;
  limit?: number;
}

export async function getProducts(options: FetchProductsOptions = {}): Promise<{ data: ProductWithRelations[], count: number }> {
  let query = supabase
    .from('products')
    .select('*, species:species_id(*)', { count: 'exact' })
    .eq('published', true) as any;

  if (options.search) {
    query = query.ilike('name', `%${options.search}%`);
  }
  
  if (options.category) {
    query = query.ilike('category', `%${options.category}%`);
  }

  if (options.species) {
    query = query.eq('species.slug', options.species);
  }

  if (options.benefit) {
    query = query.ilike('benefits', `%${options.benefit}%`);
  }

  if (options.productType) {
    query = query.ilike('product_type', `%${options.productType}%`);
  }

  if (options.badge) {
    query = query.ilike('badges', `%${options.badge}%`);
  }

  switch (options.sortBy) {
    case 'featured':
      query = query.eq('featured', true).order('created_at', { ascending: false });
      break;
    case 'popular':
      query = query.eq('bestseller', true).order('created_at', { ascending: false });
      break;
    case 'price_asc':
      query = query.order('price', { ascending: true });
      break;
    case 'price_desc':
      query = query.order('price', { ascending: false });
      break;
    case 'newest':
    default:
      query = query.order('created_at', { ascending: false });
      break;
  }

  const page = options.page || 1;
  const limit = options.limit || 12;
  const skip = (page - 1) * limit;

  query = query.range(skip, skip + limit - 1);

  const { data: rawProducts, count } = (await query) as any;
  
  // Filter out products with null species if species filter was applied
  const products = options.species 
    ? (rawProducts || []).filter((p: any) => p.species) 
    : (rawProducts || []);

  const mappedProducts = products.map((p: any) => ({
    ...p,
    productType: p.product_type,
    createdAt: new Date(p.created_at)
  }));

  return { data: mappedProducts as any, count: count || 0 };
}

export async function getProductBySlug(slug: string): Promise<ProductWithRelations | null> {
  const { data: product } = await supabase
    .from('products')
    .select('*, species:species_id(*)')
    .eq('slug', slug)
    .single() as any;

  if (!product || !product.published) return null;

  return {
    ...product,
    productType: product.product_type,
    createdAt: new Date(product.created_at)
  } as any;
}

export async function getFilterOptions() {
  // Fetch active species
  const { data: rawSpecies } = await supabase
    .from('species')
    .select('id, name, slug, image, featured')
    .eq('is_active', true)
    .order('sort_order', { ascending: true }) as any;

  const species = (rawSpecies || []).filter((s: any) => !s.name.toLowerCase().includes('test'));

  // To gracefully handle empty options, we'll fetch distinct values 
  // for category, benefits, productType from *published* products.
  const { data: products } = await supabase
    .from('products')
    .select('category, benefits, product_type, badges')
    .eq('published', true) as any;

  const categories = new Set<string>();
  const benefits = new Set<string>();
  const productTypes = new Set<string>();
  const badges = new Set<string>();

  (products || []).forEach((p: any) => {
    if (p.category) p.category.split(',').map((v: string) => v.trim()).filter(Boolean).forEach((v: string) => categories.add(v));
    if (p.benefits) p.benefits.split(',').map((v: string) => v.trim()).filter(Boolean).forEach((v: string) => benefits.add(v));
    if (p.product_type) p.product_type.split(',').map((v: string) => v.trim()).filter(Boolean).forEach((v: string) => productTypes.add(v));
    if (p.badges) p.badges.split(',').map((v: string) => v.trim()).filter(Boolean).forEach((v: string) => badges.add(v));
  });

  return {
    species: species,
    categories: Array.from(categories).map(c => ({ id: c, name: c, slug: c })),
    benefits: Array.from(benefits).map(b => ({ id: b, name: b, slug: b })),
    productTypes: Array.from(productTypes),
    badges: Array.from(badges).map(b => ({ id: b, name: b, slug: b })),
  };
}
