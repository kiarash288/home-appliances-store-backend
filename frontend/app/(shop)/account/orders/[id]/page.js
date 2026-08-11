"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, CreditCard, MapPin, PackageX } from "lucide-react";
import { toast } from "sonner";
import api, { getErrorMessage } from "@/lib/api";
import ProductImage from "@/components/shop/ProductImage";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import Skeleton from "@/components/ui/Skeleton";
import {
  formatDate,
  formatPrice,
  ORDER_STATUS_META,
  PAYMENT_STATUS_META,
} from "@/lib/utils";

export default function OrderDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    let active = true;
    api
      .get(`/orders/${id}`)
      .then(({ data }) => {
        if (active) setOrder(data);
      })
      .catch(() => {
        if (active) setNotFound(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [id]);

  const handlePayNow = async () => {
    setPaying(true);
    try {
      const { data } = await api.post(`/payments/${order.id}/init`);
      window.location.assign(data.redirectUrl);
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not start the payment"));
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64 w-full rounded-3xl" />
        <Skeleton className="h-40 w-full rounded-3xl" />
      </div>
    );
  }

  if (notFound || !order) {
    return (
      <EmptyState
        icon={PackageX}
        title="Order not found"
        description="This order does not exist or does not belong to your account."
      >
        <Button onClick={() => router.push("/account/orders")}>
          Back to orders
        </Button>
      </EmptyState>
    );
  }

  const meta = ORDER_STATUS_META[order.status] || {};
  const items = order.orderItems || [];

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/account/orders"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-500 transition hover:text-stone-900"
        >
          <ArrowLeft size={14} /> All orders
        </Link>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight">
              Order #{order.id}
            </h1>
            <Badge tone={meta.tone}>{meta.label || order.status}</Badge>
          </div>
          {order.status === "pending" && (
            <Button loading={paying} onClick={handlePayNow}>
              <CreditCard size={15} /> Pay now
            </Button>
          )}
        </div>
        <p className="mt-1 text-xs text-stone-400">
          Placed on {formatDate(order.createdAt)} · Tracking code{" "}
          <span className="font-mono text-stone-500">
            {order.tracking_code}
          </span>
        </p>
      </div>

      {/* Items */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-3xl border border-stone-200 bg-white"
      >
        <div className="divide-y divide-stone-100">
          {items.map((line) => (
            <div key={line.id} className="flex items-center gap-4 p-5">
              <Link
                href={`/products/${line.item_id}`}
                className="h-16 w-14 shrink-0 overflow-hidden rounded-xl bg-stone-100"
              >
                <ProductImage product={line.item} letterSize={18} />
              </Link>
              <div className="min-w-0 flex-1">
                <Link
                  href={`/products/${line.item_id}`}
                  className="block truncate text-sm font-medium hover:underline"
                >
                  {line.item?.name || "Product"}
                </Link>
                <p className="mt-0.5 text-xs text-stone-400">
                  {line.quantity} × {formatPrice(line.unit_price)}
                </p>
              </div>
              <p className="text-sm font-semibold tabular-nums">
                {formatPrice(Number(line.unit_price) * Number(line.quantity))}
              </p>
            </div>
          ))}
        </div>
        <div className="space-y-2 border-t border-stone-100 bg-stone-50/60 p-5">
          <div className="flex justify-between text-sm text-stone-500">
            <span>Shipping</span>
            <span>Free</span>
          </div>
          <div className="flex justify-between text-base font-semibold">
            <span>Total</span>
            <span className="tabular-nums">
              {formatPrice(order.total_amount)}
            </span>
          </div>
        </div>
      </motion.section>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Address */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="rounded-3xl border border-stone-200 bg-white p-6"
        >
          <div className="flex items-center gap-2.5">
            <MapPin size={17} className="text-stone-400" />
            <h2 className="font-semibold tracking-tight">Delivery address</h2>
          </div>
          {order.address ? (
            <div className="mt-4 space-y-1 text-sm text-stone-600">
              <p className="font-medium text-stone-900">
                {order.address.title}
              </p>
              <p>{order.address.fullAddress}</p>
              <p>
                {order.address.city}, {order.address.state} ·{" "}
                {order.address.postalCode}
              </p>
              <p className="text-stone-400">{order.address.phone}</p>
            </div>
          ) : (
            <p className="mt-4 text-sm text-stone-400">
              No address is attached to this order.
            </p>
          )}
        </motion.section>

        {/* Payments */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-3xl border border-stone-200 bg-white p-6"
        >
          <div className="flex items-center gap-2.5">
            <CreditCard size={17} className="text-stone-400" />
            <h2 className="font-semibold tracking-tight">Payments</h2>
          </div>
          {order.payments?.length ? (
            <div className="mt-4 space-y-3">
              {order.payments.map((payment) => {
                const paymentMeta =
                  PAYMENT_STATUS_META[payment.status] || {};
                return (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between gap-3 rounded-2xl bg-stone-50 px-4 py-3"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium capitalize">
                        {payment.gateway_name}
                      </p>
                      <p className="mt-0.5 text-xs text-stone-400">
                        {formatDate(payment.createdAt)}
                        {payment.ref_id && (
                          <>
                            {" "}
                            · Ref{" "}
                            <span className="font-mono">{payment.ref_id}</span>
                          </>
                        )}
                      </p>
                    </div>
                    <Badge tone={paymentMeta.tone}>
                      {paymentMeta.label || payment.status}
                    </Badge>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="mt-4 text-sm text-stone-400">
              No payment attempts yet.
            </p>
          )}
        </motion.section>
      </div>
    </div>
  );
}
