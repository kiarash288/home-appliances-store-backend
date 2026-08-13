# STORE. — Full-Stack E-Commerce Platform

A production-style e-commerce platform with a customer storefront, a dedicated
admin panel, and a REST API. Built as a monorepo: the Express API lives at the
root and the Next.js frontend lives in [`frontend/`](./frontend).

## Features

**Storefront**
- Product catalog with search, category filters, sorting and pagination
- Product pages with image galleries, stock status and customer reviews
- Server-backed shopping cart with an animated slide-out sidebar
- Favorites (wishlist), addresses, order history and profile management
- Auth with JWT access tokens + HttpOnly refresh-token cookie
- Email verification and OTP-based password reset
- Checkout with ZarinPal payment gateway (initiate → redirect → verify)

**Admin panel** (`/admin`, role-guarded)
- Dashboard with revenue/orders/customers stats and a sales chart
  (daily / weekly / monthly / yearly)
- Product management with multi-image upload (1 main + up to 5 gallery images)
- Category, order (status workflow) and user (role) management

**API**
- Layered architecture: routes → controllers → services → repositories → models
- Zod request validation, Sequelize transactions with row-level locking for
  checkout and payment verification
- Swagger/OpenAPI docs at `/api-docs`

## Tech Stack

| Layer      | Technology |
|------------|------------|
| Backend    | Node.js, Express 5, Sequelize (MySQL), Redis, Zod, JWT, bcrypt, Multer, Nodemailer, Swagger |
| Frontend   | Next.js 15 (App Router), Tailwind CSS v4, Zustand, Framer Motion, Axios, Recharts, sonner |
| Payments   | ZarinPal (API v4) |
| SMS        | Kavenegar (phone OTP) |

## Project Structure

```
store/
├── src/                  # Express API
│   ├── config/           # database, redis, mail, swagger
│   ├── models/           # Sequelize models
│   ├── repositories/     # data access layer
│   ├── services/         # business logic (transactions live here)
│   ├── controllers/      # request/response handling
│   ├── routes/           # route definitions + swagger annotations
│   ├── middlewares/      # auth, validation, uploads
│   └── validators/       # zod schemas
├── database/schema.sql   # reference schema
├── public/uploads/       # uploaded product images (git-ignored)
└── frontend/             # Next.js storefront + admin panel
```

## Getting Started

### 1. Prerequisites

- Node.js 20+
- MySQL 8
- Redis (easiest via Docker):

```bash
docker run -d --name redis -p 6379:6379 redis:7-alpine
```

### 2. Configure the environment

```bash
cp .env.example .env
```

Fill in at minimum:

| Variable | Notes |
|----------|-------|
| `DB_*` | MySQL connection (create the `store` database first) |
| `JWT_SECRET`, `JWT_REFRESH_SECRET` | any long random strings |
| `REDIS_URL` | default `redis://127.0.0.1:6379` |
| `SMTP_*` | SMTP account for verification/OTP emails |
| `FRONTEND_URL` | `http://localhost:3001` (email links + payment redirects) |
| `APP_URL` | `http://localhost:3000` (ZarinPal callback base) |
| `ZARINPAL_MERCHANT_ID` | required for real payments |

Create the database:

```sql
CREATE DATABASE store CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

(Tables are created automatically on first start via Sequelize sync.)

### 3. Run the backend (port 3000)

```bash
npm install
npm run dev
```

- API base: `http://localhost:3000/api`
- Swagger docs: `http://localhost:3000/api-docs`

### 4. Run the frontend (port 3001)

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:3001`.

### 5. Create an admin user

Register through the UI, then promote the account:

```sql
UPDATE users SET role = 'admin' WHERE email = 'you@example.com';
```

Sign in again and you will be redirected to the admin panel at `/admin`.

## Useful Scripts

| Location   | Command         | Description |
|------------|-----------------|-------------|
| root       | `npm run dev`   | API with nodemon (auto-reload) |
| root       | `npm start`     | API without reload |
| `frontend` | `npm run dev`   | Next.js dev server on port 3001 |
| `frontend` | `npm run build` | Production build |
| `frontend` | `npm start`     | Serve the production build |

## Notes

- **Emails** require a reachable SMTP server; the API logs a detailed SMTP
  connectivity report on startup.
- **Payments** redirect to ZarinPal and return to
  `FRONTEND_URL/payment/success` or `/payment/failed`.
- **Uploads** are stored under `public/uploads/` and served from
  `http://localhost:3000/uploads/...`.
