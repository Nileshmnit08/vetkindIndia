"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Search, Filter, ChevronDown, CheckCircle, 
  Clock, XCircle, AlertTriangle, FileText, 
  Phone, Mail, MapPin, Tag, ChevronLeft, ChevronRight, User, Inbox
} from "lucide-react";

const getStatusColor = (status: string) => {
  switch(status.toUpperCase()) {
    case 'NEW': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
    case 'OPEN': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
    case 'IN PROGRESS': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
    case 'CONTACTED': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
    case 'QUALIFIED': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
    case 'CONVERTED': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400';
    case 'SPAM': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
    case 'CLOSED': return 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-400';
    default: return 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-400';
  }
};

const getPriorityColor = (priority: string) => {
  switch(priority?.toUpperCase()) {
    case 'URGENT': return 'text-red-600 dark:text-red-400 font-bold';
    case 'HIGH': return 'text-orange-600 dark:text-orange-400 font-semibold';
    case 'MEDIUM': return 'text-zinc-600 dark:text-zinc-400';
    case 'LOW': return 'text-zinc-400 dark:text-zinc-500';
    default: return 'text-zinc-600 dark:text-zinc-400';
  }
};

export default function InquiryListClient({ 
  initialInquiries,
  totalCount,
  admins
}: { 
  initialInquiries: any[],
  totalCount: number,
  admins: any[]
}) {
  const [inquiries, setInquiries] = useState(initialInquiries);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const limit = 20;

  useEffect(() => {
    // Only skip the first render if we rely entirely on Server Actions for navigation.
    // In a full implementation we would call getInquiries action here when filters change.
    // For simplicity with initialData, we'll implement simple client-side filtering 
    // for demonstration if search is used without hitting DB, OR we could hit DB.
    // Here we'll stick to a basic structure that assumes we fetch data from the server.
  }, [search, statusFilter, page]);

  // Client-side simple filter for demonstration (in production, use server action to fetch)
  const filtered = inquiries.filter(i => {
    if (statusFilter !== "ALL" && i.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!i.name?.toLowerCase().includes(q) && 
          !i.email?.toLowerCase().includes(q) && 
          !i.company?.toLowerCase().includes(q)) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Filters Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800">
        <div className="relative w-full sm:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-zinc-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 rounded-md border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-3 py-2 text-sm focus:border-green-500 focus:ring-green-500 dark:text-white"
            placeholder="Search name, email, company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className="flex gap-4 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="block w-full sm:w-48 rounded-md border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-3 py-2 text-sm focus:border-green-500 focus:ring-green-500 dark:text-white"
          >
            <option value="ALL">All Statuses</option>
            <option value="NEW">New</option>
            <option value="OPEN">Open</option>
            <option value="IN PROGRESS">In Progress</option>
            <option value="CONTACTED">Contacted</option>
            <option value="QUALIFIED">Qualified</option>
            <option value="CONVERTED">Converted</option>
            <option value="CLOSED">Closed</option>
            <option value="SPAM">Spam</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800">
            <thead className="bg-zinc-50 dark:bg-zinc-900/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Lead</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Type / Source</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Assignee</th>
                <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {filtered.length > 0 ? (
                filtered.map((inquiry) => (
                  <tr key={inquiry.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                    <td suppressHydrationWarning className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500 dark:text-zinc-400">
                      {new Date(inquiry.created_at || inquiry.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-medium text-zinc-900 dark:text-white">{inquiry.name}</span>
                        <span className="text-xs text-zinc-500 dark:text-zinc-400">{inquiry.company || inquiry.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm text-zinc-900 dark:text-zinc-300 capitalize">{inquiry.inquiry_type || 'General'}</span>
                        <span className="text-xs text-zinc-500 capitalize">{inquiry.source?.replace('_', ' ') || '-'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={getPriorityColor(inquiry.priority)}>
                        {inquiry.priority || 'Medium'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${getStatusColor(inquiry.status)}`}>
                        {inquiry.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500">
                      {inquiry.assigned_to?.name || <span className="text-zinc-400 italic">Unassigned</span>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link href={`/admin/inquiries/${inquiry.id}`} className="text-green-600 hover:text-green-900 dark:text-green-500 dark:hover:text-green-400">
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <Inbox className="h-10 w-10 text-zinc-300 dark:text-zinc-600 mb-4" />
                      <p className="text-sm font-medium text-zinc-900 dark:text-white">No inquiries found</p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Try adjusting your filters or search query.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="bg-zinc-50 dark:bg-zinc-900/50 px-6 py-3 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <div className="text-sm text-zinc-500 dark:text-zinc-400">
            Showing <span className="font-medium">{filtered.length}</span> results
          </div>
          <div className="flex gap-2">
            <button disabled className="p-1 rounded bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-400 disabled:opacity-50">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button disabled className="p-1 rounded bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-400 disabled:opacity-50">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
