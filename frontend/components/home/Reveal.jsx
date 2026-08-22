"use client";

import { motion } from "framer-motion";

/**
 * Tiny client island that adds an entrance animation to server-rendered
 * children. The children themselves stay Server Components — only the
 * wrapper ships client-side JavaScript.
 */
export default function Reveal({
  children,
  className,
  delay = 0,
  y = 14,
  viewport = false,
}) {
  const transition = { duration: 0.45, delay, ease: "easeOut" };

  if (viewport) {
    return (
      <motion.div
        className={className}
        initial={{ opacity: 0, y }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={transition}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={transition}
    >
      {children}
    </motion.div>
  );
}
