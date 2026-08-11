"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";

export interface FilterOptions {
  categories: { id: string; name: string; slug: string }[];
  species: { id: string; name: string; slug: string }[];
  benefits: { id: string; name: string; slug: string }[];
  productTypes: string[];
}

export function CatalogueFilters({ options }: { options: FilterOptions }) {
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
      params.delete("page"); // Reset page on filter change
      return params.toString();
    },
    [searchParams]
  );

  const handleFilterChange = (key: string, value: string) => {
    // If the same value is clicked, clear the filter
    const current = searchParams.get(key);
    const newValue = current === value ? "" : value;
    router.push(pathname + "?" + createQueryString(key, newValue));
  };

  const currentCategory = searchParams.get("category");
  const currentSpecies = searchParams.get("species");
  const currentBenefit = searchParams.get("benefit");
  const currentType = searchParams.get("productType");

  const hasActiveFilters = !!(currentCategory || currentSpecies || currentBenefit || currentType);

  const clearAllFilters = () => {
    router.push(pathname);
  };

  return (
    <div className="space-y-8">
      {hasActiveFilters && (
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
      {/* Categories */}
      <div>
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
          Categories
        </h3>
        <div className="space-y-2">
          {options.categories.map((cat) => (
            <label key={cat.id} className="flex items-center gap-3 cursor-pointer group">
              <div className={`flex h-4 w-4 items-center justify-center rounded border transition-colors ${currentCategory === cat.slug ? 'border-green-600 bg-green-600 text-white' : 'border-zinc-300 dark:border-zinc-700'}`}>
                {currentCategory === cat.slug && <svg viewBox="0 0 14 14" fill="none" className="h-3 w-3"><path d="M3 8L6 11L11 3.5" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/></svg>}
              </div>
              <input 
                type="checkbox" 
                className="hidden" 
                checked={currentCategory === cat.slug}
                onChange={() => handleFilterChange("category", cat.slug)}
              />
              <span className={`text-sm ${currentCategory === cat.slug ? 'font-medium text-zinc-900 dark:text-zinc-100' : 'text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-200'}`}>
                {cat.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Animal Species */}
      <div>
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
          Animal Species
        </h3>
        <div className="space-y-2">
          {options.species.map((spec) => (
            <label key={spec.id} className="flex items-center gap-3 cursor-pointer group">
              <div className={`flex h-4 w-4 items-center justify-center rounded border transition-colors ${currentSpecies === spec.slug ? 'border-green-600 bg-green-600 text-white' : 'border-zinc-300 dark:border-zinc-700'}`}>
                {currentSpecies === spec.slug && <svg viewBox="0 0 14 14" fill="none" className="h-3 w-3"><path d="M3 8L6 11L11 3.5" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/></svg>}
              </div>
              <input 
                type="checkbox" 
                className="hidden" 
                checked={currentSpecies === spec.slug}
                onChange={() => handleFilterChange("species", spec.slug)}
              />
              <span className={`text-sm ${currentSpecies === spec.slug ? 'font-medium text-zinc-900 dark:text-zinc-100' : 'text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-200'}`}>
                {spec.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Benefits */}
      <div>
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
          Benefits
        </h3>
        <div className="space-y-2">
          {options.benefits.map((ben) => (
            <label key={ben.id} className="flex items-center gap-3 cursor-pointer group">
              <div className={`flex h-4 w-4 items-center justify-center rounded border transition-colors ${currentBenefit === ben.slug ? 'border-green-600 bg-green-600 text-white' : 'border-zinc-300 dark:border-zinc-700'}`}>
                {currentBenefit === ben.slug && <svg viewBox="0 0 14 14" fill="none" className="h-3 w-3"><path d="M3 8L6 11L11 3.5" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/></svg>}
              </div>
              <input 
                type="checkbox" 
                className="hidden" 
                checked={currentBenefit === ben.slug}
                onChange={() => handleFilterChange("benefit", ben.slug)}
              />
              <span className={`text-sm ${currentBenefit === ben.slug ? 'font-medium text-zinc-900 dark:text-zinc-100' : 'text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-200'}`}>
                {ben.name}
              </span>
            </label>
          ))}
        </div>
      </div>
      
      {/* Product Type */}
      <div>
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
          Product Type
        </h3>
        <div className="space-y-2">
          {options.productTypes.map((type) => (
            <label key={type} className="flex items-center gap-3 cursor-pointer group">
              <div className={`flex h-4 w-4 items-center justify-center rounded border transition-colors ${currentType === type ? 'border-green-600 bg-green-600 text-white' : 'border-zinc-300 dark:border-zinc-700'}`}>
                {currentType === type && <svg viewBox="0 0 14 14" fill="none" className="h-3 w-3"><path d="M3 8L6 11L11 3.5" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/></svg>}
              </div>
              <input 
                type="checkbox" 
                className="hidden" 
                checked={currentType === type}
                onChange={() => handleFilterChange("productType", type)}
              />
              <span className={`text-sm ${currentType === type ? 'font-medium text-zinc-900 dark:text-zinc-100' : 'text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-200'}`}>
                {type}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
