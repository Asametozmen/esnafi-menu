# ROADMAP.md — ESNAFİ LOKANTA QR Menu

Phased delivery plan. Each phase should be shippable/demoable on its own; no
phase depends on speculative future work. No application code is written until
Phase 1 begins (this document and its siblings are Phase 0).

## Phase 0 — Planning (this phase)
- [x] `PROJECT_PLAN.md` — scope, locked product decisions, categories
- [x] `ARCHITECTURE.md` — folder structure, rendering, auth, i18n, storage,
  settings/theme/currency, SEO
- [x] `DATABASE.md` — schema, RLS, storage policies, seed data
- [x] `ROADMAP.md` — this file

## Phase 1 — Foundation
- Scaffold Next.js 15 (App Router) + TypeScript + Tailwind project
- Create Supabase project; apply schema from `DATABASE.md` as a migration
  (including `restaurant_settings` and the `availability` column)
- Enable RLS policies; create `menu-images` storage bucket
- Run `supabase/seed.sql` (restaurant row + one `restaurant_settings` row with
  defaults — `TRY`/`₺`, placeholder theme colors — + 12 categories)
- Wire up Supabase client helpers (`lib/supabase/client.ts`, `server.ts`)
- Set up `next-intl` with `tr` (default), `en`, `ar` locales and empty
  `messages/*.json` files
- Add `lib/currency.ts` (`formatPrice`) as the single place currency
  formatting happens
- Generate TypeScript types from the Supabase schema
- **Exit criteria:** empty app deploys to Vercel, connects to Supabase, no
  auth or menu UI yet.

## Phase 2 — Public QR Menu
- Language selection screen at `/` (sets locale cookie, redirects)
- `/[locale]` category list, reading live from `categories` table
- `/[locale]/kategori/[slug]` product list for a category
- Out-of-stock badge/treatment for products with `availability = 'out_of_stock'`
- Prices rendered via `formatPrice()` using `restaurant_settings.currency_code`/
  `currency_symbol` — never a hardcoded symbol
- RTL layout verification for `ar`
- Language switcher component (persistent, no rescanning needed)
- Empty-state handling (category with zero active products)
- **Exit criteria:** a phone scanning a QR code can browse the full menu in
  all three languages using seed/placeholder data, with correct currency
  formatting and out-of-stock products clearly marked.

## Phase 3 — Admin Panel
- `/admin/login` using Supabase Auth — Super Admin only, no role selector
- Auth guard in `middleware.ts` for `/admin/**`
- Dashboard shell (nav, basic counts)
- Category CRUD (TR/EN/AR name, no manual slug field — auto-generated on
  insert) + drag-to-reorder
- Product CRUD — exactly the fields in `PROJECT_PLAN.md` §3.1 (TR/EN/AR name,
  TR/EN/AR description, price, image, category, active/passive, availability,
  sort order) + drag-to-reorder within category
- Image upload wired to Supabase Storage using `image_path` (object key);
  replacing a photo deletes the old object; deleting a product relies on the
  DB trigger to delete its image automatically (`DATABASE.md` §3) — verify
  this end-to-end in this phase
- Settings screen (`PROJECT_PLAN.md` §3.3): one form over `restaurant_settings`
  — branding (name/logo/cover), contact (phone/WhatsApp/address/maps/
  Instagram/hours), currency (code + symbol), theme (primary/secondary/accent
  color pickers), SEO (title/description per locale, OG image, favicon)
- Server Actions call `revalidatePath` so public menu reflects edits
  immediately
- **Exit criteria:** staff can go from "empty menu" to "fully populated menu"
  using only the admin panel, no developer involved; deleting a product
  leaves no orphaned file in Storage; changing theme colors or currency in
  Settings is reflected on the public menu without a redeploy.

## Phase 4 — Premium Polish
- Visual design pass (typography, spacing, imagery treatment) to match a
  "premium" feel, not a generic template look
- Wire theme colors (`restaurant_settings.theme_*`) as CSS custom properties
  consumed by Tailwind utilities, replacing any placeholder hardcoded colors
- Loading/transition states, image optimization (`next/image` + Supabase
  transforms)
- Accessibility pass (contrast, tap targets, screen-reader labels, RTL
  correctness) — including with real theme colors, not just placeholders
- SEO metadata wired via `generateMetadata` from `restaurant_settings`
  (title/description per locale, Open Graph image, favicon) — see
  `ARCHITECTURE.md` §10
- Performance pass against the LCP target in `PROJECT_PLAN.md` §6

## Phase 5 — QA & Launch
- Cross-device testing (iOS Safari, Android Chrome at minimum)
- Content pass: all real ESNAFİ LOKANTA products, prices, and photos entered
  by staff through the admin panel
- Generate **one** physical QR code asset pointing at the production root URL —
  the same code is printed/placed on every table, no per-table variants
- Production deploy on Vercel with custom domain
- **Exit criteria:** QR codes are printed and live on tables.

## Phase 6 — Future Modules (not scheduled, architecture already ready for them)

None of these require re-architecting what's built in Phases 1–5 — each is
additive on top of the existing tenant-scoped (`restaurant_id`), RLS-secured
foundation:

- **Online ordering** — add `orders` / `order_items` tables referencing the
  existing `products` (which already have stable IDs and decimal prices), plus
  a payment provider integration.
- **Table ordering** — add a `tables` table (table number, its own QR code)
  and associate orders with a table. This is a deliberate addition *on top of*
  Phase 1's single-global-QR decision (`PROJECT_PLAN.md` §3), not a
  contradiction of it — Phase 1 simply has no `tables` concept yet.
- **Kitchen display** — a real-time view over `orders`/`order_items` (e.g. via
  Supabase Realtime subscriptions); no changes to any menu table required.
- **Analytics** — scan counts, popular categories, etc. via a lightweight
  `events` table, independent of menu tables — without resurrecting the
  "Most Popular" *customer-facing* section, which remains explicitly out of
  scope per `PROJECT_PLAN.md` §3.
- **Multiple restaurants** — every content table (`categories`, `products`,
  `restaurant_settings`, `admin_profiles`) already carries `restaurant_id`.
  Onboarding a second restaurant is a data problem (insert a new `restaurants`
  + `restaurant_settings` row), not a schema migration.
- Search / filtering (full-text search over category & product JSONB)
- Additional languages beyond TR/EN/AR
- Additional admin roles/permissions beyond `super_admin` (e.g. a `manager`
  role with restricted access)
