"use client";

import { Suspense, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { useCartStore } from "@/store/cart";
import Button from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-md px-4 py-24">
          <Skeleton className="h-80 w-full rounded-3xl" />
        </div>
      }
    >
      <PaymentSuccess />
    </Suspense>
  );
}

function PaymentSuccess() {
  const searchParams = useSearchParams();
  const refId = searchParams.get("refId");
  const fetchBasket = useCartStore((state) => state.fetchBasket);

  useEffect(() => {
    fetchBasket();
  }, [fetchBasket]);

  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
      <motion.div
        initial={{ scale: 0.3, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 240, damping: 16 }}
      >
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
          <CheckCircle2 size={42} className="text-emerald-600" />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4 }}
      >
        <h1 className="mt-8 text-2xl font-semibold tracking-tight">
          Payment successful!
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-stone-500">
          Thank you for your purchase. Your order is confirmed and is now being
          processed.
        </p>
        {refId && (
          <p className="mt-4 rounded-full bg-stone-100 px-4 py-2 text-xs text-stone-500">
            Payment reference: <span className="font-mono">{refId}</span>
          </p>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="mt-10 flex w-full flex-col gap-3"
      >
        <Link href="/account/orders" className="w-full">
          <Button size="lg" className="w-full">
            View my orders
          </Button>
        </Link>
        <Link href="/products" className="w-full">
          <Button variant="secondary" size="lg" className="w-full">
            Continue shopping
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
