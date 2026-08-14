// @ts-nocheck
import { createServerClient } from "@/lib/supabase/client";
import { Package, Users, MessageSquare, Activity } from "lucide-react";
import UserManagement from "@/components/admin/UserManagement";

import { auth } from "@/auth";

const supabase = createServerClient();

export default async function AdminDashboardPage() {
  const session = await auth();

  const [
    { count: productCount },
    { count: distributorCount },
    { count: inquiryCount },
    { data: recentInquiries },
    { data: allUsers }
  ] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('users').select('*', { count: 'exact', head: true }).eq('role', 'DISTRIBUTOR'),
    supabase.from('inquiries').select('*', { count: 'exact', head: true }),
    supabase.from('inquiries').select('*').order('created_at', { ascending: false }).limit(5),
    supabase.from('users').select('*').order('created_at', { ascending: false })
  ]);
  
  const mappedInquiries = (recentInquiries || []).map(i => ({
    ...i,
    createdAt: new Date(i.created_at)
  }));
  
  const mappedUsers = (allUsers || []).map(u => ({
    ...u,
    createdAt: new Date(u.created_at)
  }));

  const stats = [
    { name: "Total Products", value: productCount || 0, icon: Package, color: "text-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400" },
    { name: "Distributors", value: distributorCount || 0, icon: Users, color: "text-green-600 bg-green-50 dark:bg-green-900/30 dark:text-green-400" },
    { name: "Inquiries", value: inquiryCount || 0, icon: MessageSquare, color: "text-purple-600 bg-purple-50 dark:bg-purple-900/30 dark:text-purple-400" },
    { name: "System Status", value: "Active", icon: Activity, color: "text-amber-600 bg-amber-50 dark:bg-amber-900/30 dark:text-amber-400" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Overview of VetKind platform metrics.
          </p>
        </div>
        <div className="flex flex-col gap-1 text-sm bg-zinc-50 dark:bg-zinc-800/50 p-3 rounded-lg border border-zinc-100 dark:border-zinc-800 min-w-[280px]">
          <p className="text-zinc-500 dark:text-zinc-400 font-medium border-b border-zinc-200 dark:border-zinc-700 pb-1 mb-1">Current Session</p>
          <div className="flex justify-between">
            <span className="text-zinc-500 dark:text-zinc-400">Email:</span>
            <span className="font-medium text-zinc-900 dark:text-zinc-200">{session?.user?.email || 'Unknown'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500 dark:text-zinc-400">Role:</span>
            <span className="font-medium text-green-600 dark:text-green-500">{session?.user?.role || 'ADMIN'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500 dark:text-zinc-400">User ID:</span>
            <span className="font-mono text-xs text-zinc-900 dark:text-zinc-300 mt-0.5">{session?.user?.id?.split('-')[0] + '...'}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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

      <div className="mt-8">
        <h2 className="text-lg font-medium text-zinc-900 dark:text-white mb-4">Recent Inquiries</h2>
        <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          {mappedInquiries.length > 0 ? (
            <ul className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {mappedInquiries.map((inquiry) => (
                <li key={inquiry.id} className="p-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <p className="truncate text-sm font-medium text-green-600 dark:text-green-500">
                      {inquiry.name} ({inquiry.company || "Individual"})
                    </p>
                    <div className="ml-2 flex flex-shrink-0">
                      <p className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        {inquiry.status}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-zinc-500 dark:text-zinc-400">
                        {inquiry.email}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-zinc-500 dark:text-zinc-400 sm:mt-0">
                      <p suppressHydrationWarning>
                        {new Date(inquiry.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
              No recent inquiries found.
            </div>
          )}
        </div>
      </div>

      <UserManagement initialUsers={mappedUsers} />
    </div>
  );
}

