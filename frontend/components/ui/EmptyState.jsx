"use client";

import { motion } from "framer-motion";

export default function EmptyState({ icon: Icon, title, description, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-stone-200 bg-white/60 px-6 py-16 text-center"
    >
      {Icon && (
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-stone-100 text-stone-400">
          <Icon size={26} strokeWidth={1.5} />
        </div>
      )}
      <h3 className="mt-4 text-base font-semibold tracking-tight">{title}</h3>
      {description && (
        <p className="mt-1.5 max-w-sm text-sm text-stone-500">{description}</p>
      )}
      {children && <div className="mt-6">{children}</div>}
    </motion.div>
  );
}
