"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Loader2,
  LogOut,
  Package,
  ShoppingCart,
  Store,
  Tags,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth";
import { useMounted } from "@/lib/hooks";
import { cn, getInitials } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: Tags },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/users", label: "Users", icon: Users },
];

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const mounted = useMounted();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    if (!mounted) return;
    if (!user) {
      router.replace("/login?next=/admin");
    } else if (user.role !== "admin") {
      toast.error("This area is for admins only");
      router.replace("/");
    }
  }, [mounted, user, router]);

  if (!mounted || !user || user.role !== "admin") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-100">
        <Loader2 size={28} className="animate-spin text-stone-400" />
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-stone-100">
      {/* Sidebar (desktop) */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col bg-stone-950 text-stone-300 lg:flex">
        <div className="flex h-16 items-center gap-2 border-b border-stone-800/60 px-6">
          <p className="text-base font-bold tracking-[0.25em] text-white">
            STORE<span className="text-emerald-500">.</span>
          </p>
          <span className="rounded-md bg-stone-800 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-stone-400">
            Admin
          </span>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-5">
          {NAV_ITEMS.map((item) => {
            const active =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm transition",
                  active
                    ? "bg-stone-800 font-medium text-white"
                    : "text-stone-400 hover:bg-stone-900 hover:text-stone-200"
                )}
              >
                <item.icon size={17} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="space-y-1 border-t border-stone-800/60 px-3 py-4">
          <div className="flex items-center gap-3 px-3.5 py-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-xs font-semibold text-white">
              {getInitials(user)}
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-medium text-white">
                {user.firstName} {user.lastName}
              </p>
              <p className="truncate text-[11px] text-stone-500">
                {user.email}
              </p>
            </div>
          </div>
          <Link
            href="/"
            className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm text-stone-400 transition hover:bg-stone-900 hover:text-stone-200"
          >
            <Store size={17} />
            Back to store
          </Link>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm text-red-400 transition hover:bg-stone-900"
          >
            <LogOut size={17} />
            Sign out
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="sticky top-0 z-30 border-b border-stone-200 bg-white lg:hidden">
        <div className="flex h-14 items-center justify-between px-4">
          <p className="text-sm font-bold tracking-[0.2em]">
            STORE<span className="text-emerald-600">.</span>{" "}
            <span className="text-[10px] font-semibold uppercase text-stone-400">
              Admin
            </span>
          </p>
          <Link href="/" className="text-xs font-medium text-stone-500">
            Back to store
          </Link>
        </div>
        <nav className="no-scrollbar flex gap-1 overflow-x-auto px-3 pb-3">
          {NAV_ITEMS.map((item) => {
            const active =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex shrink-0 items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium transition",
                  active
                    ? "bg-stone-900 text-white"
                    : "bg-stone-100 text-stone-600"
                )}
              >
                <item.icon size={13} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <main className="px-4 py-8 sm:px-6 lg:ml-60 lg:px-10">{children}</main>
    </div>
  );
}
