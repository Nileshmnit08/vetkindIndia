import { auth } from "@/auth";
import { logout } from "@/app/actions/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { 
  LayoutDashboard, 
  Package, 
  MessageSquare,
  LogOut,
  FlaskConical
} from "lucide-react";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Distributor Portal | VetKind",
  description: "VetKind Distributor Portal",
};

export default async function DistributorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Admin can also access this layout if needed, but normally it's for distributors
  if (!session?.user || (session.user.role !== "DISTRIBUTOR" && session.user.role !== "ADMIN")) {
    redirect("/login");
  }

  const navigation = [
    { name: 'Dashboard', href: '/distributor/dashboard', icon: LayoutDashboard },
    { name: 'Products & Resources', href: '/distributor/products', icon: Package },
    { name: 'Order Requests', href: '/distributor/inquiries', icon: MessageSquare },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-zinc-950">
      {/* Top Navigation */}
      <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white px-4 py-3 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-600 text-white">
              <FlaskConical className="h-5 w-5" />
            </div>
            <span className="font-bold text-zinc-900 dark:text-white">Distributor Portal</span>
          </Link>
          
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end mr-4">
              <span className="text-sm font-medium text-zinc-900 dark:text-white">
                {session.user.name}
              </span>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                {session.user.email}
              </span>
            </div>
            <form action={logout}>
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-lg bg-white px-3 py-2 text-sm font-medium text-red-600 shadow-sm border border-zinc-200 hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:bg-zinc-900 dark:border-zinc-800 dark:hover:bg-zinc-800"
              >
                <LogOut className="h-4 w-4 sm:mr-2" aria-hidden="true" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </form>
          </div>
        </div>
        
        {/* Horizontal Nav */}
        <nav className="mt-4 flex space-x-4 overflow-x-auto pb-2">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 hover:text-green-600 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-green-500 transition-colors"
            >
              <item.icon
                className="mr-2 h-4 w-4 flex-shrink-0"
                aria-hidden="true"
              />
              {item.name}
            </Link>
          ))}
        </nav>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
