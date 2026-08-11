import { create } from "zustand";
import { toast } from "sonner";
import api, { getErrorMessage } from "@/lib/api";

const EMPTY_BASKET = { id: null, items: [], totalPrice: 0 };

export const useCartStore = create((set, get) => ({
  basket: EMPTY_BASKET,
  isOpen: false,
  loading: false,
  mutatingId: null,

  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),

  fetchBasket: async () => {
    set({ loading: true });
    try {
      const { data } = await api.get("/baskets");
      set({ basket: data });
    } catch (_) {
      // Silently keep the previous basket; the next action will surface errors
    } finally {
      set({ loading: false });
    }
  },

  addItem: async (productId, quantity = 1) => {
    set({ mutatingId: productId });
    try {
      const { data } = await api.post("/baskets/items", {
        productId,
        quantity,
      });
      set({ basket: data, isOpen: true });
      toast.success("Added to cart");
      return true;
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not add to cart"));
      return false;
    } finally {
      set({ mutatingId: null });
    }
  },

  updateQuantity: async (itemId, quantity) => {
    set({ mutatingId: itemId });
    try {
      const { data } = await api.put(`/baskets/items/${itemId}`, { quantity });
      set({ basket: data });
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not update quantity"));
    } finally {
      set({ mutatingId: null });
    }
  },

  removeItem: async (itemId) => {
    set({ mutatingId: itemId });
    try {
      const { data } = await api.delete(`/baskets/items/${itemId}`);
      set({ basket: data });
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not remove item"));
    } finally {
      set({ mutatingId: null });
    }
  },

  clear: async () => {
    try {
      const { data } = await api.delete("/baskets");
      set({ basket: data.basket || EMPTY_BASKET });
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not clear the cart"));
    }
  },

  reset: () => set({ basket: EMPTY_BASKET, isOpen: false }),
}));
