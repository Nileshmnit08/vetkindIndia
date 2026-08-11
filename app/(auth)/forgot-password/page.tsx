"use client";

import Link from "next/link";
import { FlaskConical, AlertCircle, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-zinc-50 px-4 py-12 dark:bg-zinc-950 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-sm border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800">
        <div className="flex flex-col items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-600 text-white mb-4">
            <FlaskConical className="h-6 w-6" />
          </div>
          <h2 className="text-center text-3xl font-extrabold text-zinc-900 dark:text-white">
            Reset Password
          </h2>
          <p className="mt-2 text-center text-sm text-zinc-600 dark:text-zinc-400">
            Enter your email address and we&apos;ll send you a link to reset your password.
          </p>
        </div>

        <div className="rounded-md bg-amber-50 p-4 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800/50">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-amber-800 dark:text-amber-300">Development Mode</h3>
              <div className="mt-2 text-sm text-amber-700 dark:text-amber-400">
                <p>Email sending is not configured yet. This is a scaffolded UI for the password reset flow.</p>
              </div>
            </div>
          </div>
        </div>

        <form className="mt-8 space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Email address
            </label>
            <div className="mt-1">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="block w-full appearance-none rounded-lg border border-zinc-300 px-3 py-2 placeholder-zinc-400 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                placeholder="farmer@example.com"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-lg border border-transparent bg-green-600 py-2.5 px-4 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
            >
              Send Reset Link
            </button>
          </div>
        </form>
        
        <div className="text-center">
          <Link href="/login" className="inline-flex items-center text-sm font-medium text-green-600 hover:text-green-500 dark:text-green-500 dark:hover:text-green-400">
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
