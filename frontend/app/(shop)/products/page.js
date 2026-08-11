"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { PackageSearch, Search } from "lucide-react";
import api from "@/lib/api";
import { useDebouncedValue } from "@/lib/hooks";
import ProductCard, { gridVariants } from "@/components/shop/ProductCard";
import Skeleton from "@/components/ui/Skeleton";
import EmptyState from "@/components/ui/EmptyState";
import Pagination from "@/components/ui/Pagination";
import { cn } from "@/lib/utils";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
];

const PAGE_SIZE = 12;

export default function ProductsPage() {
  return (
    <Suspense fallback={<CatalogSkeleton />}>
      <Catalog />
    </Suspense>
  );
}

function Catalog() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);

  const [categories, setCategories] = useState([]);
  const [data, setData] = useState({
    items: [],
    totalItems: 0,
    totalPages: 1,
    currentPage: 1,
  });
  const [loading, setLoading] = useState(true);

  const debouncedSearch = useDebouncedValue(search, 400);

  useEffect(() => {
    api
      .get("/categories")
      .then(({ data: list }) =>
        setCategories(Array.isArray(list) ? list : [])
      )
      .catch(() => {});
  }, []);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, category]);

  useEffect(() => {
    let active = true;
    setLoading(true);

    const params = { page, limit: PAGE_SIZE };
    if (debouncedSearch) params.name = debouncedSearch;
    if (category) params.categoryId = category;

    api
      .get("/items", { params })
      .then(({ data: result }) => {
        if (active) setData(result);
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false);
      });

    // Keep the URL shareable without triggering a re-render loop
    const query = new URLSearchParams();
    if (debouncedSearch) query.set("q", debouncedSearch);
    if (category) query.set("category", category);
    const queryString = query.toString();
    window.history.replaceState(
      null,
      "",
      queryString ? `/products?${queryString}` : "/products"
    );

    return () => {
      active = false;
    };
  }, [debouncedSearch, category, page]);

  const sortedItems = useMemo(() => {
    const items = [...(data.items || [])];
    if (sort === "price-asc") {
      items.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sort === "price-desc") {
      items.sort((a, b) => Number(b.price) - Number(a.price));
    }
    return items;
  }, [data.items, sort]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">Shop all</h1>
        <p className="mt-1 text-sm text-stone-500">
          {loading ? "Loading products…" : `${data.totalItems} products`}
        </p>
      </div>

      {/* Controls */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-sm">
            <Search
              size={16}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"
            />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search products…"
              className="h-11 w-full rounded-full border border-stone-200 bg-white pl-10 pr-4 text-sm placeholder:text-stone-400 transition focus:border-stone-900 focus:outline-none focus:ring-4 focus:ring-stone-900/5"
            />
          </div>
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            className="h-11 rounded-full border border-stone-200 bg-white px-4 text-sm focus:border-stone-900 focus:outline-none"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
          <CategoryPill
            active={!category}
            onClick={() => setCategory("")}
            label="All"
          />
          {categories.map((item) => (
            <CategoryPill
              key={item.id}
              active={String(category) === String(item.id)}
              onClick={() => setCategory(String(item.id))}
              label={item.name}
            />
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <ProductGridSkeleton />
      ) : sortedItems.length === 0 ? (
        <EmptyState
          icon={PackageSearch}
          title="No products found"
          description="Try adjusting your search or removing filters."
        />
      ) : (
        <motion.div
          key={`${debouncedSearch}-${category}-${page}-${sort}`}
          variants={gridVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 gap-x-5 gap-y-9 sm:grid-cols-3 lg:grid-cols-4"
        >
          {sortedItems.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </motion.div>
      )}

      <div className="mt-12">
        <Pagination
          page={page}
          totalPages={data.totalPages}
          onChange={(next) => {
            setPage(next);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      </div>
    </div>
  );
}

function CategoryPill({ active, onClick, label }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition",
        active
          ? "border-stone-900 bg-stone-900 text-white"
          : "border-stone-200 bg-white text-stone-600 hover:border-stone-400"
      )}
    >
      {label}
    </button>
  );
}

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-x-5 gap-y-9 sm:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="space-y-3">
          <Skeleton className="aspect-[4/5] w-full rounded-2xl" />
          <Skeleton className="h-3.5 w-2/3" />
          <Skeleton className="h-3.5 w-1/3" />
        </div>
      ))}
    </div>
  );
}

function CatalogSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <Skeleton className="h-9 w-44" />
      <Skeleton className="mt-3 h-4 w-24" />
      <Skeleton className="mt-8 h-11 w-full max-w-sm rounded-full" />
      <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-9 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="space-y-3">
            <Skeleton className="aspect-[4/5] w-full rounded-2xl" />
            <Skeleton className="h-3.5 w-2/3" />
            <Skeleton className="h-3.5 w-1/3" />
          </div>
        ))}
      </div>
    </div>
  );
}
