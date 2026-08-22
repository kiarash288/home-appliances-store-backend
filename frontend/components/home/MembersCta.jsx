"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { useMounted } from "@/lib/hooks";

/**
 * Auth-aware CTA banner. Session state lives in localStorage (client only),
 * so this island renders for guests and removes itself for signed-in users.
 */
export default function MembersCta() {
  const mounted = useMounted();
  const user = useAuthStore((state) => state.user);

  if (mounted && user) return null;

  return (
    <section className="pb-24 pt-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-start justify-between gap-6 rounded-3xl bg-stone-950 p-10 text-white sm:flex-row sm:items-center lg:p-14"
      >
        <div>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Members get more.
          </h2>
          <p className="mt-2 max-w-md text-sm text-stone-400">
            Create an account to track orders, save favorites and check out
            faster.
          </p>
        </div>
        <Link
          href="/register"
          className="inline-flex h-12 shrink-0 items-center gap-2 rounded-full bg-emerald-600 px-7 text-sm font-medium text-white transition hover:bg-emerald-500"
        >
          Create account <ArrowRight size={16} />
        </Link>
      </motion.div>
    </section>
  );
}
