"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const TONES = {
  stone: "bg-stone-100 text-stone-700",
  emerald: "bg-emerald-100 text-emerald-700",
  amber: "bg-amber-100 text-amber-700",
  blue: "bg-blue-100 text-blue-700",
  violet: "bg-violet-100 text-violet-700",
};

export default function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  tone = "stone",
  index = 0,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.35 }}
      className="rounded-2xl border border-stone-200 bg-white p-5"
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
          {label}
        </p>
        {Icon && (
          <span
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-xl",
              TONES[tone] || TONES.stone
            )}
          >
            <Icon size={17} />
          </span>
        )}
      </div>
      <p className="mt-3 text-2xl font-semibold tracking-tight tabular-nums">
        {value}
      </p>
      {hint && <p className="mt-1 text-xs text-stone-400">{hint}</p>}
    </motion.div>
  );
}
