import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import api, { bindAuthHandlers } from "@/lib/api";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,

      login: async (email, password) => {
        const { data } = await api.post("/auth/login", { email, password });
        set({ user: data.user, accessToken: data.accessToken });
        return data.user;
      },

      register: async (payload) => {
        const { data } = await api.post("/auth/register", payload);
        return data;
      },

      refreshProfile: async () => {
        const { data } = await api.get("/users/profile");
        set({ user: data });
        return data;
      },

      refreshToken: async () => {
        const { data } = await api.post("/auth/refresh");
        set({ accessToken: data.accessToken });
        return data.accessToken;
      },

      logout: async () => {
        try {
          await api.post("/auth/logout");
        } catch (_) {
          // Session cleanup should never block signing out locally
        }
        set({ user: null, accessToken: null });
      },

      clearSession: () => set({ user: null, accessToken: null }),
    }),
    {
      name: "store-auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
      }),
    }
  )
);

bindAuthHandlers({
  tokenGetter: () => useAuthStore.getState().accessToken,
  onTokenRefreshed: (accessToken) => useAuthStore.setState({ accessToken }),
  onSessionExpired: () =>
    useAuthStore.setState({ user: null, accessToken: null }),
});
