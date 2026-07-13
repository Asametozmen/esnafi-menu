import { z } from "zod";

const hexColor = z.string().trim().regex(/^#[0-9a-fA-F]{6}$/, "Geçerli bir hex renk girin (örn. #8B1E1E)");

export const settingsFormSchema = z.object({
  name: z.string().trim().min(1, "Restoran adı zorunludur"),
  logo_path: z.string().optional(),
  cover_image_path: z.string().optional(),

  phone: z.string().trim().optional(),
  whatsapp: z.string().trim().optional(),
  address: z.string().trim().optional(),
  google_maps_url: z.string().trim().optional(),
  instagram_url: z.string().trim().optional(),
  hours_mon: z.string().trim().optional(),
  hours_tue: z.string().trim().optional(),
  hours_wed: z.string().trim().optional(),
  hours_thu: z.string().trim().optional(),
  hours_fri: z.string().trim().optional(),
  hours_sat: z.string().trim().optional(),
  hours_sun: z.string().trim().optional(),

  currency_code: z.string().trim().min(1, "Para birimi kodu zorunludur"),
  currency_symbol: z.string().trim().min(1, "Para birimi simgesi zorunludur"),

  theme_primary_color: hexColor,
  theme_secondary_color: hexColor,
  theme_accent_color: hexColor,

  seo_title_tr: z.string().trim().optional(),
  seo_title_en: z.string().trim().optional(),
  seo_title_ar: z.string().trim().optional(),
  seo_title_ru: z.string().trim().optional(),
  seo_description_tr: z.string().trim().optional(),
  seo_description_en: z.string().trim().optional(),
  seo_description_ar: z.string().trim().optional(),
  seo_description_ru: z.string().trim().optional(),
  seo_og_image_path: z.string().optional(),
  favicon_path: z.string().optional(),
});

export type SettingsFormValues = z.infer<typeof settingsFormSchema>;

export const WEEKDAYS = [
  { key: "mon", label: "Pazartesi" },
  { key: "tue", label: "Salı" },
  { key: "wed", label: "Çarşamba" },
  { key: "thu", label: "Perşembe" },
  { key: "fri", label: "Cuma" },
  { key: "sat", label: "Cumartesi" },
  { key: "sun", label: "Pazar" },
] as const;
