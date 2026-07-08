# ARCHITECTURE.md — ESNAFİ LOKANTA QR Menu

## 1. High-Level Shape

Two front ends, one Next.js app, one Supabase project:

```
                      ┌─────────────────────────┐
   Customer's phone → │   Public Menu (RSC)      │ → reads only, no auth
   (QR scan)          │   /[locale]/...          │
                      └───────────┬─────────────┘
                                  │ Supabase JS (anon key, RLS-enforced)
                      ┌───────────┴─────────────┐
                      │        Supabase          │
                      │  Postgres + Auth + Storage│
                      └───────────┬─────────────┘
                                  │ Supabase JS (session, RLS-enforced)
   Staff browser  →   ┌───────────┴─────────────┐
   /admin/...         │   Admin Panel (RSC + SA) │ → auth required
                      └─────────────────────────┘
```

Both surfaces live in the same Next.js project and deploy together to Vercel.
There is no separate backend API service — Supabase is accessed directly from
Server Components and Server Actions, with Postgres Row Level Security (RLS) as
the actual authorization boundary (never trust the client).

## 2. Folder Structure

```
esnafi-menu/
├── src/
│   ├── app/
│   │   ├── page.tsx                     # language selection screen (entry point)
│   │   ├── [locale]/                    # tr | en | ar
│   │   │   ├── layout.tsx               # sets <html lang/dir>, loads next-intl messages
│   │   │   ├── page.tsx                 # category list — the "home" screen post-selection
│   │   │   └── kategori/[slug]/
│   │   │       └── page.tsx             # products within one category
│   │   ├── admin/
│   │   │   ├── login/page.tsx
│   │   │   ├── layout.tsx               # auth guard + shell (nav, sidebar)
│   │   │   ├── page.tsx                 # dashboard (counts, quick links)
│   │   │   ├── categories/
│   │   │   │   ├── page.tsx             # list + drag-reorder
│   │   │   │   ├── new/page.tsx
│   │   │   │   └── [id]/page.tsx        # edit
│   │   │   ├── products/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── new/page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   └── settings/
│   │   │       └── page.tsx             # one form (tabs: General/Contact/Theme/SEO) over restaurant_settings
│   │   └── api/                         # only for webhooks/edge cases; CRUD uses Server Actions, not REST handlers
│   ├── components/
│   │   ├── menu/                        # public-facing UI (category card, product card, language switcher)
│   │   ├── admin/                       # admin-only UI (forms, image uploader, reorder list, color pickers)
│   │   └── ui/                          # shared primitives (button, input, dialog)
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts                # browser client (anon key)
│   │   │   ├── server.ts                # server-side client bound to request cookies
│   │   │   └── middleware.ts            # session refresh helper used by middleware.ts
│   │   ├── i18n/
│   │   │   ├── config.ts                # locales = ['tr','en','ar'], defaultLocale = 'tr'
│   │   │   └── request.ts               # next-intl server config
│   │   ├── currency.ts                  # formatPrice(price, settings) — the only place a currency symbol is rendered
│   │   └── validation/                  # zod schemas for admin forms (category/product/settings input)
│   ├── messages/
│   │   ├── tr.json                      # static UI strings (buttons, labels, empty states)
│   │   ├── en.json
│   │   └── ar.json
│   ├── types/
│   │   └── database.ts                  # generated Supabase types (`supabase gen types typescript`)
│   └── middleware.ts                    # locale-cookie handling + /admin/** auth guard
├── supabase/
│   ├── migrations/                      # versioned SQL migrations (source of truth for schema)
│   └── seed.sql                         # the 12 categories seed data
├── public/
└── (config files: next.config.ts, tailwind.config.ts, tsconfig.json, .env.local)
```

Two content types never mix: **UI chrome strings** live in `messages/*.json`
(next-intl, static, developer-edited). **Menu content** (category/product names,
descriptions) lives in the database as translated JSONB, editable by staff. This
split matters — staff should never need a code deploy to fix a typo in a dish
name, but "Add to menu" / "Back" button labels are a developer concern.

## 3. Rendering & Data Strategy

