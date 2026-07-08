# PROJECT_PLAN.md — ESNAFİ LOKANTA QR Menu

## 1. Purpose

Build a premium, production-ready digital QR menu for ESNAFİ LOKANTA, backed by a
simple admin panel that lets restaurant staff manage categories, products, prices,
images, and translations without touching code.

Phase 1 scope is intentionally narrow: **display a menu beautifully and let it be
edited easily.** No ordering, no payments, no accounts for customers.

## 2. Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 15 (App Router) | Server Components for fast, SEO-friendly menu pages; one codebase for public menu + admin |
| UI | React 19 + Tailwind CSS | Fast iteration, consistent design tokens, small bundle |
| Language | TypeScript | Type-safe DB access, fewer runtime bugs in admin CRUD |
| Backend/DB | Supabase (Postgres + Auth + Storage) | Managed Postgres with Row Level Security, built-in auth, built-in file storage — no separate backend service needed |
| Hosting | Vercel | Native Next.js support, edge caching, zero-config previews |

## 3. Core Product Decisions (locked)

These were explicitly decided and should not be revisited without discussion:

- **Flow:** Language selection screen → directly to the **category list**. There is
  no intermediate landing page.
- **No curated homepage sections.** No "Most Popular," "Chef's Recommendations," or
  "New Products" shelves. The menu is browsed by category only. This keeps the data
  model and admin panel simple (no featured/ranking logic) and keeps the customer
  experience predictable.
- **No generic "Ana Yemekler / Main Courses" bucket.** Categories are specific and
  match how the kitchen actually organizes the menu.
- **Single global QR code.** One static QR code represents the whole restaurant
  and links to the same menu root URL for every table. There is no per-table QR
  provisioning, no table identifier in the URL, and no table-level state anywhere
  in the system.
- **Single admin role in Phase 1: Super Admin.** No manager/staff roles yet — see
  §4.2.
- **Category and product sorting is drag-and-drop**, not a manual "order number"
  field typed into a form. This applies to categories (top-level order) and to
  products (order within their category).
- **Category slugs are generated automatically** from the Turkish name — staff
  never type or edit a slug.
- **Product image cleanup is automatic.** Deleting a product deletes its image
  from Supabase Storage in the same operation; no orphaned files pile up.
- **Currency is configurable, not hardcoded.** Default is Turkish Lira (TRY).
  Prices are stored as plain decimal values with no currency baked into the
  number; the currency code and display symbol live in restaurant settings
  (see §3.3) and are applied at render time. A restaurant has exactly one
  active currency — no per-product currency override.
- **Restaurant branding, contact info, and theme colors are admin-editable**
  through one Restaurant Settings screen (see §3.3), not hardcoded in code or
  in the Tailwind config.
- **Product availability is separate from Active/Passive.** Products support
  an *Available* / *Out of Stock* state. An out-of-stock product stays visible
  on the menu — it is clearly marked, not hidden. Hiding a product entirely is
  what Active/Passive is for.
- **SEO metadata is admin-editable data**, not hardcoded per page: page title,
  description, Open Graph image, and favicon all come from restaurant settings.
- **Fixed category list** (order matters — this is the display order):
  1. Kahvaltılar
  2. Çorbalar
  3. Sahanda Yumurta
  4. Kıymalı Yemekler ve Köfteler
  5. Tavuklu Yemekler
  6. Etli Yemekler
  7. Etsiz Yemekler
  8. Garnitür
  9. Zeytinyağlılar
  10. Menüler
  11. Tatlılar
  12. İçecekler

  Categories are stored as data (see `DATABASE.md`), not hardcoded, so the above is
  the initial seed — not a code constant — but no *new categories* should be invented
  by the app itself (e.g., auto-generated "Popular in this category").

## 3.1 Product Fields

Every product managed in the admin panel has exactly these fields — nothing more
in Phase 1 (see `PROJECT_PLAN.md` §5 for what's deliberately excluded, like
featured/tag flags):

1. Turkish name
2. English name
3. Arabic name
4. Turkish description
5. English description
6. Arabic description
7. Price
8. Image
9. Category
10. Active / Passive — whether the product exists on the menu at all
11. Availability: Available / Out of Stock — whether it's currently orderable;
    out-of-stock products remain visible but clearly marked (see §3 above)
