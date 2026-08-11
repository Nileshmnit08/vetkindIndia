const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  await prisma.product.upsert({
    where: { slug: 'vetkind-calf-starter-pro' },
    update: {},
    create: {
      name: 'VetKind Calf Starter Pro',
      slug: 'vetkind-calf-starter-pro',
      category: 'Dairy',
      published: true,
      price: 999.00,
      shortDescription: 'Early nutrition support formula for calf growth and immunity',
      description: 'Science-backed calf nutrition blend designed to support growth, gut health, and feed efficiency',
      featured: true,
      bestseller: false
    }
  });
  console.log('Created product');
}

main().catch(console.error).finally(() => prisma.$disconnect());
