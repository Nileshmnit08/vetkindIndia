"use client";

import { useState } from "react";
import { updateInquiryStatus } from "@/app/actions/admin";
import { CheckCircle2, CircleDashed, Archive } from "lucide-react";
import { useRouter } from "next/navigation";

interface InquiryStatusActionsProps {
  inquiryId: string;
  currentStatus: string;
}

export function InquiryStatusActions({ inquiryId, currentStatus }: InquiryStatusActionsProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleUpdateStatus = async (status: string) => {
    if (status === currentStatus) return;
    
    setLoading(true);
    try {
      const result = await updateInquiryStatus(inquiryId, status);
      if (result.success) {
        router.refresh();
      } else {
        alert(result.error || "Failed to update status");
      }
    } catch (e) {
      alert("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Current Status: <span className="font-bold">{currentStatus}</span></p>
      
      <button
        onClick={() => handleUpdateStatus('NEW')}
        disabled={loading || currentStatus === 'NEW'}
        className={`w-full flex items-center justify-between px-4 py-2 text-sm rounded-md transition-colors ${
          currentStatus === 'NEW' 
            ? 'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800' 
            : 'bg-white text-zinc-700 border border-zinc-200 hover:bg-zinc-50 dark:bg-zinc-900 dark:text-zinc-300 dark:border-zinc-700 dark:hover:bg-zinc-800'
        }`}
      >
        <span className="flex items-center gap-2">
          <CircleDashed className="h-4 w-4" /> Mark as New
        </span>
        {currentStatus === 'NEW' && <CheckCircle2 className="h-4 w-4" />}
      </button>

      <button
        onClick={() => handleUpdateStatus('CONTACTED')}
        disabled={loading || currentStatus === 'CONTACTED'}
        className={`w-full flex items-center justify-between px-4 py-2 text-sm rounded-md transition-colors ${
          currentStatus === 'CONTACTED' 
            ? 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800' 
            : 'bg-white text-zinc-700 border border-zinc-200 hover:bg-zinc-50 dark:bg-zinc-900 dark:text-zinc-300 dark:border-zinc-700 dark:hover:bg-zinc-800'
        }`}
      >
        <span className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" /> Mark as Contacted
        </span>
        {currentStatus === 'CONTACTED' && <CheckCircle2 className="h-4 w-4" />}
      </button>

      <button
        onClick={() => handleUpdateStatus('ARCHIVED')}
        disabled={loading || currentStatus === 'ARCHIVED'}
        className={`w-full flex items-center justify-between px-4 py-2 text-sm rounded-md transition-colors ${
          currentStatus === 'ARCHIVED' 
            ? 'bg-zinc-100 text-zinc-700 border border-zinc-300 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700' 
            : 'bg-white text-zinc-700 border border-zinc-200 hover:bg-zinc-50 dark:bg-zinc-900 dark:text-zinc-300 dark:border-zinc-700 dark:hover:bg-zinc-800'
        }`}
      >
        <span className="flex items-center gap-2">
          <Archive className="h-4 w-4" /> Archive Inquiry
        </span>
        {currentStatus === 'ARCHIVED' && <CheckCircle2 className="h-4 w-4" />}
      </button>
    </div>
  );
}
