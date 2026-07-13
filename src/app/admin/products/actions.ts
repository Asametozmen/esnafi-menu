"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getRestaurant } from "@/lib/restaurant";
import { createClient } from "@/lib/supabase/server";
import { productFormSchema } from "@/lib/validation/product";
import { locales } from "@/lib/i18n/config";

function revalidatePublicMenu() {
  for (const locale of locales) {
    revalidatePath(`/${locale}`, "page");
    revalidatePath(`/${locale}/kategori/[slug]`, "page");
  }
}

function parseForm(formData: FormData) {
  return productFormSchema.safeParse({
    category_id: formData.get("category_id"),
    name_tr: formData.get("name_tr"),
    name_en: formData.get("name_en"),
    name_ar: formData.get("name_ar"),
    name_ru: formData.get("name_ru"),
    description_tr: formData.get("description_tr"),
    description_en: formData.get("description_en"),
    description_ar: formData.get("description_ar"),
    description_ru: formData.get("description_ru"),
    price: formData.get("price"),
    image_path: formData.get("image_path"),
    availability: formData.get("availability"),
    is_active: formData.get("is_active") === "on",
  });
}

export async function createProduct(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const parsed = parseForm(formData);
  if (!parsed.success) {
    redirect(`/admin/products/new?error=${encodeURIComponent(parsed.error.issues[0].message)}`);
  }
  const values = parsed.data;

  const restaurant = await getRestaurant();
  const supabase = await createClient();

  const { data: last } = await supabase
    .from("products")
    .select("display_order")
    .eq("category_id", values.category_id)
    .order("display_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { error } = await supabase.from("products").insert({
    id,
    restaurant_id: restaurant.id,
    category_id: values.category_id,
    name: {
      tr: values.name_tr,
      en: values.name_en ?? "",
      ar: values.name_ar ?? "",
      ru: values.name_ru ?? "",
    },
    description: {
      tr: values.description_tr ?? "",
      en: values.description_en ?? "",
      ar: values.description_ar ?? "",
      ru: values.description_ru ?? "",
    },
    price: values.price,
    image_path: values.image_path || null,
    availability: values.availability,
    is_active: values.is_active,
    display_order: (last?.display_order ?? -1) + 1,
  });
  if (error) throw error;

  revalidatePublicMenu();
  redirect("/admin/products");
}

export async function updateProduct(id: string, formData: FormData) {
  const parsed = parseForm(formData);
  if (!parsed.success) {
    redirect(`/admin/products/${id}?error=${encodeURIComponent(parsed.error.issues[0].message)}`);
  }
  const values = parsed.data;

  const restaurant = await getRestaurant();
  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("products")
    .select("image_path")
    .eq("id", id)
    .eq("restaurant_id", restaurant.id)
    .maybeSingle();

  const { error } = await supabase
    .from("products")
    .update({
      category_id: values.category_id,
      name: {
        tr: values.name_tr,
        en: values.name_en ?? "",
        ar: values.name_ar ?? "",
        ru: values.name_ru ?? "",
      },
      description: {
        tr: values.description_tr ?? "",
        en: values.description_en ?? "",
        ar: values.description_ar ?? "",
        ru: values.description_ru ?? "",
      },
      price: values.price,
      image_path: values.image_path || null,
      availability: values.availability,
      is_active: values.is_active,
    })
    .eq("id", id)
    .eq("restaurant_id", restaurant.id);
  if (error) throw error;

  // Replacing a photo deletes the old Storage object — deletion is not a DB
  // trigger here since "old" only exists at update time.
  if (existing?.image_path && existing.image_path !== values.image_path) {
    await supabase.storage.from("menu-images").remove([existing.image_path]);
  }

  revalidatePublicMenu();
  redirect("/admin/products");
}

export async function deleteProduct(id: string) {
  const restaurant = await getRestaurant();
  const supabase = await createClient();

  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", id)
    .eq("restaurant_id", restaurant.id);
  if (error) throw error;

  revalidatePublicMenu();
  revalidatePath("/admin/products");
}

export async function reorderProducts(categoryId: string, orderedIds: string[]) {
  const restaurant = await getRestaurant();
  const supabase = await createClient();

  await Promise.all(
    orderedIds.map((id, index) =>
      supabase
        .from("products")
        .update({ display_order: index })
        .eq("id", id)
        .eq("category_id", categoryId)
        .eq("restaurant_id", restaurant.id),
    ),
  );

  revalidatePublicMenu();
  revalidatePath("/admin/products");
}
