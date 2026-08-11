import { getProducts } from "@/lib/products";
import { ProductCard } from "@/components/products/ProductCard";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface RelatedProductsProps {
  currentProductId: string;
  category?: string | null;
}

export async function RelatedProducts({ currentProductId, category }: RelatedProductsProps) {
  // Fetch a few products from the same category, or just general featured products if no category
  const { data: products } = await getProducts({ 
    category: category || undefined,
    limit: 4 
  });

  const related = products.filter(p => p.id !== currentProductId).slice(0, 3);

  if (related.length === 0) {
    return null;
  }

  return (
    <section className="py-16 md:py-24 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
              Recommended With This Product
            </h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Other products frequently used alongside this treatment.
            </p>
          </div>
          <Link href="/products" className="inline-flex items-center text-sm font-medium text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300">
            View full catalogue <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
