"use server";

import { PrismaClient, Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function getResearchArticles(query?: string, category?: string, status?: string) {
  try {
    const where: Prisma.ResearchArticleWhereInput = {};
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
    
    const articles = await prisma.researchArticle.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
    return { success: true, data: articles };
  } catch (error: any) {
    console.error("Failed to fetch research articles:", error);
    return { success: false, error: error.message };
  }
}

export async function getResearchArticleById(id: string) {
  try {
    const article = await prisma.researchArticle.findUnique({
      where: { id },
    });
    if (!article) throw new Error("Research article not found");
    return { success: true, data: article };
  } catch (error: any) {
    console.error("Failed to fetch research article:", error);
    return { success: false, error: error.message };
  }
}

export async function getResearchArticleBySlug(slug: string) {
  try {
    const article = await prisma.researchArticle.findUnique({
      where: { slug, status: "PUBLISHED" },
    });
    if (!article) return null;
    return article;
  } catch (error: any) {
    console.error("Failed to fetch research article by slug:", error);
    return null;
  }
}

export async function createResearchArticle(data: any) {
  try {
    const article = await prisma.researchArticle.create({
      data,
    });
    revalidatePath("/admin/research");
    revalidatePath("/research");
    return { success: true, data: article };
  } catch (error: any) {
    console.error("Failed to create research article:", error);
    return { success: false, error: error.message };
  }
}

export async function updateResearchArticle(id: string, data: any) {
  try {
    const article = await prisma.researchArticle.update({
      where: { id },
      data,
    });
    revalidatePath("/admin/research");
    revalidatePath("/research");
    revalidatePath(`/research/${article.slug}`);
    return { success: true, data: article };
  } catch (error: any) {
    console.error("Failed to update research article:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteResearchArticle(id: string) {
  try {
    const article = await prisma.researchArticle.delete({
      where: { id },
    });
    revalidatePath("/admin/research");
    revalidatePath("/research");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to delete research article:", error);
    return { success: false, error: error.message };
  }
}

export async function toggleResearchArticleStatus(id: string, currentStatus: string) {
  try {
    const newStatus = currentStatus === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    const article = await prisma.researchArticle.update({
      where: { id },
      data: { status: newStatus },
    });
    revalidatePath("/admin/research");
    revalidatePath("/research");
    revalidatePath(`/research/${article.slug}`);
    return { success: true, data: article };
  } catch (error: any) {
    console.error("Failed to toggle status:", error);
    return { success: false, error: error.message };
  }
}
