"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Filter, X } from "lucide-react";

interface BlogFiltersProps {
  categories: { slug: string; name: string }[];
  years: string[];
  totalResults: number;
}

export function BlogFilters({ categories, years, totalResults }: BlogFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeCategory = searchParams.get("species");
  const activeYear = searchParams.get("year");
  
  const hasActiveFilters = activeCategory || activeYear;

  const setFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push(pathname);
  };

  return (
    <div className="mb-12 flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-zinc-200 pb-6 dark:border-zinc-800">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
        <div className="flex items-center gap-2 text-sm font-medium text-zinc-500 whitespace-nowrap">
          <Filter className="h-4 w-4" />
          <span>Filter by:</span>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          {/* Species / Category Select */}
          <select
            value={activeCategory || ""}
            onChange={(e) => setFilter("species", e.target.value)}
            className="rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
          >
            <option value="">All Species</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Year Select */}
          <select
            value={activeYear || ""}
            onChange={(e) => setFilter("year", e.target.value)}
            className="rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
          >
            <option value="">All Years</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-6 lg:justify-end">
        {!!hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1.5 text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400"
          >
            <X className="h-4 w-4" />
            Clear all
          </button>
        )}
        
        {!!hasActiveFilters && (
          <div className="hidden sm:block h-4 w-px bg-zinc-300 dark:bg-zinc-700"></div>
        )}

        <div className="text-sm font-medium text-zinc-500">
          Showing {totalResults} {totalResults === 1 ? 'article' : 'articles'}
        </div>
      </div>
    </div>
  );
}
