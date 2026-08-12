import { NewsEventForm } from "@/components/admin/NewsEventForm";

export default function NewNewsEventPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
          Add New Item
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Create a new news article or event for the website.
        </p>
      </div>
      <NewsEventForm />
    </div>
  );
}
