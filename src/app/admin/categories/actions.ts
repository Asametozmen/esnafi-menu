"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getRestaurant } from "@/lib/restaurant";
import { createClient } from "@/lib/supabase/server";
import { categoryFormSchema } from "@/lib/validation/category";
import { locales } from "@/lib/i18n/config";

function revalidatePublicMenu() {
  for (const locale of locales) {
    revalidatePath(`/${locale}`, "page");
    revalidatePath(`/${locale}/kategori/[slug]`, "page");
  }
}

function parseForm(formData: FormData) {
  return categoryFormSchema.safeParse({
    name_tr: formData.get("name_tr"),
    name_en: formData.get("name_en"),
    name_ar: formData.get("name_ar"),
    is_active: formData.get("is_active") === "on",
  });
}

export async function createCategory(formData: FormData) {
  const parsed = parseForm(formData);
  if (!parsed.success) {
    redirect(
      `/admin/categories/new?error=${encodeURIComponent(parsed.error.issues[0].message)}`,
    );
  }
  const values = parsed.data;

  const restaurant = await getRestaurant();
  const supabase = await createClient();

  const { data: last } = await supabase
    .from("categories")
    .select("display_order")
    .eq("restaurant_id", restaurant.id)
    .order("display_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { error } = await supabase.from("categories").insert({
    restaurant_id: restaurant.id,
    name: { tr: values.name_tr, en: values.name_en ?? "", ar: values.name_ar ?? "" },
    is_active: values.is_active,
    display_order: (last?.display_order ?? -1) + 1,
  });
  if (error) throw error;

  revalidatePublicMenu();
  redirect("/admin/categories");
}

export async function updateCategory(id: string, formData: FormData) {
  const parsed = parseForm(formData);
  if (!parsed.success) {
    redirect(`/admin/categories/${id}?error=${encodeURIComponent(parsed.error.issues[0].message)}`);
  }
  const values = parsed.data;

  const restaurant = await getRestaurant();
  const supabase = await createClient();

  const { error } = await supabase
    .from("categories")
    .update({
      name: { tr: values.name_tr, en: values.name_en ?? "", ar: values.name_ar ?? "" },
      is_active: values.is_active,
    })
    .eq("id", id)
    .eq("restaurant_id", restaurant.id);
  if (error) throw error;

  revalidatePublicMenu();
  redirect("/admin/categories");
}

export async function deleteCategory(id: string) {
  const restaurant = await getRestaurant();
  const supabase = await createClient();

  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("id", id)
    .eq("restaurant_id", restaurant.id);
  if (error) throw error;

  revalidatePublicMenu();
  revalidatePath("/admin/categories");
}

export async function reorderCategories(orderedIds: string[]) {
  const restaurant = await getRestaurant();
  const supabase = await createClient();

  await Promise.all(
    orderedIds.map((id, index) =>
      supabase
        .from("categories")
        .update({ display_order: index })
        .eq("id", id)
        .eq("restaurant_id", restaurant.id),
    ),
  );

  revalidatePublicMenu();
  revalidatePath("/admin/categories");
}
