import { DistributorForm } from "@/components/admin/DistributorForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createServerClient } from "@/lib/supabase/client";
import { notFound } from "next/navigation";

export default async function EditDistributorPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  
  const supabase = createServerClient();
  
  const { data: user } = await supabase
    .from('users')
    .select('*, profile:distributor_profiles(*)')
    .eq('id', id)
    .single() as any;

  if (!user || user.role !== 'DISTRIBUTOR') {
    notFound();
  }

  // Normalize profile data
  const profile = Array.isArray(user.profile) ? user.profile[0] : user.profile;
  const initialData = {
    ...user,
    profile: profile ? {
      companyName: profile.company_name,
      phone: profile.phone,
      region: profile.region,
    } : null
  };

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
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Edit Distributor</h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Update account and contact information for this distributor.
          </p>
        </div>
      </div>

      <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <DistributorForm initialData={initialData} />
      </div>
    </div>
  );
}
