// @ts-nocheck
"use server";

import { createServerClient } from "@/lib/supabase/client";
import { revalidatePath } from "next/cache";

const supabase = createServerClient();

export async function getNewsEvents(query?: string, type?: string, status?: string) {
  try {
    let supabaseQuery = supabase.from('news_events').select('*').order('created_at', { ascending: false });

    if (query) {
      supabaseQuery = supabaseQuery.or(`title.ilike.%${query}%,slug.ilike.%${query}%`);
    }

    if (type) {
      supabaseQuery = supabaseQuery.eq('type', type);
    }

    if (status) {
      supabaseQuery = supabaseQuery.eq('status', status);
    }
    
    const { data: items, error } = await supabaseQuery as any;
    if (error) throw error;
    
    const mapped = items.map((i: any) => ({
      ...i,
      coverImage: i.cover_image,
      eventDate: i.event_date ? new Date(i.event_date) : null,
      publishedAt: i.published_at ? new Date(i.published_at) : null,
      seoTitle: i.seo_title,
      seoDescription: i.seo_description,
      createdAt: new Date(i.created_at)
    }));

    return { success: true, data: mapped };
  } catch (error: any) {
    console.error("Failed to fetch news & events:", error);
    return { success: false, error: error.message };
  }
}

export async function getNewsEventById(id: string) {
  try {
    const { data: item, error } = await supabase.from('news_events').select('*').eq('id', id).single() as any;
    if (error || !item) throw new Error("News/Event not found");
    
    const mapped = {
      ...item,
      coverImage: item.cover_image,
      eventDate: item.event_date ? new Date(item.event_date) : null,
      publishedAt: item.published_at ? new Date(item.published_at) : null,
      seoTitle: item.seo_title,
      seoDescription: item.seo_description,
      createdAt: new Date(item.created_at)
    };
    
    return { success: true, data: mapped };
  } catch (error: any) {
    console.error("Failed to fetch news/event:", error);
    return { success: false, error: error.message };
  }
}

export async function getNewsEventBySlug(slug: string) {
  try {
    const { data: item, error } = await supabase
      .from('news_events')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'PUBLISHED')
      .single() as any;
      
    if (error || !item) return null;
    
    return {
      ...item,
      coverImage: item.cover_image,
      eventDate: item.event_date ? new Date(item.event_date) : null,
      publishedAt: item.published_at ? new Date(item.published_at) : null,
      seoTitle: item.seo_title,
      seoDescription: item.seo_description,
      createdAt: new Date(item.created_at)
    };
  } catch (error: any) {
    console.error("Failed to fetch news/event by slug:", error);
    return null;
  }
}

export async function createNewsEvent(data: any) {
  try {
    const insertData: any = { ...data };
    if (data.coverImage !== undefined) { insertData.cover_image = data.coverImage; delete insertData.coverImage; }
    if (data.eventDate !== undefined) { insertData.event_date = data.eventDate; delete insertData.eventDate; }
    if (data.publishedAt !== undefined) { insertData.published_at = data.publishedAt; delete insertData.publishedAt; }
    if (data.seoTitle !== undefined) { insertData.seo_title = data.seoTitle; delete insertData.seoTitle; }
    if (data.seoDescription !== undefined) { insertData.seo_description = data.seoDescription; delete insertData.seoDescription; }

    const { data: item, error } = await supabase.from('news_events').insert(insertData).select().single() as any;
    if (error) throw error;
    
    revalidatePath("/admin/news-events");
    revalidatePath("/news-events");
    return { success: true, data: item };
  } catch (error: any) {
    console.error("Failed to create news/event:", error);
    return { success: false, error: error.message };
  }
}

export async function updateNewsEvent(id: string, data: any) {
  try {
    const updateData: any = { ...data };
    if (data.coverImage !== undefined) { updateData.cover_image = data.coverImage; delete updateData.coverImage; }
    if (data.eventDate !== undefined) { updateData.event_date = data.eventDate; delete updateData.eventDate; }
    if (data.publishedAt !== undefined) { updateData.published_at = data.publishedAt; delete updateData.publishedAt; }
    if (data.seoTitle !== undefined) { updateData.seo_title = data.seoTitle; delete updateData.seoTitle; }
    if (data.seoDescription !== undefined) { updateData.seo_description = data.seoDescription; delete updateData.seoDescription; }

    const { data: item, error } = await supabase.from('news_events').update(updateData).eq('id', id).select().single() as any;
    if (error) throw error;
    
    revalidatePath("/admin/news-events");
    revalidatePath("/news-events");
    revalidatePath(`/news-events/${item.slug}`);
    return { success: true, data: item };
  } catch (error: any) {
    console.error("Failed to update news/event:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteNewsEvent(id: string) {
  try {
    const { error } = await supabase.from('news_events').delete().eq('id', id);
    if (error) throw error;
    
    revalidatePath("/admin/news-events");
    revalidatePath("/news-events");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to delete news/event:", error);
    return { success: false, error: error.message };
  }
}

export async function toggleNewsEventStatus(id: string, currentStatus: string) {
  try {
    const newStatus = currentStatus === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    const { data: item, error } = await supabase.from('news_events').update({ status: newStatus } as any).eq('id', id).select().single() as any;
    if (error) throw error;
    
    revalidatePath("/admin/news-events");
    revalidatePath("/news-events");
    revalidatePath(`/news-events/${item.slug}`);
    return { success: true, data: item };
  } catch (error: any) {
    console.error("Failed to toggle status:", error);
    return { success: false, error: error.message };
  }
}

