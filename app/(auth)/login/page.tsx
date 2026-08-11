"use client";

import { useActionState } from "react";
import { authenticate } from "@/app/actions/auth";
import Link from "next/link";
import { FlaskConical, AlertCircle, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [errorMessage, formAction, isPending] = useActionState(authenticate, undefined);

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-zinc-50 px-4 py-12 dark:bg-zinc-950 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-sm border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800">
        <div className="flex flex-col items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-600 text-white mb-4">
            <FlaskConical className="h-6 w-6" />
          </div>
          <h2 className="text-center text-3xl font-extrabold text-zinc-900 dark:text-white">
            Sign in to VetKind
          </h2>
          <p className="mt-2 text-center text-sm text-zinc-600 dark:text-zinc-400">
            Or{" "}
            <Link href="/register" className="font-medium text-green-600 hover:text-green-500 dark:text-green-500 dark:hover:text-green-400">
              create a new account
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" action={formAction}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="text"
                  autoComplete="email"
                  required
                  className="block w-full appearance-none rounded-lg border border-zinc-300 px-3 py-2 placeholder-zinc-400 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                  placeholder="admin or email@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="block w-full appearance-none rounded-lg border border-zinc-300 px-3 py-2 placeholder-zinc-400 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-zinc-300 text-green-600 focus:ring-green-500 dark:border-zinc-700 dark:bg-zinc-800"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-zinc-700 dark:text-zinc-300">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <Link href="/forgot-password" className="font-medium text-green-600 hover:text-green-500 dark:text-green-500 dark:hover:text-green-400">
                Forgot your password?
              </Link>
            </div>
          </div>

          {errorMessage && (
            <div className="rounded-md bg-red-50 p-4 dark:bg-red-900/30">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800 dark:text-red-300">{errorMessage}</h3>
                </div>
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isPending}
              className="flex w-full justify-center rounded-lg border border-transparent bg-green-600 py-2.5 px-4 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
