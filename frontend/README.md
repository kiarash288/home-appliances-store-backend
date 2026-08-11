# STORE. — Frontend

Modern e-commerce frontend + admin panel for the Express/Sequelize backend in the parent folder.

## Stack

- **Next.js 15** (App Router, route groups: `(shop)`, `(auth)`, `(admin)`)
- **Tailwind CSS v4** for styling
- **Framer Motion** for page transitions and micro-interactions
- **Zustand** for auth / cart / favorites state
- **Axios** with automatic Bearer token + refresh-token interceptors
- **sonner** toasts, **lucide-react** icons

## Getting started

```bash
# 1. Backend (from ../)
npm run dev            # API on http://localhost:3000

# 2. Frontend (from this folder)
npm install
npm run dev            # App on http://localhost:3001
```

`NEXT_PUBLIC_API_URL` is set in `.env.local` (defaults to `http://localhost:3000/api`).

> The backend `.env` must point `FRONTEND_URL=http://localhost:3001` so email
> verification links and ZarinPal payment redirects land on this app.

## Structure

```
app/
  (shop)/      storefront: home, products, favorites, checkout, account, payment results
  (auth)/      login, register, verify-email, forgot-password
  (admin)/     admin panel: dashboard, products, categories, orders, users
components/    ui kit, shop components, admin components
lib/           axios client, hooks, formatting helpers
store/         zustand stores (auth, cart, favorites)
```

## Notes

- The cart and favorites require a signed-in user (they are server-backed).
- Placing an order requires a verified email (`requireVerifiedEmail` on the API).
- Checkout redirects to ZarinPal; the gateway callback returns to
  `/payment/success` or `/payment/failed`.
