"use server";

import { PrismaClient, Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function getNewsEvents(query?: string, type?: string, status?: string) {
  try {
    const where: Prisma.NewsEventWhereInput = {};
    if (query) {
      where.OR = [
        { title: { contains: query } },
        { slug: { contains: query } },
      ];
    }
    if (type) {
      where.type = type;
    }
    if (status) {
      where.status = status;
    }
    
    const items = await prisma.newsEvent.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
    return { success: true, data: items };
  } catch (error: any) {
    console.error("Failed to fetch news & events:", error);
    return { success: false, error: error.message };
  }
}

export async function getNewsEventById(id: string) {
  try {
    const item = await prisma.newsEvent.findUnique({
      where: { id },
    });
    if (!item) throw new Error("News/Event not found");
    return { success: true, data: item };
  } catch (error: any) {
    console.error("Failed to fetch news/event:", error);
    return { success: false, error: error.message };
  }
}

export async function getNewsEventBySlug(slug: string) {
  try {
    const item = await prisma.newsEvent.findUnique({
      where: { slug, status: "PUBLISHED" },
    });
    if (!item) return null;
    return item;
  } catch (error: any) {
    console.error("Failed to fetch news/event by slug:", error);
    return null;
  }
}

export async function createNewsEvent(data: any) {
  try {
    const item = await prisma.newsEvent.create({
      data,
    });
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
    const item = await prisma.newsEvent.update({
      where: { id },
      data,
    });
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
    const item = await prisma.newsEvent.delete({
      where: { id },
    });
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
    const item = await prisma.newsEvent.update({
      where: { id },
      data: { status: newStatus },
    });
    revalidatePath("/admin/news-events");
    revalidatePath("/news-events");
    revalidatePath(`/news-events/${item.slug}`);
    return { success: true, data: item };
  } catch (error: any) {
    console.error("Failed to toggle status:", error);
    return { success: false, error: error.message };
  }
}
