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

  return (
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
  );
}
