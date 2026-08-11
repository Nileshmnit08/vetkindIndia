import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("password", 10);
  
  await prisma.user.upsert({
    where: { email: "admin" },
    update: {
      role: "ADMIN",
      password: passwordHash,
    },
    create: {
      name: "Admin User",
      email: "admin",
      password: passwordHash,
      role: "ADMIN",
    },
  });

  console.log("Created admin user with username: admin, password: password");
}

main().finally(async () => {
  await prisma.$disconnect();
});
