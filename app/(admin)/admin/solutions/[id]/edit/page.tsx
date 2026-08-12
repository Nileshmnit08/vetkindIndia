import { SolutionForm } from "@/components/admin/SolutionForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getSolutionById } from "@/app/actions/solutions";
import { notFound } from "next/navigation";

export default async function EditSolutionPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const response = await getSolutionById(resolvedParams.id);
  
  if (!response.success || !response.data) {
    notFound();
  }

  const solution = response.data;

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <Link
          href="/admin/solutions"
          className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Solutions
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Edit Solution</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Update the solution details.
        </p>
      </div>

      <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-zinc-800">
        <SolutionForm initialData={solution} />
      </div>
    </div>
  );
}
