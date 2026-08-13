// @ts-nocheck
"use server";

import { createServerClient } from "@/lib/supabase/client";
import { revalidatePath } from "next/cache";

const supabase = createServerClient();

export async function getBlogArticles(query?: string, category?: string, status?: string, year?: string) {
  try {
    let supabaseQuery = supabase.from('blog_articles').select('*').order('created_at', { ascending: false });

    if (query) {
      supabaseQuery = supabaseQuery.or(`title.ilike.%${query}%,slug.ilike.%${query}%`);
    }

    if (category) {
      // Resolve slug to species name for exact matching
      const { data: speciesMatch } = await supabase.from('species')
        .select('name')
        .or(`slug.eq.${category},name.eq.${category}`)
        .limit(1)
        .single();
        
      if (speciesMatch) {
        supabaseQuery = supabaseQuery.eq('category', speciesMatch.name);
      } else {
        supabaseQuery = supabaseQuery.ilike('category', `%${category}%`);
      }
    }

    if (status) {
      supabaseQuery = supabaseQuery.eq('status', status);
    }

    if (year) {
      const startOfYear = `${year}-01-01T00:00:00.000Z`;
      const endOfYear = `${year}-12-31T23:59:59.999Z`;
      supabaseQuery = supabaseQuery.gte('published_at', startOfYear).lte('published_at', endOfYear);
    }
    
    const { data: articles, error } = await supabaseQuery;
    if (error) throw error;
    
    // Map camelCase for frontend
    const mappedArticles = articles.map(a => ({
      ...a,
      publishedAt: a.published_at ? new Date(a.published_at) : null,
      createdAt: new Date(a.created_at),
      coverImage: a.cover_image,
      articleContent: a.article_content
    }));
    
    return { success: true, data: mappedArticles };
  } catch (error: any) {
    console.error("Failed to fetch blog articles:", error);
    return { success: false, error: error.message };
  }
}

export async function getBlogFilterOptions() {
  try {
    const { data: articles, error: err1 } = await supabase
      .from('blog_articles')
      .select('category, published_at')
      .eq('status', 'PUBLISHED');
      
    if (err1) throw err1;
      
    const { data: rawSpecies, error: err2 } = await supabase
      .from('species')
      .select('slug, name')
      .eq('is_active', true);
      
    if (err2) throw err2;

    const categoryNames = new Set<string>();
    const years = new Set<string>();

    articles.forEach(article => {
      if (article.category) categoryNames.add(article.category);
      if (article.published_at) {
        years.add(new Date(article.published_at).getFullYear().toString());
      }
    });
    
    const mappedCategoriesMap = new Map<string, { slug: string, name: string }>();

    categoryNames.forEach(c => {
      const match = rawSpecies.find(s => s.name.toLowerCase() === c.toLowerCase() || s.slug.toLowerCase() === c.toLowerCase());
      if (match) {
        mappedCategoriesMap.set(match.slug, { slug: match.slug, name: match.name });
      } else {
        const fallbackSlug = c.toLowerCase().replace(/\s+/g, '-');
        mappedCategoriesMap.set(fallbackSlug, { slug: fallbackSlug, name: c });
      }
    });

    const mappedCategories = Array.from(mappedCategoriesMap.values()).sort((a, b) => a.name.localeCompare(b.name));

    return {
      success: true,
      data: {
        categories: mappedCategories,
        years: Array.from(years).sort((a, b) => b.localeCompare(a)),
      }
    };
  } catch (error: any) {
    console.error("Failed to fetch blog filter options:", error);
    return { success: false, error: error.message };
  }
}

export async function getBlogArticleById(id: string) {
  try {
    const { data: article, error } = await supabase.from('blog_articles').select('*').eq('id', id).single();
    if (error || !article) throw new Error("Blog article not found");
    
    const mappedArticle = {
      ...article,
      publishedAt: article.published_at ? new Date(article.published_at) : null,
      createdAt: new Date(article.created_at),
      coverImage: article.cover_image,
      articleContent: article.article_content
    };
    
    return { success: true, data: mappedArticle };
  } catch (error: any) {
    console.error("Failed to fetch blog article:", error);
    return { success: false, error: error.message };
  }
}

export async function getBlogArticleBySlug(slug: string) {
  try {
    const { data: article, error } = await supabase
      .from('blog_articles')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'PUBLISHED')
      .single();
      
    if (error || !article) return null;
    
    return {
      ...article,
      publishedAt: article.published_at ? new Date(article.published_at) : null,
      createdAt: new Date(article.created_at),
      coverImage: article.cover_image,
      articleContent: article.article_content
    };
  } catch (error: any) {
    console.error("Failed to fetch blog article by slug:", error);
    return null;
  }
}

export async function createBlogArticle(data: any) {
  try {
    const insertData: any = { ...data };
    if (data.coverImage !== undefined) { insertData.cover_image = data.coverImage; delete insertData.coverImage; }
    if (data.articleContent !== undefined) { insertData.article_content = data.articleContent; delete insertData.articleContent; }
    if (data.publishedAt !== undefined) { insertData.published_at = data.publishedAt; delete insertData.publishedAt; }

    const { data: article, error } = await supabase.from('blog_articles').insert(insertData).select().single();
    if (error) throw error;
    
    revalidatePath("/admin/blog");
    revalidatePath("/blog");
    return { success: true, data: article };
  } catch (error: any) {
    console.error("Failed to create blog article:", error);
    return { success: false, error: error.message };
  }
}

export async function updateBlogArticle(id: string, data: any) {
  try {
    const updateData: any = { ...data };
    if (data.coverImage !== undefined) { updateData.cover_image = data.coverImage; delete updateData.coverImage; }
    if (data.articleContent !== undefined) { updateData.article_content = data.articleContent; delete updateData.articleContent; }
    if (data.publishedAt !== undefined) { updateData.published_at = data.publishedAt; delete updateData.publishedAt; }

    const { data: article, error } = await supabase.from('blog_articles').update(updateData).eq('id', id).select().single();
    if (error) throw error;
    
    revalidatePath("/admin/blog");
    revalidatePath("/blog");
    revalidatePath(`/blog/${article.slug}`);
    return { success: true, data: article };
  } catch (error: any) {
    console.error("Failed to update blog article:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteBlogArticle(id: string) {
  try {
    const { error } = await supabase.from('blog_articles').delete().eq('id', id);
    if (error) throw error;
    
    revalidatePath("/admin/blog");
    revalidatePath("/blog");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to delete blog article:", error);
    return { success: false, error: error.message };
  }
}

export async function toggleBlogArticleStatus(id: string, currentStatus: string) {
  try {
    const newStatus = currentStatus === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    const { data: article, error } = await supabase.from('blog_articles').update({ status: newStatus }).eq('id', id).select().single();
    if (error) throw error;
    
    revalidatePath("/admin/blog");
    revalidatePath("/blog");
    revalidatePath(`/blog/${article.slug}`);
    return { success: true, data: article };
  } catch (error: any) {
    console.error("Failed to toggle status:", error);
    return { success: false, error: error.message };
  }
}

