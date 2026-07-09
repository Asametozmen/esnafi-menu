-- Bulk product import generated from POS export (Item Definitions).
-- Run in the Supabase SQL Editor after confirming categories are seeded.

-- ===== Kahvaltılar (32 items) =====
insert into products (restaurant_id, category_id, name, price, display_order)
select r.id, c.id, v.name, v.price, v.display_order
from restaurants r
join categories c on c.restaurant_id = r.id and c.slug = 'kahvaltilar'
cross join (values
  ('{"tr": "Simit", "en": "Simit (Sesame Bread Ring)", "ar": "سيميت (خبز بالسمسم)"}'::jsonb, 40, 0),
  ('{"tr": "Serpme Kahvaltı 2 Kişilik", "en": "Turkish Breakfast Spread (2 People)", "ar": "فطور تركي منوع لشخصين"}'::jsonb, 120, 1),
  ('{"tr": "Kızartma Antep Peynir", "en": "Fried Antep Cheese", "ar": "جبنة عنتاب المقلية"}'::jsonb, 200, 2),
  ('{"tr": "Omlet Sucuklu", "en": "Omelette with Sujuk", "ar": "أومليت بالسجق"}'::jsonb, 350, 3),
  ('{"tr": "Kahvaltı Tabağı 1 Kişilik", "en": "Breakfast Plate (1 Person)", "ar": "طبق فطور لشخص واحد"}'::jsonb, 195, 4),
  ('{"tr": "Nutella", "en": "Nutella", "ar": "نوتيلا"}'::jsonb, 100, 5),
  ('{"tr": "Sahanda Sade Yumurtalı 2 Yumurtalı", "en": "Plain Pan-Fried Eggs (2 Eggs)", "ar": "بيض مقلي سادة (بيضتان)"}'::jsonb, 180, 6),
  ('{"tr": "Reçel", "en": "Jam", "ar": "مربى"}'::jsonb, 50, 7),
  ('{"tr": "Kaymak", "en": "Kaymak (Clotted Cream)", "ar": "قيمر (قشطة)"}'::jsonb, 150, 8),
  ('{"tr": "Sivas Çömlek Peynir", "en": "Sivas Clay-Pot Cheese", "ar": "جبنة سيفاس بالفخار"}'::jsonb, 50, 9),
  ('{"tr": "Sahanda Salçalı Yumurta 2 Yumurtalı", "en": "Pan-Fried Eggs with Tomato Sauce (2 Eggs)", "ar": "بيض مقلي بالصلصة (بيضتان)"}'::jsonb, 245, 10),
  ('{"tr": "Omlet Taze Otlu Beyaz Peynir", "en": "Omelette with Fresh Herbs & White Cheese", "ar": "أومليت بالأعشاب الطازجة والجبنة البيضاء"}'::jsonb, 275, 11),
  ('{"tr": "Bal - Tereyağ", "en": "Honey & Butter", "ar": "عسل وزبدة"}'::jsonb, 120, 12),
  ('{"tr": "Sahanda Sucuk", "en": "Pan-Fried Sujuk", "ar": "سجق مقلي"}'::jsonb, 250, 13),
  ('{"tr": "Acuka", "en": "Acuka (Spicy Walnut & Pepper Spread)", "ar": "أجوقة (معجون الجوز والفلفل الحار)"}'::jsonb, 120, 14),
  ('{"tr": "Sahanda Sucuklu Yumurta 2 Yumurtalı", "en": "Pan-Fried Eggs with Sujuk (2 Eggs)", "ar": "بيض مقلي بالسجق (بيضتان)"}'::jsonb, 295, 15),
  ('{"tr": "Patatesli Yumurta", "en": "Eggs with Potatoes", "ar": "بيض بالبطاطس"}'::jsonb, 245, 16),
  ('{"tr": "Sahanda Peynirli Yumurta 2 Yumurtalı", "en": "Pan-Fried Eggs with Cheese (2 Eggs)", "ar": "بيض مقلي بالجبنة (بيضتان)"}'::jsonb, 245, 17),
  ('{"tr": "Turşu", "en": "Pickles", "ar": "مخلل"}'::jsonb, 150, 18),
  ('{"tr": "Patates Kızartması", "en": "French Fries", "ar": "بطاطس مقلية"}'::jsonb, 150, 19),
  ('{"tr": "Tura Tur Serpme Kahvaltı", "en": "Tura Tur Breakfast Spread", "ar": "فطور تورا تور المنوع"}'::jsonb, 750, 20),
  ('{"tr": "Omlet Peynirli", "en": "Cheese Omelette", "ar": "أومليت بالجبنة"}'::jsonb, 300, 21),
  ('{"tr": "Ekstra Peynir", "en": "Extra Cheese", "ar": "جبنة إضافية"}'::jsonb, 50, 22),
  ('{"tr": "Ekstra Zeytin", "en": "Extra Olives", "ar": "زيتون إضافي"}'::jsonb, 50, 23),
  ('{"tr": "Omlet", "en": "Omelette", "ar": "أومليت"}'::jsonb, 250, 24),
  ('{"tr": "Ekstra Yumurta", "en": "Extra Egg", "ar": "بيضة إضافية"}'::jsonb, 50, 25),
  ('{"tr": "Haşlanmış Yumurta", "en": "Boiled Egg", "ar": "بيضة مسلوقة"}'::jsonb, 50, 26),
  ('{"tr": "Esnafi Çikolatalı", "en": "Esnafi Chocolate", "ar": "إسنافي بالشوكولاتة"}'::jsonb, 70, 27),
  ('{"tr": "Esnafi Ispanaklı Peynirli", "en": "Esnafi Spinach & Cheese", "ar": "إسنافي بالسبانخ والجبنة"}'::jsonb, 70, 28),
  ('{"tr": "Esnafi Kıymalı", "en": "Esnafi Minced Meat", "ar": "إسنافي باللحم المفروم"}'::jsonb, 100, 29),
  ('{"tr": "Söğüş Tabağı", "en": "Söğüş Plate (Fresh Vegetables & Cold Cuts)", "ar": "طبق سوغوش (خضار طازجة)"}'::jsonb, 195, 30),
  ('{"tr": "Poğaça", "en": "Poğaça (Savory Pastry)", "ar": "بوغاتشا (معجنات تركية)"}'::jsonb, 50, 31)
) as v(name, price, display_order)
where r.slug = 'esnafi-lokanta';

