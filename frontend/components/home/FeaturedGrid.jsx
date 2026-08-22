"use client";

import { motion } from "framer-motion";
import ProductCard, { gridVariants } from "@/components/shop/ProductCard";

/**
 * Client island for the featured products grid. Receives server-fetched
 * products as props; the client handles the stagger animation plus the
 * interactive cards (add to cart, favorites).
 */
export default function FeaturedGrid({ products = [] }) {
  if (products.length === 0) {
    return (
      <p className="rounded-3xl border border-dashed border-stone-200 bg-white/60 px-6 py-16 text-center text-sm text-stone-400">
        Products are coming soon — check back shortly.
      </p>
    );
  }

  return (
    <motion.div
      variants={gridVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      className="grid grid-cols-2 gap-x-5 gap-y-9 sm:grid-cols-3 lg:grid-cols-4"
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </motion.div>
  );
}
