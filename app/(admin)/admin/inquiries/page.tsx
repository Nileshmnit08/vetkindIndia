// @ts-nocheck
import { createServerClient } from "@/lib/supabase/client";
import Link from "next/link";

const supabase = createServerClient();

export default async function AdminInquiriesPage() {
  const { data: rawInquiries } = await supabase
    .from('inquiries')
    .select('*')
    .order('created_at', { ascending: false });
    
  const inquiries = (rawInquiries || []).map(i => ({
    ...i,
    createdAt: new Date(i.created_at)
  }));

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Inquiries</h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            View and manage contact form submissions and bulk requests.
          </p>
        </div>
      </div>

      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg border border-zinc-200 dark:border-zinc-800">
              <table className="min-w-full divide-y divide-zinc-300 dark:divide-zinc-800">
                <thead className="bg-zinc-50 dark:bg-zinc-900/50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-200 sm:pl-6">
                      Date
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-200">
                      Sender
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-200">
                      Status
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-200">
                      Message Snippet
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">View</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 bg-white dark:bg-zinc-900">
                  {inquiries.length > 0 ? (
                    inquiries.map((inquiry) => (
                      <tr key={inquiry.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-zinc-500 dark:text-zinc-400 sm:pl-6">
                          {new Date(inquiry.createdAt).toLocaleDateString()}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                          <div className="flex flex-col">
                            <span>{inquiry.name}</span>
                            <span className="text-xs font-normal text-zinc-500">{inquiry.company || "-"}</span>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-zinc-500 dark:text-zinc-400">
                          <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                            inquiry.status === 'NEW' 
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" 
                              : inquiry.status === 'CONTACTED' 
                              ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                              : "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-400"
                          }`}>
                            {inquiry.status}
                          </span>
                        </td>
                        <td className="px-3 py-4 text-sm text-zinc-500 dark:text-zinc-400 max-w-xs truncate">
                          {inquiry.message}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <Link href={`/admin/inquiries/${inquiry.id}`} className="text-green-600 hover:text-green-900 dark:text-green-500 dark:hover:text-green-400">
                            View<span className="sr-only">, {inquiry.name}</span>
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
                        No inquiries found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