12. Sort order (drag-and-drop, not a typed number)

## 3.2 Category Fields

1. Turkish name
2. English name
3. Arabic name
4. Slug (auto-generated from the Turkish name — not editable by staff)
5. Active / Passive
6. Sort order (drag-and-drop)

## 3.3 Restaurant Settings Fields

A single settings screen, backed by one row of data, covering everything about
*the restaurant itself* rather than its menu content:

**Branding & Contact**
1. Restaurant name
2. Logo
3. Cover image
4. Phone number
5. WhatsApp number
6. Address
7. Google Maps URL
8. Instagram URL
9. Working hours (per day of week)

**Currency**
10. Currency code (default `TRY`)
11. Currency symbol (default `₺`)

**Theme**
12. Primary color
13. Secondary color
14. Accent color

**SEO**
15. Page title (per language)
16. Page description (per language)
17. Open Graph image
18. Favicon

See `DATABASE.md` §2.3 for the exact schema and `ARCHITECTURE.md` §9–§10 for
how theme colors and SEO metadata are wired at runtime.

## 4. Users & Flows

### 4.1 Customer (public menu)
1. Scans the restaurant's single, table-agnostic QR code → lands on language
   selection screen (TR / EN / AR).
2. Selects a language → goes straight to the category list in that language.
3. Taps a category → sees products in that category (name, description, price, photo).
4. Can switch language at any time via a persistent switcher (does not need to
   rescan the QR code).

### 4.2 Admin (restaurant staff)
1. Logs in at `/admin/login` with Supabase-authenticated credentials. Phase 1 has
   exactly one role — **Super Admin** — with full access to everything; there is
   no manager/staff role yet (see `ARCHITECTURE.md` §4 for how the schema stays
   ready for that without a migration).
2. Manages categories: create, edit, drag-to-reorder, activate/deactivate. Slug
   is generated automatically and is never a form field.
3. Manages products: create, edit, assign to category, set price, upload photo,
   fill in TR/EN/AR name & description, drag-to-reorder within category,
   activate/deactivate, and toggle Available / Out of Stock independently of
   active/passive.
4. Deleting a product also deletes its uploaded image from Storage automatically
   — no manual cleanup, no orphaned files.
5. Manages Restaurant Settings (§3.3): branding, contact info, currency, theme
   colors, and SEO metadata — one form, no code changes ever required for these.
6. Changes are visible on the public menu quickly (see `ARCHITECTURE.md` for
   revalidation strategy) without a redeploy.

## 5. Explicit Non-Goals (Phase 1)

- Online ordering / cart / checkout
- Payments
- Customer accounts, loyalty, reviews
- Table-side calling a waiter
- Per-table QR codes or any table-identification concept — one global QR code
  for the whole restaurant is the only supported flow
- Additional admin roles beyond Super Admin (manager/staff permissions)
- Multi-restaurant / multi-branch management UI (schema stays *ready* for it, see
  `ARCHITECTURE.md` §12 and `DATABASE.md`, but no UI is built for it now)
- Analytics dashboards
- Search / filtering by allergen or diet
- Multiple simultaneous currencies (one active currency per restaurant at a time)

## 6. Success Criteria

- Menu loads fast on a mid-range phone over restaurant Wi-Fi/4G (target: LCP < 2s).
- Admin can add a new product with photo and all three translations in under two
  minutes, with no developer involvement.
- Arabic renders correctly in RTL with no layout breakage.
- Menu is fully usable with JavaScript-light initial paint (Server Components),
  not a client-side SPA shell.
- Admin can update restaurant branding, contact info, theme colors, and SEO
  metadata without any code change or redeploy.
- An out-of-stock product is unmistakably marked on the public menu, never
  silently indistinguishable from an available one.

## 7. Related Documents

- `ARCHITECTURE.md` — folder structure, rendering strategy, auth, i18n, storage, scalability
- `DATABASE.md` — full schema, RLS policies, storage buckets
- `ROADMAP.md` — phased delivery plan
