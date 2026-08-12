"use server";

import { PrismaClient, Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function getSolutions(query?: string, status?: string) {
  try {
    const where: Prisma.SolutionWhereInput = {};
    if (query) {
      where.OR = [
        { title: { contains: query } },
        { slug: { contains: query } },
      ];
    }
    if (status) {
      where.status = status;
    }
    
    const solutions = await prisma.solution.findMany({
      where,
      orderBy: { sortOrder: 'asc' },
    });
    return { success: true, data: solutions };
  } catch (error: any) {
    console.error("Failed to fetch solutions:", error);
    return { success: false, error: error.message };
  }
}

export async function getSolutionById(id: string) {
  try {
    const solution = await prisma.solution.findUnique({
      where: { id },
    });
    if (!solution) throw new Error("Solution not found");
    return { success: true, data: solution };
  } catch (error: any) {
    console.error("Failed to fetch solution:", error);
    return { success: false, error: error.message };
  }
}

export async function getSolutionBySlug(slug: string) {
  try {
    const solution = await prisma.solution.findUnique({
      where: { slug, status: "PUBLISHED" },
    });
    if (!solution) return null;
    return solution;
  } catch (error: any) {
    console.error("Failed to fetch solution by slug:", error);
    return null;
  }
}

export async function createSolution(data: any) {
  try {
    const solution = await prisma.solution.create({
      data,
    });
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
    const solution = await prisma.solution.update({
      where: { id },
      data,
    });
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
    const solution = await prisma.solution.delete({
      where: { id },
    });
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
    const solution = await prisma.solution.update({
      where: { id },
      data: { status: newStatus },
    });
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
