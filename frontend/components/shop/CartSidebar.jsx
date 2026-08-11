"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ShoppingBag, Trash2, X } from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { useCartStore } from "@/store/cart";
import ProductImage from "@/components/shop/ProductImage";
import QuantityStepper from "@/components/shop/QuantityStepper";
import Button from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils";

export default function CartSidebar() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  const basket = useCartStore((state) => state.basket);
  const isOpen = useCartStore((state) => state.isOpen);
  const close = useCartStore((state) => state.close);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const mutatingId = useCartStore((state) => state.mutatingId);

  const itemCount = basket.items.reduce(
    (sum, item) => sum + Number(item.quantity || 0),
    0
  );

  const handleCheckout = () => {
    close();
    if (!user) {
      router.push("/login?next=/checkout");
      return;
    }
    router.push("/checkout");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[80]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={close}
            className="absolute inset-0 bg-stone-950/40 backdrop-blur-sm"
          />

          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
            className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-stone-100 px-6 py-5">
              <h2 className="text-base font-semibold tracking-tight">
                Your cart
                {itemCount > 0 && (
                  <span className="ml-2 text-sm font-normal text-stone-400">
                    {itemCount} {itemCount === 1 ? "item" : "items"}
                  </span>
                )}
              </h2>
              <button
                onClick={close}
                aria-label="Close cart"
                className="flex h-8 w-8 items-center justify-center rounded-full text-stone-400 transition hover:bg-stone-100 hover:text-stone-900"
              >
                <X size={17} />
              </button>
            </div>

            {basket.items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-stone-100 text-stone-400">
                  <ShoppingBag size={28} strokeWidth={1.5} />
                </div>
                <div>
                  <p className="font-medium">Your cart is empty</p>
                  <p className="mt-1 text-sm text-stone-500">
                    Discover something you will love.
                  </p>
                </div>
                <Button
                  onClick={() => {
                    close();
                    router.push("/products");
                  }}
                >
                  Explore products
                </Button>
              </div>
            ) : (
              <>
                <div className="flex-1 divide-y divide-stone-100 overflow-y-auto px-6">
                  <AnimatePresence initial={false}>
                    {basket.items.map((line) => (
                      <motion.div
                        key={line.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 30 }}
                        transition={{ duration: 0.25 }}
                        className="flex gap-4 py-5"
                      >
                        <Link
                          href={`/products/${line.item_id}`}
                          onClick={close}
                          className="h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-stone-100"
                        >
                          <ProductImage product={line.item} letterSize={24} />
                        </Link>

                        <div className="flex min-w-0 flex-1 flex-col justify-between">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <Link
                                href={`/products/${line.item_id}`}
                                onClick={close}
                                className="block truncate text-sm font-medium hover:underline"
                              >
                                {line.item?.name || "Product"}
                              </Link>
                              <p className="mt-0.5 text-xs text-stone-400">
                                {formatPrice(line.item?.price)} each
                              </p>
                            </div>
                            <button
                              onClick={() => removeItem(line.item_id)}
                              aria-label="Remove item"
                              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-stone-300 transition hover:bg-red-50 hover:text-red-500"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>

                          <div className="flex items-center justify-between">
                            <QuantityStepper
                              size="sm"
                              value={line.quantity}
                              min={1}
                              max={Math.max(Number(line.item?.stock) || 1, 1)}
                              disabled={mutatingId === line.item_id}
                              onChange={(next) =>
                                updateQuantity(line.item_id, next)
                              }
                            />
                            <p className="text-sm font-semibold tabular-nums">
                              {formatPrice(
                                Number(line.item?.price || 0) *
                                  Number(line.quantity || 0)
                              )}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                <div className="space-y-4 border-t border-stone-100 px-6 py-5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-stone-500">Subtotal</span>
                    <span className="text-base font-semibold tabular-nums">
                      {formatPrice(basket.totalPrice)}
                    </span>
                  </div>
                  <p className="text-xs text-stone-400">
                    Shipping and taxes are calculated at checkout.
                  </p>
                  <Button size="lg" className="w-full" onClick={handleCheckout}>
                    Checkout
                  </Button>
                  <button
                    onClick={() => {
                      close();
                      router.push("/products");
                    }}
                    className="w-full text-center text-xs font-medium text-stone-500 underline-offset-4 transition hover:text-stone-900 hover:underline"
                  >
                    or continue shopping
                  </button>
                </div>
              </>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
