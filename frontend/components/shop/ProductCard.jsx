"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ShoppingBag, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth";
import { useCartStore } from "@/store/cart";
import ProductImage from "@/components/shop/ProductImage";
import FavoriteButton from "@/components/shop/FavoriteButton";
import { cn, formatPrice } from "@/lib/utils";

export const gridVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

export const cardVariants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export default function ProductCard({ product }) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const addItem = useCartStore((state) => state.addItem);
  const mutatingId = useCartStore((state) => state.mutatingId);

  const outOfStock = Number(product.stock) <= 0;
  const lowStock = !outOfStock && Number(product.stock) <= 5;
  const adding = mutatingId === product.id;

  const handleQuickAdd = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (!user) {
      toast("Please sign in to start shopping");
      router.push(`/login?next=/products/${product.id}`);
      return;
    }
    addItem(product.id, 1);
  };

  return (
    <motion.div variants={cardVariants} className="group">
      <Link href={`/products/${product.id}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-stone-100">
          <div className="h-full w-full transition-transform duration-500 ease-out group-hover:scale-105">
            <ProductImage product={product} />
          </div>

          <FavoriteButton
            product={product}
            className="absolute right-3 top-3 opacity-100 transition-opacity duration-200 lg:opacity-0 lg:group-hover:opacity-100"
          />

          {outOfStock && (
            <div className="absolute left-3 top-3 rounded-full bg-stone-950/80 px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-white backdrop-blur">
              Sold out
            </div>
          )}

          {!outOfStock && (
            <button
              onClick={handleQuickAdd}
              disabled={adding}
              className={cn(
                "absolute inset-x-3 bottom-3 flex h-10 translate-y-14 items-center justify-center gap-2 rounded-full bg-stone-900/90 text-xs font-medium tracking-wide text-white opacity-0 backdrop-blur transition-all duration-300",
                "group-hover:translate-y-0 group-hover:opacity-100 hover:bg-stone-800"
              )}
            >
              {adding ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <ShoppingBag size={14} />
              )}
              Add to cart
            </button>
          )}
        </div>

        <div className="mt-3 space-y-1 px-1">
          {product.category?.name && (
            <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-stone-400">
              {product.category.name}
            </p>
          )}
          <h3 className="truncate text-sm font-medium text-stone-900">
            {product.name}
          </h3>
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold">{formatPrice(product.price)}</p>
            {lowStock && (
              <span className="text-[11px] font-medium text-amber-600">
                Only {product.stock} left
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
