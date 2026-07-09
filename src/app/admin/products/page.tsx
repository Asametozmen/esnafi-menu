import Link from "next/link";
import { getRestaurant } from "@/lib/restaurant";
import { getAllCategoriesForAdmin, getAllProductsForAdmin } from "@/lib/menu";
import { ProductList } from "@/components/admin/product-list";

export default async function AdminProductsPage() {
  const restaurant = await getRestaurant();
  const [categories, products] = await Promise.all([
    getAllCategoriesForAdmin(restaurant.id),
    getAllProductsForAdmin(restaurant.id),
  ]);

  return (
    <main className="flex-1 px-6 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Ürünler</h1>
        <Link
          href="/admin/products/new"
          className="rounded-full bg-black px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-black"
        >
          + Yeni Ürün
        </Link>
      </div>
      <div className="flex flex-col gap-8">
        {categories.map((category) => {
          const categoryProducts = products.filter(
            (product) => product.category_id === category.id,
          );
          return (
            <section key={category.id}>
              <h2 className="mb-3 font-medium">
                {(category.name as Record<string, string> | null)?.tr ?? category.slug}
              </h2>
              {categoryProducts.length === 0 ? (
                <p className="text-sm text-black/60 dark:text-white/60">
                  Bu kategoride ürün yok.
                </p>
              ) : (
                <ProductList
                  key={categoryProducts.map((product) => product.id).join(",")}
                  categoryId={category.id}
                  products={categoryProducts}
                  currency={restaurant.settings}
                />
              )}
            </section>
          );
        })}
      </div>
    </main>
  );
}
