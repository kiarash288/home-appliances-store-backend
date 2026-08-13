"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronRight,
  PackageX,
  RefreshCcw,
  ShieldCheck,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { toast } from "sonner";
import api, { assetUrl } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth";
import { useCartStore } from "@/store/cart";
import ProductImage from "@/components/shop/ProductImage";
import FavoriteButton from "@/components/shop/FavoriteButton";
import QuantityStepper from "@/components/shop/QuantityStepper";
import ReviewsSection, { Stars } from "@/components/shop/ReviewsSection";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Skeleton from "@/components/ui/Skeleton";
import EmptyState from "@/components/ui/EmptyState";
import { formatPrice } from "@/lib/utils";

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const user = useAuthStore((state) => state.user);
  const addItem = useCartStore((state) => state.addItem);
  const mutatingId = useCartStore((state) => state.mutatingId);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Main image first, then gallery images (gallery may arrive as JSON string)
  const images = useMemo(() => {
    if (!product) return [];
    let gallery = product.gallery || [];
    if (typeof gallery === "string") {
      try {
        gallery = JSON.parse(gallery);
      } catch {
        gallery = [];
      }
    }
    return [product.main_image, ...(Array.isArray(gallery) ? gallery : [])]
      .filter(Boolean)
      .map(assetUrl);
  }, [product]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setNotFound(false);
    setActiveImageIndex(0);

    api
      .get(`/items/${id}`)
      .then(({ data }) => {
        if (active) setProduct(data);
      })
      .catch(() => {
        if (active) setNotFound(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  const handleAddToCart = () => {
    if (!user) {
      toast("Please sign in to start shopping");
      router.push(`/login?next=/products/${id}`);
      return;
    }
    addItem(product.id, quantity);
  };

  if (loading) {
    return <DetailSkeleton />;
  }

  if (notFound || !product) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24">
        <EmptyState
          icon={PackageX}
          title="Product not found"
          description="It may have been removed or is temporarily unavailable."
        >
          <Button onClick={() => router.push("/products")}>
            Back to shop
          </Button>
        </EmptyState>
      </div>
    );
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
  const adding = mutatingId === product.id;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Breadcrumbs */}
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
        {/* Images */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="space-y-3"
        >
          <div className="relative aspect-square overflow-hidden rounded-3xl bg-stone-100">
            {images.length > 0 ? (
              <AnimatePresence mode="wait">
                <motion.img
                  key={images[activeImageIndex] || images[0]}
                  src={images[activeImageIndex] || images[0]}
                  alt={product.name}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="h-full w-full object-cover"
                />
              </AnimatePresence>
            ) : (
              <ProductImage product={product} letterSize={110} />
            )}
            <FavoriteButton
              product={product}
              className="absolute right-4 top-4 h-11 w-11"
              size={20}
            />
          </div>

          {images.length > 1 && (
            <div className="no-scrollbar flex gap-3 overflow-x-auto pb-1">
              {images.map((image, index) => (
                <button
                  key={image}
                  type="button"
                  onClick={() => setActiveImageIndex(index)}
                  aria-label={`View image ${index + 1}`}
                  className={cn(
                    "h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-2 transition",
                    index === activeImageIndex
                      ? "border-stone-900"
                      : "border-transparent opacity-70 hover:opacity-100"
                  )}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex flex-col"
        >
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

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <QuantityStepper
              value={quantity}
              onChange={setQuantity}
              min={1}
              max={Math.max(Number(product.stock) || 1, 1)}
              disabled={outOfStock}
            />
            <Button
              size="lg"
              className="flex-1 sm:flex-none sm:px-10"
              disabled={outOfStock}
              loading={adding}
              onClick={handleAddToCart}
            >
              <ShoppingBag size={16} />
              {outOfStock ? "Sold out" : "Add to cart"}
            </Button>
          </div>

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
        </motion.div>
      </div>

      <ReviewsSection itemId={id} />
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Skeleton className="h-4 w-52" />
      <div className="mt-8 grid gap-12 lg:grid-cols-2">
        <Skeleton className="aspect-square w-full rounded-3xl" />
        <div className="space-y-4">
          <Skeleton className="h-3.5 w-24" />
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-12 w-64 rounded-full" />
        </div>
      </div>
    </div>
  );
}
