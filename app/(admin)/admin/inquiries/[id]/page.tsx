import { createServerClient } from "@/lib/supabase/client";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Mail, Phone, Building2, MapPin, Briefcase } from "lucide-react";
import { InquiryStatusActions } from "@/components/admin/InquiryStatusActions";

export default async function InquiryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  
  const supabase = createServerClient();
  
  const { data: inquiry } = await supabase
    .from('inquiries')
    .select('*')
    .eq('id', id)
    .single() as any;

  if (!inquiry) {
    notFound();
  }

  const createdAt = new Date(inquiry.created_at).toLocaleString();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/inquiries"
          className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-zinc-100 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Back to inquiries</span>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Inquiry Details</h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Received {createdAt}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">Message</h2>
            <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap text-zinc-700 dark:text-zinc-300">
              {inquiry.message}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">Sender Profile</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-zinc-900 dark:text-white">{inquiry.name}</p>
                {inquiry.company && (
                  <p className="text-sm flex items-center gap-2 text-zinc-500 dark:text-zinc-400 mt-1">
                    <Building2 className="h-4 w-4" />
                    {inquiry.company}
                  </p>
                )}
              </div>
              
              <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 space-y-3">
                <a href={`mailto:${inquiry.email}`} className="text-sm flex items-center gap-2 text-zinc-600 dark:text-zinc-300 hover:text-green-600">
                  <Mail className="h-4 w-4" />
                  {inquiry.email}
                </a>
                {inquiry.phone && (
                  <a href={`tel:${inquiry.phone}`} className="text-sm flex items-center gap-2 text-zinc-600 dark:text-zinc-300 hover:text-green-600">
                    <Phone className="h-4 w-4" />
                    {inquiry.phone}
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">Actions</h2>
            <InquiryStatusActions inquiryId={inquiry.id} currentStatus={inquiry.status} />
          </div>
        </div>
      </div>
    </div>
  );
}
