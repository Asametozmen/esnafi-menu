# DATABASE.md — ESNAFİ LOKANTA QR Menu (Supabase / Postgres)

## 1. Design Principles

- **One table per concept**, translations stored as JSONB on the row rather
  than a separate `*_translations` table — for a fixed, small set of languages
  (TR/EN/AR) this avoids joins on every menu render and keeps the admin form
  simple (one row = one form with three language tabs). If the language count
  ever grew large and dynamic (10+, user-manageable), a normalized translations
  table would be worth revisiting — not needed at this scale.
- **`restaurant_id` on every content table from day one**, even though phase 1
  only ever has one row in `restaurants`. This is the cheapest possible future
  insurance against a multi-branch rewrite (see `ARCHITECTURE.md` §12).
- **No speculative columns.** Nothing is added for "Most Popular" flags,
  "featured" ranking, or dietary tags — those aren't in scope per
  `PROJECT_PLAN.md`, and adding them later is a trivial additive migration.
- **RLS is the real authorization layer.** Every table below has RLS enabled;
  policies are listed alongside each table.

## 2. Entity Overview

```
restaurants (1 row for now)
   └── admin_profiles       (staff who can manage this restaurant — Super Admin only in phase 1)
   └── restaurant_settings  (1:1 — branding, contact, currency, theme, SEO)
   └── categories           (12 seeded rows)
          └── products
```

## 2.1 Field Mapping — Product

The admin panel's product form maps directly onto these columns; there is
nothing beyond this list in Phase 1:

| Requested field | Column | Notes |
|---|---|---|
| Turkish name | `name->>'tr'` | required |
| English name | `name->>'en'` | optional; UI falls back to TR if blank |
| Arabic name | `name->>'ar'` | optional; UI falls back to TR if blank |
| Turkish description | `description->>'tr'` | optional |
| English description | `description->>'en'` | optional |
| Arabic description | `description->>'ar'` | optional |
| Price | `price` | `numeric(10,2)` |
| Image | `image_path` | Storage object key, not a full URL — see §5 |
| Category | `category_id` | FK to `categories` |
| Active / Passive | `is_active` | boolean — controls whether the product exists on the menu at all |
| Availability | `availability` | `'available'` \| `'out_of_stock'` — independent of `is_active`; out-of-stock stays visible but marked |
| Sort order | `display_order` | driven by drag-and-drop in the admin UI, never typed |

## 2.2 Field Mapping — Category

| Requested field | Column | Notes |
|---|---|---|
| Turkish name | `name->>'tr'` | required |
| English name | `name->>'en'` | optional; falls back to TR |
| Arabic name | `name->>'ar'` | optional; falls back to TR |
| Slug | `slug` | auto-generated from Turkish name on insert — see §3.1, never a form field |
| Active / Passive | `is_active` | boolean |
| Sort order | `display_order` | drag-and-drop |

## 2.3 Field Mapping — Restaurant Settings

One table, one row per restaurant, edited through a single admin "Settings"
screen (organized into tabs — General / Contact / Theme / SEO — purely a UI
grouping, not separate tables):

| Requested field | Column | Notes |
|---|---|---|
| Restaurant name | `name` | required |
| Logo | `logo_path` | Storage object key, same pattern as product images |
| Cover image | `cover_image_path` | Storage object key |
| Phone number | `phone` | |
| WhatsApp number | `whatsapp` | |
| Address | `address` | |
| Google Maps URL | `google_maps_url` | |
| Instagram URL | `instagram_url` | |
| Working hours | `working_hours` | jsonb, keyed by day of week |
| Currency code | `currency_code` | ISO 4217, default `'TRY'` |
| Currency symbol | `currency_symbol` | default `'₺'`, used for display only |
| Primary color | `theme_primary_color` | hex, validated by check constraint |
| Secondary color | `theme_secondary_color` | hex, validated by check constraint |
| Accent color | `theme_accent_color` | hex, validated by check constraint |
| SEO title | `seo_title` | jsonb, per-locale (`{"tr":"...","en":"...","ar":"..."}`) |
| SEO description | `seo_description` | jsonb, per-locale |
| Open Graph image | `seo_og_image_path` | Storage object key |
| Favicon | `favicon_path` | Storage object key |