-- ===== Kıymalı Yemekler ve Köfteler (52 items) =====
insert into products (restaurant_id, category_id, name, price, display_order)
select r.id, c.id, v.name, v.price, v.display_order
from restaurants r
join categories c on c.restaurant_id = r.id and c.slug = 'kiymali-yemekler-ve-kofteler'
cross join (values
  ('{"tr": "Patlıcan Musakka (Az Porsiyon)", "en": "Eggplant Moussaka (Half Portion)", "ar": "مسقعة الباذنجان (نصف حصة)"}'::jsonb, 350, 0),
  ('{"tr": "Patlıcan Musakka (Tam Porsiyon)", "en": "Eggplant Moussaka (Full Portion)", "ar": "مسقعة الباذنجان (حصة كاملة)"}'::jsonb, 450, 1),
  ('{"tr": "Kuru Biber Dolması (Az Porsiyon)", "en": "Stuffed Dried Peppers (Half Portion)", "ar": "فلفل مجفف محشي (نصف حصة)"}'::jsonb, 350, 2),
  ('{"tr": "Kuru Biber Dolması (Tam Porsiyon)", "en": "Stuffed Dried Peppers (Full Portion)", "ar": "فلفل مجفف محشي (حصة كاملة)"}'::jsonb, 450, 3),
  ('{"tr": "Patates Musakka (Az Porsiyon)", "en": "Potato Moussaka (Half Portion)", "ar": "مسقعة البطاطس (نصف حصة)"}'::jsonb, 350, 4),
  ('{"tr": "Patates Musakka (Tam Porsiyon)", "en": "Potato Moussaka (Full Portion)", "ar": "مسقعة البطاطس (حصة كاملة)"}'::jsonb, 450, 5),
  ('{"tr": "Fellah Köfte (Az Porsiyon)", "en": "Fellah Köfte (Peasant-Style Meatballs) (Half Portion)", "ar": "كفتة الفلاح (نصف حصة)"}'::jsonb, 350, 6),
  ('{"tr": "Fellah Köfte (Tam Porsiyon)", "en": "Fellah Köfte (Peasant-Style Meatballs) (Full Portion)", "ar": "كفتة الفلاح (حصة كاملة)"}'::jsonb, 450, 7),
  ('{"tr": "Beğendi (Az Porsiyon)", "en": "Eggplant Purée (Beğendi) (Half Portion)", "ar": "بيغندي (بوريه الباذنجان) (نصف حصة)"}'::jsonb, 200, 8),
  ('{"tr": "Beğendi (Tam Porsiyon)", "en": "Eggplant Purée (Beğendi) (Full Portion)", "ar": "بيغندي (بوريه الباذنجان) (حصة كاملة)"}'::jsonb, 250, 9),
  ('{"tr": "Kabak Dolması (Az Porsiyon)", "en": "Stuffed Zucchini (Half Portion)", "ar": "كوسا محشية (نصف حصة)"}'::jsonb, 450, 10),
  ('{"tr": "Kabak Dolması (Tam Porsiyon)", "en": "Stuffed Zucchini (Full Portion)", "ar": "كوسا محشية (حصة كاملة)"}'::jsonb, 450, 11),
  ('{"tr": "Karnı Yarık (Az Porsiyon)", "en": "Karnıyarık (Stuffed Eggplant with Minced Meat) (Half Portion)", "ar": "كارنيارك (باذنجان محشي باللحم المفروم) (نصف حصة)"}'::jsonb, 350, 12),
  ('{"tr": "Karnı Yarık (Tam Porsiyon)", "en": "Karnıyarık (Stuffed Eggplant with Minced Meat) (Full Portion)", "ar": "كارنيارك (باذنجان محشي باللحم المفروم) (حصة كاملة)"}'::jsonb, 450, 13),
  ('{"tr": "Günün Tavuklu Yemeği (Az Porsiyon)", "en": "Chicken Dish of the Day (Half Portion)", "ar": "طبق الدجاج اليومي (نصف حصة)"}'::jsonb, 290, 14),
  ('{"tr": "Günün Tavuklu Yemeği (Tam Porsiyon)", "en": "Chicken Dish of the Day (Full Portion)", "ar": "طبق الدجاج اليومي (حصة كاملة)"}'::jsonb, 390, 15),
  ('{"tr": "Ali Nazik (Az Porsiyon)", "en": "Ali Nazik (Garlic Yogurt with Eggplant & Meat) (Half Portion)", "ar": "علي نازك (نصف حصة)"}'::jsonb, 325, 16),
  ('{"tr": "Ali Nazik (Tam Porsiyon)", "en": "Ali Nazik (Garlic Yogurt with Eggplant & Meat) (Full Portion)", "ar": "علي نازك (حصة كاملة)"}'::jsonb, 450, 17),
  ('{"tr": "Kadın Budu Köfre (Az Porsiyon)", "en": "Kadınbudu Köfte (Lady''s Thigh Meatballs) (Half Portion)", "ar": "كفتة كادن بودو (نصف حصة)"}'::jsonb, 450, 18),
  ('{"tr": "Kadın Budu Köfre (Tam Porsiyon)", "en": "Kadınbudu Köfte (Lady''s Thigh Meatballs) (Full Portion)", "ar": "كفتة كادن بودو (حصة كاملة)"}'::jsonb, 450, 19),
  ('{"tr": "Soğan Dolması (Az Porsiyon)", "en": "Stuffed Onions (Half Portion)", "ar": "بصل محشي (نصف حصة)"}'::jsonb, 350, 20),
  ('{"tr": "Soğan Dolması (Tam Porsiyon)", "en": "Stuffed Onions (Full Portion)", "ar": "بصل محشي (حصة كاملة)"}'::jsonb, 450, 21),
  ('{"tr": "Fırında Sebzeli Köfte (Az Porsiyon)", "en": "Baked Meatballs with Vegetables (Half Portion)", "ar": "كفتة بالخضار في الفرن (نصف حصة)"}'::jsonb, 350, 22),
  ('{"tr": "Fırında Sebzeli Köfte (Tam Porsiyon)", "en": "Baked Meatballs with Vegetables (Full Portion)", "ar": "كفتة بالخضار في الفرن (حصة كاملة)"}'::jsonb, 450, 23),
  ('{"tr": "Tavuk Kavurma", "en": "Sautéed Chicken (Kavurma)", "ar": "دجاج مقلي (كافورما)"}'::jsonb, 450, 24),
  ('{"tr": "Ekmek Arası Tavuk Kavurma", "en": "Sautéed Chicken (Kavurma) (in Bread)", "ar": "دجاج مقلي (كافورما) (بالخبز)"}'::jsonb, 390, 25),
  ('{"tr": "Sulu Köfte (Az Porsiyon)", "en": "Meatballs in Broth (Half Portion)", "ar": "كفتة بالمرق (نصف حصة)"}'::jsonb, 350, 26),
  ('{"tr": "Sulu Köfte (Tam Porsiyon)", "en": "Meatballs in Broth (Full Portion)", "ar": "كفتة بالمرق (حصة كاملة)"}'::jsonb, 450, 27),
  ('{"tr": "Bezelye (Az Porsiyon)", "en": "Peas (Half Portion)", "ar": "بازلاء (نصف حصة)"}'::jsonb, 325, 28),
  ('{"tr": "Bezelye (Tam Porsiyon)", "en": "Peas (Full Portion)", "ar": "بازلاء (حصة كاملة)"}'::jsonb, 450, 29),
  ('{"tr": "Günün Kıymalı Yemeği (Az Porsiyon)", "en": "Minced Meat Dish of the Day (Half Portion)", "ar": "طبق اللحم المفروم اليومي (نصف حصة)"}'::jsonb, 350, 30),
  ('{"tr": "Günün Kıymalı Yemeği (Tam Porsiyon)", "en": "Minced Meat Dish of the Day (Full Portion)", "ar": "طبق اللحم المفروم اليومي (حصة كاملة)"}'::jsonb, 450, 31),
  ('{"tr": "Kavurma", "en": "Kavurma (Sautéed Meat)", "ar": "كافورما (لحم مقلي)"}'::jsonb, 650, 32),
  ('{"tr": "Ekmek Arası Kavurma", "en": "Kavurma (Sautéed Meat) (in Bread)", "ar": "كافورما (لحم مقلي) (بالخبز)"}'::jsonb, 600, 33),
  ('{"tr": "Biber Dolması (Az Porsiyon)", "en": "Stuffed Peppers (Half Portion)", "ar": "فلفل محشي (نصف حصة)"}'::jsonb, 325, 34),
  ('{"tr": "Biber Dolması (Tam Porsiyon)", "en": "Stuffed Peppers (Full Portion)", "ar": "فلفل محشي (حصة كاملة)"}'::jsonb, 450, 35),
  ('{"tr": "Hasanpaşa köfte (Az Porsiyon)", "en": "Hasanpaşa Köfte (Half Portion)", "ar": "كفتة حسن باشا (نصف حصة)"}'::jsonb, 350, 36),
  ('{"tr": "Hasanpaşa köfte (Tam Porsiyon)", "en": "Hasanpaşa Köfte (Full Portion)", "ar": "كفتة حسن باشا (حصة كاملة)"}'::jsonb, 450, 37),
  ('{"tr": "İzmir Köfte (Az Porsiyon)", "en": "Izmir Köfte (Half Portion)", "ar": "كفتة إزمير (نصف حصة)"}'::jsonb, 350, 38),
  ('{"tr": "İzmir Köfte (Tam Porsiyon)", "en": "Izmir Köfte (Full Portion)", "ar": "كفتة إزمير (حصة كاملة)"}'::jsonb, 450, 39),
  ('{"tr": "Günün Etli Yemeği (Az Porsiyon)", "en": "Meat Dish of the Day (Half Portion)", "ar": "طبق اللحم اليومي (نصف حصة)"}'::jsonb, 500, 40),
  ('{"tr": "Günün Etli Yemeği (Tam Porsiyon)", "en": "Meat Dish of the Day (Full Portion)", "ar": "طبق اللحم اليومي (حصة كاملة)"}'::jsonb, 650, 41),
  ('{"tr": "Fasulte (Az Porsiyon)", "en": "Beans (Half Portion)", "ar": "فاصوليا (نصف حصة)"}'::jsonb, 325, 42),
  ('{"tr": "Fasulte (Tam Porsiyon)", "en": "Beans (Full Portion)", "ar": "فاصوليا (حصة كاملة)"}'::jsonb, 450, 43),
  ('{"tr": "Ekşili Köfte (Az Porsiyon)", "en": "Sour Meatballs (Half Portion)", "ar": "كفتة بالصلصة الحامضة (نصف حصة)"}'::jsonb, 325, 44),
  ('{"tr": "Ekşili Köfte (Tam Porsiyon)", "en": "Sour Meatballs (Full Portion)", "ar": "كفتة بالصلصة الحامضة (حصة كاملة)"}'::jsonb, 450, 45),
  ('{"tr": "Kabak Graten (Az Porsiyon)", "en": "Zucchini Gratin (Half Portion)", "ar": "جراتان الكوسا (نصف حصة)"}'::jsonb, 350, 46),
  ('{"tr": "Kabak Graten (Tam Porsiyon)", "en": "Zucchini Gratin (Full Portion)", "ar": "جراتان الكوسا (حصة كاملة)"}'::jsonb, 450, 47),
  ('{"tr": "Sini Köfte (Az Porsiyon)", "en": "Sini Köfte (Baked Tray Meatballs) (Half Portion)", "ar": "كفتة الصينية (نصف حصة)"}'::jsonb, 450, 48),
  ('{"tr": "Sini Köfte (Tam Porsiyon)", "en": "Sini Köfte (Baked Tray Meatballs) (Full Portion)", "ar": "كفتة الصينية (حصة كاملة)"}'::jsonb, 450, 49),
  ('{"tr": "Kuru Patlıcan Dolması (Az Porsiyon)", "en": "Stuffed Dried Eggplant (Half Portion)", "ar": "باذنجان مجفف محشي (نصف حصة)"}'::jsonb, 350, 50),
  ('{"tr": "Kuru Patlıcan Dolması (Tam Porsiyon)", "en": "Stuffed Dried Eggplant (Full Portion)", "ar": "باذنجان مجفف محشي (حصة كاملة)"}'::jsonb, 450, 51)
) as v(name, price, display_order)
where r.slug = 'esnafi-lokanta';

