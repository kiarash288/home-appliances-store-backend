"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  CreditCard,
  MailWarning,
  MapPin,
  Plus,
  ShieldCheck,
  ShoppingBag,
} from "lucide-react";
import { toast } from "sonner";
import api, { getErrorMessage } from "@/lib/api";
import { useAuthStore } from "@/store/auth";
import { useCartStore } from "@/store/cart";
import { useMounted } from "@/lib/hooks";
import AddressFormModal from "@/components/shop/AddressFormModal";
import ProductImage from "@/components/shop/ProductImage";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import Skeleton from "@/components/ui/Skeleton";
import { cn, formatPrice } from "@/lib/utils";

export default function CheckoutPage() {
  const router = useRouter();
  const mounted = useMounted();

  const user = useAuthStore((state) => state.user);
  const basket = useCartStore((state) => state.basket);
  const cartLoading = useCartStore((state) => state.loading);
  const fetchBasket = useCartStore((state) => state.fetchBasket);

  const [addresses, setAddresses] = useState([]);
  const [addressesLoading, setAddressesLoading] = useState(true);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (mounted && !user) {
      router.replace("/login?next=/checkout");
    }
  }, [mounted, user, router]);

  const fetchAddresses = async () => {
    try {
      const { data } = await api.get("/addresses");
      const list = Array.isArray(data) ? data : [];
      setAddresses(list);
      if (list.length > 0) {
        const preferred = list.find((address) => address.isDefault) || list[0];
        setSelectedAddressId((current) => current ?? preferred.id);
      }
    } catch (_) {
      // handled through UI empty state
    } finally {
      setAddressesLoading(false);
    }
  };

  useEffect(() => {
    if (mounted && user) {
      fetchAddresses();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, user]);

  const handleResendVerification = async () => {
    setResending(true);
    try {
      const { data } = await api.post("/auth/resend-verification");
      toast.success(data.message || "Verification email sent");
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not send the email"));
    } finally {
      setResending(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      toast.error("Please select a delivery address");
      return;
    }
    setPlacing(true);

    let order;
    try {
      const { data } = await api.post("/orders", {
        addressId: Number(selectedAddressId),
      });
      order = data;
    } catch (error) {
      const status = error?.response?.status;
      if (status === 403) {
        toast.error("Please verify your email before placing an order.");
      } else {
        toast.error(getErrorMessage(error, "Could not place the order"));
      }
      setPlacing(false);
      return;
    }

    // The basket was cleared server-side inside the order transaction
    fetchBasket();

    try {
      const { data: payment } = await api.post(`/payments/${order.id}/init`);
      toast.success("Order placed! Redirecting to ZarinPal…");
      window.location.assign(payment.redirectUrl);
    } catch (error) {
      toast.error(getErrorMessage(error, "Payment could not be started"));
      toast.info("Your order was created — you can retry payment any time.");
      router.push(`/account/orders/${order.id}`);
    }
  };

  if (!mounted || !user || (cartLoading && basket.items.length === 0)) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Skeleton className="h-9 w-48" />
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
          <Skeleton className="h-96 rounded-3xl" />
          <Skeleton className="h-72 rounded-3xl" />
        </div>
      </div>
    );
  }

  if (basket.items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
        <EmptyState
          icon={ShoppingBag}
          title="Your cart is empty"
          description="Add some products before heading to checkout."
        >
          <Button onClick={() => router.push("/products")}>
            Browse products
          </Button>
        </EmptyState>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold tracking-tight">Checkout</h1>
      <p className="mt-1 text-sm text-stone-500">
        Almost there — confirm your delivery details and pay securely.
      </p>

      <div className="mt-8 grid items-start gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          {/* Step 1 — Address */}
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-stone-200 bg-white p-6"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-stone-900 text-xs font-semibold text-white">
                  1
                </span>
                <h2 className="font-semibold tracking-tight">
                  Delivery address
                </h2>
              </div>
              <Button
                variant="secondary"
                size="sm"
                disabled={addresses.length >= 3}
                onClick={() => setAddressModalOpen(true)}
              >
                <Plus size={14} /> New
              </Button>
            </div>

            {addressesLoading ? (
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <Skeleton className="h-32 rounded-2xl" />
                <Skeleton className="h-32 rounded-2xl" />
              </div>
            ) : addresses.length === 0 ? (
              <div className="mt-5 rounded-2xl border border-dashed border-stone-200 p-6 text-center">
                <MapPin size={22} className="mx-auto text-stone-300" />
                <p className="mt-2 text-sm text-stone-500">
                  You have no saved addresses yet.
                </p>
                <Button
                  size="sm"
                  className="mt-4"
                  onClick={() => setAddressModalOpen(true)}
                >
                  <Plus size={14} /> Add delivery address
                </Button>
              </div>
            ) : (
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {addresses.map((address) => {
                  const selected =
                    Number(selectedAddressId) === Number(address.id);
                  return (
                    <button
                      key={address.id}
                      onClick={() => setSelectedAddressId(address.id)}
                      className={cn(
                        "rounded-2xl border p-4 text-left transition",
                        selected
                          ? "border-stone-900 bg-stone-50 ring-2 ring-stone-900/10"
                          : "border-stone-200 hover:border-stone-400"
                      )}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold">
                          {address.title}
                        </p>
                        <span
                          className={cn(
                            "flex h-4.5 w-4.5 items-center justify-center rounded-full border",
                            selected
                              ? "border-stone-900 bg-stone-900"
                              : "border-stone-300"
                          )}
                        >
                          {selected && (
                            <span className="h-1.5 w-1.5 rounded-full bg-white" />
                          )}
                        </span>
                      </div>
                      <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-stone-500">
                        {address.fullAddress}
                      </p>
                      <p className="mt-1 text-xs text-stone-400">
                        {address.city} · {address.postalCode}
                      </p>
                      {address.isDefault && (
                        <Badge tone="emerald" className="mt-2">
                          Default
                        </Badge>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </motion.section>

          {/* Step 2 — Items */}
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="rounded-3xl border border-stone-200 bg-white p-6"
          >
            <div className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-stone-900 text-xs font-semibold text-white">
                2
              </span>
              <h2 className="font-semibold tracking-tight">
                Review your items
              </h2>
            </div>
            <div className="mt-4 divide-y divide-stone-100">
              {basket.items.map((line) => (
                <div key={line.id} className="flex items-center gap-4 py-4">
                  <div className="h-14 w-12 shrink-0 overflow-hidden rounded-xl bg-stone-100">
                    <ProductImage product={line.item} letterSize={16} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {line.item?.name}
                    </p>
                    <p className="mt-0.5 text-xs text-stone-400">
                      Qty {line.quantity} × {formatPrice(line.item?.price)}
                    </p>
                  </div>
                  <p className="text-sm font-semibold tabular-nums">
                    {formatPrice(
                      Number(line.item?.price || 0) * Number(line.quantity)
                    )}
                  </p>
                </div>
              ))}
            </div>
            <Link
              href="/products"
              className="text-xs font-medium text-stone-500 underline-offset-4 hover:text-stone-900 hover:underline"
            >
              Add more items
            </Link>
          </motion.section>
        </div>

        {/* Summary */}
        <motion.aside
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4 lg:sticky lg:top-24"
        >
          {user && !user.isVerified && (
            <div className="flex items-start gap-3 rounded-3xl border border-amber-200 bg-amber-50 p-5">
              <MailWarning size={19} className="mt-0.5 shrink-0 text-amber-600" />
              <div>
                <p className="text-sm font-medium text-amber-900">
                  Email verification required
                </p>
                <p className="mt-1 text-xs leading-relaxed text-amber-700">
                  Orders can only be placed with a verified email. Check your
                  inbox or resend the link.
                </p>
                <Button
                  variant="secondary"
                  size="sm"
                  className="mt-3"
                  loading={resending}
                  onClick={handleResendVerification}
                >
                  Resend verification
                </Button>
              </div>
            </div>
          )}

          <div className="rounded-3xl border border-stone-200 bg-white p-6">
            <h2 className="font-semibold tracking-tight">Order summary</h2>
            <div className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between text-stone-500">
                <span>
                  Items (
                  {basket.items.reduce(
                    (sum, line) => sum + Number(line.quantity),
                    0
                  )}
                  )
                </span>
                <span className="tabular-nums">
                  {formatPrice(basket.totalPrice)}
                </span>
              </div>
              <div className="flex justify-between text-stone-500">
                <span>Shipping</span>
                <span className="text-emerald-700">Free</span>
              </div>
              <div className="flex justify-between border-t border-stone-100 pt-3 text-base font-semibold">
                <span>Total</span>
                <span className="tabular-nums">
                  {formatPrice(basket.totalPrice)}
                </span>
              </div>
            </div>

            <Button
              size="lg"
              className="mt-6 w-full"
              loading={placing}
              disabled={!selectedAddressId}
              onClick={handlePlaceOrder}
            >
              <CreditCard size={16} /> Pay with ZarinPal
            </Button>

            <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-[11px] text-stone-400">
              <ShieldCheck size={13} />
              You will be redirected to ZarinPal to complete payment securely.
            </p>
          </div>
        </motion.aside>
      </div>

      <AddressFormModal
        open={addressModalOpen}
        onClose={() => setAddressModalOpen(false)}
        onSaved={(address) => {
          fetchAddresses();
          if (address?.id) setSelectedAddressId(address.id);
        }}
      />
    </div>
  );
}
