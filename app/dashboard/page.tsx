import { auth } from "@/auth";
import { logout } from "@/app/actions/auth";
import { User, LogOut, Package, ClipboardList, Shield } from "lucide-react";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="min-h-[80vh] bg-zinc-50 dark:bg-zinc-950 py-12">
      <div className="container mx-auto px-4 md:px-6 max-w-5xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">
              Welcome back, {session.user.name || "User"}
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400">
              Manage your VetKind account and view your resources.
            </p>
          </div>
          <form action={logout}>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-red-600 shadow-sm border border-zinc-200 hover:bg-zinc-50 dark:bg-zinc-900 dark:border-zinc-800 dark:hover:bg-zinc-800 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </form>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <div className="rounded-xl bg-white p-6 shadow-sm border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800 flex items-start gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg dark:bg-blue-900/30 dark:text-blue-400">
              <User className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-zinc-900 dark:text-white">Account Details</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">{session.user.email}</p>
            </div>
          </div>
          
          <div className="rounded-xl bg-white p-6 shadow-sm border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800 flex items-start gap-4">
            <div className="p-3 bg-green-50 text-green-600 rounded-lg dark:bg-green-900/30 dark:text-green-400">
              <Package className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-zinc-900 dark:text-white">Active Orders</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">No active orders found.</p>
            </div>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800 flex items-start gap-4">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-lg dark:bg-purple-900/30 dark:text-purple-400">
              <ClipboardList className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-zinc-900 dark:text-white">Saved Resources</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">0 saved articles.</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-8 shadow-sm border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800">
          <div className="flex items-center gap-2 mb-6">
            <Shield className="h-5 w-5 text-green-600 dark:text-green-500" />
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Account Security</h2>
          </div>
          <p className="text-zinc-600 dark:text-zinc-400 mb-4">
            Your account is secured with standard credentials. 
          </p>
          <button className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700">
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
}