-- ===== Etsiz Yemekler (14 items) =====
insert into products (restaurant_id, category_id, name, price, display_order)
select r.id, c.id, v.name, v.price, v.display_order
from restaurants r
join categories c on c.restaurant_id = r.id and c.slug = 'etsiz-yemekler'
cross join (values
  ('{"tr": "Nohut (Az Porsiyon)", "en": "Chickpeas (Half Portion)", "ar": "حمص (نصف حصة)"}'::jsonb, 150, 0),
  ('{"tr": "Nohut (Tam Porsiyon)", "en": "Chickpeas (Full Portion)", "ar": "حمص (حصة كاملة)"}'::jsonb, 250, 1),
  ('{"tr": "Fırında Kaşarlı Mantar (Az Porsiyon)", "en": "Baked Mushroom with Kashar Cheese (Half Portion)", "ar": "فطر بالفرن بجبنة كاشار (نصف حصة)"}'::jsonb, 250, 2),
  ('{"tr": "Fırında Kaşarlı Mantar (Tam Porsiyon)", "en": "Baked Mushroom with Kashar Cheese (Full Portion)", "ar": "فطر بالفرن بجبنة كاشار (حصة كاملة)"}'::jsonb, 350, 3),
  ('{"tr": "Mücver (Az Porsiyon)", "en": "Mücver (Zucchini Fritters) (Half Portion)", "ar": "موجفر (فطائر الكوسا) (نصف حصة)"}'::jsonb, 150, 4),
  ('{"tr": "Mücver (Tam Porsiyon)", "en": "Mücver (Zucchini Fritters) (Full Portion)", "ar": "موجفر (فطائر الكوسا) (حصة كاملة)"}'::jsonb, 250, 5),
  ('{"tr": "Kabak Graten (Az Porsiyon)", "en": "Zucchini Gratin (Half Portion)", "ar": "جراتان الكوسا (نصف حصة)"}'::jsonb, 150, 6),
  ('{"tr": "Kabak Graten (Tam Porsiyon)", "en": "Zucchini Gratin (Full Portion)", "ar": "جراتان الكوسا (حصة كاملة)"}'::jsonb, 250, 7),
  ('{"tr": "Ispanaklı Graten (Az Porsiyon)", "en": "Spinach Gratin (Half Portion)", "ar": "جراتان السبانخ (نصف حصة)"}'::jsonb, 150, 8),
  ('{"tr": "Ispanaklı Graten (Tam Porsiyon)", "en": "Spinach Gratin (Full Portion)", "ar": "جراتان السبانخ (حصة كاملة)"}'::jsonb, 250, 9),
  ('{"tr": "Fırında Sebzeli (Az Porsiyon)", "en": "Baked Vegetables (Half Portion)", "ar": "خضار بالفرن (نصف حصة)"}'::jsonb, 150, 10),
  ('{"tr": "Fırında Sebzeli (Tam Porsiyon)", "en": "Baked Vegetables (Full Portion)", "ar": "خضار بالفرن (حصة كاملة)"}'::jsonb, 250, 11),
  ('{"tr": "Patates Graten (Az Porsiyon)", "en": "Potato Gratin (Half Portion)", "ar": "جراتان البطاطس (نصف حصة)"}'::jsonb, 150, 12),
  ('{"tr": "Patates Graten (Tam Porsiyon)", "en": "Potato Gratin (Full Portion)", "ar": "جراتان البطاطس (حصة كاملة)"}'::jsonb, 250, 13)
) as v(name, price, display_order)
where r.slug = 'esnafi-lokanta';

