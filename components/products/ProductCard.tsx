import Image from "next/image";
import Link from "next/link";

import { ProductWithRelations } from "@/lib/products";
import { formatPrice } from "@/lib/utils";

export function ProductCard({ product }: { product: ProductWithRelations }) {
  // Use the primary image if available, else fallback
  const primaryImage = product.image || "/product-mockup.png";

  return (
    <Link href={`/products/${product.slug}`} className="group flex flex-col rounded-2xl border border-zinc-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950 overflow-hidden">
      {/* Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900">
        <Image
          src={primaryImage}
          alt={product.name}
          fill
          className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {product.bestseller && (
          <div className="absolute top-3 left-3 flex items-center rounded-full bg-green-600 px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
            Bestseller
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-wider text-green-600 dark:text-green-400">
            {product.category || "General"}
          </span>
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            {product.packSize || ""}
          </span>
        </div>
        
        <h3 className="mb-2 text-lg font-bold text-zinc-900 dark:text-zinc-50">
          {product.name}
        </h3>
        
        <p className="mb-4 flex-1 text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">
          {product.shortDescription}
        </p>
        
        <div className="mt-auto flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800/50">
           <span className="font-bold text-zinc-900 dark:text-zinc-100">
             {product.price != null ? formatPrice(product.price) : ""}
           </span>
           <span className="text-sm font-medium text-green-600 group-hover:text-green-700 dark:text-green-400 dark:group-hover:text-green-300 transition-colors">
             View Details &rarr;
           </span>
        </div>
      </div>
    </Link>
  );
}