## 3. Schema (DDL)

```sql
-- Extensions
create extension if not exists "pgcrypto"; -- gen_random_uuid()

-- ─────────────────────────────────────────────
-- restaurants
-- ─────────────────────────────────────────────
-- `restaurants` is kept lean: tenant identity + i18n config only. Everything
-- editable from the admin panel (branding, contact, currency, theme, SEO)
-- lives in `restaurant_settings` below — that split keeps a hard line between
-- "what identifies this tenant" and "what the Super Admin edits day to day."
create table restaurants (
  id                 uuid primary key default gen_random_uuid(),
  slug               text unique not null,          -- e.g. 'esnafi-lokanta' (future: subdomain/path routing)
  default_locale     text not null default 'tr',
  supported_locales  text[] not null default array['tr','en','ar'],
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

-- ─────────────────────────────────────────────
-- restaurant_settings (1:1 with restaurants)
-- ─────────────────────────────────────────────
-- Everything the Super Admin edits via the Settings screen. One row per
-- restaurant, always upserted — the UI never offers "create/delete a settings
-- row." See §2.3 for the field-by-field mapping.
create table restaurant_settings (
  id                     uuid primary key default gen_random_uuid(),
  restaurant_id          uuid not null unique references restaurants(id) on delete cascade,

  -- Branding & contact
  name                   text not null,
  logo_path              text,                      -- Storage object key
  cover_image_path       text,                       -- Storage object key
  phone                  text,
  whatsapp               text,
  address                text,
  google_maps_url        text,
  instagram_url          text,
  working_hours          jsonb,                      -- {"mon": "08:00-22:00", ..., "sun": "closed"}

  -- Currency (see PROJECT_PLAN.md §3 — one active currency per restaurant)
  currency_code          text not null default 'TRY',   -- ISO 4217
  currency_symbol        text not null default '₺',     -- display only, formatting is an app-layer concern

  -- Theme (hex colors, validated below). Defaults are neutral placeholders
  -- until Super Admin sets the real brand colors in Settings.
  theme_primary_color    text not null default '#8B1E1E',
  theme_secondary_color  text not null default '#1F2937',
  theme_accent_color     text not null default '#D4A017',

  -- SEO
  seo_title              jsonb,                      -- {"tr": "...", "en": "...", "ar": "..."}
  seo_description        jsonb,
  seo_og_image_path      text,                        -- Storage object key
  favicon_path           text,                        -- Storage object key

  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now(),

  constraint theme_primary_color_hex   check (theme_primary_color   ~* '^#[0-9a-f]{6}$'),
  constraint theme_secondary_color_hex check (theme_secondary_color ~* '^#[0-9a-f]{6}$'),
  constraint theme_accent_color_hex    check (theme_accent_color    ~* '^#[0-9a-f]{6}$')
);

-- ─────────────────────────────────────────────
-- admin_profiles (1:1 with auth.users, scoped to a restaurant)
-- ─────────────────────────────────────────────
create table admin_profiles (
  id             uuid primary key references auth.users(id) on delete cascade,
  restaurant_id  uuid not null references restaurants(id) on delete cascade,
  -- Phase 1 has exactly one role. The column (and check constraint) exist so a
  -- future role like 'manager' can be added by widening the constraint and
  -- adding role-aware RLS/UI — not by reshaping the identity model.
  role           text not null default 'super_admin' check (role in ('super_admin')),
  full_name      text,
  created_at     timestamptz not null default now()
);

-- ─────────────────────────────────────────────
-- categories
-- ─────────────────────────────────────────────
create table categories (
  id             uuid primary key default gen_random_uuid(),
  restaurant_id  uuid not null references restaurants(id) on delete cascade,
  slug           text not null,               -- e.g. 'kahvaltilar' — auto-generated, see §3.1; never entered by staff
  name           jsonb not null,              -- {"tr": "Kahvaltılar", "en": "Breakfast", "ar": "..."}
  description    jsonb,                       -- optional, same shape
  display_order  integer not null default 0,
  is_active      boolean not null default true,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  unique (restaurant_id, slug)
);

create index categories_restaurant_order_idx
  on categories (restaurant_id, display_order);

-- ─────────────────────────────────────────────
-- products
-- ─────────────────────────────────────────────
create table products (
  id             uuid primary key default gen_random_uuid(),
  restaurant_id  uuid not null references restaurants(id) on delete cascade,
  category_id    uuid not null references categories(id) on delete cascade,
  name           jsonb not null,              -- {"tr": "...", "en": "...", "ar": "..."}
  description    jsonb,                       -- optional
  price          numeric(10,2) not null,
  image_path     text,                        -- Storage object key, e.g. '{restaurant_id}/products/{id}/photo.jpg'
                                               -- NOT a full public URL — the app derives the URL from this key (see §5)
  display_order  integer not null default 0,
  is_active      boolean not null default true,
  -- Independent of is_active: an out-of-stock product stays visible on the
  -- menu, clearly marked. is_active is what hides a product entirely.
  availability   text not null default 'available'
                   check (availability in ('available', 'out_of_stock')),
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index products_category_order_idx
  on products (category_id, display_order);

create index products_restaurant_active_idx
  on products (restaurant_id, is_active);

-- ─────────────────────────────────────────────
-- updated_at maintenance
-- ─────────────────────────────────────────────
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger restaurants_set_updated_at before update on restaurants
  for each row execute function set_updated_at();
create trigger restaurant_settings_set_updated_at before update on restaurant_settings
  for each row execute function set_updated_at();
create trigger categories_set_updated_at before update on categories
  for each row execute function set_updated_at();
create trigger products_set_updated_at before update on products
  for each row execute function set_updated_at();

-- ─────────────────────────────────────────────
-- category slug auto-generation
-- ─────────────────────────────────────────────
-- Turkish-aware slugify: transliterate Turkish letters to ASCII *before*
-- lower-casing, so 'İ' never hits Postgres's dotted/dotless-I lower() quirk.
create or replace function slugify(input text)
returns text language sql immutable as $$
  select trim(both '-' from
    regexp_replace(
      lower(translate(input, 'çğıöşüÇĞİÖŞÜ', 'cgiosuCGIOSU')),
      '[^a-z0-9]+', '-', 'g'
    )
  );
$$;

-- Generates the slug once, from the Turkish name, only when one isn't already
-- set (seed data may set it explicitly). Runs on INSERT only — editing the
-- name later never changes the slug, so menu URLs stay stable. Appends a
-- numeric suffix on collision within the same restaurant.
create or replace function categories_generate_slug()
returns trigger language plpgsql as $$
declare
  base_slug text;
  candidate text;
  suffix    int := 1;
begin
  if new.slug is not null and new.slug <> '' then
    return new;
  end if;

  base_slug := slugify(new.name->>'tr');
  candidate := base_slug;

  while exists (
    select 1 from categories
    where restaurant_id = new.restaurant_id
      and slug = candidate
  ) loop
    suffix := suffix + 1;
    candidate := base_slug || '-' || suffix;
  end loop;

  new.slug := candidate;
  return new;
end;
$$;

create trigger categories_set_slug
  before insert on categories
  for each row execute function categories_generate_slug();

-- ─────────────────────────────────────────────
-- automatic image cleanup on product delete
-- ─────────────────────────────────────────────
-- SECURITY DEFINER: this is a system-guaranteed side effect of a delete that
-- RLS already authorized (`products_admin_all`), so cleanup must not be
-- blocked by Storage RLS nuances — it runs with the function owner's rights.
create or replace function delete_product_image()
returns trigger language plpgsql security definer as $$
begin
  if old.image_path is not null then
    delete from storage.objects
    where bucket_id = 'menu-images'
      and name = old.image_path;
  end if;
  return old;
end;
$$;

create trigger products_delete_image
  after delete on products
  for each row execute function delete_product_image();
```

