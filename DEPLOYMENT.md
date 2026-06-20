# NÜRHAUS — Headless Shopify Deployment Guide

This site is a **headless Shopify storefront**: all design, animation, and layout live in this Next.js codebase, while products, inventory, carts, and checkout are powered by **Shopify's Storefront API**. Shopify is the commerce backend; nothing about the storefront's visual design depends on Shopify's theme system.

---

## 1. Architecture at a glance

```
src/lib/shopify/
  client.ts      → low-level GraphQL fetch wrapper (reads SHOPIFY_* env vars)
  queries.ts      → GraphQL queries & mutations (products, cart)
  types.ts        → raw Shopify + app-facing TypeScript types
  transform.ts    → maps raw Shopify shapes → the shapes the UI components expect
  index.ts        → high-level functions: getProducts, getProductByHandle, cart mutations
  actions.ts       → 'use server' Server Actions — cart mutations callable from client components,
                     manage the cart-id cookie

src/contexts/CartContext.tsx → client-side cart state, backed by the Server Actions above
```

Pages fetch data **on the server** (React Server Components) and pass it down to the existing
client components (animations, interactivity unchanged). Cart mutations go through Next.js
**Server Actions**, so your Storefront API token is never sent to the browser.

Checkout is **Shopify-hosted**: the "Proceed to Checkout" button links straight to the cart's
`checkoutUrl`, which is Shopify's own secure checkout (supports Shop Pay, Apple Pay, etc., exactly
as configured in your Shopify admin).

---

## 2. Create a Shopify Storefront API app

