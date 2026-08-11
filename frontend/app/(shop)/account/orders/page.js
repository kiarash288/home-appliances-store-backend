"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronRight, Package } from "lucide-react";
import api from "@/lib/api";
import ProductImage from "@/components/shop/ProductImage";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import Skeleton from "@/components/ui/Skeleton";
import { formatDate, formatPrice, ORDER_STATUS_META } from "@/lib/utils";

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    api
      .get("/orders")
      .then(({ data }) => {
        if (active) setOrders(Array.isArray(data) ? data : []);
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-28 w-full rounded-3xl" />
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <EmptyState
        icon={Package}
        title="No orders yet"
        description="When you place an order it will show up here."
      >
        <Button onClick={() => router.push("/products")}>
          Start shopping
        </Button>
      </EmptyState>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order, index) => {
        const meta = ORDER_STATUS_META[order.status] || {};
        const items = order.orderItems || [];
        const itemCount = items.reduce(
          (sum, line) => sum + Number(line.quantity || 0),
          0
        );

        return (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
          >
            <Link
              href={`/account/orders/${order.id}`}
              className="flex flex-wrap items-center gap-5 rounded-3xl border border-stone-200 bg-white p-5 transition hover:border-stone-400 sm:p-6"
            >
              {/* Thumbnails */}
              <div className="flex -space-x-3">
                {items.slice(0, 3).map((line) => (
                  <div
                    key={line.id}
                    className="h-12 w-12 overflow-hidden rounded-xl ring-2 ring-white"
                  >
                    <ProductImage product={line.item} letterSize={16} />
                  </div>
                ))}
                {items.length > 3 && (
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-stone-100 text-xs font-medium text-stone-500 ring-2 ring-white">
                    +{items.length - 3}
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-semibold">Order #{order.id}</p>
                  <Badge tone={meta.tone}>{meta.label || order.status}</Badge>
                </div>
                <p className="mt-1 text-xs text-stone-400">
                  {formatDate(order.createdAt)} · {itemCount}{" "}
                  {itemCount === 1 ? "item" : "items"} ·{" "}
                  <span className="font-mono">{order.tracking_code}</span>
                </p>
              </div>

              <div className="flex items-center gap-3">
                <p className="text-sm font-semibold tabular-nums">
                  {formatPrice(order.total_amount)}
                </p>
                <ChevronRight size={16} className="text-stone-300" />
              </div>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
