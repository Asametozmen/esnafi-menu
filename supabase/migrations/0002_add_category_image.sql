-- Adds a hero/background image per category, shown behind the category
-- card on the public menu's category grid ([locale]/page.tsx).
alter table categories
  add column image_path text;
