-- Seeds one restaurant, its settings row (defaults per DATABASE.md §2.3), and
-- the 12 locked categories from PROJECT_PLAN.md §3. Arabic names are left
-- blank for staff to fill in via the admin panel (TR is the fallback locale).
-- Slugs are intentionally omitted here so the `categories_set_slug` trigger
-- generates them from the Turkish name, exercising the same path staff use.

with new_restaurant as (
  insert into restaurants (slug, default_locale, supported_locales)
  values ('esnafi-lokanta', 'tr', array['tr', 'en', 'ar'])
  returning id
),
new_settings as (
  insert into restaurant_settings (restaurant_id, name)
  select id, 'Esnafi Lokanta' from new_restaurant
  returning restaurant_id
)
insert into categories (restaurant_id, name, display_order)
select r.id, c.name, c.display_order
from new_restaurant r
cross join (
  values
    ('{"tr": "Kahvaltılar", "en": "Breakfast", "ar": ""}'::jsonb, 0),
    ('{"tr": "Çorbalar", "en": "Soups", "ar": ""}'::jsonb, 1),
    ('{"tr": "Sahanda Yumurta", "en": "Pan-Fried Eggs", "ar": ""}'::jsonb, 2),
    ('{"tr": "Kıymalı Yemekler ve Köfteler", "en": "Minced Meat Dishes & Meatballs", "ar": ""}'::jsonb, 3),
    ('{"tr": "Tavuklu Yemekler", "en": "Chicken Dishes", "ar": ""}'::jsonb, 4),
    ('{"tr": "Etli Yemekler", "en": "Meat Dishes", "ar": ""}'::jsonb, 5),
    ('{"tr": "Etsiz Yemekler", "en": "Meatless Dishes", "ar": ""}'::jsonb, 6),
    ('{"tr": "Garnitür", "en": "Side Dishes", "ar": ""}'::jsonb, 7),
    ('{"tr": "Zeytinyağlılar", "en": "Olive Oil Dishes", "ar": ""}'::jsonb, 8),
    ('{"tr": "Menüler", "en": "Set Menus", "ar": ""}'::jsonb, 9),
    ('{"tr": "Tatlılar", "en": "Desserts", "ar": ""}'::jsonb, 10),
    ('{"tr": "İçecekler", "en": "Drinks", "ar": ""}'::jsonb, 11)
) as c(name, display_order);
