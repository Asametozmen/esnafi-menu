import { cache } from "react";
import { createPublicClient } from "@/lib/supabase/public";

/**
 * Phase 1 has exactly one restaurant row; there's no multi-tenant routing yet,
 * so callers don't need to know its id ahead of time.
 *
 * Uses the cookie-free public client (restaurants/restaurant_settings are
 * RLS-open to anyone) so pages that only need this lookup — the public menu
 * — aren't forced into dynamic rendering just to read branding.
 */
export const getRestaurant = cache(async () => {
  const supabase = createPublicClient();

  const { data: restaurant, error: restaurantError } = await supabase
    .from("restaurants")
    .select("*")
    .single();
  if (restaurantError || !restaurant) {
    throw new Error("Restaurant not found");
  }

  const { data: settings, error: settingsError } = await supabase
    .from("restaurant_settings")
    .select("*")
    .eq("restaurant_id", restaurant.id)
    .single();
  if (settingsError || !settings) {
    throw new Error("Restaurant settings not found");
  }

  return { ...restaurant, settings };
});
