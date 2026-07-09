import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getRestaurant } from "@/lib/restaurant";
import { getCategoryBySlug, getProductsByCategory } from "@/lib/menu";
import { localizedText } from "@/lib/i18n/localized-content";
import { ProductCard } from "@/components/menu/product-card";
import { isLocale } from "@/lib/i18n/config";

export const revalidate = 3600;

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
        className="mb-6 inline-block text-sm font-medium underline"
      >
        {t("back")}
      </Link>
      <h1 className="mb-6 text-2xl font-semibold">
        {localizedText(category.name, locale)}
      </h1>
      {products.length === 0 ? (
        <p className="text-black/60 dark:text-white/60">{t("emptyCategory")}</p>
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
