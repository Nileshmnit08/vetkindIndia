import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding dummy products...');

  // Optional: clear existing products
  await prisma.product.deleteMany();
  console.log('Cleared existing products.');

  const products = [
    {
      name: 'VetKind Pro Milk',
      slug: 'vetkind-pro-milk',
      category: 'Dairy',
      shortDescription: 'Advanced lactation support for high-yielding dairy cows.',
      description: 'VetKind Pro Milk is a premium nutritional supplement designed to maximize milk production and improve milk fat and protein content. Enriched with essential vitamins, bypass fat, and phytogenic extracts.',
      price: 1250.00,
      published: true,
      featured: true,
      bestseller: true,
    },
    {
      name: 'VetKind Growth Plus',
      slug: 'vetkind-growth-plus',
      category: 'Small Ruminants',
      shortDescription: 'Accelerates weight gain and muscle development in goats and sheep.',
      description: 'A specialized formula for small ruminants that promotes rapid healthy growth, improves feed conversion ratio (FCR), and supports overall immune function during crucial growth phases.',
      price: 850.50,
      published: true,
      featured: false,
      bestseller: false,
    },
    {
      name: 'VetKind Phyto Boost',
      slug: 'vetkind-phyto-boost',
      category: 'Dairy',
      shortDescription: 'Natural herbal immunity and rumen health booster.',
      description: 'Harnessing the power of traditional Indian phytogenics, Phyto Boost naturally stimulates appetite, stabilizes rumen pH, and enhances the natural defense mechanisms of cattle.',
      price: 600.00,
      published: true,
      featured: true,
      bestseller: false,
    },
    {
      name: 'VetKind Poultry Max',
      slug: 'vetkind-poultry-max',
      category: 'Poultry',
      shortDescription: 'Comprehensive mineral and vitamin mix for broilers and layers.',
      description: 'Ensures optimal eggshell quality in layers and supports skeletal strength and rapid weight gain in broilers. Fortified with bioavailable trace minerals.',
      price: 450.00,
      published: true,
      featured: false,
      bestseller: true,
    }
  ];

  for (const product of products) {
    await prisma.product.create({
      data: product
    });
  }

  console.log('Seeding complete. Added 4 products.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
