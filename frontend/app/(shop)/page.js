"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  RefreshCcw,
  ShieldCheck,
  Sparkles,
  Truck,
} from "lucide-react";
import api from "@/lib/api";
import { useAuthStore } from "@/store/auth";
import { useMounted } from "@/lib/hooks";
import ProductCard, {
  gridVariants,
} from "@/components/shop/ProductCard";
import ProductImage from "@/components/shop/ProductImage";
import Skeleton from "@/components/ui/Skeleton";

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

export default function HomePage() {
  const mounted = useMounted();
  const user = useAuthStore((state) => state.user);

  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    Promise.allSettled([
      api.get("/items", { params: { limit: 8 } }),
      api.get("/categories"),
    ]).then(([itemsResult, categoriesResult]) => {
      if (!active) return;
      if (itemsResult.status === "fulfilled") {
        setFeatured(itemsResult.value.data.items || []);
      }
      if (categoriesResult.status === "fulfilled") {
        setCategories(
          Array.isArray(categoriesResult.value.data)
            ? categoriesResult.value.data
            : []
        );
      }
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* ============ Hero ============ */}
      <section className="grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.12 } },
          }}
          className="space-y-7"
        >
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 16 },
              show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
            }}
            className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-1.5 text-xs font-medium text-stone-600"
          >
            <Sparkles size={13} className="text-emerald-600" />
            New season, fresh arrivals
          </motion.div>

          <motion.h1
            variants={{
              hidden: { opacity: 0, y: 16 },
              show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
            }}
            className="text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl"
          >
            Everyday essentials,
            <br />
            <span className="text-stone-400">thoughtfully curated.</span>
          </motion.h1>

          <motion.p
            variants={{
              hidden: { opacity: 0, y: 16 },
              show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
            }}
            className="max-w-md text-base leading-relaxed text-stone-500"
          >
            Discover quality products at honest prices — from daily basics to
            statement pieces, all in one place.
          </motion.p>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 16 },
              show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
            }}
            className="flex flex-wrap items-center gap-3"
          >
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
          </motion.div>
        </motion.div>

        {/* Hero art */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative hidden lg:block"
        >
          <div className="grid grid-cols-2 gap-4">
            {(featured.length >= 4 ? featured.slice(0, 4) : [null, null, null, null]).map(
              (product, index) => (
                <motion.div
                  key={product?.id ?? index}
                  animate={{ y: [0, index % 2 === 0 ? -8 : 8, 0] }}
                  transition={{
                    duration: 6 + index,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className={
                    index % 2 === 0
                      ? "aspect-[4/5] overflow-hidden rounded-3xl shadow-sm"
                      : "mt-10 aspect-[4/5] overflow-hidden rounded-3xl shadow-sm"
                  }
                >
                  {product ? (
                    <Link href={`/products/${product.id}`}>
                      <ProductImage product={product} letterSize={56} />
                    </Link>
                  ) : (
                    <div className="skeleton h-full w-full" />
                  )}
                </motion.div>
              )
            )}
          </div>
        </motion.div>
      </section>

      {/* ============ Value props ============ */}
      <section className="grid gap-4 border-y border-stone-200 py-10 sm:grid-cols-3">
        {VALUE_PROPS.map((prop, index) => (
          <motion.div
            key={prop.title}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.08, duration: 0.4 }}
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
          </motion.div>
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
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05, duration: 0.35 }}
              >
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
              </motion.div>
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

        {loading ? (
          <div className="grid grid-cols-2 gap-x-5 gap-y-9 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="space-y-3">
                <Skeleton className="aspect-[4/5] w-full rounded-2xl" />
                <Skeleton className="h-3.5 w-2/3" />
                <Skeleton className="h-3.5 w-1/3" />
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            variants={gridVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-2 gap-x-5 gap-y-9 sm:grid-cols-3 lg:grid-cols-4"
          >
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </motion.div>
        )}
      </section>

      {/* ============ CTA banner ============ */}
      {(!mounted || !user) && (
        <section className="pb-24 pt-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-start justify-between gap-6 rounded-3xl bg-stone-950 p-10 text-white sm:flex-row sm:items-center lg:p-14"
          >
            <div>
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Members get more.
              </h2>
              <p className="mt-2 max-w-md text-sm text-stone-400">
                Create an account to track orders, save favorites and check out
                faster.
              </p>
            </div>
            <Link
              href="/register"
              className="inline-flex h-12 shrink-0 items-center gap-2 rounded-full bg-emerald-600 px-7 text-sm font-medium text-white transition hover:bg-emerald-500"
            >
              Create account <ArrowRight size={16} />
            </Link>
          </motion.div>
        </section>
      )}
    </div>
  );
}
