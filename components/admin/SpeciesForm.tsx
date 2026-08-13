"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSpecies, updateSpecies, deleteSpecies } from "@/app/actions/species";
import { Save, Trash2, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

export function SpeciesForm({ initialData }: { initialData?: any | null }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      slug: formData.get("slug") as string,
      description: formData.get("description") as string,
      image: formData.get("image") as string,
      featured: formData.get("featured") === "on",
      isActive: formData.get("isActive") === "on",
      sortOrder: parseInt((formData.get("sortOrder") as string) || "0"),
    };

    try {
      if (initialData?.id) {
        await updateSpecies(initialData.id, data);
      } else {
        await createSpecies(data);
      }
      router.push("/admin/species");
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!initialData?.id || !confirm("Are you sure you want to delete this species?")) return;
    setIsDeleting(true);
    try {
      await deleteSpecies(initialData.id);
      router.push("/admin/species");
    } catch (err: any) {
      setError(err.message || "Failed to delete species.");
      setIsDeleting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/species" className="p-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
            {initialData ? "Edit Species" : "Create Species"}
          </h1>
        </div>
        <div className="flex items-center gap-4">
          {initialData && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:border-red-900/50 dark:bg-zinc-900 dark:hover:bg-red-900/20 disabled:opacity-50"
            >
              {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              Delete
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save Changes
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-red-50 text-red-600 text-sm">
          {error}
        </div>
      )}

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 space-y-6">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">General Information</h2>
            
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Name *</label>
              <input
                id="name"
                name="name"
                required
                defaultValue={initialData?.name || ""}
                className="w-full h-10 px-3 rounded-md border border-zinc-300 dark:border-zinc-700 bg-transparent text-zinc-900 dark:text-white focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="slug" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Slug *</label>
              <input
                id="slug"
                name="slug"
                required
                defaultValue={initialData?.slug || ""}
                className="w-full h-10 px-3 rounded-md border border-zinc-300 dark:border-zinc-700 bg-transparent text-zinc-900 dark:text-white focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Description</label>
              <textarea
                id="description"
                name="description"
                rows={4}
                defaultValue={initialData?.description || ""}
                className="w-full p-3 rounded-md border border-zinc-300 dark:border-zinc-700 bg-transparent text-zinc-900 dark:text-white focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 space-y-6">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Media & Display</h2>

            <div className="space-y-2">
              <label htmlFor="image" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Image URL</label>
              <input
                id="image"
                name="image"
                defaultValue={initialData?.image || ""}
                placeholder="https://images.unsplash.com/..."
                className="w-full h-10 px-3 rounded-md border border-zinc-300 dark:border-zinc-700 bg-transparent text-zinc-900 dark:text-white focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="sortOrder" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Sort Order</label>
              <input
                id="sortOrder"
                name="sortOrder"
                type="number"
                defaultValue={initialData?.sortOrder ?? 0}
                className="w-full h-10 px-3 rounded-md border border-zinc-300 dark:border-zinc-700 bg-transparent text-zinc-900 dark:text-white focus:ring-2 focus:ring-green-500"
              />
            </div>

            <label className="flex items-center justify-between p-4 rounded-lg border border-zinc-200 dark:border-zinc-800">
              <div>
                <p className="font-medium text-zinc-900 dark:text-white">Is Active</p>
                <p className="text-xs text-zinc-500">Visible in admin filters</p>
              </div>
              <input
                type="checkbox"
                name="isActive"
                defaultChecked={initialData ? initialData.isActive : true}
                className="h-5 w-5 rounded border-zinc-300 text-green-600 focus:ring-green-500"
              />
            </label>

            <label className="flex items-center justify-between p-4 rounded-lg border border-zinc-200 dark:border-zinc-800">
              <div>
                <p className="font-medium text-zinc-900 dark:text-white">Featured</p>
                <p className="text-xs text-zinc-500">Show in storefront grid</p>
              </div>
              <input
                type="checkbox"
                name="featured"
                defaultChecked={initialData ? initialData.featured : false}
                className="h-5 w-5 rounded border-zinc-300 text-green-600 focus:ring-green-500"
              />
            </label>
          </div>
        </div>
      </div>
    </form>
  );
}