-- ===== Zeytinyağlılar (31 items) =====
insert into products (restaurant_id, category_id, name, price, display_order)
select r.id, c.id, v.name, v.price, v.display_order
from restaurants r
join categories c on c.restaurant_id = r.id and c.slug = 'zeytinyaglilar'
cross join (values
  ('{"tr": "Kabak (Az Porsiyon)", "en": "Zucchini (Half Portion)", "ar": "كوسا (نصف حصة)"}'::jsonb, 200, 0),
  ('{"tr": "Kabak (Tam Porsiyon)", "en": "Zucchini (Full Portion)", "ar": "كوسا (حصة كاملة)"}'::jsonb, 350, 1),
  ('{"tr": "Köz Patlıcan (Az Porsiyon)", "en": "Grilled Eggplant (Half Portion)", "ar": "باذنجان مشوي (نصف حصة)"}'::jsonb, 200, 2),
  ('{"tr": "Köz Patlıcan (Tam Porsiyon)", "en": "Grilled Eggplant (Full Portion)", "ar": "باذنجان مشوي (حصة كاملة)"}'::jsonb, 350, 3),
  ('{"tr": "Pırasa (Az Porsiyon)", "en": "Leeks (Half Portion)", "ar": "كراث (نصف حصة)"}'::jsonb, 200, 4),
  ('{"tr": "Pırasa (Tam Porsiyon)", "en": "Leeks (Full Portion)", "ar": "كراث (حصة كاملة)"}'::jsonb, 350, 5),
  ('{"tr": "Pancarlı Siyah Pirinç Salatası (Az Porsiyon)", "en": "Beetroot & Black Rice Salad (Half Portion)", "ar": "سلطة الشمندر والأرز الأسود (نصف حصة)"}'::jsonb, 200, 6),
  ('{"tr": "Pancarlı Siyah Pirinç Salatası (Tam Porsiyon)", "en": "Beetroot & Black Rice Salad (Full Portion)", "ar": "سلطة الشمندر والأرز الأسود (حصة كاملة)"}'::jsonb, 350, 7),
  ('{"tr": "Yoğurtlu Semiz Otu (Az Porsiyon)", "en": "Purslane with Yogurt (Half Portion)", "ar": "بقلة باللبن (نصف حصة)"}'::jsonb, 350, 8),
  ('{"tr": "Yoğurtlu Semiz Otu (Tam Porsiyon)", "en": "Purslane with Yogurt (Full Portion)", "ar": "بقلة باللبن (حصة كاملة)"}'::jsonb, 350, 9),
  ('{"tr": "Kayısılı Pırasa (Az Porsiyon)", "en": "Leeks with Apricot (Half Portion)", "ar": "كراث بالمشمش (نصف حصة)"}'::jsonb, 200, 10),
  ('{"tr": "Kayısılı Pırasa (Tam Porsiyon)", "en": "Leeks with Apricot (Full Portion)", "ar": "كراث بالمشمش (حصة كاملة)"}'::jsonb, 350, 11),
  ('{"tr": "Biber Dolması (Az Porsiyon)", "en": "Stuffed Peppers (Half Portion)", "ar": "فلفل محشي (نصف حصة)"}'::jsonb, 200, 12),
  ('{"tr": "Biber Dolması (Tam Porsiyon)", "en": "Stuffed Peppers (Full Portion)", "ar": "فلفل محشي (حصة كاملة)"}'::jsonb, 350, 13),
  ('{"tr": "Kinao Salatası", "en": "Quinoa Salad", "ar": "سلطة الكينوا"}'::jsonb, 275, 14),
  ('{"tr": "Brokoli (Az Porsiyon)", "en": "Broccoli (Half Portion)", "ar": "بروكلي (نصف حصة)"}'::jsonb, 200, 15),
  ('{"tr": "Brokoli (Tam Porsiyon)", "en": "Broccoli (Full Portion)", "ar": "بروكلي (حصة كاملة)"}'::jsonb, 350, 16),
  ('{"tr": "Havuç Salatası", "en": "Carrot Salad", "ar": "سلطة الجزر"}'::jsonb, 275, 17),
  ('{"tr": "Kuru Cacık (Az Porsiyon)", "en": "Cacık (Thick Yogurt & Cucumber) (Half Portion)", "ar": "جاجيك سميك (نصف حصة)"}'::jsonb, 200, 18),
  ('{"tr": "Kuru Cacık (Tam Porsiyon)", "en": "Cacık (Thick Yogurt & Cucumber) (Full Portion)", "ar": "جاجيك سميك (حصة كاملة)"}'::jsonb, 350, 19),
  ('{"tr": "Karabuğday Salatası", "en": "Buckwheat Salad", "ar": "سلطة الحنطة السوداء"}'::jsonb, 275, 20),
  ('{"tr": "Bal Kabağı (Az Porsiyon)", "en": "Pumpkin (Half Portion)", "ar": "قرع (نصف حصة)"}'::jsonb, 200, 21),
  ('{"tr": "Bal Kabağı (Tam Porsiyon)", "en": "Pumpkin (Full Portion)", "ar": "قرع (حصة كاملة)"}'::jsonb, 350, 22),
  ('{"tr": "Kabak Salatası", "en": "Zucchini Salad", "ar": "سلطة الكوسا"}'::jsonb, 275, 23),
  ('{"tr": "Çoban Salata", "en": "Shepherd''s Salad", "ar": "سلطة الراعي"}'::jsonb, 275, 24),
  ('{"tr": "Enginar Dolması (Az Porsiyon)", "en": "Stuffed Artichoke (Half Portion)", "ar": "أرضي شوكي محشي (نصف حصة)"}'::jsonb, 200, 25),
  ('{"tr": "Enginar Dolması (Tam Porsiyon)", "en": "Stuffed Artichoke (Full Portion)", "ar": "أرضي شوكي محشي (حصة كاملة)"}'::jsonb, 350, 26),
  ('{"tr": "Kereviz (Az Porsiyon)", "en": "Celery Root (Half Portion)", "ar": "كرفس (نصف حصة)"}'::jsonb, 200, 27),
  ('{"tr": "Kereviz (Tam Porsiyon)", "en": "Celery Root (Full Portion)", "ar": "كرفس (حصة كاملة)"}'::jsonb, 350, 28),
  ('{"tr": "Patatesli Salata", "en": "Potato Salad", "ar": "سلطة البطاطس"}'::jsonb, 275, 29),
  ('{"tr": "Mevsim Salata", "en": "Seasonal Salad", "ar": "سلطة موسمية"}'::jsonb, 275, 30)
) as v(name, price, display_order)
where r.slug = 'esnafi-lokanta';

