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
  
  const speciesId = formData.get("speciesId") as string || null;
  const benefits = formData.get("benefits") as string || null;
  const productType = formData.get("productType") as string || null;
  const badges = formData.get("badges") as string || null;

  const featured = formData.get("featured") === "true";
  const bestseller = formData.get("bestseller") === "true";
  const published = formData.get("published") === "true";

  try {
    const { error } = await supabase.from('products').insert({
      name,
      slug,
      category,
      species_id: speciesId,
      benefits,
      product_type: productType,
      badges,
      short_description: shortDescription,
      description,
      price,
      image,
      featured,
      bestseller,
      published,
    });

    if (error) throw error;

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
  
  const speciesId = formData.get("speciesId") as string || null;
  const benefits = formData.get("benefits") as string || null;
  const productType = formData.get("productType") as string || null;
  const badges = formData.get("badges") as string || null;
  
  const featured = formData.get("featured") === "true";
  const bestseller = formData.get("bestseller") === "true";
  const published = formData.get("published") === "true";

  try {
    const { error } = await supabase.from('products').update({
      name,
      slug,
      category,
      species_id: speciesId,
      benefits,
      product_type: productType,
      badges,
      short_description: shortDescription,
      description,
      price,
      image,
      featured,
      bestseller,
      published,
    }).eq('id', id);

    if (error) throw error;

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
    const { error } = await supabase.from('products').update({ published }).eq('id', id);
    if (error) throw error;

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
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw error;

    revalidatePath("/admin/products");
    revalidatePath("/products");
    return { success: true };
  } catch (e) {
    return { success: false, error: "Failed to delete product." };
  }
}

export async function createDistributorAccount(formData: FormData) {
  await checkAdminAuth();
  
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const company = formData.get("company") as string;
  const phone = formData.get("phone") as string;
  const region = formData.get("region") as string;

  if (!email || !name) {
    return { success: false, error: "Name and email are required." };
  }

  // Generate a random password for now
  const passwordHash = await bcrypt.hash(Math.random().toString(36).slice(-8) + "Aa1!", 10);

  try {
    const { data: existingUser } = await supabase.from('users').select('id').eq('email', email).single();
    if (existingUser) {
      return { success: false, error: "A user with this email already exists." };
    }

    const { data: user, error: userError } = await supabase.from('users').insert({
      email,
      name,
      password: passwordHash,
      role: 'DISTRIBUTOR',
      status: 'PENDING' // They need to accept invite
    }).select().single();

    if (userError) throw userError;

    const { error: profileError } = await supabase.from('distributor_profiles').insert({
      user_id: user.id,
      company_name: company || null,
      phone: phone || null,
      region: region || null
    });

    if (profileError) throw profileError;

    revalidatePath("/admin/distributors");
    return { success: true, id: user.id, message: "Distributor created successfully." };
  } catch (error: any) {
    console.error("Error creating distributor:", error);
    return { success: false, error: error.message || "Failed to create distributor" };
  }
}

export async function updateDistributorProfile(id: string, formData: FormData) {
  await checkAdminAuth();
  
  const name = formData.get("name") as string;
  const company = formData.get("company") as string;
  const phone = formData.get("phone") as string;
  const region = formData.get("region") as string;
  const status = formData.get("status") as string;

  try {
    // Update user table
    const updateData: any = {};
    if (name) updateData.name = name;
    if (status) updateData.status = status;
    
    if (Object.keys(updateData).length > 0) {
      const { error: userError } = await supabase.from('users').update(updateData).eq('id', id);
      if (userError) throw userError;
    }

    // Update profile table
    const { data: existingProfile } = await supabase.from('distributor_profiles').select('id').eq('user_id', id).single();
    
    if (existingProfile) {
      const { error: profileError } = await supabase.from('distributor_profiles').update({
        company_name: company || null,
        phone: phone || null,
        region: region || null
      }).eq('user_id', id);
      if (profileError) throw profileError;
    } else {
      // Create if doesn't exist
      const { error: profileError } = await supabase.from('distributor_profiles').insert({
        user_id: id,
        company_name: company || null,
        phone: phone || null,
        region: region || null
      });
      if (profileError) throw profileError;
    }

    revalidatePath("/admin/distributors");
    return { success: true };
  } catch (error: any) {
    console.error("Error updating distributor:", error);
    return { success: false, error: error.message || "Failed to update distributor" };
  }
}

export async function updateInquiryStatus(id: string, newStatus: string) {
  await checkAdminAuth();
  
  try {
    const { error } = await supabase.from('inquiries').update({ status: newStatus }).eq('id', id);
    if (error) throw error;
    
    revalidatePath("/admin/inquiries");
    return { success: true };
  } catch (error: any) {
    console.error("Error updating inquiry status:", error);
    return { success: false, error: error.message || "Failed to update inquiry status" };
  }
}

export async function updateDistributorStatus(id: string, newStatus: string) {
  await checkAdminAuth();
  
  try {
    const { error } = await supabase.from('users').update({ status: newStatus }).eq('id', id);
    if (error) throw error;

    revalidatePath("/admin/distributors");
    return { success: true };
  } catch (e) {
    return { success: false, error: "Failed to update distributor status." };
  }
}

export async function deleteDistributor(id: string) {
  await checkAdminAuth();
  
  try {
    const { error } = await supabase.from('users').delete().eq('id', id);
    if (error) throw error;

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
    const { error } = await supabase.from('users').update({ status: "PENDING" }).eq('id', id);
    if (error) throw error;

    revalidatePath("/admin/distributors");
    return { success: true };
  } catch (e) {
    return { success: false, error: "Failed to resend invite." };
  }
}

