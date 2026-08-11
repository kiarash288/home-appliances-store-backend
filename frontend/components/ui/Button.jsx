"use client";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const VARIANTS = {
  primary: "bg-stone-900 text-white hover:bg-stone-700",
  secondary:
    "bg-white text-stone-900 border border-stone-200 hover:border-stone-400 hover:bg-stone-50",
  ghost: "bg-transparent text-stone-600 hover:bg-stone-100 hover:text-stone-900",
  danger: "bg-red-600 text-white hover:bg-red-500",
  accent: "bg-emerald-700 text-white hover:bg-emerald-600",
};

const SIZES = {
  sm: "h-8 px-3.5 text-xs",
  md: "h-10 px-5 text-sm",
  lg: "h-12 px-7 text-sm",
  icon: "h-10 w-10",
};

export default function Button({
  variant = "primary",
  size = "md",
  loading = false,
  className,
  children,
  disabled,
  ...props
}) {
  return (
    <motion.button
      whileTap={{ scale: disabled || loading ? 1 : 0.97 }}
      className={cn(
        "inline-flex select-none items-center justify-center gap-2 rounded-full font-medium tracking-wide transition-colors duration-200",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900",
        "disabled:cursor-not-allowed disabled:opacity-50",
        VARIANTS[variant],
        SIZES[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 size={15} className="animate-spin" />}
      {children}
    </motion.button>
  );
}
