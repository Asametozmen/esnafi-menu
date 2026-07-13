"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getRestaurant } from "@/lib/restaurant";
import { createClient } from "@/lib/supabase/server";
import { settingsFormSchema, WEEKDAYS } from "@/lib/validation/settings";
import { locales } from "@/lib/i18n/config";

function revalidatePublicMenu() {
  revalidatePath("/", "page");
  for (const locale of locales) {
    revalidatePath(`/${locale}`, "page");
    revalidatePath(`/${locale}/kategori/[slug]`, "page");
  }
}

function parseForm(formData: FormData) {
  return settingsFormSchema.safeParse({
    name: formData.get("name"),
    logo_path: formData.get("logo_path"),
    cover_image_path: formData.get("cover_image_path"),
    phone: formData.get("phone"),
    whatsapp: formData.get("whatsapp"),
    address: formData.get("address"),
    google_maps_url: formData.get("google_maps_url"),
    instagram_url: formData.get("instagram_url"),
    hours_mon: formData.get("hours_mon"),
    hours_tue: formData.get("hours_tue"),
    hours_wed: formData.get("hours_wed"),
    hours_thu: formData.get("hours_thu"),
    hours_fri: formData.get("hours_fri"),
    hours_sat: formData.get("hours_sat"),
    hours_sun: formData.get("hours_sun"),
    currency_code: formData.get("currency_code"),
    currency_symbol: formData.get("currency_symbol"),
    theme_primary_color: formData.get("theme_primary_color"),
    theme_secondary_color: formData.get("theme_secondary_color"),
    theme_accent_color: formData.get("theme_accent_color"),
    seo_title_tr: formData.get("seo_title_tr"),
    seo_title_en: formData.get("seo_title_en"),
    seo_title_ar: formData.get("seo_title_ar"),
    seo_title_ru: formData.get("seo_title_ru"),
    seo_description_tr: formData.get("seo_description_tr"),
    seo_description_en: formData.get("seo_description_en"),
    seo_description_ar: formData.get("seo_description_ar"),
    seo_description_ru: formData.get("seo_description_ru"),
    seo_og_image_path: formData.get("seo_og_image_path"),
    favicon_path: formData.get("favicon_path"),
  });
}

export async function updateSettings(formData: FormData) {
  const parsed = parseForm(formData);
  if (!parsed.success) {
    redirect(`/admin/settings?error=${encodeURIComponent(parsed.error.issues[0].message)}`);
  }
  const values = parsed.data;

  const restaurant = await getRestaurant();
  const supabase = await createClient();

  const workingHours = Object.fromEntries(
    WEEKDAYS.map((day) => [day.key, values[`hours_${day.key}` as const] ?? ""]),
  );

  const { data: existing } = await supabase
    .from("restaurant_settings")
    .select("logo_path, cover_image_path, seo_og_image_path, favicon_path")
    .eq("restaurant_id", restaurant.id)
    .maybeSingle();

  const { error } = await supabase
    .from("restaurant_settings")
    .update({
      name: values.name,
      logo_path: values.logo_path || null,
      cover_image_path: values.cover_image_path || null,
      phone: values.phone || null,
      whatsapp: values.whatsapp || null,
      address: values.address || null,
      google_maps_url: values.google_maps_url || null,
      instagram_url: values.instagram_url || null,
      working_hours: workingHours,
      currency_code: values.currency_code,
      currency_symbol: values.currency_symbol,
      theme_primary_color: values.theme_primary_color,
      theme_secondary_color: values.theme_secondary_color,
      theme_accent_color: values.theme_accent_color,
      seo_title: {
        tr: values.seo_title_tr ?? "",
        en: values.seo_title_en ?? "",
        ar: values.seo_title_ar ?? "",
        ru: values.seo_title_ru ?? "",
      },
      seo_description: {
        tr: values.seo_description_tr ?? "",
        en: values.seo_description_en ?? "",
        ar: values.seo_description_ar ?? "",
        ru: values.seo_description_ru ?? "",
      },
      seo_og_image_path: values.seo_og_image_path || null,
      favicon_path: values.favicon_path || null,
    })
    .eq("restaurant_id", restaurant.id);
  if (error) throw error;

  // Replacing an image deletes the old Storage object, same as product photos.
  if (existing) {
    const removed = [
      existing.logo_path !== (values.logo_path || null) ? existing.logo_path : null,
      existing.cover_image_path !== (values.cover_image_path || null) ? existing.cover_image_path : null,
      existing.seo_og_image_path !== (values.seo_og_image_path || null) ? existing.seo_og_image_path : null,
      existing.favicon_path !== (values.favicon_path || null) ? existing.favicon_path : null,
    ].filter((path): path is string => Boolean(path));
    if (removed.length > 0) {
      await supabase.storage.from("menu-images").remove(removed);
    }
  }

  revalidatePublicMenu();
  redirect("/admin/settings");
}
