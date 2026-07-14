import { randomUUID } from "crypto";
import Link from "next/link";
import { getRestaurant } from "@/lib/restaurant";
import { CategoryForm } from "@/components/admin/category-form";
import { createCategory } from "../actions";

export default async function NewCategoryPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const restaurant = await getRestaurant();
  const id = randomUUID();

  return (
    <main className="flex-1 px-6 py-8">
      <Link
        href="/admin/categories"
        className="mb-6 inline-block text-sm font-medium underline"
      >
        Geri
      </Link>
      <h1 className="mb-6 text-xl font-semibold">Yeni Kategori</h1>
      <CategoryForm action={createCategory} restaurantId={restaurant.id} id={id} error={error} />
    </main>
  );
}
