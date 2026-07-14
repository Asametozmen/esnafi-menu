import type { Database } from "@/types/database";
import { ImageUploader } from "./image-uploader";

type Category = Database["public"]["Tables"]["categories"]["Row"];

export function CategoryForm({
  action,
  category,
  restaurantId,
  id,
  error,
}: {
  action: (formData: FormData) => void;
  category?: Category;
  restaurantId: string;
  id: string;
  error?: string;
}) {
  const name = (category?.name ?? {}) as Record<string, string>;

  return (
    <form action={action} className="flex max-w-lg flex-col gap-4">
      {error && (
        <p className="rounded-lg bg-red-100 px-4 py-2 text-sm text-red-700 dark:bg-red-900/40 dark:text-red-300">
          {error}
        </p>
      )}
      <input type="hidden" name="id" value={id} />
      {category && (
        <p className="text-sm text-black/60 dark:text-white/60">
          Slug: <span className="font-mono">{category.slug}</span>
        </p>
      )}
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">Arka plan görseli</span>
        <ImageUploader
          objectPathPrefix={`${restaurantId}/categories/${id}`}
          initialPath={category?.image_path}
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">Türkçe isim</span>
        <input
          type="text"
          name="name_tr"
          defaultValue={name.tr ?? ""}
          required
          className="rounded-lg border border-black/10 px-4 py-2 dark:border-white/15"
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">İngilizce isim</span>
        <input
          type="text"
          name="name_en"
          defaultValue={name.en ?? ""}
          className="rounded-lg border border-black/10 px-4 py-2 dark:border-white/15"
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">Arapça isim</span>
        <input
          type="text"
          name="name_ar"
          defaultValue={name.ar ?? ""}
          dir="rtl"
          className="rounded-lg border border-black/10 px-4 py-2 dark:border-white/15"
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">Rusça isim</span>
        <input
          type="text"
          name="name_ru"
          defaultValue={name.ru ?? ""}
          className="rounded-lg border border-black/10 px-4 py-2 dark:border-white/15"
        />
      </label>
      <label className="flex items-center gap-2">
        <input type="checkbox" name="is_active" defaultChecked={category?.is_active ?? true} />
        <span className="text-sm font-medium">Aktif (menüde görünsün)</span>
      </label>
      <button
        type="submit"
        className="self-start rounded-full bg-black px-6 py-2 font-medium text-white dark:bg-white dark:text-black"
      >
        Kaydet
      </button>
    </form>
  );
}
