/**
 * Server-side data fetching for Server Components.
 *
 * Deliberately separate from lib/api.js: the axios client carries browser
 * concerns (interceptors, token handling, store bindings) that must not be
 * pulled into the React Server Component graph.
 */
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

/**
 * Fetches a public API endpoint with ISR caching.
 * Returns the parsed JSON, or null when the API is unreachable so pages can
 * still render their shell.
 */
export async function fetchFromApi(path, { revalidate = 60 } = {}) {
  try {
    const response = await fetch(`${API_URL}${path}`, {
      next: { revalidate },
    });
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}
