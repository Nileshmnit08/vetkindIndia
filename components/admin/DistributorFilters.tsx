"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useState } from "react";
import { Search } from "lucide-react";

export function DistributorFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [region, setRegion] = useState(searchParams.get("region") || "");

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      // Reset to page 1 when filtering changes
      params.delete("page");
      return params.toString();
    },
    [searchParams]
  );

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`${pathname}?${createQueryString("q", search)}`);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    router.push(`${pathname}?${createQueryString("status", e.target.value)}`);
  };

  const handleRegionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`${pathname}?${createQueryString("region", region)}`);
  };

  const handleRegionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegion(e.target.value);
  };

  const handleRegionBlur = () => {
    router.push(`${pathname}?${createQueryString("region", region)}`);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <form onSubmit={handleSearchSubmit} className="flex-1 relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Search className="h-4 w-4 text-zinc-400" />
        </div>
        <input
          type="text"
          placeholder="Search distributors by name, email, or company..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="block w-full rounded-md border border-zinc-300 pl-10 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
        />
      </form>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <form onSubmit={handleRegionSubmit} className="sm:w-48">
          <input
            type="text"
            placeholder="Filter by region..."
            value={region}
            onChange={handleRegionChange}
            onBlur={handleRegionBlur}
            className="block w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
          />
        </form>

        <select
          value={searchParams.get("status") || ""}
          onChange={handleStatusChange}
          className="block w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white sm:w-40"
        >
          <option value="">All Statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
          <option value="PENDING">Pending (Invited)</option>
        </select>
      </div>
    </div>
  );
}
