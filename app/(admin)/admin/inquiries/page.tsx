import { getInquiries, getAdminUsers } from "@/app/actions/inquiry";
import InquiryListClient from "./InquiryListClient";
import { Users, MailOpen, UserCheck, Inbox, AlertTriangle } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Inquiries CRM | Admin | VetKind",
};

export default async function AdminInquiriesPage() {
  const { success, inquiries, count, error } = await getInquiries();
  const admins = await getAdminUsers().catch(() => []); // Fail safe for admins too

  if (!success) {
    return (
      <div className="space-y-6">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Inquiries CRM</h1>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Manage contact form submissions, distributor requests, and leads.
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-red-200 bg-red-50 p-6 dark:border-red-900/50 dark:bg-red-900/10">
          <div className="flex items-start">
            <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-500 mt-0.5 mr-3" />
            <div>
              <h3 className="text-lg font-medium text-red-800 dark:text-red-400">
                Unable to load inquiries right now
              </h3>
              <div className="mt-2 text-sm text-red-700 dark:text-red-300 space-y-1">
                <p>We encountered an error while communicating with the database.</p>
                {error?.message && <p className="font-mono text-xs mt-2 bg-red-100 dark:bg-red-900/30 p-2 rounded">Error: {error.message} {error.code ? `(Code: ${error.code})` : ''}</p>}
              </div>
              <div className="mt-4">
                <Link href="/admin/inquiries" className="inline-flex items-center rounded-md bg-red-100 px-3 py-2 text-sm font-medium text-red-800 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50">
                  Try Again
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const newCount = inquiries?.filter(i => i.status === 'NEW').length || 0;
  const openCount = inquiries?.filter(i => ['OPEN', 'IN PROGRESS'].includes(i.status)).length || 0;
  const qualifiedCount = inquiries?.filter(i => i.status === 'QUALIFIED').length || 0;

  const stats = [
    { name: "Total Inquiries", value: count || 0, icon: Inbox, color: "text-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400" },
    { name: "New", value: newCount, icon: MailOpen, color: "text-green-600 bg-green-50 dark:bg-green-900/30 dark:text-green-400" },
    { name: "Open/Working", value: openCount, icon: Users, color: "text-amber-600 bg-amber-50 dark:bg-amber-900/30 dark:text-amber-400" },
    { name: "Qualified Leads", value: qualifiedCount, icon: UserCheck, color: "text-purple-600 bg-purple-50 dark:bg-purple-900/30 dark:text-purple-400" },
  ];

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Inquiries CRM</h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Manage contact form submissions, distributor requests, and leads.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="flex flex-col bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="h-6 w-6" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                  {stat.name}
                </p>
                <p className="text-2xl font-bold text-zinc-900 dark:text-white mt-1">
                  {stat.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <InquiryListClient 
        initialInquiries={inquiries || []} 
        totalCount={count || 0}
        admins={admins || []}
      />
    </div>
  );
}
