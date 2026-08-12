import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash("admin123", 10);
  const distributorPassword = await bcrypt.hash("distributor123", 10);

  // Admin User
  await prisma.user.upsert({
    where: { email: "admin@vetkind.com" },
    update: {
      role: "ADMIN",
      password: adminPassword,
    },
    create: {
      name: "Admin User",
      email: "admin@vetkind.com",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  // Distributor User
  const distributor = await prisma.user.upsert({
    where: { email: "distributor@vetkind.com" },
    update: {
      role: "DISTRIBUTOR",
      password: distributorPassword,
    },
    create: {
      name: "John Distributor",
      email: "distributor@vetkind.com",
      password: distributorPassword,
      role: "DISTRIBUTOR",
      profile: {
        create: {
          companyName: "AgroVet Supplies",
          region: "Rajasthan",
        }
      }
    },
  });

  // Seed Species
  const dairySpecies = await prisma.species.upsert({
    where: { slug: "Dairy" },
    update: {},
    create: {
      name: "Dairy",
      slug: "Dairy",
      image: "https://images.unsplash.com/photo-1596733430284-f7437275218d?q=80&w=400&auto=format&fit=crop",
      featured: true,
      isActive: true,
      sortOrder: 1,
    }
  });

  const poultrySpecies = await prisma.species.upsert({
    where: { slug: "Poultry" },
    update: {},
    create: {
      name: "Poultry",
      slug: "Poultry",
      image: "https://images.unsplash.com/photo-1516467508483-a7212febe31a?q=80&w=400&auto=format&fit=crop",
      featured: true,
      isActive: true,
      sortOrder: 2,
    }
  });

  // Dummy Product
  await prisma.product.upsert({
    where: { slug: "vetkind-pro-milk" },
    update: {},
    create: {
      name: "VetKind Pro Milk",
      slug: "vetkind-pro-milk",
      category: "Dairy Nutrition",
      speciesId: dairySpecies.id,
      description: "Premium phytogenic supplement to boost milk yield.",
      price: 1500,
      published: true,
      resources: {
        create: {
          title: "Pro Milk Distributor Pricing",
          fileUrl: "https://example.com/pricing.pdf",
          resourceType: "PRICING",
          visibility: "DISTRIBUTOR"
        }
      }
    }
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