1. In your **Shopify admin**, go to **Settings → Apps and sales channels → Develop apps**.
   (If you don't see "Develop apps", enable it first under "Allow custom app development".)
2. Click **Create an app**, name it e.g. `NÜRHAUS Storefront`.
3. Open the **API credentials** tab → **Configure Storefront API scopes**, and enable at least:
   - `unauthenticated_read_product_listings`
   - `unauthenticated_read_product_inventory` (needed for stock/size availability)
   - `unauthenticated_read_product_tags`
   - `unauthenticated_write_checkouts` / cart-related scopes (cart create/update)
   - `unauthenticated_read_checkouts`
4. Click **Install app**.
5. Under **API credentials**, copy the **Storefront API access token** (not the Admin API token).
6. Note your store's `*.myshopify.com` domain — this is `SHOPIFY_STORE_DOMAIN`, not your custom
   domain (e.g. `nurhaus.com` won't work here even if that's your live domain).

> Alternatively, Shopify's newer **Headless** sales channel (Settings → Apps → Headless) gives you
> the same Storefront API token through a slightly different UI — either path works.

---

## 3. Environment variables

Copy `.env.local.example` to `.env.local` and fill in:

```
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=shpat_xxxxxxxxxxxxxxxxxxxxx
SHOPIFY_STOREFRONT_API_VERSION=2024-10
```

Check [shopify.dev/docs/api/usage/versioning](https://shopify.dev/docs/api/usage/versioning) for
the current API version and bump `SHOPIFY_STOREFRONT_API_VERSION` quarterly — Shopify supports each
version for about a year, so this is a low-maintenance once-a-quarter check.

Run locally:

```
npm install
npm run dev
```

If these variables are missing or wrong, the site **does not crash** — every data-driven page
(home collection grid, shop, product detail, search, cart) shows a "Connect your Shopify store"
notice instead of breaking the layout, so you can preview the design before the store is connected.

---

## 4. Aligning your catalog with this storefront

The shop grid, search, and homepage "Collection" section pull **whatever products exist in your
store** — no hardcoded product list. Categories (the Abaya / Dress filter) are derived automatically
from each product's **Product Type** field in Shopify admin, so set Product Type to `Abaya` or
`Dress` (or any types you use) on each product.

A few editorial pages reference *specific* product handles as part of fixed brand storytelling and
are **not** Shopify-driven (this is intentional — they're campaign content, not catalog data):

- `src/app/lookbook/page.tsx` — the `SCENES` array links each "look" to a handle like `sahar-abaya`.
- `src/app/journal/page.tsx` / `journal/[slug]/page.tsx` — editorial articles, not products.

To keep the lookbook's "Shop this look" links working, either:
- create products in Shopify with matching handles (`sahar-abaya`, `noor-dress`, `layl-abaya`,
  `dunya-dress`, `layla-dress`, `zahra-dress`), **or**
- edit the `handle` field in `SCENES` to point at your real product handles.

**Variants & sizing**: the size selector reads the variant option named `Size` (case-insensitive).
Set up each product's first variant option as "Size" in Shopify admin and the UI handles the rest —
per-size availability, sold-out styling, and (if you've granted the inventory scope above) low-stock
messaging ("Only 3 pieces remaining") when Shopify reports `quantityAvailable`.

**"New" badge**: add the tag `new` (lowercase) to a product in Shopify admin to show the "New" badge
on the shop grid.

---

## 5. Deploying to Vercel

1. Push this repo to GitHub (already done if you're reading this from the repo).
2. In [Vercel](https://vercel.com), **Add New → Project**, import the repo.
3. Framework preset: **Next.js** (auto-detected).
4. Under **Environment Variables**, add the three `SHOPIFY_*` variables from step 3 — set them for
   **Production**, **Preview**, and **Development** environments.
5. Deploy. Vercel runs `next build`; product/shop/home pages are statically generated with
   Incremental Static Regeneration (60s revalidation), and the product detail route renders
   on-demand per request — no extra configuration needed.
6. Once live, revisit your Shopify custom app's settings and, if prompted, add your Vercel
   production domain (and any preview domains you use regularly) to the app's allowed origins.

No changes are needed to `next.config.mjs` for Shopify images — `cdn.shopify.com` is already
whitelisted for `next/image`.

---

## 6. Cart & checkout behavior

- Adding to cart calls a Server Action, which creates a Shopify Cart (Storefront API `cartCreate` /
  `cartLinesAdd`) and stores the cart ID in an `nh_cart_id` cookie (30-day expiry, `httpOnly`-style
  handling via Next's `cookies()`).
- The cart drawer and `/cart` page both read live cart state — updating quantity or removing a line
  calls Shopify directly; there's no separate "local" cart state to get out of sync.
- "Buy Now" on a product page adds the item then redirects straight to that cart's `checkoutUrl`.
- "Proceed to Checkout" on `/cart` links to the same Shopify-hosted `checkoutUrl`. Payment methods,
  shipping rates, taxes, and discount codes are all whatever you've configured in Shopify admin —
  this app doesn't reimplement any of that.

---

## 7. Known limitations / good next steps

- **Wishlist & Account pages** are front-end-only (localStorage), not wired to Shopify. Real
  customer accounts require Shopify's **Customer Account API** (a separate OAuth-based system) —
  out of scope for this pass but a natural next step if you need persistent, cross-device wishlists
  or order history.
- **Single variant option** ("Size") is supported out of the box. If you sell the same style in
  multiple colors as well, the size selector will still work, but you'll want to extend
  `ProductClient.tsx` with a second option selector (the data is already fetched — every variant's
  `selectedOptions` array — it's just not rendered as a separate picker yet).
- **Care instructions / craftsmanship story** copy on the product page is generic site-wide text
  (not pulled from Shopify), since the base Storefront API doesn't expose custom per-product fields
  without **metafields**. If you want per-product care/story copy, define metafields in Shopify
  admin and extend `queries.ts`/`transform.ts` to fetch them.

---

## 8. Post-deploy checklist

- [ ] `SHOPIFY_STORE_DOMAIN` and `SHOPIFY_STOREFRONT_ACCESS_TOKEN` set in Vercel for all environments
- [ ] At least one product has Product Type `Abaya` and one has `Dress` (category filter needs both)
- [ ] Each product's first option is named `Size` with real variants
- [ ] Add a product to cart → drawer shows it → quantity +/- updates Shopify cart
- [ ] "Proceed to Checkout" lands on a real `myshopify.com`/checkout-branded checkout page
- [ ] Product images load via `cdn.shopify.com` with no broken-image icons
- [ ] Lookbook "Shop this look" links resolve to real products (see §4)
