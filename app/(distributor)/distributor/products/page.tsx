import { PrismaClient } from "@prisma/client";
import { Search, Download, ExternalLink } from "lucide-react";

const prisma = new PrismaClient();

export default async function DistributorProductsPage() {
  const products = await prisma.product.findMany({
    where: { published: true },
    include: {
      resources: {
        where: {
          visibility: { in: ["PUBLIC", "DISTRIBUTOR"] }
        }
      }
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Products & Resources</h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Browse our complete catalog and download distributor-exclusive materials.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <div className="relative rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-4 w-4 text-zinc-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              name="search"
              id="search"
              className="block w-full rounded-lg border border-zinc-300 pl-10 px-3 py-2 placeholder-zinc-400 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              placeholder="Search products..."
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-8">
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product.id} className="flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex-1 p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300">
                    {product.category}
                  </span>
                  {product.packSize && (
                    <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                      {product.packSize}
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">{product.name}</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-3">
                  {product.shortDescription || product.description || "No description available."}
                </p>
                {product.price && (
                  <p className="mt-4 text-lg font-bold text-green-600 dark:text-green-500">
                    ₹{product.price} <span className="text-xs font-normal text-zinc-500">Distributor Price</span>
                  </p>
                )}
              </div>
              <div className="border-t border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900/50">
                <h4 className="text-sm font-medium text-zinc-900 dark:text-white mb-3">Resources</h4>
                {product.resources.length > 0 ? (
                  <ul className="space-y-2">
                    {product.resources.map((resource) => (
                      <li key={resource.id}>
                        <a 
                          href={resource.fileUrl} 
                          target="_blank" 
                          rel="noreferrer"
                          className="group flex items-center text-sm font-medium text-zinc-600 hover:text-green-600 dark:text-zinc-400 dark:hover:text-green-500 transition-colors"
                        >
                          <Download className="mr-2 h-4 w-4 text-zinc-400 group-hover:text-green-600 dark:group-hover:text-green-500" />
                          {resource.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">No resources available for this product.</p>
                )}
                <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                  <a href={`/products/${product.slug}`} target="_blank" rel="noreferrer" className="inline-flex items-center text-sm font-medium text-green-600 hover:text-green-500 dark:text-green-500 dark:hover:text-green-400">
                    View public page <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center border-2 border-dashed border-zinc-300 rounded-xl dark:border-zinc-800">
            <h3 className="mt-2 text-sm font-semibold text-zinc-900 dark:text-white">No products</h3>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Check back later for updated product catalogue.</p>
          </div>
        )}
      </div>
    </div>
  );
}
