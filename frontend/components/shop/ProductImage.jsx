"use client";

import { cn } from "@/lib/utils";

const PALETTES = [
  ["#e7e5e4", "#a8a29e"],
  ["#d1fae5", "#6ee7b7"],
  ["#fef3c7", "#fcd34d"],
  ["#dbeafe", "#93c5fd"],
  ["#ede9fe", "#c4b5fd"],
  ["#fce7f3", "#f9a8d4"],
  ["#ffedd5", "#fdba74"],
  ["#ccfbf1", "#5eead4"],
];

/**
 * Renders the product's main image, or a deterministic gradient tile with the
 * product initial when no image has been uploaded.
 */
export default function ProductImage({ product, className, letterSize = 44 }) {
  if (product?.main_image) {
    return (
      <img
        src={product.main_image}
        alt={product?.name || "Product"}
        className={cn("h-full w-full object-cover", className)}
      />
    );
  }

  const [from, to] = PALETTES[(Number(product?.id) || 0) % PALETTES.length];
  const letter = (product?.name || "?").charAt(0).toUpperCase();

  return (
    <div
      className={cn(
        "flex h-full w-full items-center justify-center",
        className
      )}
      style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
    >
      <span
        className="select-none font-bold text-white/70"
        style={{ fontSize: letterSize }}
      >
        {letter}
      </span>
    </div>
  );
}
