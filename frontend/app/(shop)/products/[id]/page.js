import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, RefreshCcw, ShieldCheck, Truck } from "lucide-react";
import { fetchFromApi } from "@/lib/server-api";
import { formatPrice } from "@/lib/utils";
import ProductGallery from "@/components/shop/ProductGallery";
import PurchasePanel from "@/components/shop/PurchasePanel";
import ReviewsSection, { Stars } from "@/components/shop/ReviewsSection";
import Badge from "@/components/ui/Badge";

/** SEO: per-product title + description generated on the server. */
export async function generateMetadata({ params }) {
  const { id } = await params;
  const product = await fetchFromApi(`/items/${id}`);
  if (!product) {
    return { title: "Product not found" };
  }
  return {
    title: product.name,
    description: (product.description || `Buy ${product.name} at STORE.`)
      .replace(/\s+/g, " ")
      .slice(0, 160),
  };
}

/**
 * Server Component: product data is fetched on the server and rendered into
 * the initial HTML. Interactivity is isolated into ProductGallery (image
 * switcher + favorite), PurchasePanel (quantity + add to cart) and
 * ReviewsSection (list + submit form).
 */
export default async function ProductDetailPage({ params }) {
  const { id } = await params;
  const product = await fetchFromApi(`/items/${id}`);

  if (!product) {
    notFound();
  }

  const approvedReviews = (product.reviews || []).filter(
    (review) => review.is_approved
  );
  const averageRating =
    approvedReviews.length > 0
      ? approvedReviews.reduce(
          (sum, review) => sum + Number(review.rating),
          0
        ) / approvedReviews.length
      : null;

  const outOfStock = Number(product.stock) <= 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Breadcrumbs (server-rendered, crawlable) */}
      <nav className="mb-8 flex items-center gap-1.5 text-xs text-stone-400">
        <Link href="/products" className="transition hover:text-stone-900">
          Shop
        </Link>
        {product.category?.name && (
          <>
            <ChevronRight size={12} />
            <Link
              href={`/products?category=${product.category.id}`}
              className="transition hover:text-stone-900"
            >
              {product.category.name}
            </Link>
          </>
        )}
        <ChevronRight size={12} />
        <span className="truncate text-stone-600">{product.name}</span>
      </nav>

      <div className="grid gap-12 lg:grid-cols-2">
        {/* Images (client island) */}
        <ProductGallery product={product} />

        {/* Info (server-rendered) */}
        <div className="flex flex-col">
          {product.category?.name && (
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-stone-400">
              {product.category.name}
            </p>
          )}
          <h1 className="mt-2 text-3xl font-semibold tracking-tight lg:text-4xl">
            {product.name}
          </h1>

          {averageRating != null && (
            <div className="mt-3 flex items-center gap-2">
              <Stars value={averageRating} size={15} />
              <span className="text-sm text-stone-500">
                {averageRating.toFixed(1)} · {approvedReviews.length}{" "}
                {approvedReviews.length === 1 ? "review" : "reviews"}
              </span>
            </div>
          )}

          <p className="mt-5 text-2xl font-semibold tabular-nums">
            {formatPrice(product.price)}
          </p>

          {product.description && (
            <p className="mt-5 whitespace-pre-line text-sm leading-relaxed text-stone-600">
              {product.description}
            </p>
          )}

          <div className="mt-5">
            {outOfStock ? (
              <Badge tone="red">Out of stock</Badge>
            ) : Number(product.stock) <= 5 ? (
              <Badge tone="amber">Only {product.stock} left in stock</Badge>
            ) : (
              <Badge tone="emerald">In stock — ready to ship</Badge>
            )}
          </div>

          {/* Quantity + add to cart (client island) */}
          <PurchasePanel product={product} />

          <div className="mt-10 space-y-3 border-t border-stone-200 pt-6 text-sm text-stone-500">
            <p className="flex items-center gap-2.5">
              <Truck size={16} className="text-stone-400" />
              Free shipping on orders over $500
            </p>
            <p className="flex items-center gap-2.5">
              <ShieldCheck size={16} className="text-stone-400" />
              Secure checkout with ZarinPal
            </p>
            <p className="flex items-center gap-2.5">
              <RefreshCcw size={16} className="text-stone-400" />
              7-day hassle-free returns
            </p>
          </div>
        </div>
      </div>

      {/* Reviews stay dynamic (client island) */}
      <ReviewsSection itemId={product.id} />
    </div>
  );
}