-- ===== Garnitür (14 items) =====
insert into products (restaurant_id, category_id, name, price, display_order)
select r.id, c.id, v.name, v.price, v.display_order
from restaurants r
join categories c on c.restaurant_id = r.id and c.slug = 'garnitur'
cross join (values
  ('{"tr": "Patates Püresi (Az Porsiyon)", "en": "Mashed Potatoes (Half Portion)", "ar": "بوريه البطاطس (نصف حصة)"}'::jsonb, 100, 0),
  ('{"tr": "Patates Püresi (Tam Porsiyon)", "en": "Mashed Potatoes (Full Portion)", "ar": "بوريه البطاطس (حصة كاملة)"}'::jsonb, 150, 1),
  ('{"tr": "Fırın Makarna (Az Porsiyon)", "en": "Baked Pasta (Half Portion)", "ar": "مكرونة بالفرن (نصف حصة)"}'::jsonb, 100, 2),
  ('{"tr": "Fırın Makarna (Tam Porsiyon)", "en": "Baked Pasta (Full Portion)", "ar": "مكرونة بالفرن (حصة كاملة)"}'::jsonb, 150, 3),
  ('{"tr": "Kuru Sebzeli Pilav (Az Porsiyon)", "en": "Rice Pilaf with Vegetables (Half Portion)", "ar": "أرز بيلاف بالخضار (نصف حصة)"}'::jsonb, 100, 4),
  ('{"tr": "Kuru Sebzeli Pilav (Tam Porsiyon)", "en": "Rice Pilaf with Vegetables (Full Portion)", "ar": "أرز بيلاف بالخضار (حصة كاملة)"}'::jsonb, 150, 5),
  ('{"tr": "Özbek Pilavı (Az Porsiyon)", "en": "Uzbek Pilaf (Half Portion)", "ar": "بيلاف أوزبكي (نصف حصة)"}'::jsonb, 120, 6),
  ('{"tr": "Özbek Pilavı (Tam Porsiyon)", "en": "Uzbek Pilaf (Full Portion)", "ar": "بيلاف أوزبكي (حصة كاملة)"}'::jsonb, 175, 7),
  ('{"tr": "Paynirli Makarna (Az Porsiyon)", "en": "Pasta with Cheese (Half Portion)", "ar": "مكرونة بالجبنة (نصف حصة)"}'::jsonb, 100, 8),
  ('{"tr": "Paynirli Makarna (Tam Porsiyon)", "en": "Pasta with Cheese (Full Portion)", "ar": "مكرونة بالجبنة (حصة كاملة)"}'::jsonb, 150, 9),
  ('{"tr": "Pirinç Pilavı (Az Porsiyon)", "en": "Rice Pilaf (Half Portion)", "ar": "أرز بيلاف (نصف حصة)"}'::jsonb, 100, 10),
  ('{"tr": "Pirinç Pilavı (Tam Porsiyon)", "en": "Rice Pilaf (Full Portion)", "ar": "أرز بيلاف (حصة كاملة)"}'::jsonb, 150, 11),
  ('{"tr": "Bulgur Pilavı (Az Porsiyon)", "en": "Bulgur Pilaf (Half Portion)", "ar": "برغل بيلاف (نصف حصة)"}'::jsonb, 100, 12),
  ('{"tr": "Bulgur Pilavı (Tam Porsiyon)", "en": "Bulgur Pilaf (Full Portion)", "ar": "برغل بيلاف (حصة كاملة)"}'::jsonb, 150, 13)
) as v(name, price, display_order)
where r.slug = 'esnafi-lokanta';

