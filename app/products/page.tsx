import { getProducts, getFilterOptions, FetchProductsOptions } from "@/lib/products";
import { ProductCard } from "@/components/products/ProductCard";
import { Suspense } from "react";
import { CatalogueFilters } from "@/components/products/CatalogueFilters";
import { CatalogueToolbar } from "@/components/products/CatalogueToolbar";
import { Pagination } from "@/components/products/Pagination";
import { Filter, ArrowRight, ShieldCheck, Leaf, FlaskConical, MessageCircle, Truck } from "lucide-react";
import { MobileFilters } from "@/components/products/MobileFilters";
import Link from "next/link";
import Image from "next/image";

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
    badge: resolvedParams.badge,
    sortBy: resolvedParams.sortBy as FetchProductsOptions["sortBy"],
    page: resolvedParams.page ? parseInt(resolvedParams.page) : 1,
    limit: 12,
  };

  const [{ data: products, count }, filterOptions] = await Promise.all([
    getProducts(options),
    getFilterOptions()
  ]);

  const isValidSpecies = options.species ? filterOptions.species.some((s: any) => s.slug === options.species) : true;

  return (
    <div className="flex min-h-screen flex-col font-sans bg-zinc-50 dark:bg-zinc-950">
      {/* 1. Hero / Collection Intro */}
      <div className="bg-green-900 text-white py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1596733430284-f7437275218d?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-t from-green-950 to-transparent" />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="flex flex-col gap-4 max-w-3xl">
            <div className="flex items-center gap-2 text-sm text-green-300 font-medium tracking-wide uppercase">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <span>/</span>
              <span className="text-white">Products</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Advanced Veterinary Nutrition
            </h1>
            <p className="text-lg text-green-100 md:text-xl leading-relaxed">
              Science-backed, phytogenic formulations designed to maximize farm productivity, elevate animal health, and support sustainable livestock operations across India.
            </p>
          </div>
        </div>
      </div>

      {/* Trust Strip */}
      <div className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
        <div className="container mx-auto px-4 md:px-6 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm font-medium text-zinc-700 dark:text-zinc-300">
            <div className="flex items-center gap-2">
              <FlaskConical className="h-5 w-5 text-green-600 dark:text-green-500" />
              <span>Science-Backed Formulations</span>
            </div>
            <div className="flex items-center gap-2">
              <Leaf className="h-5 w-5 text-green-600 dark:text-green-500" />
              <span>Phytogenic Ingredients</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-green-600 dark:text-green-500" />
              <span>Field-Tested Performance</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-green-600 dark:text-green-500" />
              <span>Bulk & Distributor Ready</span>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8 md:px-6 md:py-12 flex-1">
        
        {/* 2. Species Discovery Grid */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-6">Browse by Species</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {filterOptions.species.filter((s: any) => s.featured).map((spec: any) => {
              const isActive = options.species === spec.slug;
              return (
                <Link 
                  key={spec.name} 
                  href={isActive ? '/products' : `/products?species=${spec.slug}`} 
                  className={`group relative overflow-hidden rounded-xl aspect-[4/3] flex items-center justify-center bg-zinc-900 ring-2 ring-offset-2 transition-all ${
                    isActive 
                      ? 'ring-green-500 ring-offset-zinc-50 dark:ring-offset-zinc-950 opacity-100' 
                      : 'ring-transparent hover:ring-green-500/50 opacity-90 hover:opacity-100'
                  }`}
                >
                  <Image 
                    src={spec.image || "https://images.unsplash.com/photo-1596733430284-f7437275218d?q=80&w=400&auto=format&fit=crop"}
                    alt={spec.name}
                    fill
                    className={`object-cover transition-transform duration-500 group-hover:scale-110 ${isActive ? 'opacity-80' : 'opacity-60'}`}
                    sizes="(max-width: 768px) 50vw, 20vw"
                  />
                  <span className="relative z-10 text-white font-bold text-lg md:text-xl tracking-wide">
                    {spec.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* 3. Main Catalogue area */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Mobile Filter Toggle & Drawer */}
          <Suspense fallback={<div className="lg:hidden h-10 w-full animate-pulse bg-zinc-100 dark:bg-zinc-800 rounded-lg mb-4" />}>
            <MobileFilters options={filterOptions} />
          </Suspense>

          {/* Sidebar Filters */}
          <aside className="hidden lg:block space-y-8">
            <Suspense fallback={<div className="h-96 w-full animate-pulse bg-zinc-100 dark:bg-zinc-800 rounded-xl" />}>
              <CatalogueFilters options={filterOptions} />
            </Suspense>
          </aside>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            <Suspense fallback={<div className="h-16 w-full animate-pulse bg-zinc-100 dark:bg-zinc-800 rounded-xl mb-6" />}>
              <CatalogueToolbar totalCount={count} />
            </Suspense>
            
            {!isValidSpecies ? (
              <div className="flex flex-col items-center justify-center py-24 text-center rounded-2xl border border-dashed border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-900/10 mt-6">
                <div className="mb-4 rounded-full bg-red-100 p-4 dark:bg-red-900/30">
                  <Filter className="h-8 w-8 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-xl font-bold text-red-900 dark:text-red-400">Unsupported Species</h3>
                <p className="mt-2 text-red-700 dark:text-red-500 max-w-md">
                  We currently do not have a dedicated catalogue for "{options.species}". Please browse our available categories.
                </p>
                <Link href="/products" className="mt-6 inline-flex items-center justify-center rounded-lg bg-red-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-red-500 transition-colors shadow-sm">
                  View All Products
                </Link>
              </div>
            ) : products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 mt-6">
                <div className="mb-4 rounded-full bg-zinc-100 p-4 dark:bg-zinc-800">
                  <Filter className="h-8 w-8 text-zinc-400" />
                </div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white">No products found</h3>
                <p className="mt-2 text-zinc-500 dark:text-zinc-400 max-w-md">
                  Try adjusting your filters or search term to discover the right solutions for your herd.
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

      {/* 5. Lower-page Conversion Sections */}
      <section className="bg-white dark:bg-zinc-900 border-y border-zinc-200 dark:border-zinc-800 py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="rounded-2xl bg-zinc-50 dark:bg-zinc-950 p-8 border border-zinc-100 dark:border-zinc-800 flex flex-col items-start">
              <div className="h-12 w-12 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 flex items-center justify-center mb-6">
                <MessageCircle className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-3">Need Help Choosing?</h3>
              <p className="text-zinc-600 dark:text-zinc-400 mb-8 flex-1">
                Our veterinary experts can help recommend the right phytogenic formulations based on your herd's specific nutritional and productivity challenges.
              </p>
              <Link href="/contact" className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors">
                Request Consultation <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
            <div className="rounded-2xl bg-zinc-50 dark:bg-zinc-950 p-8 border border-zinc-100 dark:border-zinc-800 flex flex-col items-start">
              <div className="h-12 w-12 rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 flex items-center justify-center mb-6">
                <Truck className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-3">Bulk Orders & Distribution</h3>
              <p className="text-zinc-600 dark:text-zinc-400 mb-8 flex-1">
                Join the growing network of VetKind distributors. We offer competitive pricing, extensive marketing support, and reliable logistics across India.
              </p>
              <Link href="/distributor-inquiry" className="inline-flex items-center justify-center rounded-lg bg-green-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-green-500 transition-colors">
                Apply as Distributor <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Related Discovery / Explore More */}
      <section className="py-16 bg-zinc-50 dark:bg-zinc-950">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-8 text-center">Explore Targeted Solutions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {['Dairy Performance', 'Gut Health & Immunity', 'Lactation Support'].map((collection) => (
              <Link key={collection} href={`/solutions`} className="group flex items-center justify-between p-6 rounded-xl border border-zinc-200 bg-white hover:border-green-300 hover:shadow-md transition-all dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-green-700">
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">{collection}</span>
                <ArrowRight className="h-5 w-5 text-zinc-400 group-hover:text-green-600 dark:group-hover:text-green-500 transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Trust & Credibility Block */}
      <section className="py-16 md:py-24 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800">
        <div className="container mx-auto px-4 md:px-6 text-center max-w-4xl">
          <ShieldCheck className="h-12 w-12 text-green-600 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-6">
            Committed to Quality & Residue-Conscious Formulation
          </h2>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
            At VetKind, we understand that farm productivity relies on the foundational health of the animal. Our phytogenic and nutritional solutions are meticulously developed to ensure maximum bioavailability, adhering to stringent quality standards that promote healthier yields and sustainable farming practices.
          </p>
        </div>
      </section>

    </div>
  );
}

