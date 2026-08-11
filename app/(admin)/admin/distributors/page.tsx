import { PrismaClient, Prisma } from "@prisma/client";
import { UserPlus } from "lucide-react";
import Link from "next/link";
import { DistributorFilters } from "@/components/admin/DistributorFilters";
import { DistributorTableActions } from "@/components/admin/DistributorTableActions";
import { Pagination } from "@/components/products/Pagination";

const prisma = new PrismaClient();
const PAGE_SIZE = 10;

interface AdminDistributorsPageProps {
  searchParams: Promise<{
    q?: string;
    status?: string;
    region?: string;
    page?: string;
  }>;
}

export default async function AdminDistributorsPage({ searchParams }: AdminDistributorsPageProps) {
  const resolvedParams = await searchParams;
  const query = resolvedParams.q || "";
  const status = resolvedParams.status || "";
  const region = resolvedParams.region || "";
  const page = Number(resolvedParams.page) || 1;
  const skip = (page - 1) * PAGE_SIZE;

  // Build the Prisma where clause dynamically based on searchParams
  const where: Prisma.UserWhereInput = {
    role: "DISTRIBUTOR",
  };
  
  if (query) {
    where.OR = [
      { name: { contains: query } },
      { email: { contains: query } },
      { profile: { companyName: { contains: query } } },
    ];
  }
  
  if (status) {
    where.status = status;
  }

  if (region) {
    where.profile = {
      ...(where.profile || {}),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      region: { contains: region } as any,
    };
  }

  const [distributors, totalCount] = await Promise.all([
    prisma.user.findMany({
      where,
      include: { profile: true },
      orderBy: { updatedAt: "desc" },
      skip,
      take: PAGE_SIZE,
    }),
    prisma.user.count({ where })
  ]);

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Distributors</h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Manage your distributor network accounts and permissions.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <Link
            href="/admin/distributors/new"
            className="inline-flex items-center justify-center rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:w-auto"
          >
            <UserPlus className="-ml-1 mr-2 h-4 w-4" aria-hidden="true" />
            Add Distributor
          </Link>
        </div>
      </div>

      <DistributorFilters />

      <div className="mt-4 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg border border-zinc-200 dark:border-zinc-800">
              <table className="min-w-full divide-y divide-zinc-300 dark:divide-zinc-800">
                <thead className="bg-zinc-50 dark:bg-zinc-900/50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-200 sm:pl-6">
                      Distributor
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-200">
                      Contact Details
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-200">
                      Region
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-200">
                      Status
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-200">
                      Last Updated
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 bg-white dark:bg-zinc-900">
                  {distributors.length > 0 ? (
                    distributors.map((user) => (
                      <tr key={user.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden flex items-center justify-center border border-zinc-200 dark:border-zinc-700">
                              {user.image ? (
                                <img src={user.image} alt="" className="h-10 w-10 object-cover" />
                              ) : (
                                <span className="text-zinc-500 font-medium text-sm">
                                  {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || "?"}
                                </span>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="font-medium text-zinc-900 dark:text-zinc-100">{user.name || "Unknown"}</div>
                              <div className="text-zinc-500 dark:text-zinc-400">{user.profile?.companyName || "No Company"}</div>
                            </div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-zinc-500 dark:text-zinc-400">
                          <div className="flex flex-col">
                            <span>{user.email}</span>
                            <span className="text-xs">{user.profile?.phone || "No phone"}</span>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-zinc-500 dark:text-zinc-400">
                          {user.profile?.region || "-"}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-zinc-500 dark:text-zinc-400">
                          <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                            user.status === 'ACTIVE' 
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" 
                              : user.status === 'PENDING'
                              ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                              : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                          }`}>
                            {user.status === "PENDING" ? "Invited" : user.status}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-zinc-500 dark:text-zinc-400">
                          {new Date(user.updatedAt).toLocaleDateString()}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <DistributorTableActions id={user.id} status={user.status} name={user.name} />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-sm text-zinc-500 dark:text-zinc-400">
                        <div className="flex flex-col items-center justify-center space-y-3">
                          <div className="rounded-full bg-zinc-100 p-3 dark:bg-zinc-800">
                            <UserPlus className="h-6 w-6 text-zinc-400" />
                          </div>
                          <p>No distributors found matching your criteria.</p>
                          <Link
                            href="/admin/distributors"
                            className="text-green-600 hover:text-green-500 font-medium"
                          >
                            Clear filters
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

      {totalCount > PAGE_SIZE && (
        <Pagination totalCount={totalCount} pageSize={PAGE_SIZE} />
      )}
    </div>
  );
}