- Public menu pages (`/[locale]`, `/[locale]/kategori/[slug]`) are **React Server
  Components** that query Supabase directly at request time. No client-side
  data fetching, no loading spinners for the initial view.
- Freshness: admin writes (create/update/reorder/deactivate) call
  `revalidatePath()` for the affected public routes as part of the same Server
  Action. This means an edit in the admin panel is reflected on the public menu
  on the *next* request — no manual redeploy, no webhook plumbing needed.
- A conservative `export const revalidate = 3600` (time-based ISR) is kept as a
  safety net on public pages in case a revalidation call is ever missed, but it
  should not be relied on as the primary freshness mechanism.
- Admin panel pages are Server Components for reads and **Server Actions** for
  writes (create/update/delete/reorder) — no hand-rolled `/api/*` REST layer is
  needed for standard CRUD, which keeps the surface area small.

## 4. Authentication

- **Supabase Auth**, email + password, admin-only. Customers never authenticate.
- `middleware.ts` checks for a valid Supabase session on every request to
  `/admin/**` (except `/admin/login`) and redirects to login if absent. This is
  a UX guard, not the security boundary.
- The **real** security boundary is Postgres RLS: every table that holds menu
  data has policies that only allow writes from an authenticated user present
  in `admin_profiles` (see `DATABASE.md` §4). Even if middleware were somehow
  bypassed, the database itself refuses unauthorized writes.
- **Phase 1 has exactly one role: Super Admin.** The `admin_profiles.role`
  column exists (constrained to `'super_admin'` only, see `DATABASE.md` §3) so
  a future "invite a manager with limited permissions" role can be added later
  by widening the constraint and adding role-aware RLS/UI — not by reshaping
  the identity model. No role selector or invite UI is built in phase 1.
- Service-role key (which bypasses RLS) is **never** used in any code path that
  can be reached from the browser — only in trusted server contexts if ever
  needed (e.g., a future admin-invite flow), and never in `NEXT_PUBLIC_*` env vars.

## 5. Admin Panel

- Single-restaurant, single-role (`super_admin`) usage for phase 1; the data
  model supports more later (see §12).
- Core screens: Dashboard, Categories (list/create/edit/reorder), Products
  (list/create/edit/reorder, filter by category), and Settings, each with a
  TR/EN/AR tab set where content is translated (one product = one form, three
  language tabs — not three separate edit screens). Product form fields are
  exactly the list in `PROJECT_PLAN.md` §3.1 (name×3, description×3, price,
  image, category, active/passive, availability, sort order) — nothing more.
- **Settings is a single form over the one `restaurant_settings` row** — no
  create/list/delete flow, just an edit form (organized into General/Contact/
  Theme/SEO tabs for usability). See §9–§10 for how currency, theme, and SEO
  fields are consumed at runtime.
- **Availability is a separate control from Active/Passive** on the product
  form — e.g. a toggle or two-state pill (Available / Out of Stock), distinct
  from the Active/Passive switch. Marking a product out of stock never removes
  it from the public menu; it changes how it's rendered there (see §6).
- **Category slugs are never a form field.** They're generated automatically
  from the Turkish name by a database trigger on insert (`DATABASE.md` §3) —
  the admin UI shows the resulting slug read-only (e.g. for copying the menu
  URL) but never lets staff type or edit one.
- **Reordering is drag-and-drop for both categories and products** — not a
  typed "order number" input. Categories reorder at the top level; products
  reorder within their assigned category. Each drag interaction writes the new
  `display_order` values via a single Server Action, not per-row saves.
- Image upload happens inline in the product form, uploading straight to
  Supabase Storage and storing the resulting **object key** (`image_path`) on
  the row — the public URL is derived at render time, never stored (see §8).
  Replacing a photo deletes the old Storage object as part of the same Server
  Action; deleting a product deletes its Storage object automatically via a DB
  trigger (`DATABASE.md` §3/§5) — the admin panel never needs "clean up
  orphaned images" as a manual task.

## 6. QR Menu (Public)

- **One global, static QR code for the whole restaurant** — printed once and
  placed on every table. It encodes a single production URL (the root `/`);
  there is no per-table QR generation, no table identifier in the URL, and no
  `tables` concept anywhere in the schema. Every scan, at every table, is
  functionally identical.
