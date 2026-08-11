"use client";

import { cn } from "@/lib/utils";

const TONES = {
  stone: "bg-stone-100 text-stone-700",
  emerald: "bg-emerald-100 text-emerald-800",
  amber: "bg-amber-100 text-amber-800",
  red: "bg-red-100 text-red-700",
  blue: "bg-blue-100 text-blue-700",
  violet: "bg-violet-100 text-violet-700",
};

export default function Badge({ tone = "stone", className, children }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
        TONES[tone] || TONES.stone,
        className
      )}
    >
      {children}
    </span>
  );
}