## 4. Row Level Security

```sql
alter table restaurants          enable row level security;
alter table restaurant_settings  enable row level security;
alter table admin_profiles       enable row level security;
alter table categories           enable row level security;
alter table products              enable row level security;

-- Helper: is the current user an admin of a given restaurant?
create or replace function is_admin_of(target_restaurant_id uuid)
returns boolean language sql stable security definer as $$
  select exists (
    select 1 from admin_profiles
    where id = auth.uid()
      and restaurant_id = target_restaurant_id
  );
$$;

-- restaurants: public read (needed for locale config on menu), admin-only write
create policy "restaurants_public_read" on restaurants
  for select using (true);
create policy "restaurants_admin_write" on restaurants
  for all using (is_admin_of(id)) with check (is_admin_of(id));

-- restaurant_settings: public read (branding/theme/SEO/contact are rendered
-- on the public menu), admin-only write
create policy "restaurant_settings_public_read" on restaurant_settings
  for select using (true);
create policy "restaurant_settings_admin_write" on restaurant_settings
  for all using (is_admin_of(restaurant_id)) with check (is_admin_of(restaurant_id));

-- admin_profiles: a user can only see/manage their own row
create policy "admin_profiles_self" on admin_profiles
  for all using (id = auth.uid()) with check (id = auth.uid());

-- categories: public read of active rows, admin full access to their restaurant's rows
create policy "categories_public_read" on categories
  for select using (is_active = true);
create policy "categories_admin_all" on categories
  for all using (is_admin_of(restaurant_id)) with check (is_admin_of(restaurant_id));

-- products: public read of active rows, admin full access to their restaurant's rows
create policy "products_public_read" on products
  for select using (is_active = true);
create policy "products_admin_all" on products
  for all using (is_admin_of(restaurant_id)) with check (is_admin_of(restaurant_id));
```

