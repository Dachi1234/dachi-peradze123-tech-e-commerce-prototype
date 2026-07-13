# TechStore — Architecture

## Stack
- Next.js 16 (App Router) — JavaScript, no TypeScript
- React 19, Tailwind CSS v3
- Inter font loaded via `next/font/google` and applied at `<html>` root
- Drizzle ORM + Neon Postgres (HTTP driver)
- Auth: JWT in an httpOnly `session` cookie, signed with `jose`; passwords hashed with `bcryptjs`

## Visual design
Dark minimal theme across every page (per Nino's Figma). Tokens used everywhere:
- Page bg `#111111`, header bg `#0f0f0f`, card bg `#1a1a1a`, input bg `#1e1e1e`
- Border/divider `#2a2a2a`
- Text: primary `#ffffff`, secondary `gray-400`, placeholder `gray-500`
- Accent / primary CTA: `amber-400` (`#fbbf24`) — base, with `amber-500` on hover; CTA text is `gray-900` for legible contrast on the amber fill. Link/text accents use `amber-400` → `amber-300` on hover.
- Category badge: bg `green-950`, text `green-400`
- Star ratings: `amber-500` filled, `amber-900` (dark amber tint) for empty positions so the 5-star row keeps a consistent silhouette even when a product has no ratings yet
Rounded corners use `rounded-xl` for cards / `rounded-lg` for buttons & inputs. No light backgrounds remain.

## Data model (`lib/schema.js`)
- `users` — id (uuid), username (unique), password_hash, created_at
- `products` — id (uuid), name, category (`phone`|`laptop`), price (numeric), image_url, description
- `ratings` — id, product_id → products.id, user_id → users.id, stars (1–5), created_at; unique(product_id, user_id)
- `cart_items` — id, user_id → users.id, product_id → products.id, quantity (int, default 1), created_at; unique(user_id, product_id)

All foreign keys cascade on delete. Migrations live in `drizzle/0000_initial.sql`, `0001_add_users_auth.sql`, `0002_add_cart.sql` and are applied by `lib/migrate.js` (uses `drizzle-orm/neon-http/migrator`) before each `next build`. `lib/seed.js` seeds the product catalog (idempotent).

## Routes / pages
- `app/page.js` — homepage. Dark grid of clickable product cards (image on top with overlay green category badge, name + stars + price below) using `gap-6` for generous spacing; shared dark header with logo + centered search + Login (ghost) + Cart (amber pill); category filter pills (active = amber filled with dark text, inactive = outlined). Search bar filters the visible products client-side by name/category/description.
- `app/products/[id]/page.js` — Product details page. Dark two-column layout with `gap-16` between columns: left card holds the product image with `p-6` internal padding and `object-contain` centering so the full shot is visible; right column shows breadcrumb (`Home / category / name`) → category badge → large white name → gray description → amber star row with avg + review count → divider → big price → specs box (parses bullets/semicolons/pipes/newlines from description; `p-6`, `space-y-3` list) → amber full-width "Add to Cart" (dark text) → ratings panel with `StarInput` wired to `/api/ratings`. Section vertical rhythm uses `mb-4 / mb-5 / mb-8 / my-8 / mb-6` to match Nino's Figma spacing.
- `app/cart/page.js` — auth-gated dark cart page. List of dark item rows with qty controls, per-item remove, clear-all (inline two-step confirm: click "Clear cart" → "Yes, clear" / "Cancel" — no `window.confirm()` since headless/strict-privacy browsers suppress it), order-summary card with totals and a disabled "Checkout (coming soon)" button.
- `app/login/page.js` — standalone dark login/register card; reads `?redirect=<path>` and bounces the user there after auth.
- `app/profile/page.js` — dark profile page with user info card and a list of their ratings (each links to `/products/[id]`).

## Shared components
- `components/SiteHeader.js` — single dark header reused by home, cart, product details, profile. Props: `search`, `onSearchChange`, `showSearch`.
- `components/StarRating.js` — `StarDisplay` uses `amber-500` (filled) and `amber-900` filled (empty) so the 5-star silhouette is consistent across rated and unrated products. `StarInput` uses `amber-500` filled vs `gray-600` outline (interactive rating UI is intentionally clearer).
- `components/AuthContext.js`, `components/CartContext.js`, `components/Toast.js`, `components/Providers.js` — unchanged behavior. `components/AuthModal.js` exists but is no longer mounted; `/login` is the single auth entry point.

## API endpoints
- `GET/POST/PATCH/DELETE /api/auth/{me,login,register,logout}` — session auth
- `GET /api/products` — full catalog with aggregated avgRating/ratingCount
- `GET /api/products/[id]` — NEW. Single product joined with avgRating/ratingCount; 404 when not found
- `GET /api/products/[id]/ratings` — product's individual ratings
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
- Single global cart per user; no quantity caps or stock tracking
- Search bar is purely client-side filter (no server search yet)
- Spec parsing on product details is a heuristic split of `description`; a dedicated `specs` column would be cleaner
