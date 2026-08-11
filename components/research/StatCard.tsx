import React from "react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  number: string;
  label: string;
  icon?: LucideIcon;
}

export function StatCard({ number, label, icon: Icon }: StatCardProps) {
  return (
    <div className="flex flex-col items-center p-6 text-center rounded-2xl bg-white shadow-sm border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800 transition-transform hover:-translate-y-1">
      {Icon && (
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
          <Icon className="h-6 w-6" />
        </div>
      )}
      <span className="text-3xl font-extrabold text-zinc-900 dark:text-white mb-2">{number}</span>
      <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">{label}</span>
    </div>
  );
}