- Root `/` is the language selection screen. First-time visitors see it because
  no locale cookie is set yet.
- On selection, a `NEXT_LOCALE` cookie is set and the user is sent to
  `/[locale]`, which renders the category list directly — **no** "most popular,"
  "recommended," or "new" shelves above it, per the locked product decision.
- Returning visitors within the cookie's lifetime who hit `/` are redirected
  straight to their remembered `/[locale]` — they don't need to re-pick a
  language every time they rescan the same table's QR code. A language switcher
  remains visible in the header at all times so this is never a dead end.
- Category → product list → (optional) product detail is a simple drill-down;
  no cart, no quantity selectors, no "add" actions.
- A product with `availability = 'out_of_stock'` still renders in its category
  (it is not hidden — that's what `is_active` is for) but with a clear visual
  treatment (e.g. a "Tükendi / Out of Stock" badge, reduced-emphasis styling).
  Since there's no ordering flow yet, this is a purely informational marker.

## 7. Internationalization (TR / EN / AR)

- **Library:** `next-intl`, using the `[locale]` segment pattern.
- **TR is the default/fallback locale** — if a translation is missing for a
  product/category in EN or AR, the UI falls back to the TR value rather than
  showing blank text.
- **RTL for Arabic:** the `[locale]/layout.tsx` sets `<html lang="ar" dir="rtl">`
  conditionally. Tailwind is used with logical properties (`ps-*`/`pe-*`,
  `text-start`/`text-end`) instead of physical `left/right` utilities wherever
  layout mirrors, so RTL doesn't require a parallel set of styles.
- **Two independent translation systems, intentionally:**
  - Static UI chrome → `messages/{tr,en,ar}.json`, developer-maintained.
  - Menu content (category & product name/description) → JSONB columns per row
    in Postgres (`{"tr": "...", "en": "...", "ar": "..."}`), staff-maintained
    through the admin panel's language tabs.
- Adding a 4th language later means: add a locale to `lib/i18n/config.ts`, add a
  `messages/xx.json` file, and admin forms automatically grow a new tab (driven
  off the same locale config) — no schema migration required since content
  translations are JSONB, not fixed columns.

## 8. Image Storage

- Supabase Storage bucket `menu-images`, public read.
- Path convention: `{restaurant_id}/products/{product_id}/{filename}` for
  product photos, `{restaurant_id}/branding/{logo|cover|og|favicon}/{filename}`
  for restaurant branding assets (see §9) — namespacing by `restaurant_id` from
  day one costs nothing now and avoids a painful rename/migration if a second
  location is ever added.
- **The database stores the object key (`image_path`), never a full URL.** The
  public URL is derived at render time via Supabase's `getPublicUrl()`. This is
  what makes automatic cleanup trivial and keeps stored data independent of the
  project's public host.
- Public bucket + Supabase's built-in image transformation (resize/format
  query params) is used instead of running a separate image CDN — Next.js
  `<Image>` points its `remotePatterns` at the Supabase project's storage host.
- Admin upload flow: staff picks a file → uploaded client-side to Storage using
  the authenticated session → resulting object key is saved as `image_path` on
  the product row in the same form submission.
- **Lifecycle is fully automatic:**
  - *Delete product* → a Postgres trigger deletes the matching Storage object
    in the same transaction (`DATABASE.md` §3). No orphaned files.
  - *Replace photo* → the Server Action deletes the old object right after the
    row is updated with the new `image_path`.
- Only bucket writes require auth (enforced by Storage RLS policies mirroring
  the `admin_profiles` check); reads are public, since the whole menu is public.

## 9. Restaurant Settings, Theme & Currency

- **One table, one row, one Settings screen** (`restaurant_settings`, see
  `DATABASE.md` §2.3/§3). It's always an upsert — there is no "create" or
  "delete" flow for it, unlike categories/products.
- **Currency:** `currency_code` + `currency_symbol` live on `restaurant_settings`,
  not on individual products. Every price display goes through one shared
  `lib/currency.ts` helper (e.g. `formatPrice(price, settings)`) — no component
  ever hardcodes `"₺"` or any other symbol. Changing currency in Settings
  changes every price on the public menu immediately (same `revalidatePath`
  mechanism as any other admin edit).
