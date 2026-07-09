import { z } from "zod";

export const productFormSchema = z.object({
  category_id: z.string().min(1, "Kategori seçimi zorunludur"),
  name_tr: z.string().trim().min(1, "Türkçe isim zorunludur"),
  name_en: z.string().trim().optional(),
  name_ar: z.string().trim().optional(),
  description_tr: z.string().trim().optional(),
  description_en: z.string().trim().optional(),
  description_ar: z.string().trim().optional(),
  price: z.coerce.number().positive("Fiyat pozitif bir sayı olmalı"),
  image_path: z.string().optional(),
  availability: z.enum(["available", "out_of_stock"]),
  is_active: z.boolean(),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;
