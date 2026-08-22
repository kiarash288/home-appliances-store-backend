import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  RefreshCcw,
  ShieldCheck,
  Sparkles,
  Truck,
} from "lucide-react";
import { fetchFromApi } from "@/lib/server-api";
import Reveal from "@/components/home/Reveal";
import HeroShowcase from "@/components/home/HeroShowcase";
import FeaturedGrid from "@/components/home/FeaturedGrid";
import MembersCta from "@/components/home/MembersCta";

export const metadata = {
  description:
    "Discover quality products at honest prices — from daily basics to statement pieces. Fast delivery and secure checkout.",
};

const VALUE_PROPS = [
  {
    icon: Truck,
    title: "Fast delivery",
    description: "Nationwide shipping within 2–4 working days.",
  },
  {
    icon: ShieldCheck,
    title: "Secure payments",
    description: "Every checkout is protected by ZarinPal.",
  },
  {
    icon: RefreshCcw,
    title: "7-day returns",
    description: "Changed your mind? Send it back, no questions.",
  },
];

/**
 * Server Component: data is fetched on the server and rendered into the
 * initial HTML for SEO. Animations and auth-aware UI live in small client
 * islands (Reveal, HeroShowcase, FeaturedGrid, MembersCta).
 */
export default async function HomePage() {
  const [itemsResult, categoriesResult] = await Promise.all([
    fetchFromApi("/items?limit=8"),
    fetchFromApi("/categories"),
  ]);

  const featured = itemsResult?.items || [];
  const categories = Array.isArray(categoriesResult) ? categoriesResult : [];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* ============ Hero ============ */}
      <section className="grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
        <div className="space-y-7">
          <Reveal delay={0}>
            <div className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-1.5 text-xs font-medium text-stone-600">
              <Sparkles size={13} className="text-emerald-600" />
              New season, fresh arrivals
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <h1 className="text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
              Everyday essentials,
              <br />
              <span className="text-stone-400">thoughtfully curated.</span>
            </h1>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="max-w-md text-base leading-relaxed text-stone-500">
              Discover quality products at honest prices — from daily basics to
              statement pieces, all in one place.
            </p>
          </Reveal>

          <Reveal delay={0.3}>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/products"
                className="inline-flex h-12 items-center gap-2 rounded-full bg-stone-900 px-7 text-sm font-medium text-white transition hover:bg-stone-700"
              >
                Shop now <ArrowRight size={16} />
              </Link>
              <Link
                href="/products"
                className="inline-flex h-12 items-center rounded-full border border-stone-300 bg-white px-7 text-sm font-medium text-stone-900 transition hover:border-stone-900"
              >
                Browse categories
              </Link>
            </div>
          </Reveal>
        </div>

        <HeroShowcase />
      </section>

      {/* ============ Value props ============ */}
      <section className="grid gap-4 border-y border-stone-200 py-10 sm:grid-cols-3">
        {VALUE_PROPS.map((prop, index) => (
          <Reveal
            key={prop.title}
            viewport
            delay={index * 0.08}
            className="flex items-start gap-4 px-2"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-stone-100 text-stone-700">
              <prop.icon size={20} strokeWidth={1.7} />
            </div>
            <div>
              <p className="text-sm font-semibold">{prop.title}</p>
              <p className="mt-0.5 text-sm text-stone-500">
                {prop.description}
              </p>
            </div>
          </Reveal>
        ))}
      </section>

      {/* ============ Categories ============ */}
      {categories.length > 0 && (
        <section className="py-16">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">
                Shop by category
              </h2>
              <p className="mt-1 text-sm text-stone-500">
                Find exactly what you are looking for.
              </p>
            </div>
          </div>
          <div className="no-scrollbar flex gap-4 overflow-x-auto pb-2">
            {categories.map((category, index) => (
              <Reveal key={category.id} viewport delay={index * 0.05}>
                <Link
                  href={`/products?category=${category.id}`}
                  className="group flex min-w-44 flex-col justify-between gap-8 rounded-3xl border border-stone-200 bg-white px-6 py-7 transition-colors hover:border-stone-900"
                >
                  <ArrowUpRight
                    size={18}
                    className="text-stone-300 transition group-hover:text-stone-900"
                  />
                  <div>
                    <p className="font-medium">{category.name}</p>
                    <p className="mt-0.5 line-clamp-1 text-xs text-stone-400">
                      {category.description || "Explore the collection"}
                    </p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* ============ Featured products ============ */}
      <section className="pb-8 pt-4">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">
              Latest arrivals
            </h2>
            <p className="mt-1 text-sm text-stone-500">
              Fresh finds, added just for you.
            </p>
          </div>
          <Link
            href="/products"
            className="hidden items-center gap-1 text-sm font-medium text-stone-900 underline-offset-4 hover:underline sm:inline-flex"
          >
            View all <ArrowRight size={14} />
          </Link>
        </div>

        <FeaturedGrid products={featured} />
      </section>

      {/* ============ CTA banner (hides itself for signed-in users) ============ */}
      <MembersCta />
    </div>
  );
}