-- ===== İçecekler (21 items) =====
insert into products (restaurant_id, category_id, name, price, display_order)
select r.id, c.id, v.name, v.price, v.display_order
from restaurants r
join categories c on c.restaurant_id = r.id and c.slug = 'icecekler'
cross join (values
  ('{"tr": "Soda", "en": "Soda Water", "ar": "صودا"}'::jsonb, 70, 0),
  ('{"tr": "Kutu Meyva Suyu", "en": "Boxed Fruit Juice", "ar": "عصير فواكه معلب"}'::jsonb, 90, 1),
  ('{"tr": "Şişe Su", "en": "Bottled Water", "ar": "مياه معبأة"}'::jsonb, 70, 2),
  ('{"tr": "Fincan Çay", "en": "Cup of Tea", "ar": "فنجان شاي"}'::jsonb, 100, 3),
  ('{"tr": "Pot Çay", "en": "Pot of Tea", "ar": "إبريق شاي"}'::jsonb, 300, 4),
  ('{"tr": "Ice Tea Limon", "en": "Iced Tea (Lemon)", "ar": "شاي مثلج بالليمون"}'::jsonb, 90, 5),
  ('{"tr": "Elmalı Soda", "en": "Apple Soda", "ar": "صودا بالتفاح"}'::jsonb, 90, 6),
  ('{"tr": "Filtre Kahve", "en": "Filter Coffee", "ar": "قهوة فلتر"}'::jsonb, 250, 7),
  ('{"tr": "Bardak Çay", "en": "Glass of Tea", "ar": "كوب شاي"}'::jsonb, 70, 8),
  ('{"tr": "Şalgam", "en": "Şalgam (Turnip Juice)", "ar": "شلغم (عصير اللفت المخمر)"}'::jsonb, 90, 9),
  ('{"tr": "Limonlu Soda", "en": "Lemon Soda", "ar": "صودا بالليمون"}'::jsonb, 70, 10),
  ('{"tr": "Coca Cola Zero", "en": "Coca-Cola Zero", "ar": "كوكاكولا زيرو"}'::jsonb, 90, 11),
  ('{"tr": "Ayran", "en": "Ayran (Yogurt Drink)", "ar": "عيران (مشروب اللبن)"}'::jsonb, 70, 12),
  ('{"tr": "Ice Tea Şeftali", "en": "Iced Tea (Peach)", "ar": "شاي مثلج بالخوخ"}'::jsonb, 90, 13),
  ('{"tr": "Yoğurt", "en": "Yogurt", "ar": "لبن زبادي"}'::jsonb, 80, 14),
  ('{"tr": "Sprite", "en": "Sprite", "ar": "سبرايت"}'::jsonb, 90, 15),
  ('{"tr": "Türk Kahvesi", "en": "Turkish Coffee", "ar": "قهوة تركية"}'::jsonb, 120, 16),
  ('{"tr": "Fanta", "en": "Fanta", "ar": "فانتا"}'::jsonb, 90, 17),
  ('{"tr": "Double Türk Kahvesi", "en": "Double Turkish Coffee", "ar": "قهوة تركية دبل"}'::jsonb, 120, 18),
  ('{"tr": "Coca Cola", "en": "Coca-Cola", "ar": "كوكاكولا"}'::jsonb, 90, 19),
  ('{"tr": "Portakal Suyu", "en": "Orange Juice", "ar": "عصير برتقال"}'::jsonb, 150, 20)
) as v(name, price, display_order)
where r.slug = 'esnafi-lokanta';

-- ===== Etli Yemekler (19 items) =====
insert into products (restaurant_id, category_id, name, price, display_order)
select r.id, c.id, v.name, v.price, v.display_order
from restaurants r
join categories c on c.restaurant_id = r.id and c.slug = 'etli-yemekler'
cross join (values
  ('{"tr": "Enginar Dolması", "en": "Stuffed Artichoke", "ar": "أرضي شوكي محشي"}'::jsonb, 550, 0),
  ('{"tr": "Kuzu Gerdan", "en": "Lamb Neck", "ar": "رقبة خروف"}'::jsonb, 950, 1),
  ('{"tr": "Etli Kuru Fasulye (Az Porsiyon)", "en": "Beans with Meat (Half Portion)", "ar": "فاصولياء باللحم (نصف حصة)"}'::jsonb, 300, 2),
  ('{"tr": "Etli Kuru Fasulye (Tam Porsiyon)", "en": "Beans with Meat (Full Portion)", "ar": "فاصولياء باللحم (حصة كاملة)"}'::jsonb, 450, 3),
  ('{"tr": "Haşlama (Az Porsiyon)", "en": "Haşlama (Turkish Boiled Meat Stew) (Half Portion)", "ar": "حشلامة (يخنة اللحم المسلوق) (نصف حصة)"}'::jsonb, 500, 4),
  ('{"tr": "Haşlama (Tam Porsiyon)", "en": "Haşlama (Turkish Boiled Meat Stew) (Full Portion)", "ar": "حشلامة (يخنة اللحم المسلوق) (حصة كاملة)"}'::jsonb, 650, 5),
  ('{"tr": "Başamelli Etli Krep", "en": "Meat Crêpe with Béchamel", "ar": "كريب باللحم والبشاميل"}'::jsonb, 550, 6),
  ('{"tr": "Elbasan Tava (Az Porsiyon)", "en": "Elbasan Tava (Baked Yogurt & Meat) (Half Portion)", "ar": "إلباسان طاوة (نصف حصة)"}'::jsonb, 400, 7),
  ('{"tr": "Elbasan Tava (Tam Porsiyon)", "en": "Elbasan Tava (Baked Yogurt & Meat) (Full Portion)", "ar": "إلباسان طاوة (حصة كاملة)"}'::jsonb, 550, 8),
  ('{"tr": "Orman Kebabı (Az Porsiyon)", "en": "Orman Kebabı (Forest Kebab Stew) (Half Portion)", "ar": "أورمان كباب (يخنة الغابة) (نصف حصة)"}'::jsonb, 400, 9),
  ('{"tr": "Orman Kebabı (Tam Porsiyon)", "en": "Orman Kebabı (Forest Kebab Stew) (Full Portion)", "ar": "أورمان كباب (يخنة الغابة) (حصة كاملة)"}'::jsonb, 550, 10),
  ('{"tr": "İslim Kebası (Az Porsiyon)", "en": "İslim Kebabı (Eggplant-Wrapped Meat) (Half Portion)", "ar": "إسليم كباب (لحم ملفوف بالباذنجان) (نصف حصة)"}'::jsonb, 300, 11),
  ('{"tr": "İslim Kebası (Tam Porsiyon)", "en": "İslim Kebabı (Eggplant-Wrapped Meat) (Full Portion)", "ar": "إسليم كباب (لحم ملفوف بالباذنجان) (حصة كاملة)"}'::jsonb, 550, 12),
  ('{"tr": "Arnavut Ciğeri (Az Porsiyon)", "en": "Albanian-Style Fried Liver (Half Portion)", "ar": "كبدة ألبانية مقلية (نصف حصة)"}'::jsonb, 600, 13),
  ('{"tr": "Arnavut Ciğeri (Tam Porsiyon)", "en": "Albanian-Style Fried Liver (Full Portion)", "ar": "كبدة ألبانية مقلية (حصة كاملة)"}'::jsonb, 750, 14),
  ('{"tr": "Et Kavurma (Az Porsiyon)", "en": "Sautéed Beef (Kavurma) (Half Portion)", "ar": "لحم مقلي (كافورما) (نصف حصة)"}'::jsonb, 400, 15),
  ('{"tr": "Et Kavurma (Tam Porsiyon)", "en": "Sautéed Beef (Kavurma) (Full Portion)", "ar": "لحم مقلي (كافورما) (حصة كاملة)"}'::jsonb, 550, 16),
  ('{"tr": "Ayva Dolması", "en": "Stuffed Quince", "ar": "سفرجل محشي"}'::jsonb, 550, 17),
  ('{"tr": "Kuzu İncik", "en": "Lamb Shank", "ar": "موزة خروف"}'::jsonb, 950, 18)
) as v(name, price, display_order)
where r.slug = 'esnafi-lokanta';

