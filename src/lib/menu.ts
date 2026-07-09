import { createClient } from "@/lib/supabase/server";

export async function getCategories(restaurantId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("restaurant_id", restaurantId)
    .eq("is_active", true)
    .order("display_order");
  if (error) throw error;
  return data;
}

/** Admin views need inactive/draft rows too, unlike the public menu. */
export async function getAllCategoriesForAdmin(restaurantId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("restaurant_id", restaurantId)
    .order("display_order");
  if (error) throw error;
  return data;
}

export async function getCategoryBySlug(restaurantId: string, slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("restaurant_id", restaurantId)
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function getCategoryById(restaurantId: string, id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("restaurant_id", restaurantId)
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function getProductsByCategory(categoryId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("category_id", categoryId)
    .eq("is_active", true)
    .order("display_order");
  if (error) throw error;
  return data;
}

/** Admin views need inactive/draft rows too, unlike the public menu. */
export async function getAllProductsForAdmin(restaurantId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("restaurant_id", restaurantId)
    .order("display_order");
  if (error) throw error;
  return data;
}

export async function getProductById(restaurantId: string, id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("restaurant_id", restaurantId)
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data;
}
