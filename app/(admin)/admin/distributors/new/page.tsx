import { DistributorForm } from "@/components/admin/DistributorForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewDistributorPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/distributors"
          className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-zinc-100 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Back to distributors</span>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Add Distributor</h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Invite a new distributor to the platform.
          </p>
        </div>
      </div>

      <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <DistributorForm />
      </div>
    </div>
  );
}
