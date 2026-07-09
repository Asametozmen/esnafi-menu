import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getRestaurant } from "@/lib/restaurant";
import { getCategories } from "@/lib/menu";
import { localizedText } from "@/lib/i18n/localized-content";
import { isLocale } from "@/lib/i18n/config";
import { getPublicImageUrl } from "@/lib/supabase/storage";

export const revalidate = 3600;

export default async function CategoriesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    notFound();
  }
  const t = await getTranslations({ locale, namespace: "menu" });
  const restaurant = await getRestaurant();
  const categories = await getCategories(restaurant.id);

  return (
    <main className="flex-1 pb-8">
      {restaurant.settings.cover_image_path && (
        <div className="relative mb-6 h-40 w-full sm:h-56">
          <Image
            src={getPublicImageUrl(restaurant.settings.cover_image_path)}
            alt={restaurant.settings.name}
            fill
            priority
            className="object-cover"
          />
        </div>
      )}
      <h1 className="mb-6 px-6 text-2xl font-semibold">{t("categoriesTitle")}</h1>
      <ul className="grid grid-cols-2 gap-4 px-6 sm:grid-cols-3">
        {categories.map((category) => (
          <li key={category.id}>
            <Link
              href={`/${locale}/kategori/${category.slug}`}
              className="block rounded-2xl border border-black/10 px-4 py-6 text-center font-medium transition-colors hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/10"
            >
              {localizedText(category.name, locale)}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
