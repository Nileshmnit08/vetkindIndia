// @ts-nocheck
"use server";

import { auth } from "@/auth";
import { createServerClient } from "@/lib/supabase/client";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

const supabase = createServerClient();

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
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return { success: false, error: "User with this email already exists." };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { error } = await supabase.from('users').insert({
      name,
      email,
      password: hashedPassword,
      role,
      status,
    });

    if (error) throw error;

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
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

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

    const { error } = await supabase.from('users').update(dataToUpdate).eq('id', id);
    if (error) throw error;

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
    const { error } = await supabase.from('users').update({ status }).eq('id', id);
    if (error) throw error;

    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (e) {
    return { success: false, error: "Failed to update user status." };
  }
}

export async function deleteUser(id: string) {
  await checkAdminAuth();
  
  try {
    const { error } = await supabase.from('users').delete().eq('id', id);
    if (error) throw error;

    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (e) {
    return { success: false, error: "Failed to delete user." };
  }
}