Note: admins get an *additional* `select` via their `all`-scoped policy, so they
can also see inactive/draft rows in the admin panel — the public policy only
ever grants read access to `is_active = true` rows.

## 5. Storage

- Products store `image_path` — a **Storage object key**, not a public URL
  (e.g. `{restaurant_id}/products/{product_id}/photo.jpg`). The app derives the
  displayable URL at read time via Supabase's `getPublicUrl(image_path)`. This
  keeps deletion trivial (delete the object at that exact key) and avoids
  baking a project host into stored data.
- **Delete:** handled automatically by the `products_delete_image` trigger in
  §3 — deleting a product row deletes its Storage object in the same
  transaction. No orphaned files, no separate cleanup job.
- **Replace:** when staff upload a new photo for an existing product, the
  Server Action (app layer, not a DB trigger) deletes the old `image_path`
  object after the new one is uploaded and the row is updated. This is
  intentionally app-level rather than a DB trigger, since "old" only exists at
  update time, and the Server Action already has both values in hand.
- `restaurant_settings`'s branding/SEO image columns (`logo_path`,
  `cover_image_path`, `seo_og_image_path`, `favicon_path`) follow the exact
  same object-key convention, under a `{restaurant_id}/branding/` prefix
  instead of `{restaurant_id}/products/`. Replacing any of them is handled the
  same way as a product photo replace: app-layer delete-then-upload in the
  Settings Server Action. There's no automatic-delete trigger for these
  (unlike products) since `restaurant_settings` rows are never deleted on
  their own — they're cascade-deleted only if the whole restaurant is removed.

