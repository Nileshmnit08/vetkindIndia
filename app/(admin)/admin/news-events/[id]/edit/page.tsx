import { getNewsEventById } from "@/app/actions/news-events";
import { NewsEventForm } from "@/components/admin/NewsEventForm";
import { notFound } from "next/navigation";

interface EditNewsEventPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditNewsEventPage({ params }: EditNewsEventPageProps) {
  const resolvedParams = await params;
  const response = await getNewsEventById(resolvedParams.id);
  
  if (!response.success || !response.data) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
          Edit Item
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Update the information for this news or event item.
        </p>
      </div>
      <NewsEventForm initialData={response.data} />
    </div>
  );
}
