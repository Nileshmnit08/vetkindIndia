import Link from "next/link";
import { CategoryRow } from "@/lib/knowledge";

interface CategoryFiltersProps {
  categories: CategoryRow[];
  activeCategorySlug?: string;
}

export function CategoryFilters({ categories, activeCategorySlug }: CategoryFiltersProps) {
  return (
    <nav className="mb-12 flex flex-wrap gap-2 justify-center" aria-label="Article categories">
      <Link 
        href="/knowledge" 
        className={`rounded-full px-5 py-2 text-sm font-bold shadow-sm transition-colors ${
          !activeCategorySlug 
            ? "bg-green-600 text-white hover:bg-green-700" 
            : "bg-white text-zinc-700 border border-zinc-200 hover:bg-zinc-100 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800"
        }`}
        aria-current={!activeCategorySlug ? "page" : undefined}
      >
        All Articles
      </Link>
      {categories.map(cat => {
        const isActive = activeCategorySlug === cat.slug;
        return (
          <Link 
            key={cat.id} 
            href={`/knowledge?category=${cat.slug}`} 
            className={`rounded-full px-5 py-2 text-sm font-bold shadow-sm transition-colors ${
              isActive 
                ? "bg-green-600 text-white hover:bg-green-700" 
                : "bg-white text-zinc-700 border border-zinc-200 hover:bg-zinc-100 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800"
            }`}
            aria-current={isActive ? "page" : undefined}
          >
            {cat.name}
          </Link>
        );
      })}
    </nav>
  );
}
