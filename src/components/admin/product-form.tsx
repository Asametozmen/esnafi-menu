import type { Database } from "@/types/database";
import { ImageUploader } from "./image-uploader";

type Product = Database["public"]["Tables"]["products"]["Row"];
type Category = Database["public"]["Tables"]["categories"]["Row"];

export function ProductForm({
  action,
  categories,
  product,
  restaurantId,
  id,
  error,
}: {
  action: (formData: FormData) => void;
  categories: Category[];
  product?: Product;
  restaurantId: string;
  id: string;
  error?: string;
}) {
  const name = (product?.name ?? {}) as Record<string, string>;
  const description = (product?.description ?? {}) as Record<string, string>;

  return (
    <form action={action} className="flex max-w-lg flex-col gap-4">
      {error && (
        <p className="rounded-lg bg-red-100 px-4 py-2 text-sm text-red-700 dark:bg-red-900/40 dark:text-red-300">
          {error}
        </p>
      )}

      <input type="hidden" name="id" value={id} />

      <ImageUploader
        objectPathPrefix={`${restaurantId}/products/${id}`}
        initialPath={product?.image_path}
      />

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">Kategori</span>
        <select
          name="category_id"
          defaultValue={product?.category_id ?? ""}
          required
          className="rounded-lg border border-black/10 px-4 py-2 dark:border-white/15"
        >
          <option value="" disabled>
            Seçiniz
          </option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {(category.name as Record<string, string> | null)?.tr ?? category.slug}
            </option>
          ))}
        </select>
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
        <span className="text-sm font-medium">Türkçe açıklama</span>
        <textarea
          name="description_tr"
          defaultValue={description.tr ?? ""}
          className="rounded-lg border border-black/10 px-4 py-2 dark:border-white/15"
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">İngilizce açıklama</span>
        <textarea
          name="description_en"
          defaultValue={description.en ?? ""}
          className="rounded-lg border border-black/10 px-4 py-2 dark:border-white/15"
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">Arapça açıklama</span>
        <textarea
          name="description_ar"
          defaultValue={description.ar ?? ""}
          dir="rtl"
          className="rounded-lg border border-black/10 px-4 py-2 dark:border-white/15"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">Fiyat</span>
        <input
          type="number"
          name="price"
          step="0.01"
          min="0"
          defaultValue={product?.price ?? ""}
          required
          className="rounded-lg border border-black/10 px-4 py-2 dark:border-white/15"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">Durum</span>
        <select
          name="availability"
          defaultValue={product?.availability ?? "available"}
          className="rounded-lg border border-black/10 px-4 py-2 dark:border-white/15"
        >
          <option value="available">Mevcut</option>
          <option value="out_of_stock">Tükendi</option>
        </select>
      </label>

      <label className="flex items-center gap-2">
        <input type="checkbox" name="is_active" defaultChecked={product?.is_active ?? true} />
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
