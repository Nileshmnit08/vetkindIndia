// @ts-nocheck
import { auth } from "@/auth";
import { createServerClient } from "@/lib/supabase/client";
import { Package, MessageSquare, Download, FileText } from "lucide-react";
import Link from "next/link";

const supabase = createServerClient();

export default async function DistributorDashboardPage() {
  const session = await auth();
  
  const [
    { count: productCount },
    { data: recentInquiries }
  ] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }).eq('published', true),
    session?.user?.id 
      ? supabase.from('inquiries').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false }).limit(3)
      : Promise.resolve({ data: [] })
  ]);
  
  const mappedInquiries = (recentInquiries || []).map(i => ({
    ...i,
    createdAt: new Date(i.created_at)
  }));

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
          Welcome back, {session?.user?.name || "Partner"}
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Access your distributor resources, product catalogues, and submit order requests.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link 
          href="/distributor/products" 
          className="relative group overflow-hidden rounded-xl border border-zinc-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow dark:border-zinc-800 dark:bg-zinc-900"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-50 text-green-600 rounded-lg group-hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400 dark:group-hover:bg-green-900/50 transition-colors">
              <Package className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-zinc-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                Browse Products
              </h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">{productCount || 0} items available</p>
            </div>
          </div>
        </Link>
        
        <Link 
          href="/distributor/products" 
          className="relative group overflow-hidden rounded-xl border border-zinc-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow dark:border-zinc-800 dark:bg-zinc-900"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:group-hover:bg-blue-900/50 transition-colors">
              <Download className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-zinc-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                Downloads
              </h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Brochures & pricing</p>
            </div>
          </div>
        </Link>

        <Link 
          href="/distributor/inquiries" 
          className="relative group overflow-hidden rounded-xl border border-zinc-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow dark:border-zinc-800 dark:bg-zinc-900 sm:col-span-2 lg:col-span-1"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-lg group-hover:bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400 dark:group-hover:bg-purple-900/50 transition-colors">
              <MessageSquare className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-zinc-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                Order Requests
              </h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Submit bulk inquiries</p>
            </div>
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-lg font-medium text-zinc-900 dark:text-white mb-4">Latest Announcements</h2>
          <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900 p-6">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-amber-50 text-amber-600 rounded-lg dark:bg-amber-900/30 dark:text-amber-400">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">Q3 Updated Price List Available</h3>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                  The latest distributor pricing guide is now available for download in the resources section.
                </p>
                <div className="mt-3">
                  <span className="text-xs font-medium text-zinc-400 dark:text-zinc-500">Posted today</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-zinc-900 dark:text-white">Your Recent Requests</h2>
            <Link href="/distributor/inquiries" className="text-sm font-medium text-green-600 hover:text-green-500 dark:text-green-500 dark:hover:text-green-400">
              View all
            </Link>
          </div>
          <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            {mappedInquiries.length > 0 ? (
              <ul className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {mappedInquiries.map((inquiry) => (
                  <li key={inquiry.id} className="p-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
                        {new Date(inquiry.createdAt).toLocaleDateString()}
                      </p>
                      <div className="ml-2 flex flex-shrink-0">
                        <p className="inline-flex rounded-full bg-zinc-100 px-2 text-xs font-semibold leading-5 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300">
                          {inquiry.status}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm text-zinc-500 dark:text-zinc-400 truncate">
                        {inquiry.message}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
                You haven&apos;t submitted any order requests yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

