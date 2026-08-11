"use server";

import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

// Ensure the caller is an Admin
async function checkAdminAuth() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
}

export async function createProduct(formData: FormData) {
  await checkAdminAuth();
  
  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string || name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const category = formData.get("category") as string;
  const shortDescription = formData.get("shortDescription") as string || "";
  const description = formData.get("description") as string || "";
  const priceRaw = formData.get("price");
  const price = priceRaw ? parseFloat(priceRaw as string) : null;
  const image = formData.get("image") as string || "";
  
  const featured = formData.get("featured") === "true";
  const bestseller = formData.get("bestseller") === "true";
  const published = formData.get("published") === "true";

  try {
    await prisma.product.create({
      data: {
        name,
        slug,
        category,
        shortDescription,
        description,
        price,
        image,
        featured,
        bestseller,
        published,
      },
    });

    revalidatePath("/admin/products");
    revalidatePath("/products");
    return { success: true };
  } catch (error) {
    console.error("Failed to create product:", error);
    return { success: false, error: "Failed to create product. Slug might already exist." };
  }
}

export async function updateProduct(id: string, formData: FormData) {
  await checkAdminAuth();
  
  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const category = formData.get("category") as string;
  const shortDescription = formData.get("shortDescription") as string || "";
  const description = formData.get("description") as string || "";
  const priceRaw = formData.get("price");
  const price = priceRaw ? parseFloat(priceRaw as string) : null;
  const image = formData.get("image") as string || "";
  
  const featured = formData.get("featured") === "true";
  const bestseller = formData.get("bestseller") === "true";
  const published = formData.get("published") === "true";

  try {
    await prisma.product.update({
      where: { id },
      data: {
        name,
        slug,
        category,
        shortDescription,
        description,
        price,
        image,
        featured,
        bestseller,
        published,
      },
    });

    revalidatePath("/admin/products");
    revalidatePath("/products");
    revalidatePath(`/products/${slug}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to update product:", error);
    return { success: false, error: "Failed to update product." };
  }
}

export async function toggleProductStatus(id: string, published: boolean) {
  await checkAdminAuth();
  
  try {
    await prisma.product.update({
      where: { id },
      data: { published },
    });

    revalidatePath("/admin/products");
    revalidatePath("/products");
    return { success: true };
  } catch (e) {
    return { success: false, error: "Failed to toggle status." };
  }
}

export async function deleteProduct(id: string) {
  await checkAdminAuth();
  
  try {
    await prisma.product.delete({
      where: { id },
    });

    revalidatePath("/admin/products");
    revalidatePath("/products");
    return { success: true };
  } catch (e) {
    return { success: false, error: "Failed to delete product." };
  }
}

export async function createDistributorAccount() {
  await checkAdminAuth();
  // We would normally also use bcrypt here to hash a randomly generated password 
  // or a provided default password for the new distributor.
  
  // For simplicity, returning a mock success
  return { success: true, message: "Distributor created." };
}

export async function updateDistributorStatus(id: string, newStatus: string) {
  await checkAdminAuth();
  
  try {
    await prisma.user.update({
      where: { id },
      data: { status: newStatus },
    });

    revalidatePath("/admin/distributors");
    return { success: true };
  } catch (e) {
    return { success: false, error: "Failed to update distributor status." };
  }
}

export async function deleteDistributor(id: string) {
  await checkAdminAuth();
  
  try {
    await prisma.user.delete({
      where: { id },
    });

    revalidatePath("/admin/distributors");
    return { success: true };
  } catch (e) {
    return { success: false, error: "Failed to delete distributor." };
  }
}

export async function resendDistributorInvite(id: string) {
  await checkAdminAuth();
  
  try {
    // In a real app, you would generate a token and send an email
    await prisma.user.update({
      where: { id },
      data: { status: "PENDING" }, // Just simulating an invite state
    });

    revalidatePath("/admin/distributors");
    return { success: true };
  } catch (e) {
    return { success: false, error: "Failed to resend invite." };
  }
}