```sql
-- Bucket: menu-images (created via Supabase dashboard or API, public)
-- Path convention:
--   products:  {restaurant_id}/products/{product_id}/{filename}
--   branding:  {restaurant_id}/branding/{logo|cover|og|favicon}/{filename}

create policy "menu_images_public_read"
  on storage.objects for select
  using (bucket_id = 'menu-images');

create policy "menu_images_admin_write"
  on storage.objects for insert
  with check (
    bucket_id = 'menu-images'
    and is_admin_of((storage.foldername(name))[1]::uuid)
  );

create policy "menu_images_admin_update_delete"
  on storage.objects for update using (
    bucket_id = 'menu-images'
    and is_admin_of((storage.foldername(name))[1]::uuid)
  );
```

## 6. Seed Data — the 12 Categories

Seed order defines `display_order` (0-indexed), matching the locked list in
`PROJECT_PLAN.md`:

| order | slug | name.tr | name.en |
|---|---|---|---|
| 0 | kahvaltilar | Kahvaltılar | Breakfast |
| 1 | corbalar | Çorbalar | Soups |
| 2 | sahanda-yumurta | Sahanda Yumurta | Pan-Fried Eggs |
| 3 | kiymali-yemekler-ve-kofteler | Kıymalı Yemekler ve Köfteler | Minced Meat Dishes & Meatballs |
| 4 | tavuklu-yemekler | Tavuklu Yemekler | Chicken Dishes |
| 5 | etli-yemekler | Etli Yemekler | Meat Dishes |
| 6 | etsiz-yemekler | Etsiz Yemekler | Meatless Dishes |
| 7 | garnitur | Garnitür | Side Dishes |
| 8 | zeytinyaglilar | Zeytinyağlılar | Olive Oil Dishes |
| 9 | menuler | Menüler | Set Menus |
| 10 | tatlilar | Tatlılar | Desserts |
| 11 | icecekler | İçecekler | Drinks |

Arabic (`name.ar`) values are filled in by staff via the admin panel rather
than hardcoded in the seed, since they require accurate native-speaker
translation.

`supabase/seed.sql` will insert one `restaurants` row, one matching
`restaurant_settings` row (name filled in, everything else left at its
default — placeholder theme colors, `TRY`/`₺` currency, blank contact/SEO
fields for staff to fill in via Settings), plus these 12 `categories` rows
(with empty/placeholder `name.ar` and `name.en` where translation isn't ready
yet, since TR is the fallback locale per `ARCHITECTURE.md` §7).

## 7. Deliberately Deferred (not in phase 1 schema)

Documented here so it's clear these were considered, not overlooked:

- `product_variants` (e.g., half/full portion pricing) — add only if "Menüler"
  or other categories need multiple price points per item.
- `order` / `order_items` / `payments` — only needed if online ordering ships.
- `is_featured` / `tags` / `dietary_labels` — explicitly out of scope per the
  "no curated sections" product decision; revisit only if that decision changes.
- A normalized `*_translations` table — revisit only if the language count
  becomes large/dynamic (e.g., admin-configurable languages beyond TR/EN/AR).
- Additional `admin_profiles.role` values (e.g. `manager` with restricted
  permissions) — Phase 1 ships with `super_admin` only; widen the check
  constraint and add role-aware RLS conditions if/when a second role is needed.
- Any table-level or per-table QR concept — the product decision is one global
  QR code for the whole restaurant (see `PROJECT_PLAN.md` §3), so there is no
  `tables` table and no table identifier anywhere in the schema.
- Per-product currency override / multi-currency — `restaurant_settings` holds
  exactly one `currency_code`/`currency_symbol` pair; a restaurant has one
  active currency at a time.
- Locale-specific favicon/OG image variants — `favicon_path` and
  `seo_og_image_path` are single, brand-wide assets, not per-locale; only
  `seo_title`/`seo_description` are localized.
