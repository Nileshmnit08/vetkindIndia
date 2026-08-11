"use client";

import { useActionState, useEffect } from "react";
import { registerUser } from "@/app/actions/auth";
import Link from "next/link";
import { FlaskConical, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [message, formAction, isPending] = useActionState(registerUser, undefined);
  const router = useRouter();

  useEffect(() => {
    if (message === "Success") {
      // Redirect to login after successful registration
      const timer = setTimeout(() => {
        router.push("/login");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [message, router]);

  const isSuccess = message === "Success";

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-zinc-50 px-4 py-12 dark:bg-zinc-950 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-sm border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800">
        <div className="flex flex-col items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-600 text-white mb-4">
            <FlaskConical className="h-6 w-6" />
          </div>
          <h2 className="text-center text-3xl font-extrabold text-zinc-900 dark:text-white">
            Create an Account
          </h2>
          <p className="mt-2 text-center text-sm text-zinc-600 dark:text-zinc-400">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-green-600 hover:text-green-500 dark:text-green-500 dark:hover:text-green-400">
              Sign in
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" action={formAction}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Full Name
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  className="block w-full appearance-none rounded-lg border border-zinc-300 px-3 py-2 placeholder-zinc-400 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                  placeholder="John Doe"
                />
              </div>
            </div>

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
              <label htmlFor="password" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="block w-full appearance-none rounded-lg border border-zinc-300 px-3 py-2 placeholder-zinc-400 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Confirm Password
              </label>
              <div className="mt-1">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="block w-full appearance-none rounded-lg border border-zinc-300 px-3 py-2 placeholder-zinc-400 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          {message && (
            <div className={`rounded-md p-4 ${isSuccess ? 'bg-green-50 dark:bg-green-900/30' : 'bg-red-50 dark:bg-red-900/30'}`}>
              <div className="flex">
                <div className="flex-shrink-0">
                  {isSuccess ? (
                    <CheckCircle2 className="h-5 w-5 text-green-400" aria-hidden="true" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
                  )}
                </div>
                <div className="ml-3">
                  <h3 className={`text-sm font-medium ${isSuccess ? 'text-green-800 dark:text-green-300' : 'text-red-800 dark:text-red-300'}`}>
                    {isSuccess ? "Registration successful! Redirecting to login..." : message}
                  </h3>
                </div>
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isPending || isSuccess}
              className="flex w-full justify-center rounded-lg border border-transparent bg-green-600 py-2.5 px-4 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
