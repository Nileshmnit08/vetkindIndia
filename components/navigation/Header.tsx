"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FlaskConical, Menu, X } from "lucide-react";
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
    { href: "/about", label: "About" },
  ];

  const isActive = (href: string) => {
    if (href === "/" && pathname !== "/") return false;
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-600 text-white">
            <FlaskConical className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
            VETKIND
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`transition-colors hover:text-green-600 dark:hover:text-green-400 ${
                isActive(link.href)
                  ? "text-green-600 dark:text-green-400 font-semibold"
                  : "text-zinc-600 dark:text-zinc-300"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          {isLoggedIn ? (
            <>
              <Link
                href={userRole === 'ADMIN' ? '/admin/dashboard' : userRole === 'DISTRIBUTOR' ? '/distributor/dashboard' : '/dashboard'}
                className="text-sm font-medium text-zinc-600 hover:text-green-600 dark:text-zinc-300 dark:hover:text-green-400 transition-colors"
              >
                Dashboard
              </Link>
              <form action={logout}>
                <button
                  type="submit"
                  className="text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-500 transition-colors"
                >
                  Logout
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-zinc-600 hover:text-green-600 dark:text-zinc-300 dark:hover:text-green-400 transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="text-sm font-medium text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 transition-colors"
              >
                Sign up
              </Link>
            </>
          )}
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-full bg-zinc-900 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 ml-2"
          >
            Contact Us
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden flex items-center justify-center p-2 text-zinc-600 dark:text-zinc-300"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-4 space-y-4 shadow-lg absolute w-full">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`block text-base font-medium ${
                isActive(link.href)
                  ? "text-green-600 dark:text-green-400"
                  : "text-zinc-600 dark:text-zinc-300"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 flex flex-col gap-3">
            {isLoggedIn ? (
              <>
                <Link
                  href={userRole === 'ADMIN' ? '/admin/dashboard' : userRole === 'DISTRIBUTOR' ? '/distributor/dashboard' : '/dashboard'}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-base font-medium text-zinc-600 dark:text-zinc-300"
                >
                  Dashboard
                </Link>
                <form action={logout} className="w-full">
                  <button
                    type="submit"
                    className="flex w-full text-left text-base font-medium text-red-600 dark:text-red-500"
                  >
                    Logout
                  </button>
                </form>
              </>
            ) : (
              <div className="flex gap-4">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 dark:border-zinc-700 dark:text-zinc-300"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center rounded-lg border border-transparent bg-green-100 px-4 py-2 text-sm font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400"
                >
                  Sign up
                </Link>
              </div>
            )}
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-2 flex w-full items-center justify-center rounded-full bg-green-600 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-green-700"
            >
              Contact Us
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
