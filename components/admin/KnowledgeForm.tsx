"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createKnowledgeArticle, updateKnowledgeArticle } from "@/app/actions/knowledge";
import { Loader2 } from "lucide-react";

interface KnowledgeFormProps {
  initialData?: any;
}

export function KnowledgeForm({ initialData }: KnowledgeFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    
    // Parse publishedAt date
    const publishedAtStr = formData.get("publishedAt") as string;
    const publishedAt = publishedAtStr ? new Date(publishedAtStr).toISOString() : null;

    const data = {
      title: formData.get("title") as string,
      slug: formData.get("slug") as string,
      category: formData.get("category") as string,
      excerpt: formData.get("excerpt") as string,
      articleContent: formData.get("articleContent") as string,
      coverImage: formData.get("coverImage") as string,
      author: formData.get("author") as string,
      readTime: formData.get("readTime") as string,
      publishedAt: publishedAt,
      featured: formData.get("featured") === "on",
      status: formData.get("status") as string,
      seoTitle: formData.get("seoTitle") as string,
      seoDescription: formData.get("seoDescription") as string,
    };

    let result;
    if (initialData?.id) {
      result = await updateKnowledgeArticle(initialData.id, data);
    } else {
      result = await createKnowledgeArticle(data);
    }

    if (result.success) {
      router.push("/admin/knowledge");
      router.refresh();
    } else {
      setError(result.error || "An error occurred while saving.");
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 divide-y divide-zinc-200 dark:divide-zinc-800">
      <div className="space-y-8 divide-y divide-zinc-200 dark:divide-zinc-800 sm:space-y-5">
        <div className="space-y-6 sm:space-y-5">
          <div>
            <h3 className="text-base font-semibold leading-6 text-zinc-900 dark:text-white">
              Article Information
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-zinc-500 dark:text-zinc-400">
              Set up the content for this knowledge article.
            </p>
          </div>

          <div className="space-y-6 sm:space-y-5">
            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
              <label htmlFor="title" className="block text-sm font-medium leading-6 text-zinc-900 dark:text-zinc-300 sm:pt-1.5">
                Title
              </label>
              <div className="mt-2 sm:col-span-2 sm:mt-0">
                <input
                  type="text"
                  name="title"
                  id="title"
                  required
                  defaultValue={initialData?.title}
                  className="block w-full rounded-md border-0 py-1.5 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:max-w-xl sm:text-sm sm:leading-6 dark:bg-zinc-800 dark:text-zinc-100 dark:ring-zinc-700"
                />
              </div>
            </div>

            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
              <label htmlFor="slug" className="block text-sm font-medium leading-6 text-zinc-900 dark:text-zinc-300 sm:pt-1.5">
                Slug (URL)
              </label>
              <div className="mt-2 sm:col-span-2 sm:mt-0">
                <input
                  type="text"
                  name="slug"
                  id="slug"
                  required
                  defaultValue={initialData?.slug}
                  className="block w-full rounded-md border-0 py-1.5 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:max-w-xl sm:text-sm sm:leading-6 dark:bg-zinc-800 dark:text-zinc-100 dark:ring-zinc-700"
                />
              </div>
            </div>

            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
              <label htmlFor="category" className="block text-sm font-medium leading-6 text-zinc-900 dark:text-zinc-300 sm:pt-1.5">
                Category
              </label>
              <div className="mt-2 sm:col-span-2 sm:mt-0">
                <input
                  type="text"
                  name="category"
                  id="category"
                  placeholder="e.g. Dairy nutrition"
                  defaultValue={initialData?.category}
                  className="block w-full rounded-md border-0 py-1.5 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:max-w-xl sm:text-sm sm:leading-6 dark:bg-zinc-800 dark:text-zinc-100 dark:ring-zinc-700"
                />
              </div>
            </div>

            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
              <label htmlFor="excerpt" className="block text-sm font-medium leading-6 text-zinc-900 dark:text-zinc-300 sm:pt-1.5">
                Excerpt
              </label>
              <div className="mt-2 sm:col-span-2 sm:mt-0">
                <textarea
                  id="excerpt"
                  name="excerpt"
                  rows={3}
                  defaultValue={initialData?.excerpt}
                  className="block w-full rounded-md border-0 py-1.5 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:max-w-xl sm:text-sm sm:leading-6 dark:bg-zinc-800 dark:text-zinc-100 dark:ring-zinc-700"
                />
              </div>
            </div>

            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
              <label htmlFor="articleContent" className="block text-sm font-medium leading-6 text-zinc-900 dark:text-zinc-300 sm:pt-1.5">
                Article Content
              </label>
              <div className="mt-2 sm:col-span-2 sm:mt-0">
                <textarea
                  id="articleContent"
                  name="articleContent"
                  rows={15}
                  defaultValue={initialData?.articleContent}
                  className="block w-full rounded-md border-0 py-1.5 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6 dark:bg-zinc-800 dark:text-zinc-100 dark:ring-zinc-700"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 sm:pt-10">
          <div>
            <h3 className="text-base font-semibold leading-6 text-zinc-900 dark:text-white">
              Meta & Media
            </h3>
          </div>
          <div className="space-y-6 sm:space-y-5 mt-6">
            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
              <label htmlFor="coverImage" className="block text-sm font-medium leading-6 text-zinc-900 dark:text-zinc-300 sm:pt-1.5">
                Cover Image URL
              </label>
              <div className="mt-2 sm:col-span-2 sm:mt-0">
                <input
                  type="text"
                  name="coverImage"
                  id="coverImage"
                  defaultValue={initialData?.coverImage}
                  className="block w-full rounded-md border-0 py-1.5 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:max-w-xl sm:text-sm sm:leading-6 dark:bg-zinc-800 dark:text-zinc-100 dark:ring-zinc-700"
                />
              </div>
            </div>

            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
              <label htmlFor="author" className="block text-sm font-medium leading-6 text-zinc-900 dark:text-zinc-300 sm:pt-1.5">
                Author
              </label>
              <div className="mt-2 sm:col-span-2 sm:mt-0">
                <input
                  type="text"
                  name="author"
                  id="author"
                  defaultValue={initialData?.author}
                  className="block w-full rounded-md border-0 py-1.5 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:max-w-xs sm:text-sm sm:leading-6 dark:bg-zinc-800 dark:text-zinc-100 dark:ring-zinc-700"
                />
              </div>
            </div>

            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
              <label htmlFor="readTime" className="block text-sm font-medium leading-6 text-zinc-900 dark:text-zinc-300 sm:pt-1.5">
                Read Time
              </label>
              <div className="mt-2 sm:col-span-2 sm:mt-0">
                <input
                  type="text"
                  name="readTime"
                  id="readTime"
                  placeholder="e.g. 5 min read"
                  defaultValue={initialData?.readTime}
                  className="block w-full rounded-md border-0 py-1.5 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:max-w-xs sm:text-sm sm:leading-6 dark:bg-zinc-800 dark:text-zinc-100 dark:ring-zinc-700"
                />
              </div>
            </div>

            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
              <label htmlFor="publishedAt" className="block text-sm font-medium leading-6 text-zinc-900 dark:text-zinc-300 sm:pt-1.5">
                Published Date
              </label>
              <div className="mt-2 sm:col-span-2 sm:mt-0">
                <input
                  type="date"
                  name="publishedAt"
                  id="publishedAt"
                  defaultValue={initialData?.publishedAt ? new Date(initialData.publishedAt).toISOString().split('T')[0] : ''}
                  className="block w-full rounded-md border-0 py-1.5 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:max-w-xs sm:text-sm sm:leading-6 dark:bg-zinc-800 dark:text-zinc-100 dark:ring-zinc-700"
                />
              </div>
            </div>

            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
              <div className="sm:col-span-3">
                <div className="flex items-center gap-x-3">
                  <div className="flex h-6 items-center">
                    <input
                      id="featured"
                      name="featured"
                      type="checkbox"
                      defaultChecked={initialData?.featured}
                      className="h-4 w-4 rounded border-zinc-300 text-green-600 focus:ring-green-600 dark:border-zinc-700 dark:bg-zinc-800 dark:focus:ring-green-600"
                    />
                  </div>
                  <label htmlFor="featured" className="text-sm font-medium leading-6 text-zinc-900 dark:text-zinc-300">
                    Featured Article
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 sm:pt-10">
          <div>
            <h3 className="text-base font-semibold leading-6 text-zinc-900 dark:text-white">
              SEO & Status
            </h3>
          </div>
          <div className="space-y-6 sm:space-y-5 mt-6">
            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
              <label htmlFor="seoTitle" className="block text-sm font-medium leading-6 text-zinc-900 dark:text-zinc-300 sm:pt-1.5">
                SEO Title
              </label>
              <div className="mt-2 sm:col-span-2 sm:mt-0">
                <input
                  type="text"
                  name="seoTitle"
                  id="seoTitle"
                  defaultValue={initialData?.seoTitle}
                  className="block w-full rounded-md border-0 py-1.5 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:max-w-xl sm:text-sm sm:leading-6 dark:bg-zinc-800 dark:text-zinc-100 dark:ring-zinc-700"
                />
              </div>
            </div>

            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
              <label htmlFor="seoDescription" className="block text-sm font-medium leading-6 text-zinc-900 dark:text-zinc-300 sm:pt-1.5">
                SEO Description
              </label>
              <div className="mt-2 sm:col-span-2 sm:mt-0">
                <textarea
                  id="seoDescription"
                  name="seoDescription"
                  rows={3}
                  defaultValue={initialData?.seoDescription}
                  className="block w-full rounded-md border-0 py-1.5 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:max-w-xl sm:text-sm sm:leading-6 dark:bg-zinc-800 dark:text-zinc-100 dark:ring-zinc-700"
                />
              </div>
            </div>

            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
              <label htmlFor="status" className="block text-sm font-medium leading-6 text-zinc-900 dark:text-zinc-300 sm:pt-1.5">
                Status
              </label>
              <div className="mt-2 sm:col-span-2 sm:mt-0">
                <select
                  id="status"
                  name="status"
                  defaultValue={initialData?.status || "DRAFT"}
                  className="block w-full rounded-md border-0 py-1.5 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:max-w-xs sm:text-sm sm:leading-6 dark:bg-zinc-800 dark:text-zinc-100 dark:ring-zinc-700"
                >
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">Published</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-6 rounded-md bg-red-50 p-4 dark:bg-red-900/30">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-400">{error}</h3>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 flex items-center justify-end gap-x-6 py-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="text-sm font-semibold leading-6 text-zinc-900 dark:text-zinc-300"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 disabled:opacity-50"
        >
          {isSubmitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Save"}
        </button>
      </div>
    </form>
  );
}
