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
    <main className="flex-1 pb-12">
      {restaurant.settings.cover_image_path && (
        <div className="relative h-48 w-full sm:h-64">
          <Image
            src={getPublicImageUrl(restaurant.settings.cover_image_path)}
            alt=""
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 px-6 py-4">
            <p className="text-lg font-semibold text-white drop-shadow-sm sm:text-xl">
              {restaurant.settings.name}
            </p>
          </div>
        </div>
      )}
      <div className="px-6 pt-8">
        <h1 className="mb-6 text-xl font-semibold text-neutral-900 dark:text-neutral-50">
          {t("categoriesTitle")}
        </h1>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
          {categories.map((category) => (
            <li key={category.id}>
              <Link
                href={`/${locale}/kategori/${category.slug}`}
                className="group flex h-24 flex-col justify-end overflow-hidden rounded-2xl border border-black/5 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md sm:h-28 dark:border-white/10 dark:bg-neutral-900"
              >
                <span className="mb-2 block h-1 w-8 rounded-full bg-primary transition-all group-hover:w-12" />
                <span className="font-medium text-neutral-900 dark:text-neutral-50">
                  {localizedText(category.name, locale)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
