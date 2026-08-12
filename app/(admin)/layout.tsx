import { auth } from "@/auth";
import { logout } from "@/app/actions/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  MessageSquare,
  LogOut,
  FlaskConical,
  BriefcaseMedical,
  BookOpen,
  Megaphone,
  FileText
} from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Distributors', href: '/admin/distributors', icon: Users },
    { name: 'Inquiries', href: '/admin/inquiries', icon: MessageSquare },
  ];

  const contentNavigation = [
    { name: 'Solutions', href: '/admin/solutions', icon: BriefcaseMedical },
    { name: 'Knowledge', href: '/admin/knowledge', icon: BookOpen },
    { name: 'Research', href: '/admin/research', icon: FlaskConical },
    { name: 'News & Events', href: '/admin/news-events', icon: Megaphone },
    { name: 'Blog', href: '/admin/blog', icon: FileText },
  ];

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Sidebar */}
      <div className="hidden w-64 flex-col border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 md:flex">
        <div className="flex h-16 shrink-0 items-center px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-600 text-white">
              <FlaskConical className="h-5 w-5" />
            </div>
            <span className="font-bold text-zinc-900 dark:text-white">Admin Portal</span>
          </Link>
        </div>
        
        <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
          <nav className="mt-5 flex-1 space-y-1 px-4 text-sm">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="group flex items-center rounded-md px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors"
              >
                <item.icon
                  className="mr-3 h-5 w-5 flex-shrink-0 text-zinc-400 group-hover:text-green-600 dark:group-hover:text-green-500"
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            ))}
          </nav>
          
          <div className="px-4 mt-8 mb-2">
            <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider dark:text-zinc-400">Content</h3>
          </div>
          <nav className="flex-1 space-y-1 px-4 text-sm">
            {contentNavigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="group flex items-center rounded-md px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors"
              >
                <item.icon
                  className="mr-3 h-5 w-5 flex-shrink-0 text-zinc-400 group-hover:text-green-600 dark:group-hover:text-green-500"
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        
        <div className="border-t border-zinc-200 p-4 dark:border-zinc-800">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="h-8 w-8 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-sm font-medium">
              {session.user.name?.charAt(0) || "A"}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-zinc-900 dark:text-white">
                {session.user.name}
              </span>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                Administrator
              </span>
            </div>
          </div>
          <form action={logout}>
            <button
              type="submit"
              className="group flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-500 dark:hover:bg-red-950/30 transition-colors"
            >
              <LogOut className="mr-3 h-5 w-5 flex-shrink-0" aria-hidden="true" />
              Logout
            </button>
          </form>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
