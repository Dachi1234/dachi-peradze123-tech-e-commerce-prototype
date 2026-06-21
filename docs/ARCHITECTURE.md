# TechStore — Architecture

## Stack
- Next.js 16 (App Router) — JavaScript, no TypeScript
- React 19, Tailwind CSS v3
- Drizzle ORM + Neon Postgres (HTTP driver)
- Auth: JWT in an httpOnly `session` cookie, signed with `jose`; passwords hashed with `bcryptjs`

## Data model (`lib/schema.js`)
- `users` — id (uuid), username (unique), password_hash, created_at
- `products` — id (uuid), name, category (`phone`|`laptop`), price (numeric), image_url, description
- `ratings` — id, product_id → products.id, user_id → users.id, stars (1–5), created_at; unique(product_id, user_id)
- `cart_items` — id, user_id → users.id, product_id → products.id, quantity (int, default 1), created_at; unique(user_id, product_id)

All foreign keys cascade on delete. Migrations live in `drizzle/0000_initial.sql`, `0001_add_users_auth.sql`, `0002_add_cart.sql` and are applied by `lib/migrate.js` (uses `drizzle-orm/neon-http/migrator`) before each `next build`. `lib/seed.js` seeds the product catalog (idempotent).

## Routes / pages
- `app/page.js` — homepage product grid with category filter; "Add to Cart" hits the DB-backed cart (redirects logged-out users to `/login?redirect=/`)
- `app/cart/page.js` — auth-gated cart page; list of items with qty controls, per-item remove, clear all, line subtotals and grand total
- `app/login/page.js` — standalone login/register page; reads `?redirect=<path>` and bounces the user there after auth
- `app/profile/page.js` — user profile with the ratings they've submitted

## API endpoints
- `GET/POST/PATCH/DELETE /api/auth/{me,login,register,logout}` — session auth
- `GET /api/products`, `GET /api/products/[id]` — product catalog with aggregated avgRating/ratingCount
- `POST /api/ratings` — upsert a user's rating for a product
- `GET /api/profile` — current user's ratings joined with product data
- `GET /api/cart` — current user's cart items joined with products
- `POST /api/cart` — add/increment `{ productId, quantity }`
- `DELETE /api/cart` — clear all cart items for the user
- `PATCH /api/cart/[itemId]` — set quantity (0 deletes)
- `DELETE /api/cart/[itemId]` — remove single item

## Client state
`app/layout.js` wraps everything in `Providers` (AuthProvider → CartProvider → ToastProvider). `useCart()` exposes `items`, `count`, `addToCart`, `updateQuantity`, `removeItem`, `clearCart`, `refresh`. The header's cart badge reads `count` so it stays in sync across pages. All cart fetch calls explicitly send `credentials: 'include'` so the httpOnly `session` cookie is attached to same-origin requests (required for the API's `getSession()` to authenticate the user).

## Env
- `DATABASE_URL` — Neon pooled connection string (set on Vercel)
- `JWT_SECRET` — optional; defaults to a dev string

## Known limitations / TODO
- No checkout / payments / order history (out of scope)
- No `/products/[id]` UI page (API exists)
- AuthModal still used on homepage for in-place login; `/login` page used for redirected flows
- Single global cart per user; no quantity caps or stock tracking
