const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() { 
  const p = await prisma.product.findMany(); 
  console.log('Products in DB:', p.length);
  console.log(p.map(x => x.name).join(', '));
}
main().catch(console.error).finally(() => prisma.$disconnect());
