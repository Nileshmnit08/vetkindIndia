const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  console.log('Starting blog seed...');

  const categories = ['dairy', 'aqua', 'camel'];

  for (const category of categories) {
    const filePath = path.join(__dirname, 'data', `${category}-blogs.json`);
    if (fs.existsSync(filePath)) {
      const rawData = fs.readFileSync(filePath, 'utf-8');
      const blogs = JSON.parse(rawData);

      for (const blog of blogs) {
        // Check if exists to avoid duplicates
        const existing = await prisma.blogArticle.findUnique({ where: { slug: blog.slug } });
        if (!existing) {
          await prisma.blogArticle.create({
            data: blog
          });
          console.log(`Created blog: ${blog.title}`);
        } else {
          console.log(`Blog already exists, skipping: ${blog.title}`);
        }
      }
    } else {
      console.warn(`File not found: ${filePath}`);
    }
  }

  console.log('Blog seed completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
