"use client";

import { useActionState, useState } from "react";
import { submitInquiry } from "@/app/actions/distributor";
import { Send, CheckCircle2, AlertCircle, Loader2, MessageSquare } from "lucide-react";

const initialState = { success: false, error: null };

export default function DistributorInquiriesPage() {
  const [result, formAction, isPending] = useActionState(submitInquiry, initialState);
  const [isSuccess, setIsSuccess] = useState(false);

  // We can track success via useEffect if we want, but since submitInquiry returns { success: true },
  // we can use a simpler conditional render based on result.
  if (result?.success && !isSuccess) {
    setIsSuccess(true);
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Order Requests & Inquiries</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Submit bulk order requests or ask commercial questions directly to the VetKind sales team.
        </p>
      </div>

      <div className="mt-8 bg-white dark:bg-zinc-900 shadow-sm rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        <div className="p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-zinc-200 dark:border-zinc-800">
            <div className="p-3 rounded-lg bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400">
              <MessageSquare className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-medium text-zinc-900 dark:text-white">New Request</h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Fill out the form below to submit your request.</p>
            </div>
          </div>

          {isSuccess ? (
            <div className="rounded-lg bg-green-50 p-6 dark:bg-green-900/30 text-center">
              <CheckCircle2 className="mx-auto h-12 w-12 text-green-400" aria-hidden="true" />
              <h3 className="mt-4 text-lg font-medium text-green-800 dark:text-green-300">Request Submitted Successfully</h3>
              <p className="mt-2 text-sm text-green-700 dark:text-green-400">
                Our sales team has received your request and will contact you shortly.
              </p>
              <button
                type="button"
                onClick={() => setIsSuccess(false)}
                className="mt-6 inline-flex items-center justify-center rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
              >
                Submit Another Request
              </button>
            </div>
          ) : (
            <form action={formAction} className="space-y-6">
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Contact Name
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="name"
                      id="name"
                      required
                      className="block w-full rounded-lg border border-zinc-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Company / Farm Name
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="company"
                      id="company"
                      required
                      className="block w-full rounded-lg border border-zinc-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="email" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Email Address
                  </label>
                  <div className="mt-1">
                    <input
                      type="email"
                      name="email"
                      id="email"
                      required
                      className="block w-full rounded-lg border border-zinc-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="message" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Request Details (Products & Quantities)
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      required
                      className="block w-full rounded-lg border border-zinc-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                    />
                  </div>
                  <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                    Please specify the products, required quantities, and delivery location.
                  </p>
                </div>
              </div>

              {result?.error && (
                <div className="rounded-md bg-red-50 p-4 dark:bg-red-900/30">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800 dark:text-red-300">Error submitting request</h3>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isPending}
                  className="inline-flex justify-center rounded-lg border border-transparent bg-green-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-5 w-5" />
                      Submit Request
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
