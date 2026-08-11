"use client";

import Link from "next/link";
import { toast } from "sonner";

const SHOP_LINKS = [
  { href: "/products", label: "All products" },
  { href: "/favorites", label: "Favorites" },
  { href: "/account/orders", label: "Track order" },
];

const SUPPORT_LINKS = [
  { href: "/account", label: "My account" },
  { href: "/checkout", label: "Checkout" },
  { href: "/register", label: "Create account" },
];

export default function Footer() {
  const handleSubscribe = (event) => {
    event.preventDefault();
    const input = event.currentTarget.querySelector("input");
    if (!input?.value) return;
    toast.success("Welcome aboard! You are on the list.");
    input.value = "";
  };

  return (
    <footer className="mt-24 bg-stone-950 text-stone-300">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <p className="text-lg font-bold tracking-[0.25em] text-white">
              STORE<span className="text-emerald-500">.</span>
            </p>
            <p className="max-w-xs text-sm leading-relaxed text-stone-400">
              Modern essentials, curated with care. Secure payments through
              ZarinPal and fast nationwide delivery.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
              Shop
            </p>
            <ul className="mt-4 space-y-2.5">
              {SHOP_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-stone-400 transition hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
              Account
            </p>
            <ul className="mt-4 space-y-2.5">
              {SUPPORT_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-stone-400 transition hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
              Stay in the loop
            </p>
            <p className="mt-4 text-sm text-stone-400">
              New drops, restocks and member-only offers.
            </p>
            <form onSubmit={handleSubscribe} className="mt-4 flex gap-2">
              <input
                type="email"
                required
                placeholder="you@example.com"
                className="h-11 min-w-0 flex-1 rounded-full border border-stone-700 bg-stone-900 px-4 text-sm text-white placeholder:text-stone-500 focus:border-emerald-500 focus:outline-none"
              />
              <button
                type="submit"
                className="h-11 shrink-0 rounded-full bg-emerald-600 px-5 text-sm font-medium text-white transition hover:bg-emerald-500"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-stone-800 pt-6 text-xs text-stone-500 sm:flex-row">
          <p>© {new Date().getFullYear()} STORE. All rights reserved.</p>
          <p>Built with Next.js · Powered by ZarinPal</p>
        </div>
      </div>
    </footer>
  );
}
