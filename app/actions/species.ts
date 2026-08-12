"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function getSpeciesList() {
  return await prisma.species.findMany({
    orderBy: { sortOrder: 'asc' },
    include: { _count: { select: { products: true } } }
  });
}

export async function getSpeciesById(id: string) {
  return await prisma.species.findUnique({
    where: { id }
  });
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
  const existing = await prisma.species.findUnique({ where: { slug: data.slug } });
  if (existing) {
    throw new Error("A species with this slug already exists.");
  }
  const species = await prisma.species.create({ data });
  revalidatePath('/admin/species');
  revalidatePath('/products');
  return species;
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
    const existing = await prisma.species.findUnique({ where: { slug: data.slug } });
    if (existing && existing.id !== id) {
      throw new Error("Another species with this slug already exists.");
    }
  }
  const species = await prisma.species.update({ where: { id }, data });
  revalidatePath('/admin/species');
  revalidatePath('/products');
  return species;
}

export async function deleteSpecies(id: string) {
  const productsCount = await prisma.product.count({ where: { speciesId: id } });
  if (productsCount > 0) {
    throw new Error("Cannot delete species that has products linked to it.");
  }
  const species = await prisma.species.delete({ where: { id } });
  revalidatePath('/admin/species');
  revalidatePath('/products');
  return species;
}
