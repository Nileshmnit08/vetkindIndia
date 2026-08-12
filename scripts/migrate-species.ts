import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const VETKIND_TAXONOMY = [
  {
    name: "Dairy",
    slug: "Dairy",
    image: "https://images.unsplash.com/photo-1596733430284-f7437275218d?q=80&w=400&auto=format&fit=crop",
    featured: true,
    isActive: true,
    sortOrder: 1,
  },
  {
    name: "Poultry",
    slug: "Poultry",
    image: "https://images.unsplash.com/photo-1516467508483-a7212febe31a?q=80&w=400&auto=format&fit=crop",
    featured: true,
    isActive: true,
    sortOrder: 2,
  },
  {
    name: "Small Ruminants",
    slug: "Small Ruminants",
    image: "https://images.unsplash.com/photo-1484557985045-edf25e08da73?q=80&w=400&auto=format&fit=crop",
    featured: true,
    isActive: true,
    sortOrder: 3,
  },
  {
    name: "Aqua",
    slug: "Aqua",
    image: "https://images.unsplash.com/photo-1524704796725-9fc3044a58b2?q=80&w=400&auto=format&fit=crop",
    featured: true,
    isActive: true,
    sortOrder: 4,
  },
  {
    name: "Pets",
    slug: "Pets",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=400&auto=format&fit=crop",
    featured: true,
    isActive: true,
    sortOrder: 5,
  },
  {
    name: "Swine",
    slug: "Swine",
    image: "https://images.unsplash.com/photo-1516467508483-a7212febe31a?q=80&w=400&auto=format&fit=crop", // Placeholder
    featured: false,
    isActive: true,
    sortOrder: 6,
  },
  {
    name: "Equine",
    slug: "Equine",
    image: "https://images.unsplash.com/photo-1596733430284-f7437275218d?q=80&w=400&auto=format&fit=crop", // Placeholder
    featured: false,
    isActive: true,
    sortOrder: 7,
  },
  {
    name: "Camel",
    slug: "Camel",
    image: "https://images.unsplash.com/photo-1484557985045-edf25e08da73?q=80&w=400&auto=format&fit=crop", // Placeholder
    featured: false,
    isActive: true,
    sortOrder: 8,
  }
];

async function main() {
  console.log("Starting species migration...");

  // 1. Create Species records
  for (const spec of VETKIND_TAXONOMY) {
    await prisma.species.upsert({
      where: { slug: spec.slug },
      update: {},
      create: {
        name: spec.name,
        slug: spec.slug,
        image: spec.image,
        featured: spec.featured,
        isActive: spec.isActive,
        sortOrder: spec.sortOrder,
      },
    });
    console.log(`Ensured species: ${spec.name}`);
  }

  // 2. Link existing products based on their current category text
  const products = await prisma.product.findMany();
  console.log(`Found ${products.length} products to map.`);

  for (const product of products) {
    if (product.category && !product.speciesId) {
      // Simple mapping logic based on string matching
      const categoryLower = product.category.toLowerCase();
      let matchedSlug = "";
      
      if (categoryLower.includes("dairy")) matchedSlug = "Dairy";
      else if (categoryLower.includes("poultry")) matchedSlug = "Poultry";
      else if (categoryLower.includes("ruminant")) matchedSlug = "Small Ruminants";
      else if (categoryLower.includes("aqua")) matchedSlug = "Aqua";
      else if (categoryLower.includes("pet")) matchedSlug = "Pets";
      else if (categoryLower.includes("swine")) matchedSlug = "Swine";
      else if (categoryLower.includes("equine")) matchedSlug = "Equine";
      else if (categoryLower.includes("camel")) matchedSlug = "Camel";

      if (matchedSlug) {
        const species = await prisma.species.findUnique({ where: { slug: matchedSlug } });
        if (species) {
          await prisma.product.update({
            where: { id: product.id },
            data: { 
              speciesId: species.id,
              // We keep the original 'category' value to serve as 'subcategory' now
            }
          });
          console.log(`Mapped product '${product.name}' to species '${matchedSlug}'.`);
        }
      } else {
        console.log(`Could not auto-map product '${product.name}' with category '${product.category}'.`);
      }
    }
  }

  console.log("Migration completed successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
