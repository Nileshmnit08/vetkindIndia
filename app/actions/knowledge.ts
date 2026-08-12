"use server";

import { PrismaClient, Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function getKnowledgeArticles(query?: string, category?: string, status?: string) {
  try {
    const where: Prisma.KnowledgeArticleWhereInput = {};
    if (query) {
      where.OR = [
        { title: { contains: query } },
        { excerpt: { contains: query } },
      ];
    }
    if (category) {
      where.category = category;
    }
    if (status) {
      where.status = status;
    }
    
    const articles = await prisma.knowledgeArticle.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
    return { success: true, data: articles };
  } catch (error: any) {
    console.error("Failed to fetch articles:", error);
    return { success: false, error: error.message };
  }
}

export async function getKnowledgeArticleById(id: string) {
  try {
    const article = await prisma.knowledgeArticle.findUnique({
      where: { id },
    });
    if (!article) throw new Error("Article not found");
    return { success: true, data: article };
  } catch (error: any) {
    console.error("Failed to fetch article:", error);
    return { success: false, error: error.message };
  }
}

export async function getKnowledgeArticleBySlug(slug: string) {
  try {
    const article = await prisma.knowledgeArticle.findUnique({
      where: { slug, status: "PUBLISHED" },
    });
    if (!article) return null;
    return article;
  } catch (error: any) {
    console.error("Failed to fetch article by slug:", error);
    return null;
  }
}

export async function createKnowledgeArticle(data: any) {
  try {
    const article = await prisma.knowledgeArticle.create({
      data,
    });
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
    const article = await prisma.knowledgeArticle.update({
      where: { id },
      data,
    });
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
    const article = await prisma.knowledgeArticle.delete({
      where: { id },
    });
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
    const article = await prisma.knowledgeArticle.update({
      where: { id },
      data: { status: newStatus },
    });
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
