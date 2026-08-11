"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export default function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 99,
  size = "md",
  disabled = false,
}) {
  const compact = size === "sm";

  const step = (delta) => {
    const next = Number(value) + delta;
    if (next < min || next > max) return;
    onChange(next);
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-stone-200 bg-white",
        compact ? "h-8" : "h-11",
        disabled && "opacity-50"
      )}
    >
      <button
        type="button"
        onClick={() => step(-1)}
        disabled={disabled || Number(value) <= min}
        aria-label="Decrease quantity"
        className={cn(
          "flex items-center justify-center rounded-full text-stone-500 transition hover:text-stone-950 disabled:cursor-not-allowed disabled:opacity-40",
          compact ? "h-8 w-8" : "h-11 w-11"
        )}
      >
        <Minus size={compact ? 13 : 15} />
      </button>
      <span
        className={cn(
          "select-none text-center font-medium tabular-nums",
          compact ? "w-7 text-xs" : "w-10 text-sm"
        )}
      >
        {value}
      </span>
      <button
        type="button"
        onClick={() => step(1)}
        disabled={disabled || Number(value) >= max}
        aria-label="Increase quantity"
        className={cn(
          "flex items-center justify-center rounded-full text-stone-500 transition hover:text-stone-950 disabled:cursor-not-allowed disabled:opacity-40",
          compact ? "h-8 w-8" : "h-11 w-11"
        )}
      >
        <Plus size={compact ? 13 : 15} />
      </button>
    </div>
  );
}
