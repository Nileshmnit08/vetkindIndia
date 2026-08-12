"use client";

import Link from "next/link";
import { Edit, Trash2, Eye, EyeOff } from "lucide-react";
import Image from "next/image";

type SpeciesWithCount = {
  id: string;
  name: string;
  slug: string;
  image: string | null;
  featured: boolean;
  isActive: boolean;
  sortOrder: number;
  _count: { products: number };
};

export function SpeciesTable({ species }: { species: SpeciesWithCount[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="bg-zinc-50 dark:bg-zinc-800/50 text-zinc-500 dark:text-zinc-400 border-b border-zinc-200 dark:border-zinc-800">
          <tr>
            <th className="px-6 py-4 font-medium">Species</th>
            <th className="px-6 py-4 font-medium">Products</th>
            <th className="px-6 py-4 font-medium">Order</th>
            <th className="px-6 py-4 font-medium">Status</th>
            <th className="px-6 py-4 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {species.map((item) => (
            <tr key={item.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
              <td className="px-6 py-4">
                <div className="flex items-center gap-4">
                  <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800">
                    {item.image ? (
                      <Image 
                        src={item.image} 
                        alt={item.name} 
                        fill 
                        className="object-cover" 
                        sizes="40px"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-zinc-400">
                        No Img
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-zinc-900 dark:text-white">{item.name}</p>
                    <p className="text-xs text-zinc-500">/{item.slug}</p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">
                {item._count.products}
              </td>
              <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">
                {item.sortOrder}
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${item.isActive ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                    {item.isActive ? 'Active' : 'Hidden'}
                  </span>
                  {item.featured && (
                    <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                      Featured
                    </span>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  <Link
                    href={`/admin/species/${item.id}/edit`}
                    className="p-2 text-zinc-400 hover:text-green-600 transition-colors"
                    title="Edit"
                  >
                    <Edit className="h-4 w-4" />
                  </Link>
                </div>
              </td>
            </tr>
          ))}
          {species.length === 0 && (
            <tr>
              <td colSpan={5} className="px-6 py-12 text-center text-zinc-500 dark:text-zinc-400">
                No species found. Create one to get started.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
