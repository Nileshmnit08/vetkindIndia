"use client";

import { useState } from "react";
import { MoreVertical, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { toggleKnowledgeArticleStatus, deleteKnowledgeArticle } from "@/app/actions/knowledge";
import { useRouter } from "next/navigation";

interface KnowledgeTableActionsProps {
  id: string;
  status: string;
  title: string;
}

export function KnowledgeTableActions({ id, status, title }: KnowledgeTableActionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();

  const handleToggleStatus = async () => {
    setIsUpdating(true);
    await toggleKnowledgeArticleStatus(id, status);
    setIsUpdating(false);
    setIsOpen(false);
  };

  const handleDelete = async () => {
    if (confirm(`Are you sure you want to delete the article "${title}"? This cannot be undone.`)) {
      setIsUpdating(true);
      await deleteKnowledgeArticle(id);
      setIsUpdating(false);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isUpdating}
        className="flex items-center text-zinc-400 hover:text-zinc-600 focus:outline-none dark:hover:text-zinc-300"
      >
        <span className="sr-only">Open options</span>
        <MoreVertical className="h-5 w-5" aria-hidden="true" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 z-20 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-zinc-800 dark:ring-zinc-700">
            <div className="py-1">
              <Link
                href={`/admin/knowledge/${id}/edit`}
                className="group flex items-center px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-700 dark:hover:text-white"
                onClick={() => setIsOpen(false)}
              >
                <Edit className="mr-3 h-4 w-4 text-zinc-400 group-hover:text-zinc-500" aria-hidden="true" />
                Edit
              </Link>
              <button
                onClick={handleToggleStatus}
                className="group flex w-full items-center px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-700 dark:hover:text-white"
              >
                {status === "PUBLISHED" ? (
                  <>
                    <EyeOff className="mr-3 h-4 w-4 text-zinc-400 group-hover:text-zinc-500" aria-hidden="true" />
                    Unpublish
                  </>
                ) : (
                  <>
                    <Eye className="mr-3 h-4 w-4 text-zinc-400 group-hover:text-zinc-500" aria-hidden="true" />
                    Publish
                  </>
                )}
              </button>
              <button
                onClick={handleDelete}
                className="group flex w-full items-center px-4 py-2 text-sm text-red-700 hover:bg-red-50 hover:text-red-900 dark:text-red-400 dark:hover:bg-red-900/30 dark:hover:text-red-300"
              >
                <Trash2 className="mr-3 h-4 w-4 text-red-400 group-hover:text-red-500" aria-hidden="true" />
                Delete
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
