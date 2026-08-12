"use server";

import { PrismaClient, Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function getBlogArticles(query?: string, category?: string, status?: string) {
  try {
    const where: Prisma.BlogArticleWhereInput = {};
    if (query) {
      where.OR = [
        { title: { contains: query } },
        { slug: { contains: query } },
      ];
    }
    if (category) {
      where.category = category;
    }
    if (status) {
      where.status = status;
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
