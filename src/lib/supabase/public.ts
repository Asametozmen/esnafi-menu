import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

/**
 * Cookie-free client for the public menu's RLS-open reads (restaurants,
 * restaurant_settings, active categories/products). The cookie-bound client
 * in server.ts calls `cookies()`, which forces Next.js to opt the whole
 * route out of static rendering — this client avoids that so `/[locale]`
 * and `/[locale]/kategori/[slug]` can actually be served from the ISR cache
 * instead of hitting the database on every request.
 */
export function createPublicClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
