"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  totalCount: number;
  pageSize: number;
}

export function Pagination({ totalCount, pageSize }: PaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentPage = Number(searchParams.get("page")) || 1;
  const totalPages = Math.ceil(totalCount / pageSize);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      router.push(pathname + "?" + createQueryString("page", newPage.toString()));
    }
  };

  if (totalPages <= 1) return null;

  return (
    <div className="mt-12 flex items-center justify-center gap-2">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex h-10 w-10 items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-500 transition-colors hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      
      <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mx-4">
        Page {currentPage} of {totalPages}
      </span>

      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex h-10 w-10 items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-500 transition-colors hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
