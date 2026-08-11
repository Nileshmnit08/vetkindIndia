"use client";

import { useState } from "react";
import { MoreHorizontal, Edit, AlertCircle, CheckCircle, Mail, Trash2 } from "lucide-react";
import Link from "next/link";
import { updateDistributorStatus, resendDistributorInvite, deleteDistributor } from "@/app/actions/admin";

interface DistributorTableActionsProps {
  id: string;
  status: string;
  name: string | null;
}

export function DistributorTableActions({ id, status, name }: DistributorTableActionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleStatusToggle = async () => {
    setIsUpdating(true);
    const newStatus = status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    await updateDistributorStatus(id, newStatus);
    setIsUpdating(false);
    setIsOpen(false);
  };

  const handleResendInvite = async () => {
    setIsUpdating(true);
    await resendDistributorInvite(id);
    setIsUpdating(false);
    setIsOpen(false);
    // Realistically you'd show a toast here
    alert("Invite resent successfully.");
  };

  const handleDelete = async () => {
    if (confirm(`Are you sure you want to delete distributor ${name || "Unknown"}? This action cannot be undone.`)) {
      setIsDeleting(true);
      await deleteDistributor(id);
      setIsDeleting(false);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          type="button"
          onClick={toggleDropdown}
          className="flex items-center rounded-full bg-transparent p-2 text-zinc-400 hover:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:hover:text-zinc-300"
          id={`menu-button-${id}`}
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <span className="sr-only">Open options</span>
          <MoreHorizontal className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          ></div>
          <div
            className="absolute right-0 z-20 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-zinc-800 dark:ring-zinc-700"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby={`menu-button-${id}`}
            tabIndex={-1}
          >
            <div className="py-1" role="none">
              <Link
                href={`/admin/distributors/${id}/edit`}
                className="group flex items-center px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-700 dark:hover:text-white"
                role="menuitem"
                tabIndex={-1}
                onClick={() => setIsOpen(false)}
              >
                <Edit className="mr-3 h-4 w-4 text-zinc-400 group-hover:text-zinc-500" aria-hidden="true" />
                Edit / View Profile
              </Link>
              
              <button
                onClick={handleStatusToggle}
                disabled={isUpdating}
                className="group flex w-full items-center px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-700 dark:hover:text-white disabled:opacity-50"
                role="menuitem"
                tabIndex={-1}
              >
                {status === "ACTIVE" ? (
                  <>
                    <AlertCircle className="mr-3 h-4 w-4 text-zinc-400 group-hover:text-amber-500" aria-hidden="true" />
                    Suspend Account
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-3 h-4 w-4 text-zinc-400 group-hover:text-green-500" aria-hidden="true" />
                    Reactivate Account
                  </>
                )}
              </button>

              <button
                onClick={handleResendInvite}
                disabled={isUpdating}
                className="group flex w-full items-center px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-700 dark:hover:text-white disabled:opacity-50"
                role="menuitem"
                tabIndex={-1}
              >
                <Mail className="mr-3 h-4 w-4 text-zinc-400 group-hover:text-blue-500" aria-hidden="true" />
                Resend Invite
              </button>

              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="group flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-500 dark:hover:bg-red-950/30 disabled:opacity-50"
                role="menuitem"
                tabIndex={-1}
              >
                <Trash2 className="mr-3 h-4 w-4 text-red-400 group-hover:text-red-500" aria-hidden="true" />
                {isDeleting ? "Deleting..." : "Delete Account"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
