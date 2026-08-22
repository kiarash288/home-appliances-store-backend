"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth";
import { useCartStore } from "@/store/cart";
import QuantityStepper from "@/components/shop/QuantityStepper";
import Button from "@/components/ui/Button";

/**
 * Client island: quantity selection + add-to-cart. Everything around it
 * (price, description, stock badges) stays server-rendered.
 */
export default function PurchasePanel({ product }) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const addItem = useCartStore((state) => state.addItem);
  const mutatingId = useCartStore((state) => state.mutatingId);

  const [quantity, setQuantity] = useState(1);

  const outOfStock = Number(product.stock) <= 0;
  const adding = mutatingId === product.id;

  const handleAddToCart = () => {
    if (!user) {
      toast("Please sign in to start shopping");
      router.push(`/login?next=/products/${product.id}`);
      return;
    }
    addItem(product.id, quantity);
  };

  return (
    <div className="mt-8 flex flex-wrap items-center gap-3">
      <QuantityStepper
        value={quantity}
        onChange={setQuantity}
        min={1}
        max={Math.max(Number(product.stock) || 1, 1)}
        disabled={outOfStock}
      />
      <Button
        size="lg"
        className="flex-1 sm:flex-none sm:px-10"
        disabled={outOfStock}
        loading={adding}
        onClick={handleAddToCart}
      >
        <ShoppingBag size={16} />
        {outOfStock ? "Sold out" : "Add to cart"}
      </Button>
    </div>
  );
}
