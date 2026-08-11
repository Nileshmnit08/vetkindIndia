"use server";

import { signIn, signOut } from "@/auth";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid email or password.";
        default:
          return "Something went wrong.";
      }
    }
    throw error;
  }
}

export async function registerUser(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (!name || !email || !password) {
      return "All fields are required.";
    }

    if (password !== confirmPassword) {
      return "Passwords do not match.";
    }

    if (password.length < 6) {
      return "Password must be at least 6 characters long.";
    }

    const normalizedEmail = email.toLowerCase();
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return "An account with this email already exists.";
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        name,
        email: normalizedEmail,
        password: hashedPassword,
      },
    });

    return "Success";
  } catch (error) {
    console.error("Failed to register user:", error);
    return "Failed to register. Please try again later.";
  }
}

export async function logout() {
  await signOut();
  revalidatePath("/");
}
