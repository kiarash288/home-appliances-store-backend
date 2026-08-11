"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { useFavoritesStore } from "@/store/favorites";
import { useMounted } from "@/lib/hooks";
import ProductCard, { gridVariants } from "@/components/shop/ProductCard";
import EmptyState from "@/components/ui/EmptyState";
import Button from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";

export default function FavoritesPage() {
  const router = useRouter();
  const mounted = useMounted();
  const user = useAuthStore((state) => state.user);
  const favorites = useFavoritesStore((state) => state.favorites);
  const loading = useFavoritesStore((state) => state.loading);

  useEffect(() => {
    if (mounted && !user) {
      router.replace("/login?next=/favorites");
    }
  }, [mounted, user, router]);

  if (!mounted || !user) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Skeleton className="h-9 w-56" />
        <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-9 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="aspect-[4/5] rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  const products = favorites
    .map((favorite) => favorite.item)
    .filter(Boolean);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">
          Your favorites
        </h1>
        <p className="mt-1 text-sm text-stone-500">
          {products.length} saved {products.length === 1 ? "item" : "items"}
        </p>
      </div>

      {loading && products.length === 0 ? (
        <div className="grid grid-cols-2 gap-x-5 gap-y-9 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="aspect-[4/5] rounded-2xl" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Nothing saved yet"
          description="Tap the heart on any product to keep it here for later."
        >
          <Button onClick={() => router.push("/products")}>
            Discover products
          </Button>
        </EmptyState>
      ) : (
        <motion.div
          variants={gridVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 gap-x-5 gap-y-9 sm:grid-cols-3 lg:grid-cols-4"
        >
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </motion.div>
      )}
    </div>
  );
}
