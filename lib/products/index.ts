import { PrismaClient, Product, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export type ProductWithRelations = Product;

export interface FetchProductsOptions {
  search?: string;
  category?: string;
  species?: string;
  benefit?: string;
  productType?: string;
  sortBy?: 'featured' | 'popular' | 'newest' | 'price_asc' | 'price_desc';
  page?: number;
  limit?: number;
}

export async function getProducts(options: FetchProductsOptions = {}): Promise<{ data: ProductWithRelations[], count: number }> {
  const where: Prisma.ProductWhereInput = {
    published: true, // Only show published products on public pages
  };

  if (options.search) {
    where.name = { contains: options.search };
  }
  
  if (options.category) {
    where.category = options.category;
  }
  
  // Note: species and benefit filtering is currently stubbed out because the Prisma schema is simplified
  // and doesn't contain these relations yet.
  
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
    }),
    prisma.product.count({ where }),
  ]);

  console.log('GET_PRODUCTS CALLED. Count:', count, 'Products:', products.map((p) => p.name));

  return { data: products, count };
}

export async function getProductBySlug(slug: string): Promise<ProductWithRelations | null> {
  const product = await prisma.product.findUnique({
    where: { slug }
  });

  if (!product || !product.published) return null;

  return product;
}

export async function getFilterOptions() {
  // Using simplified categories derived from Prisma for now
  return {
    categories: [
      { id: '1', name: 'Dairy', slug: 'Dairy' },
      { id: '2', name: 'Poultry', slug: 'Poultry' },
      { id: '3', name: 'Small Ruminants', slug: 'Small Ruminants' },
      { id: '4', name: 'Aqua', slug: 'Aqua' },
      { id: '5', name: 'Swine', slug: 'Swine' },
      { id: '6', name: 'Equine', slug: 'Equine' },
      { id: '7', name: 'Pet', slug: 'Pet' },
    ],
    species: [],
    benefits: [],
    productTypes: [],
  };
}
