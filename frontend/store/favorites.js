import { create } from "zustand";
import { toast } from "sonner";
import api, { getErrorMessage } from "@/lib/api";

export const useFavoritesStore = create((set, get) => ({
  favorites: [],
  loading: false,

  fetchFavorites: async () => {
    set({ loading: true });
    try {
      const { data } = await api.get("/favorites");
      set({ favorites: Array.isArray(data) ? data : [] });
    } catch (_) {
      // Non-blocking; favorites simply stay empty
    } finally {
      set({ loading: false });
    }
  },

  isFavorite: (itemId) =>
    get().favorites.some((fav) => Number(fav.item_id) === Number(itemId)),

  toggle: async (item) => {
    const itemId = item.id;
    const previous = get().favorites;
    const exists = previous.some(
      (fav) => Number(fav.item_id) === Number(itemId)
    );

    if (exists) {
      set({
        favorites: previous.filter(
          (fav) => Number(fav.item_id) !== Number(itemId)
        ),
      });
      try {
        await api.delete(`/favorites/${itemId}`);
      } catch (error) {
        set({ favorites: previous });
        toast.error(getErrorMessage(error, "Could not update favorites"));
      }
      return;
    }

    set({
      favorites: [
        ...previous,
        { id: `optimistic-${itemId}`, item_id: itemId, item },
      ],
    });
    try {
      const { data } = await api.post(`/favorites/${itemId}`);
      set({ favorites: [...previous, { ...data, item }] });
      toast.success("Saved to favorites");
    } catch (error) {
      set({ favorites: previous });
      toast.error(getErrorMessage(error, "Could not update favorites"));
    }
  },

  reset: () => set({ favorites: [] }),
}));
