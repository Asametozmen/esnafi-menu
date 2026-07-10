import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getRestaurant } from "@/lib/restaurant";
import { getCategories, getCategoryBySlug, getProductsByCategory } from "@/lib/menu";
import { localizedText } from "@/lib/i18n/localized-content";
import { ProductCard } from "@/components/menu/product-card";
import { locales, isLocale } from "@/lib/i18n/config";

export const revalidate = 3600;

/**
 * Without this, the [slug] segment has no static-generation set to join, so
 * `revalidate` above is silently ignored and every request falls back to
 * fully dynamic rendering. Prerendering the real slugs at build time (with
 * dynamicParams left at its default true) means new categories still render
 * on first hit and get cached from there.
 */
export async function generateStaticParams() {
  const restaurant = await getRestaurant();
  const categories = await getCategories(restaurant.id);
  return locales.flatMap((locale) =>
    categories.map((category) => ({ locale, slug: category.slug })),
  );
}

export default async function CategoryProductsPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) {
    notFound();
  }
  const t = await getTranslations({ locale, namespace: "menu" });
  const restaurant = await getRestaurant();
  const category = await getCategoryBySlug(restaurant.id, slug);

  if (!category) {
    notFound();
  }

  const products = await getProductsByCategory(category.id);

  return (
    <main className="flex-1 px-6 py-8">
      <Link
        href={`/${locale}`}
        className="-ml-2 mb-4 inline-flex items-center gap-1.5 rounded-lg px-2 py-2 text-sm font-medium text-primary"
      >
        <svg
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
          className="h-4 w-4 rtl:rotate-180"
        >
          <path
            fillRule="evenodd"
            d="M17 10a.75.75 0 0 1-.75.75H5.66l4.1 3.95a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08l-4.1 3.95h10.59A.75.75 0 0 1 17 10Z"
            clipRule="evenodd"
          />
        </svg>
        {t("back")}
      </Link>
      <h1 className="mb-6 text-xl font-semibold text-neutral-900">
        {localizedText(category.name, locale)}
      </h1>
      {products.length === 0 ? (
        <p className="text-neutral-500">{t("emptyCategory")}</p>
      ) : (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              locale={locale}
              currency={restaurant.settings}
              outOfStockLabel={t("outOfStock")}
            />
          ))}
        </ul>
      )}
    </main>
  );
}
