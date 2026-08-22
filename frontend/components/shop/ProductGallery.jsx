"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { assetUrl } from "@/lib/api";
import { cn } from "@/lib/utils";
import ProductImage from "@/components/shop/ProductImage";
import FavoriteButton from "@/components/shop/FavoriteButton";

/**
 * Client island: interactive image viewer (crossfade + thumbnail switcher)
 * with the favorite toggle overlay. Receives the server-fetched product.
 */
export default function ProductGallery({ product }) {
  const [activeIndex, setActiveIndex] = useState(0);

  // Main image first, then gallery images (gallery may arrive as JSON string)
  const images = useMemo(() => {
    let gallery = product?.gallery || [];
    if (typeof gallery === "string") {
      try {
        gallery = JSON.parse(gallery);
      } catch {
        gallery = [];
      }
    }
    return [product?.main_image, ...(Array.isArray(gallery) ? gallery : [])]
      .filter(Boolean)
      .map(assetUrl);
  }, [product]);

  return (
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
              key={images[activeIndex] || images[0]}
              src={images[activeIndex] || images[0]}
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
              onClick={() => setActiveIndex(index)}
              aria-label={`View image ${index + 1}`}
              className={cn(
                "h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-2 transition",
                index === activeIndex
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
  );
}
