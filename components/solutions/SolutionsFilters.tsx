"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";

const ANIMAL_TYPES = [
  { id: "cow", name: "Cattle" },
  { id: "buffalo", name: "Buffalo" },
  { id: "poultry", name: "Poultry" },
  { id: "dog", name: "Pets" },
  { id: "feed", name: "Feed & Nutrition" },
];

export function SolutionsFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

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

  const handleFilterChange = (key: string, value: string) => {
    const current = searchParams.get(key);
    const newValue = current === value ? "" : value;
    router.push(pathname + "?" + createQueryString(key, newValue));
  };

  const currentSpecies = searchParams.get("species");

  const clearAllFilters = () => {
    router.push(pathname);
  };

  return (
    <div className="space-y-8">
      {currentSpecies && (
        <div className="flex justify-between items-center pb-4 border-b border-zinc-200 dark:border-zinc-800">
          <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Filters Applied</span>
          <button 
            onClick={clearAllFilters}
            className="text-xs text-green-600 hover:text-green-700 font-medium transition-colors"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Animal Species */}
      <div>
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
          Animal Type
        </h3>
        <div className="space-y-2">
          {ANIMAL_TYPES.map((spec) => (
            <label key={spec.id} className="flex items-center gap-3 cursor-pointer group">
              <div className={`flex h-4 w-4 items-center justify-center rounded border transition-colors ${currentSpecies === spec.id ? 'border-green-600 bg-green-600 text-white' : 'border-zinc-300 dark:border-zinc-700'}`}>
                {currentSpecies === spec.id && <svg viewBox="0 0 14 14" fill="none" className="h-3 w-3"><path d="M3 8L6 11L11 3.5" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/></svg>}
              </div>
              <input 
                type="checkbox" 
                className="hidden" 
                checked={currentSpecies === spec.id}
                onChange={() => handleFilterChange("species", spec.id)}
              />
              <span className={`text-sm ${currentSpecies === spec.id ? 'font-medium text-zinc-900 dark:text-zinc-100' : 'text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-200'}`}>
                {spec.name}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
