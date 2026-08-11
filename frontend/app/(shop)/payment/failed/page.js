"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { XCircle } from "lucide-react";
import Button from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";

export default function PaymentFailedPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-md px-4 py-24">
          <Skeleton className="h-80 w-full rounded-3xl" />
        </div>
      }
    >
      <PaymentFailed />
    </Suspense>
  );
}

function PaymentFailed() {
  const searchParams = useSearchParams();
  const message = searchParams.get("message");

  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
      <motion.div
        initial={{ scale: 0.3, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 240, damping: 16 }}
      >
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
          <XCircle size={42} className="text-red-500" />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4 }}
      >
        <h1 className="mt-8 text-2xl font-semibold tracking-tight">
          Payment failed
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-stone-500">
          {message ||
            "The payment was cancelled or could not be verified. Don't worry — your order is saved and you can retry any time."}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="mt-10 flex w-full flex-col gap-3"
      >
        <Link href="/account/orders" className="w-full">
          <Button size="lg" className="w-full">
            Retry from my orders
          </Button>
        </Link>
        <Link href="/products" className="w-full">
          <Button variant="secondary" size="lg" className="w-full">
            Back to the shop
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
