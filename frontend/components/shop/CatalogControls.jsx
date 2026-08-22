"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Search } from "lucide-react";
import { cn } from "@/lib/utils";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
];

/**
 * Client island for the catalog filters. All state lives in the URL — every
 * change updates searchParams and the Server Component re-renders with fresh
 * server-fetched data.
 */
export default function CatalogControls({ categories = [] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentQuery = searchParams.get("q") || "";
  const currentCategory = searchParams.get("category") || "";
  const currentSort = searchParams.get("sort") || "newest";

  const [search, setSearch] = useState(currentQuery);
  const skipFirstRun = useRef(true);

  const applyParams = (updates) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });
    params.delete("page"); // changing filters resets pagination
    const queryString = params.toString();
    startTransition(() => {
      router.replace(queryString ? `/products?${queryString}` : "/products", {
        scroll: false,
      });
    });
  };

  // Debounced search -> URL
  useEffect(() => {
    if (skipFirstRun.current) {
      skipFirstRun.current = false;
      return undefined;
    }
    const timer = setTimeout(() => {
      if (search !== currentQuery) {
        applyParams({ q: search });
      }
    }, 400);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  return (
    <div
      className={cn(
        "mb-8 space-y-4 transition-opacity",
        isPending && "opacity-60"
      )}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          {isPending ? (
            <Loader2
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 animate-spin text-stone-400"
            />
          ) : (
            <Search
              size={16}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"
            />
          )}
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search products…"
            className="h-11 w-full rounded-full border border-stone-200 bg-white pl-10 pr-4 text-sm placeholder:text-stone-400 transition focus:border-stone-900 focus:outline-none focus:ring-4 focus:ring-stone-900/5"
          />
        </div>
        <select
          value={currentSort}
          onChange={(event) =>
            applyParams({
              sort:
                event.target.value === "newest" ? "" : event.target.value,
            })
          }
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
          active={!currentCategory}
          onClick={() => applyParams({ category: "" })}
          label="All"
        />
        {categories.map((item) => (
          <CategoryPill
            key={item.id}
            active={String(currentCategory) === String(item.id)}
            onClick={() => applyParams({ category: String(item.id) })}
            label={item.name}
          />
        ))}
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
