import type { Database } from "@/types/database";
import { WEEKDAYS } from "@/lib/validation/settings";
import { ImageUploader } from "./image-uploader";

type Settings = Database["public"]["Tables"]["restaurant_settings"]["Row"];

const inputClass =
  "rounded-lg border border-black/10 px-4 py-2 dark:border-white/15";

export function SettingsForm({
  action,
  settings,
  restaurantId,
  error,
}: {
  action: (formData: FormData) => void;
  settings: Settings;
  restaurantId: string;
  error?: string;
}) {
  const workingHours = (settings.working_hours ?? {}) as Record<string, string>;
  const seoTitle = (settings.seo_title ?? {}) as Record<string, string>;
  const seoDescription = (settings.seo_description ?? {}) as Record<string, string>;

  return (
    <form action={action} className="flex max-w-2xl flex-col gap-10">
      {error && (
        <p className="rounded-lg bg-red-100 px-4 py-2 text-sm text-red-700 dark:bg-red-900/40 dark:text-red-300">
          {error}
        </p>
      )}

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Genel &amp; Marka</h2>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Restoran adı</span>
          <input type="text" name="name" defaultValue={settings.name} required className={inputClass} />
        </label>
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium">Logo</span>
          <ImageUploader
            name="logo_path"
            objectPathPrefix={`${restaurantId}/branding/logo`}
            initialPath={settings.logo_path}
          />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium">Kapak görseli</span>
          <ImageUploader
            name="cover_image_path"
            objectPathPrefix={`${restaurantId}/branding/cover`}
            initialPath={settings.cover_image_path}
          />
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">İletişim</h2>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Telefon</span>
          <input type="text" name="phone" defaultValue={settings.phone ?? ""} className={inputClass} />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">WhatsApp</span>
          <input type="text" name="whatsapp" defaultValue={settings.whatsapp ?? ""} className={inputClass} />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Adres</span>
          <input type="text" name="address" defaultValue={settings.address ?? ""} className={inputClass} />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Google Maps URL</span>
          <input type="url" name="google_maps_url" defaultValue={settings.google_maps_url ?? ""} className={inputClass} />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Instagram URL</span>
          <input type="url" name="instagram_url" defaultValue={settings.instagram_url ?? ""} className={inputClass} />
        </label>
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium">Çalışma saatleri</span>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {WEEKDAYS.map((day) => (
              <label key={day.key} className="flex flex-col gap-1">
                <span className="text-xs text-black/60 dark:text-white/60">{day.label}</span>
                <input
                  type="text"
                  name={`hours_${day.key}`}
                  placeholder="08:00-22:00"
                  defaultValue={workingHours[day.key] ?? ""}
                  className={inputClass}
                />
              </label>
            ))}
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Para Birimi</h2>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Para birimi kodu (ISO 4217)</span>
          <input type="text" name="currency_code" defaultValue={settings.currency_code} required className={inputClass} />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Para birimi simgesi</span>
          <input type="text" name="currency_symbol" defaultValue={settings.currency_symbol} required className={inputClass} />
        </label>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Tema Renkleri</h2>
        {(
          [
            ["theme_primary_color", "Ana renk", settings.theme_primary_color],
            ["theme_secondary_color", "İkincil renk", settings.theme_secondary_color],
            ["theme_accent_color", "Vurgu rengi", settings.theme_accent_color],
          ] as const
        ).map(([field, label, value]) => (
          <label key={field} className="flex items-center gap-3">
            <span className="w-32 text-sm font-medium">{label}</span>
            <input
              type="color"
              name={field}
              defaultValue={value}
              required
              className="h-9 w-9 cursor-pointer rounded border border-black/10 dark:border-white/15"
            />
          </label>
        ))}
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">SEO</h2>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Sayfa başlığı (TR)</span>
          <input type="text" name="seo_title_tr" defaultValue={seoTitle.tr ?? ""} className={inputClass} />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Sayfa başlığı (EN)</span>
          <input type="text" name="seo_title_en" defaultValue={seoTitle.en ?? ""} className={inputClass} />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Sayfa başlığı (AR)</span>
          <input type="text" name="seo_title_ar" defaultValue={seoTitle.ar ?? ""} dir="rtl" className={inputClass} />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Sayfa başlığı (RU)</span>
          <input type="text" name="seo_title_ru" defaultValue={seoTitle.ru ?? ""} className={inputClass} />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Açıklama (TR)</span>
          <textarea name="seo_description_tr" defaultValue={seoDescription.tr ?? ""} className={inputClass} />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Açıklama (EN)</span>
          <textarea name="seo_description_en" defaultValue={seoDescription.en ?? ""} className={inputClass} />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Açıklama (AR)</span>
          <textarea name="seo_description_ar" defaultValue={seoDescription.ar ?? ""} dir="rtl" className={inputClass} />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Açıklama (RU)</span>
          <textarea name="seo_description_ru" defaultValue={seoDescription.ru ?? ""} className={inputClass} />
        </label>
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium">Open Graph görseli</span>
          <ImageUploader
            name="seo_og_image_path"
            objectPathPrefix={`${restaurantId}/branding/og`}
            initialPath={settings.seo_og_image_path}
          />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium">Favicon</span>
          <ImageUploader
            name="favicon_path"
            objectPathPrefix={`${restaurantId}/branding/favicon`}
            initialPath={settings.favicon_path}
          />
        </div>
      </section>

      <button
        type="submit"
        className="self-start rounded-full bg-black px-6 py-2 font-medium text-white dark:bg-white dark:text-black"
      >
        Kaydet
      </button>
    </form>
  );
}
