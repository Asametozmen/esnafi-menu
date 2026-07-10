import Link from "next/link";
import { getRestaurant } from "@/lib/restaurant";
import { getAllCategoriesForAdmin, getAllProductsForAdmin } from "@/lib/menu";
import { ProductsBrowser } from "@/components/admin/products-browser";

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
      <ProductsBrowser categories={categories} products={products} currency={restaurant.settings} />
    </main>
  );
}
