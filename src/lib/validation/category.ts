import { z } from "zod";

export const categoryFormSchema = z.object({
  name_tr: z.string().trim().min(1, "Türkçe isim zorunludur"),
  name_en: z.string().trim().optional(),
  name_ar: z.string().trim().optional(),
  is_active: z.boolean(),
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;
