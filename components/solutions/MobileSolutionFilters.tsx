"use client";

import { useState } from "react";
import { Filter, X } from "lucide-react";
import { SolutionsFilters } from "./SolutionsFilters";

export function MobileSolutionFilters() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="lg:hidden mb-4">
        <button 
          onClick={() => setIsOpen(true)}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white py-3 font-medium shadow-sm transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800"
        >
          <Filter className="h-4 w-4" />
          Filter Solutions
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-4/5 max-w-sm bg-white p-6 shadow-2xl dark:bg-zinc-950 overflow-y-auto">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-200 dark:border-zinc-800">
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Filters</h2>
              <button 
                onClick={() => setIsOpen(false)}
                className="rounded-full p-2 text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <SolutionsFilters />
          </div>
        </div>
      )}
    </>
  );
}
