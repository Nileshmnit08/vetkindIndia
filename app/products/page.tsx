import { getProducts, getFilterOptions, FetchProductsOptions } from "@/lib/products";
import { ProductCard } from "@/components/products/ProductCard";
import { CatalogueFilters } from "@/components/products/CatalogueFilters";
import { CatalogueToolbar } from "@/components/products/CatalogueToolbar";
import { Pagination } from "@/components/products/Pagination";
import { Filter } from "lucide-react";
import { MobileFilters } from "@/components/products/MobileFilters";
import Link from "next/link";

export const metadata = {
  title: "Product Catalogue | VetKind",
  description: "Browse our comprehensive range of veterinary products and nutritional supplements.",
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  const resolvedParams = await searchParams;
  const options: FetchProductsOptions = {
    search: resolvedParams.search,
    category: resolvedParams.category,
    species: resolvedParams.species,
    benefit: resolvedParams.benefit,
    productType: resolvedParams.productType,
    sortBy: resolvedParams.sortBy as FetchProductsOptions["sortBy"],
    page: resolvedParams.page ? parseInt(resolvedParams.page) : 1,
    limit: 12,
  };

  const [{ data: products, count }, filterOptions] = await Promise.all([
    getProducts(options),
    getFilterOptions()
  ]);

  return (
    <div className="flex min-h-screen flex-col font-sans bg-zinc-50 dark:bg-zinc-950">
      <div className="border-b border-zinc-200 bg-white py-8 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-sm text-zinc-500">
              <Link href="/" className="hover:text-green-600">Home</Link>
              <span>/</span>
              <span className="text-zinc-900 dark:text-zinc-100">Products</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
              Product Catalogue
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400 max-w-2xl">
              Explore our comprehensive range of science-backed veterinary nutrition and phytogenic solutions.
            </p>
          </div>
        </div>
      </div>


      <main className="container mx-auto px-4 py-8 md:px-6 md:py-12 flex-1">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          
          {/* Mobile Filter Toggle & Drawer */}
          <MobileFilters options={filterOptions} />

          {/* Sidebar */}
          <aside className="hidden lg:block space-y-8">
            <CatalogueFilters options={filterOptions} />
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <CatalogueToolbar totalCount={count} />
            
            {products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="mb-4 rounded-full bg-zinc-100 p-4 dark:bg-zinc-800">
                  <Filter className="h-8 w-8 text-zinc-400" />
                </div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white">No products found</h3>
                <p className="mt-2 text-zinc-500 dark:text-zinc-400">
                  Try adjusting your filters or search term to find what you&apos;re looking for.
                </p>
              </div>
            ) : (
              <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            <Pagination totalCount={count} pageSize={options.limit!} />
          </div>
        </div>
      </main>
    </div>
  );
}