-- ===== Çorbalar (20 items) =====
insert into products (restaurant_id, category_id, name, price, display_order)
select r.id, c.id, v.name, v.price, v.display_order
from restaurants r
join categories c on c.restaurant_id = r.id and c.slug = 'corbalar'
cross join (values
  ('{"tr": "Kremalı Domates (Az Porsiyon)", "en": "Creamy Tomato Soup (Half Portion)", "ar": "شوربة الطماطم بالكريمة (نصف حصة)"}'::jsonb, 100, 0),
  ('{"tr": "Kremalı Domates (Tam Porsiyon)", "en": "Creamy Tomato Soup (Full Portion)", "ar": "شوربة الطماطم بالكريمة (حصة كاملة)"}'::jsonb, 150, 1),
  ('{"tr": "Sebzeli Çorbası (Az Porsiyon)", "en": "Vegetable Soup (Half Portion)", "ar": "شوربة الخضار (نصف حصة)"}'::jsonb, 100, 2),
  ('{"tr": "Sebzeli Çorbası (Tam Porsiyon)", "en": "Vegetable Soup (Full Portion)", "ar": "شوربة الخضار (حصة كاملة)"}'::jsonb, 150, 3),
  ('{"tr": "Bal Kabağı Çorbası (Az Porsiyon)", "en": "Pumpkin Soup (Half Portion)", "ar": "شوربة القرع (نصف حصة)"}'::jsonb, 100, 4),
  ('{"tr": "Bal Kabağı Çorbası (Tam Porsiyon)", "en": "Pumpkin Soup (Full Portion)", "ar": "شوربة القرع (حصة كاملة)"}'::jsonb, 150, 5),
  ('{"tr": "Köz Patlıcan Çorbası (Az Porsiyon)", "en": "Grilled Eggplant Soup (Half Portion)", "ar": "شوربة الباذنجان المشوي (نصف حصة)"}'::jsonb, 100, 6),
  ('{"tr": "Köz Patlıcan Çorbası (Tam Porsiyon)", "en": "Grilled Eggplant Soup (Full Portion)", "ar": "شوربة الباذنجان المشوي (حصة كاملة)"}'::jsonb, 150, 7),
  ('{"tr": "Süzme mercimek (Az Porsiyon)", "en": "Strained Lentil Soup (Half Portion)", "ar": "شوربة العدس المصفى (نصف حصة)"}'::jsonb, 100, 8),
  ('{"tr": "Süzme mercimek (Tam Porsiyon)", "en": "Strained Lentil Soup (Full Portion)", "ar": "شوربة العدس المصفى (حصة كاملة)"}'::jsonb, 150, 9),
  ('{"tr": "Kremalı Mantar (Az Porsiyon)", "en": "Creamy Mushroom Soup (Half Portion)", "ar": "شوربة الفطر بالكريمة (نصف حصة)"}'::jsonb, 100, 10),
  ('{"tr": "Kremalı Mantar (Tam Porsiyon)", "en": "Creamy Mushroom Soup (Full Portion)", "ar": "شوربة الفطر بالكريمة (حصة كاملة)"}'::jsonb, 150, 11),
  ('{"tr": "Yayla Çorbası (Az Porsiyon)", "en": "Yayla Soup (Yogurt Soup) (Half Portion)", "ar": "شوربة يايلا (باللبن) (نصف حصة)"}'::jsonb, 80, 12),
  ('{"tr": "Yayla Çorbası (Tam Porsiyon)", "en": "Yayla Soup (Yogurt Soup) (Full Portion)", "ar": "شوربة يايلا (باللبن) (حصة كاملة)"}'::jsonb, 120, 13),
  ('{"tr": "Etli Düğün Çorbası (Az Porsiyon)", "en": "Wedding Soup with Meat (Half Portion)", "ar": "شوربة العرس باللحم (نصف حصة)"}'::jsonb, 130, 14),
  ('{"tr": "Etli Düğün Çorbası (Tam Porsiyon)", "en": "Wedding Soup with Meat (Full Portion)", "ar": "شوربة العرس باللحم (حصة كاملة)"}'::jsonb, 190, 15),
  ('{"tr": "Tavuk Suyu (Az Porsiyon)", "en": "Chicken Broth Soup (Half Portion)", "ar": "شوربة مرق الدجاج (نصف حصة)"}'::jsonb, 100, 16),
  ('{"tr": "Tavuk Suyu (Tam Porsiyon)", "en": "Chicken Broth Soup (Full Portion)", "ar": "شوربة مرق الدجاج (حصة كاملة)"}'::jsonb, 150, 17),
  ('{"tr": "Ezogelin (Az Porsiyon)", "en": "Ezogelin Soup (Red Lentil) (Half Portion)", "ar": "شوربة عزوجلين (عدس أحمر) (نصف حصة)"}'::jsonb, 100, 18),
  ('{"tr": "Ezogelin (Tam Porsiyon)", "en": "Ezogelin Soup (Red Lentil) (Full Portion)", "ar": "شوربة عزوجلين (عدس أحمر) (حصة كاملة)"}'::jsonb, 150, 19)
) as v(name, price, display_order)
where r.slug = 'esnafi-lokanta';

