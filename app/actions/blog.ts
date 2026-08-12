"use server";

import { PrismaClient, Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function getBlogArticles(query?: string, category?: string, status?: string, year?: string) {
  try {
    const where: Prisma.BlogArticleWhereInput = {};
    if (query) {
      where.OR = [
        { title: { contains: query } },
        { slug: { contains: query } },
      ];
    }
    if (category) {
      // Resolve slug to species name for exact matching
      const speciesMatch = await prisma.species.findFirst({
        where: {
          OR: [
            { slug: category },
            { name: category }
          ]
        }
      });
      if (speciesMatch) {
        where.category = speciesMatch.name;
      } else {
        where.category = { contains: category };
      }
    }
    if (status) {
      where.status = status;
    }
    if (year) {
      const startOfYear = new Date(`${year}-01-01T00:00:00.000Z`);
      const endOfYear = new Date(`${year}-12-31T23:59:59.999Z`);
      where.publishedAt = {
        gte: startOfYear,
        lte: endOfYear,
      };
    }
    
    const articles = await prisma.blogArticle.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
    return { success: true, data: articles };
  } catch (error: any) {
    console.error("Failed to fetch blog articles:", error);
    return { success: false, error: error.message };
  }
}

export async function getBlogFilterOptions() {
  try {
    const [articles, rawSpecies] = await Promise.all([
      prisma.blogArticle.findMany({
        where: { status: "PUBLISHED" },
        select: {
          category: true,
          publishedAt: true,
        }
      }),
      prisma.species.findMany({
        where: { isActive: true },
        select: { slug: true, name: true }
      })
    ]);

    const categoryNames = new Set<string>();
    const years = new Set<string>();

    articles.forEach(article => {
      if (article.category) categoryNames.add(article.category);
      if (article.publishedAt) years.add(article.publishedAt.getFullYear().toString());
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
    const article = await prisma.blogArticle.findUnique({
      where: { id },
    });
    if (!article) throw new Error("Blog article not found");
    return { success: true, data: article };
  } catch (error: any) {
    console.error("Failed to fetch blog article:", error);
    return { success: false, error: error.message };
  }
}

export async function getBlogArticleBySlug(slug: string) {
  try {
    const article = await prisma.blogArticle.findUnique({
      where: { slug, status: "PUBLISHED" },
    });
    if (!article) return null;
    return article;
  } catch (error: any) {
    console.error("Failed to fetch blog article by slug:", error);
    return null;
  }
}

export async function createBlogArticle(data: any) {
  try {
    const article = await prisma.blogArticle.create({
      data,
    });
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
    const article = await prisma.blogArticle.update({
      where: { id },
      data,
    });
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
    const article = await prisma.blogArticle.delete({
      where: { id },
    });
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
    const article = await prisma.blogArticle.update({
      where: { id },
      data: { status: newStatus },
    });
    revalidatePath("/admin/blog");
    revalidatePath("/blog");
    revalidatePath(`/blog/${article.slug}`);
    return { success: true, data: article };
  } catch (error: any) {
    console.error("Failed to toggle status:", error);
    return { success: false, error: error.message };
  }
}
