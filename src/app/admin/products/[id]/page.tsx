import Link from "next/link";
import { notFound } from "next/navigation";
import { getRestaurant } from "@/lib/restaurant";
import { getAllCategoriesForAdmin, getProductById } from "@/lib/menu";
import { ProductForm } from "@/components/admin/product-form";
import { updateProduct } from "../actions";

export default async function EditProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;
  const restaurant = await getRestaurant();
  const [categories, product] = await Promise.all([
    getAllCategoriesForAdmin(restaurant.id),
    getProductById(restaurant.id, id),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <main className="flex-1 px-6 py-8">
      <Link
        href="/admin/products"
        className="mb-6 inline-block text-sm font-medium underline"
      >
        Geri
      </Link>
      <h1 className="mb-6 text-xl font-semibold">Ürünü Düzenle</h1>
      <ProductForm
        action={updateProduct.bind(null, product.id)}
        categories={categories}
        product={product}
        restaurantId={restaurant.id}
        id={product.id}
        error={error}
      />
    </main>
  );
}
