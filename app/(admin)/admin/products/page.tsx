import { PrismaClient, Prisma } from "@prisma/client";
import { Plus } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { ProductFilters } from "@/components/admin/ProductFilters";
import { ProductTableActions } from "@/components/admin/ProductTableActions";

const prisma = new PrismaClient();

interface AdminProductsPageProps {
  searchParams: Promise<{
    q?: string;
    species?: string;
    status?: string;
  }>;
}

export default async function AdminProductsPage({ searchParams }: AdminProductsPageProps) {
  const resolvedParams = await searchParams;
  const query = resolvedParams.q || "";
  const species = resolvedParams.species || "";
  const status = resolvedParams.status || "";

  // Build the Prisma where clause dynamically based on searchParams
  const where: Prisma.ProductWhereInput = {};
  
  if (query) {
    where.name = { contains: query };
  }
  
  if (species) {
    where.species = { slug: species };
  }
  
  if (status) {
    if (status === "published") where.published = true;
    if (status === "draft") where.published = false;
  }

  const products = await prisma.product.findMany({
    where,
    include: { species: true },
    orderBy: { createdAt: "desc" },
  });

  const speciesOptions = await prisma.species.findMany({
    select: { id: true, name: true, slug: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Products</h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Manage your product catalogue and variants.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <Link
            href="/admin/products/new"
            className="inline-flex items-center justify-center rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:w-auto"
          >
            <Plus className="-ml-1 mr-2 h-4 w-4" aria-hidden="true" />
            Add Product
          </Link>
        </div>
      </div>

      <ProductFilters speciesOptions={speciesOptions} />

      <div className="mt-4 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg border border-zinc-200 dark:border-zinc-800">
              <table className="min-w-full divide-y divide-zinc-300 dark:divide-zinc-800">
                <thead className="bg-zinc-50 dark:bg-zinc-900/50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-200 sm:pl-6 w-1/3">
                      Product
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-200">
                      Species
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-200">
                      Status
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-200">
                      Price
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-zinc-900 dark:text-zinc-200">
                      Created
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 bg-white dark:bg-zinc-900">
                  {products.length > 0 ? (
                    products.map((product) => (
                      <tr key={product.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0 rounded bg-zinc-100 dark:bg-zinc-800 overflow-hidden flex items-center justify-center border border-zinc-200 dark:border-zinc-700">
                              {product.image ? (
                                <img src={product.image} alt="" className="h-10 w-10 object-cover" />
                              ) : (
                                <span className="text-zinc-400 text-xs font-medium">IMG</span>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="font-medium text-zinc-900 dark:text-zinc-100">{product.name}</div>
                              <div className="text-zinc-500 dark:text-zinc-400">{product.slug}</div>
                            </div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-zinc-500 dark:text-zinc-400">
                          {(product as any).species?.name || "-"}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-zinc-500 dark:text-zinc-400">
                          <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                            product.published 
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" 
                              : "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300"
                          }`}>
                            {product.published ? "Published" : "Draft"}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-zinc-500 dark:text-zinc-400">
                          {product.price != null ? formatPrice(product.price) : "-"}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-zinc-500 dark:text-zinc-400">
                          {new Date(product.createdAt).toLocaleDateString()}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <ProductTableActions id={product.id} published={product.published} slug={product.slug} />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-sm text-zinc-500 dark:text-zinc-400">
                        <div className="flex flex-col items-center justify-center space-y-3">
                          <div className="rounded-full bg-zinc-100 p-3 dark:bg-zinc-800">
                            <Plus className="h-6 w-6 text-zinc-400" />
                          </div>
                          <p>No products found matching your criteria.</p>
                          <Link 
                            href="/admin/products/new" 
                            className="text-green-600 hover:text-green-500 font-medium"
                          >
                            Add a new product
                          </Link>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
