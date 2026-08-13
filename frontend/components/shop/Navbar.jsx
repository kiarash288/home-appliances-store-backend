"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Heart,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Search,
  ShoppingBag,
  User as UserIcon,
  X,
} from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { useCartStore } from "@/store/cart";
import { useFavoritesStore } from "@/store/favorites";
import { useMounted } from "@/lib/hooks";
import { cn, getInitials } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Shop" },
];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const mounted = useMounted();

  const user = useAuthStore((state) => state.user);
  const accessToken = useAuthStore((state) => state.accessToken);
  const logout = useAuthStore((state) => state.logout);

  const cartCount = useCartStore((state) =>
    state.basket.items.reduce((sum, item) => sum + Number(item.quantity || 0), 0)
  );
  const openCart = useCartStore((state) => state.open);
  const fetchBasket = useCartStore((state) => state.fetchBasket);
  const resetCart = useCartStore((state) => state.reset);

  const favoritesCount = useFavoritesStore((state) => state.favorites.length);
  const fetchFavorites = useFavoritesStore((state) => state.fetchFavorites);
  const resetFavorites = useFavoritesStore((state) => state.reset);

  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Central session-data loader: whenever a token appears the basket and
  // favorites are hydrated; when it goes away both are cleared.
  useEffect(() => {
    if (accessToken) {
      fetchBasket();
      fetchFavorites();
    } else {
      resetCart();
      resetFavorites();
    }
  }, [accessToken, fetchBasket, fetchFavorites, resetCart, resetFavorites]);

  useEffect(() => {
    setMenuOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    setUserMenuOpen(false);
    await logout();
    router.push("/");
  };

  const showUser = mounted && user;

  return (
    <>
      <div className="bg-stone-950 py-2 text-center text-[11px] font-medium uppercase tracking-[0.25em] text-stone-300">
        Free shipping on orders over $500
      </div>

      <header className="sticky top-0 z-40 border-b border-stone-200/80 bg-stone-50/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2.5">
            <button
              className="flex h-9 w-9 items-center justify-center rounded-full text-stone-600 transition hover:bg-stone-200/60 lg:hidden"
              onClick={() => setMenuOpen((value) => !value)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <Link
              href="/"
              className="text-lg font-bold tracking-[0.25em] text-stone-950"
            >
              STORE<span className="text-emerald-600">.</span>
            </Link>
          </div>

          <nav className="hidden items-center gap-8 lg:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm transition-colors hover:text-stone-950",
                  pathname === link.href
                    ? "font-semibold text-stone-950"
                    : "text-stone-500"
                )}
              >
                {link.label}
              </Link>
            ))}
            {showUser && user.role === "admin" && (
              <Link
                href="/admin"
                className="text-sm font-medium text-emerald-700 transition-colors hover:text-emerald-600"
              >
                Admin
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-1.5">
            <IconButton label="Search" onClick={() => router.push("/products")}>
              <Search size={19} />
            </IconButton>
            <IconButton
              label="Favorites"
              onClick={() => router.push(user ? "/favorites" : "/login")}
            >
              <Heart size={19} />
              {mounted && <CountBadge count={favoritesCount} />}
            </IconButton>
            <IconButton label="Cart" onClick={openCart}>
              <ShoppingBag size={19} />
              {mounted && <CountBadge count={cartCount} />}
            </IconButton>

            <div className="mx-1 hidden h-6 w-px bg-stone-200 sm:block" />

            {showUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen((value) => !value)}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-stone-900 text-xs font-semibold text-white transition hover:bg-stone-700"
                  aria-label="Account menu"
                >
                  {getInitials(user)}
                </button>
                <AnimatePresence>
                  {userMenuOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setUserMenuOpen(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.97 }}
                        transition={{ duration: 0.16, ease: "easeOut" }}
                        className="absolute right-0 z-20 mt-2 w-56 overflow-hidden rounded-2xl border border-stone-200 bg-white py-1.5 shadow-xl"
                      >
                        <div className="border-b border-stone-100 px-4 py-2.5">
                          <p className="truncate text-sm font-medium">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="truncate text-xs text-stone-500">
                            {user.email}
                          </p>
                        </div>
                        <MenuLink href="/account" icon={UserIcon}>
                          My account
                        </MenuLink>
                        <MenuLink href="/account/orders" icon={Package}>
                          Orders
                        </MenuLink>
                        {user.role === "admin" && (
                          <MenuLink href="/admin" icon={LayoutDashboard}>
                            Admin panel
                          </MenuLink>
                        )}
                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 transition hover:bg-red-50"
                        >
                          <LogOut size={15} /> Sign out
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                href="/login"
                className="ml-1 inline-flex h-9 items-center rounded-full bg-stone-900 px-4 text-sm font-medium text-white transition hover:bg-stone-700"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="overflow-hidden border-t border-stone-200 bg-stone-50 lg:hidden"
            >
              <div className="space-y-1 px-4 py-3">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "block rounded-xl px-3 py-2.5 text-sm transition",
                      pathname === link.href
                        ? "bg-stone-200/60 font-semibold text-stone-950"
                        : "text-stone-600 hover:bg-stone-100"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href="/favorites"
                  className="block rounded-xl px-3 py-2.5 text-sm text-stone-600 transition hover:bg-stone-100"
                >
                  Favorites
                </Link>
                {showUser && user.role === "admin" && (
                  <Link
                    href="/admin"
                    className="block rounded-xl px-3 py-2.5 text-sm font-medium text-emerald-700 transition hover:bg-emerald-50"
                  >
                    Admin panel
                  </Link>
                )}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}

function IconButton({ children, label, onClick }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="relative flex h-9 w-9 items-center justify-center rounded-full text-stone-600 transition hover:bg-stone-200/60 hover:text-stone-950"
    >
      {children}
    </button>
  );
}

function CountBadge({ count }) {
  if (!count) return null;
  return (
    <motion.span
      key={count}
      initial={{ scale: 0.4 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 500, damping: 25 }}
      className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-emerald-600 px-1 text-[10px] font-bold text-white"
    >
      {count > 99 ? "99+" : count}
    </motion.span>
  );
}

function MenuLink({ href, icon: Icon, children }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-stone-700 transition hover:bg-stone-50"
    >
      {Icon && <Icon size={15} className="text-stone-400" />}
      {children}
    </Link>
  );
}
