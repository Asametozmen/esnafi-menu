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
                className="group relative flex h-24 items-center overflow-hidden rounded-2xl border border-primary/10 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md hover:shadow-primary/10 sm:h-28"
              >
                {category.image_path && (
                  <>
                    <Image
                      src={getPublicImageUrl(category.image_path)}
                      alt=""
                      fill
                      sizes="(min-width: 640px) 33vw, 50vw"
                      className="object-cover object-right transition-transform duration-300 ease-out group-hover:scale-[1.03]"
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(90deg, rgba(255,255,255,.92) 0%, rgba(255,255,255,.70) 35%, rgba(255,255,255,.15) 100%)",
                      }}
                    />
                  </>
                )}
                <div className="relative flex flex-col gap-2 p-4">
                  <span className="block h-1 w-8 rounded-full bg-gradient-to-r from-primary to-secondary transition-all group-hover:w-12" />
                  <span className="font-medium text-neutral-900">
                    {localizedText(category.name, locale)}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
