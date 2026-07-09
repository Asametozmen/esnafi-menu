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
-- row." See DATABASE.md §2.3 for the field-by-field mapping.
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

-- ─────────────────────────────────────────────
-- Row Level Security
-- ─────────────────────────────────────────────
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

-- ─────────────────────────────────────────────
-- Storage: menu-images bucket policies
-- (bucket itself is created via the Supabase dashboard/API, public)
-- Path convention:
--   products:  {restaurant_id}/products/{product_id}/{filename}
--   branding:  {restaurant_id}/branding/{logo|cover|og|favicon}/{filename}
-- ─────────────────────────────────────────────
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
