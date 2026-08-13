// @ts-nocheck
"use server";

import { createServerClient } from "@/lib/supabase/client";
import { revalidatePath } from "next/cache";

const supabase = createServerClient();

export async function getKnowledgeArticles(query?: string, category?: string, status?: string) {
  try {
    let supabaseQuery = supabase.from('knowledge_articles').select('*').order('created_at', { ascending: false });

    if (query) {
      supabaseQuery = supabaseQuery.or(`title.ilike.%${query}%,excerpt.ilike.%${query}%`);
    }

    if (category) {
      supabaseQuery = supabaseQuery.eq('category', category);
    }

    if (status) {
      supabaseQuery = supabaseQuery.eq('status', status);
    }
    
    const { data: articles, error } = await supabaseQuery as any;
    if (error) throw error;
    
    const mapped = articles.map((a: any) => ({
      ...a,
      coverImage: a.cover_image,
      articleContent: a.article_content,
      readTime: a.read_time,
      publishedAt: a.published_at ? new Date(a.published_at) : null,
      seoTitle: a.seo_title,
      seoDescription: a.seo_description,
      createdAt: new Date(a.created_at)
    }));

    return { success: true, data: mapped };
  } catch (error: any) {
    console.error("Failed to fetch articles:", error);
    return { success: false, error: error.message };
  }
}

export async function getKnowledgeArticleById(id: string) {
  try {
    const { data: article, error } = await supabase.from('knowledge_articles').select('*').eq('id', id).single() as any;
    if (error || !article) throw new Error("Article not found");
    
    const mapped = {
      ...article,
      coverImage: article.cover_image,
      articleContent: article.article_content,
      readTime: article.read_time,
      publishedAt: article.published_at ? new Date(article.published_at) : null,
      seoTitle: article.seo_title,
      seoDescription: article.seo_description,
      createdAt: new Date(article.created_at)
    };
    
    return { success: true, data: mapped };
  } catch (error: any) {
    console.error("Failed to fetch article:", error);
    return { success: false, error: error.message };
  }
}

export async function getKnowledgeArticleBySlug(slug: string) {
  try {
    const { data: article, error } = await supabase
      .from('knowledge_articles')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'PUBLISHED')
      .single() as any;
      
    if (error || !article) return null;
    
    return {
      ...article,
      coverImage: article.cover_image,
      articleContent: article.article_content,
      readTime: article.read_time,
      publishedAt: article.published_at ? new Date(article.published_at) : null,
      seoTitle: article.seo_title,
      seoDescription: article.seo_description,
      createdAt: new Date(article.created_at)
    };
  } catch (error: any) {
    console.error("Failed to fetch article by slug:", error);
    return null;
  }
}

export async function createKnowledgeArticle(data: any) {
  try {
    const insertData: any = { ...data };
    if (data.coverImage !== undefined) { insertData.cover_image = data.coverImage; delete insertData.coverImage; }
    if (data.articleContent !== undefined) { insertData.article_content = data.articleContent; delete insertData.articleContent; }
    if (data.readTime !== undefined) { insertData.read_time = data.readTime; delete insertData.readTime; }
    if (data.publishedAt !== undefined) { insertData.published_at = data.publishedAt; delete insertData.publishedAt; }
    if (data.seoTitle !== undefined) { insertData.seo_title = data.seoTitle; delete insertData.seoTitle; }
    if (data.seoDescription !== undefined) { insertData.seo_description = data.seoDescription; delete insertData.seoDescription; }

    const { data: article, error } = await supabase.from('knowledge_articles').insert(insertData).select().single() as any;
    if (error) throw error;
    
    revalidatePath("/admin/knowledge");
    revalidatePath("/knowledge");
    revalidatePath("/");
    return { success: true, data: article };
  } catch (error: any) {
    console.error("Failed to create article:", error);
    return { success: false, error: error.message };
  }
}

export async function updateKnowledgeArticle(id: string, data: any) {
  try {
    const updateData: any = { ...data };
    if (data.coverImage !== undefined) { updateData.cover_image = data.coverImage; delete updateData.coverImage; }
    if (data.articleContent !== undefined) { updateData.article_content = data.articleContent; delete updateData.articleContent; }
    if (data.readTime !== undefined) { updateData.read_time = data.readTime; delete updateData.readTime; }
    if (data.publishedAt !== undefined) { updateData.published_at = data.publishedAt; delete updateData.publishedAt; }
    if (data.seoTitle !== undefined) { updateData.seo_title = data.seoTitle; delete updateData.seoTitle; }
    if (data.seoDescription !== undefined) { updateData.seo_description = data.seoDescription; delete updateData.seoDescription; }

    const { data: article, error } = await supabase.from('knowledge_articles').update(updateData).eq('id', id).select().single() as any;
    if (error) throw error;
    
    revalidatePath("/admin/knowledge");
    revalidatePath("/knowledge");
    revalidatePath(`/knowledge/${article.slug}`);
    revalidatePath("/");
    return { success: true, data: article };
  } catch (error: any) {
    console.error("Failed to update article:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteKnowledgeArticle(id: string) {
  try {
    const { error } = await supabase.from('knowledge_articles').delete().eq('id', id);
    if (error) throw error;
    
    revalidatePath("/admin/knowledge");
    revalidatePath("/knowledge");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to delete article:", error);
    return { success: false, error: error.message };
  }
}

export async function toggleKnowledgeArticleStatus(id: string, currentStatus: string) {
  try {
    const newStatus = currentStatus === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    const { data: article, error } = await supabase.from('knowledge_articles').update({ status: newStatus } as any).eq('id', id).select().single() as any;
    if (error) throw error;
    
    revalidatePath("/admin/knowledge");
    revalidatePath("/knowledge");
    revalidatePath(`/knowledge/${article.slug}`);
    revalidatePath("/");
    return { success: true, data: article };
  } catch (error: any) {
    console.error("Failed to toggle status:", error);
    return { success: false, error: error.message };
  }
}

