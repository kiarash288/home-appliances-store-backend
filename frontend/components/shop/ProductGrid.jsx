"use client";

import { motion } from "framer-motion";
import { PackageSearch } from "lucide-react";
import ProductCard, { gridVariants } from "@/components/shop/ProductCard";
import EmptyState from "@/components/ui/EmptyState";

/**
 * Client island for the catalog grid: stagger animation + interactive cards.
 * Products arrive server-fetched via props; `animationKey` re-triggers the
 * entrance animation when the filters change.
 */
export default function ProductGrid({ products = [], animationKey }) {
  if (products.length === 0) {
    return (
      <EmptyState
        icon={PackageSearch}
        title="No products found"
        description="Try adjusting your search or removing filters."
      />
    );
  }

  return (
    <motion.div
      key={animationKey}
      variants={gridVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 gap-x-5 gap-y-9 sm:grid-cols-3 lg:grid-cols-4"
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </motion.div>
  );
}
