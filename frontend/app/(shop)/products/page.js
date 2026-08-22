import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { fetchFromApi } from "@/lib/server-api";
import { cn } from "@/lib/utils";
import CatalogControls from "@/components/shop/CatalogControls";
import ProductGrid from "@/components/shop/ProductGrid";

export const metadata = {
  title: "Shop all",
  description:
    "Browse the full catalog — search, filter by category and find your next favorite product.",
};

const PAGE_SIZE = 12;

/**
 * Server Component: reads filters from the URL, fetches matching products on
 * the server and renders them into the initial HTML. The filter bar and grid
 * animation live in client islands; pagination is plain crawlable links.
 */
export default async function ProductsPage({ searchParams }) {
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q : "";
  const category = typeof params.category === "string" ? params.category : "";
  const sort = typeof params.sort === "string" ? params.sort : "newest";
  const page = Math.max(parseInt(params.page, 10) || 1, 1);

  const query = new URLSearchParams({
    page: String(page),
    limit: String(PAGE_SIZE),
  });
  if (q) query.set("name", q);
  if (category) query.set("categoryId", category);

  const [itemsResult, categoriesResult] = await Promise.all([
    fetchFromApi(`/items?${query.toString()}`, { revalidate: 30 }),
    fetchFromApi("/categories"),
  ]);

  // The API always sorts by newest; price sorting applies within the page
  const items = [...(itemsResult?.items || [])];
  if (sort === "price-asc") {
    items.sort((a, b) => Number(a.price) - Number(b.price));
  } else if (sort === "price-desc") {
    items.sort((a, b) => Number(b.price) - Number(a.price));
  }

  const totalItems = itemsResult?.totalItems ?? 0;
  const totalPages = itemsResult?.totalPages ?? 1;
  const categories = Array.isArray(categoriesResult) ? categoriesResult : [];

  const pageHref = (target) => {
    const next = new URLSearchParams();
    if (q) next.set("q", q);
    if (category) next.set("category", category);
    if (sort !== "newest") next.set("sort", sort);
    if (target > 1) next.set("page", String(target));
    const queryString = next.toString();
    return queryString ? `/products?${queryString}` : "/products";
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">Shop all</h1>
        <p className="mt-1 text-sm text-stone-500">
          {totalItems} {totalItems === 1 ? "product" : "products"}
        </p>
      </div>

      <CatalogControls categories={categories} />

      <ProductGrid
        products={items}
        animationKey={`${q}|${category}|${sort}|${page}`}
      />

      {totalPages > 1 && (
        <div className="mt-12 flex items-center justify-center gap-4">
          <PaginationLink
            href={pageHref(page - 1)}
            disabled={page <= 1}
          >
            <ChevronLeft size={14} /> Prev
          </PaginationLink>
          <span className="text-xs font-medium text-stone-500">
            Page {page} of {totalPages}
          </span>
          <PaginationLink
            href={pageHref(page + 1)}
            disabled={page >= totalPages}
          >
            Next <ChevronRight size={14} />
          </PaginationLink>
        </div>
      )}
    </div>
  );
}

function PaginationLink({ href, disabled, children }) {
  const styles =
    "inline-flex h-8 items-center gap-2 rounded-full border px-3.5 text-xs font-medium transition";

  if (disabled) {
    return (
      <span
        className={cn(styles, "cursor-not-allowed border-stone-200 bg-white text-stone-300")}
      >
        {children}
      </span>
    );
  }

  return (
    <Link
      href={href}
      className={cn(
        styles,
        "border-stone-200 bg-white text-stone-900 hover:border-stone-400"
      )}
    >
      {children}
    </Link>
  );
}