-- ===== Tatlılar (19 items) =====
insert into products (restaurant_id, category_id, name, price, display_order)
select r.id, c.id, v.name, v.price, v.display_order
from restaurants r
join categories c on c.restaurant_id = r.id and c.slug = 'tatlilar'
cross join (values
  ('{"tr": "Komposto", "en": "Fruit Compote", "ar": "كومبوت الفواكه"}'::jsonb, 180, 0),
  ('{"tr": "İncir Tatlısı", "en": "Fig Dessert", "ar": "حلوى التين"}'::jsonb, 180, 1),
  ('{"tr": "Elma Tatlısı", "en": "Baked Apple Dessert", "ar": "حلوى التفاح"}'::jsonb, 180, 2),
  ('{"tr": "Supangle", "en": "Supangle (Chocolate Pudding)", "ar": "سوبانغل (بودينغ الشوكولاتة)"}'::jsonb, 180, 3),
  ('{"tr": "Kayısı Tatlısı", "en": "Apricot Dessert", "ar": "حلوى المشمش"}'::jsonb, 180, 4),
  ('{"tr": "Cacık", "en": "Cacık (Yogurt & Cucumber)", "ar": "جاجيك (لبن وخيار)"}'::jsonb, 120, 5),
  ('{"tr": "Kalburabastı", "en": "Kalburabastı (Semolina Syrup Dessert)", "ar": "كالبورةباستي (حلوى السميد بالشربات)"}'::jsonb, 180, 6),
  ('{"tr": "İrmik Helvası", "en": "Semolina Halva", "ar": "حلاوة السميد"}'::jsonb, 150, 7),
  ('{"tr": "Meyve Tabağı", "en": "Fruit Plate", "ar": "طبق فواكه"}'::jsonb, 350, 8),
  ('{"tr": "Şekerpare", "en": "Şekerpare (Syrup-Soaked Cookie)", "ar": "شكرباره"}'::jsonb, 150, 9),
  ('{"tr": "Sütlaç", "en": "Sütlaç (Rice Pudding)", "ar": "أرز باللبن (سوتلاتش)"}'::jsonb, 180, 10),
  ('{"tr": "Kabak Tatlısı", "en": "Candied Pumpkin Dessert", "ar": "حلوى القرع"}'::jsonb, 180, 11),
  ('{"tr": "Ayva Tatlısı", "en": "Quince Dessert", "ar": "حلوى السفرجل"}'::jsonb, 180, 12),
  ('{"tr": "Revani", "en": "Revani (Semolina Syrup Cake)", "ar": "ريفاني (كيك السميد بالشربات)"}'::jsonb, 150, 13),
  ('{"tr": "Muhallebi", "en": "Muhallebi (Milk Pudding)", "ar": "مهلبية"}'::jsonb, 150, 14),
  ('{"tr": "Karpuz", "en": "Watermelon", "ar": "بطيخ"}'::jsonb, 100, 15),
  ('{"tr": "Kavun", "en": "Melon", "ar": "شمام"}'::jsonb, 150, 16),
  ('{"tr": "Tiramisu", "en": "Tiramisu", "ar": "تيراميسو"}'::jsonb, 180, 17),
  ('{"tr": "Kemalpaşa Tatlısı", "en": "Kemalpaşa Dessert", "ar": "حلوى كمال باشا"}'::jsonb, 150, 18)
) as v(name, price, display_order)
where r.slug = 'esnafi-lokanta';

-- ===== Tavuklu Yemekler (12 items) =====
insert into products (restaurant_id, category_id, name, price, display_order)
select r.id, c.id, v.name, v.price, v.display_order
from restaurants r
join categories c on c.restaurant_id = r.id and c.slug = 'tavuklu-yemekler'
cross join (values
  ('{"tr": "Fırında Tavuk Graten (Az Porsiyon)", "en": "Baked Chicken Gratin (Half Portion)", "ar": "دجاج جراتان بالفرن (نصف حصة)"}'::jsonb, 290, 0),
  ('{"tr": "Fırında Tavuk Graten (Tam Porsiyon)", "en": "Baked Chicken Gratin (Full Portion)", "ar": "دجاج جراتان بالفرن (حصة كاملة)"}'::jsonb, 390, 1),
  ('{"tr": "Beşamelli Tavuk (Az Porsiyon)", "en": "Chicken with Béchamel (Half Portion)", "ar": "دجاج بالبشاميل (نصف حصة)"}'::jsonb, 290, 2),
  ('{"tr": "Beşamelli Tavuk (Tam Porsiyon)", "en": "Chicken with Béchamel (Full Portion)", "ar": "دجاج بالبشاميل (حصة كاملة)"}'::jsonb, 390, 3),
  ('{"tr": "Sebzelili Tavuk sote (Az Porsiyon)", "en": "Sautéed Chicken with Vegetables (Half Portion)", "ar": "دجاج سوتيه بالخضار (نصف حصة)"}'::jsonb, 290, 4),
  ('{"tr": "Sebzelili Tavuk sote (Tam Porsiyon)", "en": "Sautéed Chicken with Vegetables (Full Portion)", "ar": "دجاج سوتيه بالخضار (حصة كاملة)"}'::jsonb, 390, 5),
  ('{"tr": "Zerdaçallı Tavuk (Az Porsiyon)", "en": "Turmeric Chicken (Half Portion)", "ar": "دجاج بالكركم (نصف حصة)"}'::jsonb, 290, 6),
  ('{"tr": "Zerdaçallı Tavuk (Tam Porsiyon)", "en": "Turmeric Chicken (Full Portion)", "ar": "دجاج بالكركم (حصة كاملة)"}'::jsonb, 390, 7),
  ('{"tr": "Kremalı Soya Soslu Tavuk (Az Porsiyon)", "en": "Chicken in Creamy Soy Sauce (Half Portion)", "ar": "دجاج بصلصة الصويا الكريمية (نصف حصة)"}'::jsonb, 290, 8),
  ('{"tr": "Kremalı Soya Soslu Tavuk (Tam Porsiyon)", "en": "Chicken in Creamy Soy Sauce (Full Portion)", "ar": "دجاج بصلصة الصويا الكريمية (حصة كاملة)"}'::jsonb, 390, 9),
  ('{"tr": "Tavuk Tandır (Az Porsiyon)", "en": "Tandır Chicken (Half Portion)", "ar": "دجاج تندير (نصف حصة)"}'::jsonb, 290, 10),
  ('{"tr": "Tavuk Tandır (Tam Porsiyon)", "en": "Tandır Chicken (Full Portion)", "ar": "دجاج تندير (حصة كاملة)"}'::jsonb, 390, 11)
) as v(name, price, display_order)
where r.slug = 'esnafi-lokanta';

-- ===== Menüler (4 items) =====
insert into products (restaurant_id, category_id, name, price, display_order)
select r.id, c.id, v.name, v.price, v.display_order
from restaurants r
join categories c on c.restaurant_id = r.id and c.slug = 'menuler'
cross join (values
  ('{"tr": "Zeytinyağlı Tabağı", "en": "Olive Oil Dishes Plate", "ar": "طبق أطباق زيت الزيتون"}'::jsonb, 395, 0),
  ('{"tr": "Etli Menü", "en": "Meat Set Menu", "ar": "قائمة اللحم"}'::jsonb, 595, 1),
  ('{"tr": "Sebzeli Menü", "en": "Vegetable Set Menu", "ar": "قائمة الخضار"}'::jsonb, 395, 2),
  ('{"tr": "Tavuklu Menü", "en": "Chicken Set Menu", "ar": "قائمة الدجاج"}'::jsonb, 495, 3)
) as v(name, price, display_order)
where r.slug = 'esnafi-lokanta';
