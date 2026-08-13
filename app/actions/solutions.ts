// @ts-nocheck
"use server";

import { createServerClient } from "@/lib/supabase/client";
import { revalidatePath } from "next/cache";

const supabase = createServerClient();

export async function getSolutions(query?: string, status?: string) {
  try {
    let supabaseQuery = supabase.from('solutions_admin').select('*').order('sort_order', { ascending: true });

    if (query) {
      supabaseQuery = supabaseQuery.or(`title.ilike.%${query}%,slug.ilike.%${query}%`);
    }

    if (status) {
      supabaseQuery = supabaseQuery.eq('status', status);
    }
    
    const { data: solutions, error } = await supabaseQuery as any;
    if (error) throw error;
    
    const mapped = solutions.map((s: any) => ({
      ...s,
      shortSummary: s.short_summary,
      fullContent: s.full_content,
      heroImage: s.hero_image,
      iconName: s.icon_name,
      speciesTags: s.species_tags,
      relatedProducts: s.related_products,
      sortOrder: s.sort_order,
      seoTitle: s.seo_title,
      seoDescription: s.seo_description,
      createdAt: new Date(s.created_at)
    }));
    
    return { success: true, data: mapped };
  } catch (error: any) {
    console.error("Failed to fetch solutions:", error);
    return { success: false, error: error.message };
  }
}

export async function getSolutionById(id: string) {
  try {
    const { data: solution, error } = await supabase.from('solutions_admin').select('*').eq('id', id).single() as any;
    if (error || !solution) throw new Error("Solution not found");
    
    const mapped = {
      ...solution,
      shortSummary: solution.short_summary,
      fullContent: solution.full_content,
      heroImage: solution.hero_image,
      iconName: solution.icon_name,
      speciesTags: solution.species_tags,
      relatedProducts: solution.related_products,
      sortOrder: solution.sort_order,
      seoTitle: solution.seo_title,
      seoDescription: solution.seo_description,
      createdAt: new Date(solution.created_at)
    };
    
    return { success: true, data: mapped };
  } catch (error: any) {
    console.error("Failed to fetch solution:", error);
    return { success: false, error: error.message };
  }
}

export async function getSolutionBySlug(slug: string) {
  try {
    const { data: solution, error } = await supabase
      .from('solutions_admin')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'PUBLISHED')
      .single() as any;
      
    if (error || !solution) return null;
    
    return {
      ...solution,
      shortSummary: solution.short_summary,
      fullContent: solution.full_content,
      heroImage: solution.hero_image,
      iconName: solution.icon_name,
      speciesTags: solution.species_tags,
      relatedProducts: solution.related_products,
      sortOrder: solution.sort_order,
      seoTitle: solution.seo_title,
      seoDescription: solution.seo_description,
      createdAt: new Date(solution.created_at)
    };
  } catch (error: any) {
    console.error("Failed to fetch solution by slug:", error);
    return null;
  }
}

export async function createSolution(data: any) {
  try {
    const insertData: any = { ...data };
    if (data.shortSummary !== undefined) { insertData.short_summary = data.shortSummary; delete insertData.shortSummary; }
    if (data.fullContent !== undefined) { insertData.full_content = data.fullContent; delete insertData.fullContent; }
    if (data.heroImage !== undefined) { insertData.hero_image = data.heroImage; delete insertData.heroImage; }
    if (data.iconName !== undefined) { insertData.icon_name = data.iconName; delete insertData.iconName; }
    if (data.speciesTags !== undefined) { insertData.species_tags = data.speciesTags; delete insertData.speciesTags; }
    if (data.relatedProducts !== undefined) { insertData.related_products = data.relatedProducts; delete insertData.relatedProducts; }
    if (data.sortOrder !== undefined) { insertData.sort_order = data.sortOrder; delete insertData.sortOrder; }
    if (data.seoTitle !== undefined) { insertData.seo_title = data.seoTitle; delete insertData.seoTitle; }
    if (data.seoDescription !== undefined) { insertData.seo_description = data.seoDescription; delete insertData.seoDescription; }

    const { data: solution, error } = await supabase.from('solutions_admin').insert(insertData).select().single() as any;
    if (error) throw error;
    
    revalidatePath("/admin/solutions");
    revalidatePath("/solutions");
    revalidatePath("/");
    return { success: true, data: solution };
  } catch (error: any) {
    console.error("Failed to create solution:", error);
    return { success: false, error: error.message };
  }
}

export async function updateSolution(id: string, data: any) {
  try {
    const updateData: any = { ...data };
    if (data.shortSummary !== undefined) { updateData.short_summary = data.shortSummary; delete updateData.shortSummary; }
    if (data.fullContent !== undefined) { updateData.full_content = data.fullContent; delete updateData.fullContent; }
    if (data.heroImage !== undefined) { updateData.hero_image = data.heroImage; delete updateData.heroImage; }
    if (data.iconName !== undefined) { updateData.icon_name = data.iconName; delete updateData.iconName; }
    if (data.speciesTags !== undefined) { updateData.species_tags = data.speciesTags; delete updateData.speciesTags; }
    if (data.relatedProducts !== undefined) { updateData.related_products = data.relatedProducts; delete updateData.relatedProducts; }
    if (data.sortOrder !== undefined) { updateData.sort_order = data.sortOrder; delete updateData.sortOrder; }
    if (data.seoTitle !== undefined) { updateData.seo_title = data.seoTitle; delete updateData.seoTitle; }
    if (data.seoDescription !== undefined) { updateData.seo_description = data.seoDescription; delete updateData.seoDescription; }

    const { data: solution, error } = await supabase.from('solutions_admin').update(updateData).eq('id', id).select().single() as any;
    if (error) throw error;
    
    revalidatePath("/admin/solutions");
    revalidatePath("/solutions");
    revalidatePath(`/solutions/${solution.slug}`);
    revalidatePath("/");
    return { success: true, data: solution };
  } catch (error: any) {
    console.error("Failed to update solution:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteSolution(id: string) {
  try {
    const { error } = await supabase.from('solutions_admin').delete().eq('id', id);
    if (error) throw error;
    
    revalidatePath("/admin/solutions");
    revalidatePath("/solutions");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to delete solution:", error);
    return { success: false, error: error.message };
  }
}

export async function toggleSolutionStatus(id: string, currentStatus: string) {
  try {
    const newStatus = currentStatus === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    const { data: solution, error } = await supabase.from('solutions_admin').update({ status: newStatus } as any).eq('id', id).select().single() as any;
    if (error) throw error;
    
    revalidatePath("/admin/solutions");
    revalidatePath("/solutions");
    revalidatePath(`/solutions/${solution.slug}`);
    revalidatePath("/");
    return { success: true, data: solution };
  } catch (error: any) {
    console.error("Failed to toggle status:", error);
    return { success: false, error: error.message };
  }
}

