import React from "react";
import { FileText, ExternalLink } from "lucide-react";

interface ReferenceCardProps {
  title: string;
  authors: string;
  journal: string;
  year: string;
  doi?: string;
  summary: string;
}

export function ReferenceCard({ title, authors, journal, year, doi, summary }: ReferenceCardProps) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 transition-colors hover:border-green-200 dark:hover:border-green-900/50">
      <div className="flex gap-4 items-start">
        <FileText className="h-6 w-6 text-green-600 dark:text-green-500 shrink-0 mt-1" />
        <div className="flex-1">
          <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-lg mb-1 leading-tight">
            {title}
          </h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-3">
            {authors} • <span className="italic">{journal}</span>, {year}
          </p>
          <p className="text-zinc-700 dark:text-zinc-300 text-sm leading-relaxed mb-3">
            {summary}
          </p>
          {doi && (
            <a 
              href={doi} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm font-medium text-green-600 hover:text-green-700 dark:text-green-500 dark:hover:text-green-400"
            >
              View Publication <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
