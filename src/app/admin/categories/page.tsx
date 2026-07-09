import Link from "next/link";
import { getRestaurant } from "@/lib/restaurant";
import { getAllCategoriesForAdmin } from "@/lib/menu";
import { CategoryList } from "@/components/admin/category-list";

export default async function AdminCategoriesPage() {
  const restaurant = await getRestaurant();
  const categories = await getAllCategoriesForAdmin(restaurant.id);

  return (
    <main className="flex-1 px-6 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Kategoriler</h1>
        <Link
          href="/admin/categories/new"
          className="rounded-full bg-black px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-black"
        >
          + Yeni Kategori
        </Link>
      </div>
      <CategoryList
        key={categories.map((category) => category.id).join(",")}
        categories={categories}
      />
    </main>
  );
}
