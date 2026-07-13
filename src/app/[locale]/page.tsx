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
        <div className="brand-glow flex w-full items-center justify-center px-6 py-10 sm:py-14">
          <Image
            src={getPublicImageUrl(restaurant.settings.cover_image_path)}
            alt={restaurant.settings.name}
            width={2780}
            height={530}
            priority
            className="h-auto w-full max-w-xs sm:max-w-md"
          />
        </div>
      )}
      <div className="px-6 pt-8">
        <h1 className="mb-6 text-xl font-semibold text-neutral-900">
          {t("categoriesTitle")}
        </h1>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
          {categories.map((category) => (
            <li key={category.id}>
              <Link
                href={`/${locale}/kategori/${category.slug}`}
                className="group flex h-24 flex-col justify-end overflow-hidden rounded-2xl border border-primary/10 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md hover:shadow-primary/10 sm:h-28"
              >
                <span className="mb-2 block h-1 w-8 rounded-full bg-gradient-to-r from-primary to-secondary transition-all group-hover:w-12" />
                <span className="font-medium text-neutral-900">
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
