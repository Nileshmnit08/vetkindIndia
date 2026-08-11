"use client";

import { FlaskConical } from "lucide-react";

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-zinc-50 px-4 py-12 dark:bg-zinc-950 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-sm border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800">
        <div className="flex flex-col items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-600 text-white mb-4">
            <FlaskConical className="h-6 w-6" />
          </div>
          <h2 className="text-center text-3xl font-extrabold text-zinc-900 dark:text-white">
            Create New Password
          </h2>
          <p className="mt-2 text-center text-sm text-zinc-600 dark:text-zinc-400">
            Please enter your new password below.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                New Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="block w-full appearance-none rounded-lg border border-zinc-300 px-3 py-2 placeholder-zinc-400 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Confirm New Password
              </label>
              <div className="mt-1">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="block w-full appearance-none rounded-lg border border-zinc-300 px-3 py-2 placeholder-zinc-400 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-lg border border-transparent bg-green-600 py-2.5 px-4 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
            >
              Update Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
