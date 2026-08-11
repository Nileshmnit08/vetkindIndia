"use client";

import { useState } from "react";
import { deleteProduct, toggleProductStatus } from "@/app/actions/admin";
import { MoreHorizontal, Edit, Trash, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

interface ProductTableActionsProps {
  id: string;
  published: boolean;
  slug: string;
}

export function ProductTableActions({ id, published, slug }: ProductTableActionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  const handleTogglePublish = async () => {
    setIsToggling(true);
    await toggleProductStatus(id, !published);
    setIsToggling(false);
    setIsOpen(false);
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
      setIsDeleting(true);
      await deleteProduct(id);
      setIsDeleting(false);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-center rounded-full p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-500 focus:outline-none dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <span className="sr-only">Open options</span>
          <MoreHorizontal className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      {isOpen && (
        <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-zinc-900 dark:ring-zinc-700">
          <div className="py-1" role="menu" aria-orientation="vertical">
            <Link
              href={`/admin/products/${id}/edit`}
              className="group flex items-center px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white"
              role="menuitem"
            >
              <Edit className="mr-3 h-4 w-4 text-zinc-400 group-hover:text-zinc-500 dark:text-zinc-500 dark:group-hover:text-zinc-400" aria-hidden="true" />
              Edit
            </Link>
            
            <Link
              href={`/products/${slug}`}
              target="_blank"
              className="group flex items-center px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white"
              role="menuitem"
            >
              <Eye className="mr-3 h-4 w-4 text-zinc-400 group-hover:text-zinc-500 dark:text-zinc-500 dark:group-hover:text-zinc-400" aria-hidden="true" />
              View on site
            </Link>

            <button
              type="button"
              onClick={handleTogglePublish}
              disabled={isToggling}
              className="group flex w-full items-center px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white"
              role="menuitem"
            >
              {published ? (
                <>
                  <EyeOff className="mr-3 h-4 w-4 text-zinc-400 group-hover:text-zinc-500 dark:text-zinc-500 dark:group-hover:text-zinc-400" aria-hidden="true" />
                  {isToggling ? "Unpublishing..." : "Unpublish"}
                </>
              ) : (
                <>
                  <Eye className="mr-3 h-4 w-4 text-zinc-400 group-hover:text-zinc-500 dark:text-zinc-500 dark:group-hover:text-zinc-400" aria-hidden="true" />
                  {isToggling ? "Publishing..." : "Publish"}
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="group flex w-full items-center px-4 py-2 text-sm text-red-700 hover:bg-red-50 hover:text-red-900 dark:text-red-500 dark:hover:bg-red-900/30 dark:hover:text-red-400"
              role="menuitem"
            >
              <Trash className="mr-3 h-4 w-4 text-red-400 group-hover:text-red-500 dark:text-red-500 dark:group-hover:text-red-400" aria-hidden="true" />
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      )}
      
      {/* Invisible backdrop to close the menu when clicking outside */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
