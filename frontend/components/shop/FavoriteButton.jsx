"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth";
import { useFavoritesStore } from "@/store/favorites";
import { cn } from "@/lib/utils";

export default function FavoriteButton({ product, className, size = 18 }) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const isFavorite = useFavoritesStore((state) =>
    state.favorites.some((fav) => Number(fav.item_id) === Number(product.id))
  );
  const toggle = useFavoritesStore((state) => state.toggle);

  const handleClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (!user) {
      toast("Please sign in to save favorites");
      router.push("/login");
      return;
    }
    toggle(product);
  };

  return (
    <motion.button
      whileTap={{ scale: 0.75 }}
      onClick={handleClick}
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur transition hover:scale-105",
        className
      )}
    >
      <Heart
        size={size}
        className={cn(
          "transition-colors duration-200",
          isFavorite ? "fill-red-500 text-red-500" : "text-stone-500"
        )}
      />
    </motion.button>
  );
}
