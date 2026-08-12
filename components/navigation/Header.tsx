"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FlaskConical, Menu, X, UserCircle, LogOut } from "lucide-react";
import { useState } from "react";
import { logout } from "@/app/actions/auth";

interface HeaderProps {
  isLoggedIn?: boolean;
  userRole?: string | null;
}

export function Header({ isLoggedIn = false, userRole = null }: HeaderProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Hide the global Header on admin and distributor routes since they have their own layouts
  if (pathname?.startsWith('/admin') || pathname?.startsWith('/distributor')) {
    return null;
  }

  const navLinks = [
    { href: "/products", label: "Products" },
    { href: "/solutions", label: "Solutions" },
    { href: "/knowledge", label: "Knowledge" },
    { href: "/research", label: "Research" },
    { href: "/news-events", label: "News" },
    { href: "/blog", label: "Blog" },
    { href: "/about", label: "About" },
  ];

  const isActive = (href: string) => {
    if (href === "/" && pathname !== "/") return false;
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/90 backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-950/90">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-8">
        <Link href="/" className="flex items-center gap-3 mr-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-700 text-white shadow-sm">
            <FlaskConical className="h-6 w-6" />
          </div>
          <span className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white">
            VETKIND
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex flex-1 items-center gap-8 text-sm font-medium">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative py-2 transition-colors hover:text-green-700 dark:hover:text-green-400 ${
                  active
                    ? "text-green-700 dark:text-green-400 font-semibold"
                    : "text-zinc-600 dark:text-zinc-300"
                }`}
              >
                {link.label}
                {active && (
                  <span className="absolute left-0 bottom-0 h-0.5 w-full bg-green-600 dark:bg-green-500 rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="hidden lg:flex items-center gap-5 ml-auto">
          {isLoggedIn ? (
            <div className="flex items-center gap-4 border-l border-zinc-200 pl-5 dark:border-zinc-800">
              <Link
                href={userRole === 'ADMIN' ? '/admin/dashboard' : userRole === 'DISTRIBUTOR' ? '/distributor/dashboard' : '/dashboard'}
                className="flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
              >
                <UserCircle className="h-4 w-4" />
                Dashboard
              </Link>
              <form action={logout}>
                <button
                  type="submit"
                  className="flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-red-600 dark:text-zinc-500 dark:hover:text-red-500 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </form>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-sm font-medium text-zinc-600 hover:text-green-700 dark:text-zinc-300 dark:hover:text-green-400 transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="text-sm font-medium text-green-700 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 transition-colors"
              >
                Sign up
              </Link>
            </div>
          )}
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-full bg-zinc-900 px-6 py-2.5 text-sm font-bold text-white transition-all hover:bg-green-700 hover:shadow-md dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-green-500"
          >
            Contact Us
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="lg:hidden flex items-center justify-center p-2 text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-6 space-y-6 shadow-2xl absolute w-full h-[calc(100vh-5rem)] overflow-y-auto">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block text-lg font-medium p-2 rounded-lg transition-colors ${
                  isActive(link.href)
                    ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                    : "text-zinc-600 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-900"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800 flex flex-col gap-4">
            {isLoggedIn ? (
              <div className="flex flex-col gap-3">
                <Link
                  href={userRole === 'ADMIN' ? '/admin/dashboard' : userRole === 'DISTRIBUTOR' ? '/distributor/dashboard' : '/dashboard'}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 p-2 text-lg font-medium text-zinc-700 dark:text-zinc-200"
                >
                  <UserCircle className="h-5 w-5 text-zinc-400" />
                  Dashboard
                </Link>
                <form action={logout} className="w-full">
                  <button
                    type="submit"
                    className="flex w-full items-center gap-3 p-2 text-left text-lg font-medium text-zinc-500 hover:text-red-600 dark:text-zinc-400"
                  >
                    <LogOut className="h-5 w-5" />
                    Logout
                  </button>
                </form>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center rounded-xl border border-zinc-300 px-4 py-3 text-base font-bold text-zinc-700 dark:border-zinc-700 dark:text-zinc-200"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center rounded-xl bg-green-50 px-4 py-3 text-base font-bold text-green-800 dark:bg-green-900/30 dark:text-green-400"
                >
                  Sign up
                </Link>
              </div>
            )}
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-4 flex w-full items-center justify-center rounded-xl bg-zinc-900 px-5 py-4 text-base font-bold text-white transition-colors hover:bg-green-700 dark:bg-zinc-100 dark:text-zinc-900"
            >
              Contact Us
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
