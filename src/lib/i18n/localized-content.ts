import type { Json } from "@/types/database";
import type { Locale } from "./config";

/** TR is the fallback locale for menu content (category/product name & description). */
export function localizedText(value: Json | null | undefined, locale: Locale): string {
  if (!value || typeof value !== "object" || Array.isArray(value)) return "";

  const record = value as Record<string, Json | undefined>;
  const localized = record[locale];
  if (typeof localized === "string" && localized.trim() !== "") return localized;

  const fallback = record.tr;
  return typeof fallback === "string" ? fallback : "";
}
