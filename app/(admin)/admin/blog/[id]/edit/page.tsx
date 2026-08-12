import { getBlogArticleById } from "@/app/actions/blog";
import { BlogForm } from "@/components/admin/BlogForm";
import { notFound } from "next/navigation";

interface EditBlogPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditBlogPage({ params }: EditBlogPageProps) {
  const resolvedParams = await params;
  const response = await getBlogArticleById(resolvedParams.id);
  
  if (!response.success || !response.data) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
          Edit Blog Article
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Update the information for this blog article.
        </p>
      </div>
      <BlogForm initialData={response.data} />
    </div>
  );
}
