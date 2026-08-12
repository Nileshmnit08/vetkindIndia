const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Fetch all active species
  const speciesList = await prisma.species.findMany({
    where: { isActive: true }
  });

  if (speciesList.length === 0) {
    console.log("No active species found.");
    return;
  }

  const categories = ['Nutrition', 'Health', 'Supplement'];
  const benefits = ['Immunity', 'Growth', 'Digestion'];
  const productTypes = ['Powder', 'Liquid', 'Injection'];

  let productCount = 0;

  for (const species of speciesList) {
    // Create 3 dummy products for each species
    for (let i = 1; i <= 3; i++) {
      const productName = `${species.name} Product ${i}`;
      const slug = `${species.slug}-product-${i}`;

      // Check if product already exists to avoid unique constraint errors
      const existing = await prisma.product.findUnique({
        where: { slug }
      });

      if (!existing) {
        await prisma.product.create({
          data: {
            name: productName,
            slug: slug,
            speciesId: species.id,
            category: categories[i % categories.length],
            benefits: benefits[i % benefits.length],
            productType: productTypes[i % productTypes.length],
            packSize: `${10 * i}kg`,
            description: `This is a premium ${species.name} product designed for optimal health and productivity.`,
            shortDescription: `High-quality ${species.name} supplement.`,
            price: 50.0 + (i * 10.5),
            published: true,
            featured: i === 1,
          }
        });
        productCount++;
      }
    }
  }

  console.log(`Successfully seeded ${productCount} dummy products across ${speciesList.length} species.`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
