import axios from "axios";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

// Backend origin for static assets (uploaded images live at /uploads/...)
export const ASSET_URL = API_URL.replace(/\/api\/?$/, "");

/** Resolves a stored image path (e.g. /uploads/items/x.jpg) to a full URL. */
export function assetUrl(path) {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  return `${ASSET_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// The auth store registers these at module init, so the api layer never has
// to import the store directly (avoids circular imports).
let tokenGetter = () => null;
let onTokenRefreshed = () => {};
let onSessionExpired = () => {};

export function bindAuthHandlers(handlers = {}) {
  if (handlers.tokenGetter) tokenGetter = handlers.tokenGetter;
  if (handlers.onTokenRefreshed) onTokenRefreshed = handlers.onTokenRefreshed;
  if (handlers.onSessionExpired) onSessionExpired = handlers.onSessionExpired;
}

api.interceptors.request.use((config) => {
  const token = tokenGetter();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let refreshPromise = null;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    const status = error.response?.status;
    const url = original?.url || "";
    const isAuthEndpoint =
      url.includes("/auth/login") ||
      url.includes("/auth/register") ||
      url.includes("/auth/refresh");

    if (
      status === 401 &&
      original &&
      !original._retry &&
      !isAuthEndpoint &&
      tokenGetter()
    ) {
      original._retry = true;
      try {
        refreshPromise =
          refreshPromise ||
          axios
            .post(`${API_URL}/auth/refresh`, {}, { withCredentials: true })
            .finally(() => {
              refreshPromise = null;
            });

        const { data } = await refreshPromise;
        onTokenRefreshed(data.accessToken);
        original.headers = {
          ...original.headers,
          Authorization: `Bearer ${data.accessToken}`,
        };
        return api(original);
      } catch (refreshError) {
        onSessionExpired();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export function getErrorMessage(error, fallback = "Something went wrong") {
  const data = error?.response?.data;
  if (Array.isArray(data?.errors) && data.errors.length) {
    return data.errors.map((issue) => issue.message).join(" · ");
  }
  return data?.message || data?.error || error?.message || fallback;
}

export default api;
