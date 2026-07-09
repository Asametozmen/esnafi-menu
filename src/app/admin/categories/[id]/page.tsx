import Link from "next/link";
import { notFound } from "next/navigation";
import { getRestaurant } from "@/lib/restaurant";
import { getCategoryById } from "@/lib/menu";
import { CategoryForm } from "@/components/admin/category-form";
import { updateCategory } from "../actions";

export default async function EditCategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;
  const restaurant = await getRestaurant();
  const category = await getCategoryById(restaurant.id, id);

  if (!category) {
    notFound();
  }

  return (
    <main className="flex-1 px-6 py-8">
      <Link
        href="/admin/categories"
        className="mb-6 inline-block text-sm font-medium underline"
      >
        Geri
      </Link>
      <h1 className="mb-6 text-xl font-semibold">Kategoriyi Düzenle</h1>
      <CategoryForm
        action={updateCategory.bind(null, category.id)}
        category={category}
        error={error}
      />
    </main>
  );
}