- **Theme:** `theme_primary_color` / `theme_secondary_color` / `theme_accent_color`
  are injected as CSS custom properties in the root layout (e.g.
  `<html style={{ '--color-primary': settings.theme_primary_color, ... }}>`),
  and Tailwind utility classes reference those variables rather than
  fixed hex values baked in at build time. This is what makes the theme
  genuinely admin-configurable at runtime — a color change is a data edit, not
  a rebuild.
- **Working hours** (`working_hours` jsonb, keyed by day) render in the public
  menu's footer/header alongside contact info (phone, WhatsApp, address, Google
  Maps link, Instagram) — all sourced from the same settings row.
- **Branding images** (`logo_path`, `cover_image_path`) follow the exact same
  Storage-object-key pattern as product images (§8): public read, admin-only
  write, URL derived at render time via `getPublicUrl()`.

## 10. SEO

- Next.js Metadata API (`generateMetadata`) in `[locale]/layout.tsx` reads
  `seo_title` / `seo_description` from `restaurant_settings`, picks the current
  locale's value, and falls back to TR if missing — the same fallback rule
  used for menu content (§7).
- Open Graph tags (`og:title`, `og:description`, `og:image`) are derived from
  the same settings row, with `seo_og_image_path` resolved to a public URL the
  same way product images are.
- **Favicon:** `favicon_path` is wired via Next.js's `icon` metadata
  convention (or a generated `app/icon` route reading from Storage). It is a
  single, brand-wide asset — not localized, unlike title/description.
- Because SEO fields live in the database, changing the site's title or social
  preview image is a Settings-screen edit, not a code change or redeploy —
  consistent with the project's broader "no developer needed for content
  changes" principle.

## 11. Security Checklist

- RLS enabled on every table, default-deny, explicit `SELECT` policies for
  public menu data (`is_active = true` only) and explicit `ALL` policies scoped
  to `admin_profiles` for writes.
- Anon key is the only Supabase key ever shipped to the browser.
- All admin mutations go through Server Actions (run server-side, session
  validated by Supabase, never trust a client-submitted `restaurant_id` or
  `role`).
- Input validation on all admin forms via `zod` schemas shared between the
  form and the Server Action.

## 12. Future Scalability

Design choices made now specifically to avoid painful rewrites later:

- **Multi-branch / multi-tenant:** `restaurants` table + `restaurant_id` foreign
  key on every content table already exists (see `DATABASE.md`). Phase 1 seeds
  exactly one restaurant row. Adding a second location later is a data problem,
  not a schema migration.
- **More languages:** locale list is config-driven, content translations are
  JSONB — adding a language is additive, not a migration.
- **Online ordering (future phase):** would add `orders` / `order_items` tables
  referencing existing `products`, plus a payment provider integration — the
  current schema doesn't need to anticipate this beyond "products already have
  stable IDs and prices."
- **Table ordering (future phase):** would introduce a `tables` table (table
  number, its own QR code) and associate orders with a table — this is
  additive on top of §6's single-QR decision, not a conflict with it; Phase 1
  simply doesn't need `tables` to exist yet.
- **Kitchen display (future phase):** would consume the same `orders` /
  `order_items` tables in near-real-time (e.g. via Supabase Realtime
  subscriptions) — no changes to any menu table required.
- **Search / filtering (future):** category/product JSONB name & description
  fields can support Postgres full-text search via generated `tsvector` columns
  + GIN indexes without restructuring the base tables.
- **Analytics (future):** page-view/QR-scan tracking can be bolted on via
  Vercel Analytics or a lightweight `events` table without touching menu tables.
- **Caching/CDN:** Vercel's edge network + `revalidatePath`-driven ISR scales
  to many more concurrent scans without any code change; there's no
  server-rendered-per-request bottleneck to worry about at this traffic scale.
- **Additional admin roles:** `admin_profiles.role` and the `is_admin_of()` RLS
  helper already centralize authorization in one place (`DATABASE.md` §3/§4).
  Introducing a `manager` role later is a constraint change + new role-aware
  RLS conditions, not an identity model rewrite.
