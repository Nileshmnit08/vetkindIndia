"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import Link from "next/link";

export default function InquiriesError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Inquiries route error:", error);
  }, [error]);

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Inquiries CRM</h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Manage contact form submissions, distributor requests, and leads.
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center rounded-xl border border-zinc-200 bg-white p-12 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mb-4 rounded-full bg-red-100 p-4 dark:bg-red-900/30">
          <AlertTriangle className="h-10 w-10 text-red-600 dark:text-red-500" />
        </div>
        
        <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
          Something went wrong
        </h3>
        
        <p className="mt-2 max-w-md text-sm text-zinc-500 dark:text-zinc-400">
          An unexpected error occurred while loading the inquiries dashboard. 
          The database might be unavailable or a configuration issue occurred.
        </p>

        {process.env.NODE_ENV === "development" && (
          <div className="mt-4 max-w-lg rounded-md bg-zinc-100 p-3 text-left text-xs font-mono text-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 overflow-auto">
            {error.message || "Unknown error"}
          </div>
        )}

        <div className="mt-8 flex gap-4">
          <button
            onClick={() => reset()}
            className="inline-flex items-center rounded-md border border-transparent bg-zinc-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 dark:focus:ring-white"
          >
            <RotateCcw className="mr-2 -ml-1 h-4 w-4" />
            Try again
          </button>
          
          <Link
            href="/admin/dashboard"
            className="inline-flex items-center rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
