"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useState, useEffect } from "react";
import { Search, X } from "lucide-react";

export function SolutionsToolbar({ totalCount }: { totalCount: number }) {
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
      return params.toString();
    },
    [searchParams]
  );

  useEffect(() => {
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

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-200 pb-4 dark:border-zinc-800">
      <div className="text-sm text-zinc-500 dark:text-zinc-400">
        Showing <span className="font-bold text-zinc-900 dark:text-zinc-100">{totalCount}</span> solutions
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center w-full sm:w-auto">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search solutions, challenges..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="h-10 w-full rounded-md border border-zinc-200 bg-white pl-9 pr-10 text-sm outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-green-500"
          />
          {searchTerm && (
            <button 
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
