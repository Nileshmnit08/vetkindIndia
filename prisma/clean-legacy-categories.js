const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const legacyCategories = ["Dairy", "Poultry", "Small Ruminants", "Aqua", "Swine", "Equine", "Pet"];
  
  console.log('Cleaning legacy categories...');
  
  const result = await prisma.product.updateMany({
    where: {
      category: {
        in: legacyCategories
      }
    },
    data: {
      category: null
    }
  });
  
  console.log(`Updated ${result.count} products.`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
