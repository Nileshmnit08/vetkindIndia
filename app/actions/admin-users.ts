"use server";

import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Ensure the caller is an Admin
async function checkAdminAuth() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
}

export async function createUser(formData: FormData) {
  await checkAdminAuth();
  
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as string || "USER";
  const status = formData.get("status") as string || "ACTIVE";

  if (!email || !password) {
    return { success: false, error: "Email and password are required." };
  }

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { success: false, error: "User with this email already exists." };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        status,
      },
    });

    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Failed to create user:", error);
    return { success: false, error: "Failed to create user." };
  }
}

export async function updateUser(id: string, formData: FormData) {
  await checkAdminAuth();
  
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const role = formData.get("role") as string;
  const status = formData.get("status") as string;
  const password = formData.get("password") as string;

  if (!email) {
    return { success: false, error: "Email is required." };
  }

  try {
    // Check if another user has this email
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser && existingUser.id !== id) {
      return { success: false, error: "Another user with this email already exists." };
    }

    const dataToUpdate: any = {
      name,
      email,
      role,
      status,
    };

    if (password) {
      dataToUpdate.password = await bcrypt.hash(password, 10);
    }

    await prisma.user.update({
      where: { id },
      data: dataToUpdate,
    });

    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Failed to update user:", error);
    return { success: false, error: "Failed to update user." };
  }
}

export async function updateUserStatus(id: string, status: string) {
  await checkAdminAuth();
  
  try {
    await prisma.user.update({
      where: { id },
      data: { status },
    });

    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (e) {
    return { success: false, error: "Failed to update user status." };
  }
}

export async function deleteUser(id: string) {
  await checkAdminAuth();
  
  try {
    await prisma.user.delete({
      where: { id },
    });

    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (e) {
    return { success: false, error: "Failed to delete user." };
  }
}
