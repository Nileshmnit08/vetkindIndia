import Link from "next/link";
import { Plus } from "lucide-react";
import { getSpeciesList } from "@/app/actions/species";
import { SpeciesTable } from "@/components/admin/SpeciesTable";

export const metadata = {
  title: "Manage Species Taxonomy | Admin",
};

export default async function AdminSpeciesPage() {
  const species = await getSpeciesList();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Animal Species</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Manage the top-level taxonomy that powers the storefront categories and filters.
          </p>
        </div>
        <Link
          href="/admin/species/new"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Species
        </Link>
      </div>

      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden">
        <SpeciesTable species={species} />
      </div>
    </div>
  );
}
