import { PrismaClient, Product, Prisma, Species } from "@prisma/client";

const prisma = new PrismaClient();

export type ProductWithRelations = Product & {
  species: Species | null;
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
  const where: Prisma.ProductWhereInput = {
    published: true,
  };

  if (options.search) {
    where.name = { contains: options.search };
  }
  
  if (options.category) {
    where.category = { contains: options.category };
  }

  if (options.species) {
    where.species = {
      slug: options.species
    };
  }

  if (options.benefit) {
    where.benefits = { contains: options.benefit };
  }

  if (options.productType) {
    where.productType = { contains: options.productType };
  }

  if (options.badge) {
    where.badges = { contains: options.badge };
  }

  let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: 'desc' };
  
  switch (options.sortBy) {
    case 'featured':
      where.featured = true;
      break;
    case 'popular':
      where.bestseller = true;
      break;
    case 'price_asc':
      orderBy = { price: 'asc' };
      break;
    case 'price_desc':
      orderBy = { price: 'desc' };
      break;
    case 'newest':
    default:
      orderBy = { createdAt: 'desc' };
      break;
  }

  const page = options.page || 1;
  const limit = options.limit || 12;
  const skip = (page - 1) * limit;

  const [products, count] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        species: true
      }
    }),
    prisma.product.count({ where }),
  ]);

  return { data: products, count };
}

export async function getProductBySlug(slug: string): Promise<ProductWithRelations | null> {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      species: true
    }
  });

  if (!product || !product.published) return null;

  return product;
}

export async function getFilterOptions() {
  // Fetch active species
  const rawSpecies = await prisma.species.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
    select: { id: true, name: true, slug: true, image: true, featured: true }
  });

  const species = rawSpecies.filter(s => !s.name.toLowerCase().includes('test'));

  // To gracefully handle empty options, we'll fetch distinct values 
  // for category, benefits, productType from *published* products.
  const products = await prisma.product.findMany({
    where: { published: true },
    include: { species: true }
  });

  const categories = new Set<string>();
  const benefits = new Set<string>();
  const productTypes = new Set<string>();
  const badges = new Set<string>();
  const activeSpeciesIds = new Set<string>();

  products.forEach(p => {
    if (p.category) p.category.split(',').map(v => v.trim()).filter(Boolean).forEach(v => categories.add(v));
    if (p.benefits) p.benefits.split(',').map(v => v.trim()).filter(Boolean).forEach(v => benefits.add(v));
    if (p.productType) p.productType.split(',').map(v => v.trim()).filter(Boolean).forEach(v => productTypes.add(v));
    if (p.badges) p.badges.split(',').map(v => v.trim()).filter(Boolean).forEach(v => badges.add(v));
    if (p.species) activeSpeciesIds.add(p.species.id);
  });

  // Do not filter out species with zero products, so that Browse by Species and Footer always show the full taxonomy

  return {
    species: species,
    categories: Array.from(categories).map(c => ({ id: c, name: c, slug: c })),
    benefits: Array.from(benefits).map(b => ({ id: b, name: b, slug: b })),
    productTypes: Array.from(productTypes),
    badges: Array.from(badges).map(b => ({ id: b, name: b, slug: b })),
  };
}
