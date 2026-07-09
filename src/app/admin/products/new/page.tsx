import { randomUUID } from "crypto";
import Link from "next/link";
import { getRestaurant } from "@/lib/restaurant";
import { getAllCategoriesForAdmin } from "@/lib/menu";
import { ProductForm } from "@/components/admin/product-form";
import { createProduct } from "../actions";

export default async function NewProductPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const restaurant = await getRestaurant();
  const categories = await getAllCategoriesForAdmin(restaurant.id);
  const id = randomUUID();

  return (
    <main className="flex-1 px-6 py-8">
      <Link
        href="/admin/products"
        className="mb-6 inline-block text-sm font-medium underline"
      >
        Geri
      </Link>
      <h1 className="mb-6 text-xl font-semibold">Yeni Ürün</h1>
      <ProductForm
        action={createProduct}
        categories={categories}
        restaurantId={restaurant.id}
        id={id}
        error={error}
      />
    </main>
  );
}
