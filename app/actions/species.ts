// @ts-nocheck
"use server";

import { createServerClient } from "@/lib/supabase/client";
import { revalidatePath } from "next/cache";

const supabase = createServerClient();

export async function getSpeciesList() {
  const { data, error } = await supabase
    .from('species')
    .select('*, products(count)')
    .order('sort_order', { ascending: true }) as any;
    
  if (error) throw error;
  
  // Transform count format to match expected structure if needed
  return data.map((item: any) => ({
    ...item,
    sortOrder: item.sort_order,
    isActive: item.is_active,
    _count: { products: item.products?.[0]?.count || 0 }
  }));
}

export async function getSpeciesById(id: string) {
  const { data, error } = await supabase
    .from('species')
    .select('*')
    .eq('id', id)
    .single() as any;
    
  if (error) return null;
  
  if (data) {
    return {
      ...data,
      sortOrder: data.sort_order,
      isActive: data.is_active
    };
  }
  return data;
}

export async function createSpecies(data: {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  featured: boolean;
  isActive: boolean;
  sortOrder: number;
}) {
  const { data: existing } = await supabase.from('species').select('id').eq('slug', data.slug).single() as any;
  if (existing) {
    throw new Error("A species with this slug already exists.");
  }
  
  const { data: species, error } = await supabase.from('species').insert({
    name: data.name,
    slug: data.slug,
    description: data.description,
    image: data.image,
    featured: data.featured,
    is_active: data.isActive,
    sort_order: data.sortOrder,
  }).select().single() as any;
  
  if (error) throw error;
  
  revalidatePath('/admin/species');
  revalidatePath('/products');
  return { ...species, sortOrder: species.sort_order, isActive: species.is_active };
}

export async function updateSpecies(id: string, data: {
  name?: string;
  slug?: string;
  description?: string;
  image?: string;
  featured?: boolean;
  isActive?: boolean;
  sortOrder?: number;
}) {
  if (data.slug) {
    const { data: existing } = await supabase.from('species').select('id').eq('slug', data.slug).single() as any;
    if (existing && existing.id !== id) {
      throw new Error("Another species with this slug already exists.");
    }
  }
  
  const updateData: any = { ...data };
  if (data.isActive !== undefined) updateData.is_active = data.isActive;
  if (data.sortOrder !== undefined) updateData.sort_order = data.sortOrder;
  delete updateData.isActive;
  delete updateData.sortOrder;

  const { data: species, error } = await supabase.from('species').update(updateData).eq('id', id).select().single() as any;
  if (error) throw error;
  
  revalidatePath('/admin/species');
  revalidatePath('/products');
  return { ...species, sortOrder: species.sort_order, isActive: species.is_active };
}

export async function deleteSpecies(id: string) {
  const { count } = await supabase.from('products').select('*', { count: 'exact', head: true }).eq('species_id', id) as any;
  if (count && count > 0) {
    throw new Error("Cannot delete species that has products linked to it.");
  }
  const { data: species, error } = await supabase.from('species').delete().eq('id', id).select().single() as any;
  if (error) throw error;
  
  revalidatePath('/admin/species');
  revalidatePath('/products');
  return species;
}

