"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useState, useEffect } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";

export function CatalogueToolbar({ totalCount }: { totalCount: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [isTyping, setIsTyping] = useState(false);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      params.delete("page"); // Reset page on filter change
      return params.toString();
    },
    [searchParams]
  );

  useEffect(() => {
    // Only debounce if the user is actively typing to avoid firing on initial load
    if (!isTyping) return;
    
    const timeoutId = setTimeout(() => {
      router.push(pathname + "?" + createQueryString("search", searchTerm));
      setIsTyping(false);
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, isTyping, pathname, router, createQueryString]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setIsTyping(true);
  };

  const clearSearch = () => {
    setSearchTerm("");
    router.push(pathname + "?" + createQueryString("search", ""));
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    router.push(pathname + "?" + createQueryString("sortBy", e.target.value));
  };

  const activeFilters: { key: string; label: string; value: string }[] = [];
  const category = searchParams.get("category");
  const species = searchParams.get("species");
  const benefit = searchParams.get("benefit");
  const productType = searchParams.get("productType");
  const badge = searchParams.get("badge");

  if (category) activeFilters.push({ key: "category", label: "Category", value: category });
  if (species) activeFilters.push({ key: "species", label: "Species", value: species });
  if (benefit) activeFilters.push({ key: "benefit", label: "Benefit", value: benefit });
  if (productType) activeFilters.push({ key: "productType", label: "Type", value: productType });
  if (badge) activeFilters.push({ key: "badge", label: "Status", value: badge });

  const removeFilter = (key: string) => {
    router.push(pathname + "?" + createQueryString(key, ""));
  };

  return (
    <div className="flex flex-col gap-4 mb-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-200 pb-4 dark:border-zinc-800">
        <div className="text-sm text-zinc-500 dark:text-zinc-400">
          Showing <span className="font-bold text-zinc-900 dark:text-zinc-100">{totalCount}</span> products
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="h-10 w-full rounded-md border border-zinc-200 bg-white pl-9 pr-10 text-sm outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-green-500 sm:w-64"
            />
            {searchTerm && (
              <button 
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-zinc-400" />
            <select
              value={searchParams.get("sortBy") || "newest"}
              onChange={handleSortChange}
              className="h-10 rounded-md border border-zinc-200 bg-white px-3 text-sm outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-green-500"
            >
              <option value="featured">Featured</option>
              <option value="popular">Popular</option>
              <option value="newest">Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {activeFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-zinc-500 dark:text-zinc-400 mr-1">Active Filters:</span>
          {activeFilters.map((filter) => (
            <span 
              key={filter.key} 
              className="inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700 border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/50"
            >
              {filter.label}: {filter.value}
              <button 
                onClick={() => removeFilter(filter.key)}
                className="ml-1 rounded-full p-0.5 hover:bg-green-200 dark:hover:bg-green-800 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
          <button
            onClick={() => router.push(pathname)}
            className="text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 underline decoration-zinc-300 underline-offset-2"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}
