import { getNewsEvents } from "@/app/actions/news-events";
import { Plus } from "lucide-react";
import Link from "next/link";
import { ContentFilters } from "@/components/admin/ContentFilters";
import { NewsEventTableActions } from "@/components/admin/NewsEventTableActions";

export const dynamic = "force-dynamic";

interface AdminNewsEventsPageProps {
  searchParams: Promise<{
    q?: string;
    type?: string;
    status?: string;
  }>;
}

export default async function AdminNewsEventsPage({ searchParams }: AdminNewsEventsPageProps) {
  const resolvedParams = await searchParams;
  const query = resolvedParams.q || "";
  const type = resolvedParams.type || "";
  const status = resolvedParams.status || "";

  const response = await getNewsEvents(query, type, status);
  const newsEvents = response.success ? response.data || [] : [];

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">News & Events</h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Manage news items and upcoming events.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <Link
            href="/admin/news-events/new"
            className="inline-flex items-center justify-center rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:w-auto"
          >
            <Plus className="-ml-1 mr-2 h-4 w-4" aria-hidden="true" />
            Add News/Event
          </Link>
        </div>
      </div>

      <ContentFilters basePath="/admin/news-events" filterParamName="type" filterOptions={["NEWS", "EVENT"]} filterLabel="Type" />

      <div className="mt-4 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg border border-zinc-200 dark:border-zinc-800">
              <table className="min-w-full divide-y divide-zinc-300 dark:divide-zinc-800">
                <thead className="bg-zinc-50 dark:bg-zinc-900/50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-200 sm:pl-6">
                      Title
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-200">
                      Type
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-200">
                      Published Date
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-200">
                      Status
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 bg-white dark:bg-zinc-900">
                  {newsEvents.length > 0 ? (
                    newsEvents.map((item) => (
                      <tr key={item.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-zinc-900 dark:text-zinc-100 sm:pl-6">
                          {item.title}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-zinc-500 dark:text-zinc-400">
                          {item.type || "-"}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-zinc-500 dark:text-zinc-400">
                          {item.publishedAt ? new Date(item.publishedAt).toLocaleDateString() : "-"}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-zinc-500 dark:text-zinc-400">
                          <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                            item.status === 'PUBLISHED' 
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" 
                              : item.status === 'DRAFT'
                              ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                              : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <NewsEventTableActions id={item.id} status={item.status} title={item.title} />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-sm text-zinc-500 dark:text-zinc-400">
                        <div className="flex flex-col items-center justify-center space-y-3">
                          <div className="rounded-full bg-zinc-100 p-3 dark:bg-zinc-800">
                            <Plus className="h-6 w-6 text-zinc-400" />
                          </div>
                          <p>No news or events found matching your criteria.</p>
                          <Link 
                            href="/admin/news-events/new" 
                            className="text-green-600 hover:text-green-500 font-medium"
                          >
                            Add a new item
                          </Link>
                        </div>
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
