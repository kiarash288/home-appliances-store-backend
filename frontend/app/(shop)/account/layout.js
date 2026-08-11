"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, MapPin, Package, User as UserIcon } from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { useMounted } from "@/lib/hooks";
import Skeleton from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/account", label: "Profile", icon: UserIcon },
  { href: "/account/orders", label: "Orders", icon: Package },
  { href: "/account/addresses", label: "Addresses", icon: MapPin },
];

export default function AccountLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const mounted = useMounted();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    if (mounted && !user) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [mounted, user, router, pathname]);

  if (!mounted || !user) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Skeleton className="h-9 w-52" />
        <div className="mt-8 grid gap-10 lg:grid-cols-[220px_1fr]">
          <Skeleton className="h-48 rounded-2xl" />
          <Skeleton className="h-96 rounded-2xl" />
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold tracking-tight">My account</h1>
      <div className="mt-8 grid gap-10 lg:grid-cols-[220px_1fr]">
        <aside>
          <nav className="no-scrollbar flex gap-1.5 overflow-x-auto lg:flex-col">
            {NAV_ITEMS.map((item) => {
              const active =
                item.href === "/account"
                  ? pathname === "/account"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex shrink-0 items-center gap-2.5 rounded-full px-4 py-2.5 text-sm transition lg:rounded-xl",
                    active
                      ? "bg-stone-900 font-medium text-white"
                      : "text-stone-600 hover:bg-stone-200/60 hover:text-stone-950"
                  )}
                >
                  <item.icon size={16} />
                  {item.label}
                </Link>
              );
            })}
            <button
              onClick={handleLogout}
              className="flex shrink-0 items-center gap-2.5 rounded-full px-4 py-2.5 text-sm text-red-600 transition hover:bg-red-50 lg:rounded-xl"
            >
              <LogOut size={16} />
              Sign out
            </button>
          </nav>
        </aside>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
