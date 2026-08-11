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

  // Dummy Product
  await prisma.product.upsert({
    where: { slug: "vetkind-pro-milk" },
    update: {},
    create: {
      name: "VetKind Pro Milk",
      slug: "vetkind-pro-milk",
      category: "Dairy Nutrition",
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
