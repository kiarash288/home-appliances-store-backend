"use client";

import Link from "next/link";
import { motion } from "framer-motion";

// Curated product photography with a picsum fallback per tile in case the
// primary CDN is unreachable. Needs the client for the infinite float
// animation and the onError fallback handler.
const HERO_IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
    fallback: "https://picsum.photos/seed/shop1/800/1000",
    alt: "Premium wireless headphones on a warm background",
  },
  {
    src: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
    fallback: "https://picsum.photos/seed/shop2/800/1000",
    alt: "Minimal analog watch product shot",
  },
  {
    src: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
    fallback: "https://picsum.photos/seed/shop3/800/1000",
    alt: "Red sneaker floating on a colorful backdrop",
  },
  {
    src: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
    fallback: "https://picsum.photos/seed/shop4/800/1000",
    alt: "Minimal backpack against a soft background",
  },
];

export default function HeroShowcase() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative hidden lg:block"
    >
      <div className="grid grid-cols-2 gap-4">
        {HERO_IMAGES.map((image, index) => (
          <motion.div
            key={image.src}
            animate={{ y: [0, index % 2 === 0 ? -8 : 8, 0] }}
            transition={{
              duration: 6 + index,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className={
              index % 2 === 0
                ? "aspect-[4/5] overflow-hidden rounded-3xl shadow-sm"
                : "mt-10 aspect-[4/5] overflow-hidden rounded-3xl shadow-sm"
            }
          >
            <Link href="/products" className="block h-full w-full">
              <img
                src={image.src}
                alt={image.alt}
                loading={index < 2 ? "eager" : "lazy"}
                onError={(event) => {
                  if (event.currentTarget.src !== image.fallback) {
                    event.currentTarget.src = image.fallback;
                  }
                }}
                className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
