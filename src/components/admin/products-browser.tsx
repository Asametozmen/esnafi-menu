"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Database } from "@/types/database";
import { formatPrice, type CurrencySettings } from "@/lib/currency";
import { deleteProduct } from "@/app/admin/products/actions";
import { ProductList } from "@/components/admin/product-list";

type Product = Database["public"]["Tables"]["products"]["Row"];
type Category = Database["public"]["Tables"]["categories"]["Row"];

function productMatches(product: Product, query: string): boolean {
  const name = product.name as Record<string, string> | null;
  const haystack = [name?.tr, name?.en, name?.ar].filter(Boolean).join(" ").toLocaleLowerCase("tr");
  return haystack.includes(query);
}

function SearchResultRow({
  product,
  categoryName,
  currency,
}: {
  product: Product;
  categoryName: string;
  currency: CurrencySettings;
}) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const name = (product.name as Record<string, string> | null)?.tr ?? "";

  async function handleDelete() {
    if (!confirm(`"${name}" ürününü silmek istediğine emin misin?`)) {
      return;
    }
    setIsPending(true);
    await deleteProduct(product.id);
    router.refresh();
  }

  return (
    <li className="flex items-center gap-3 rounded-xl border border-black/10 bg-white px-4 py-3 dark:border-white/15 dark:bg-black">
      <span className="flex-1">
        <span className="font-medium">{name}</span>
        <span className="ml-2 text-xs text-black/50 dark:text-white/50">{categoryName}</span>
      </span>
      <span className="text-sm text-black/60 dark:text-white/60">
        {formatPrice(product.price, currency)}
      </span>
      {product.availability === "out_of_stock" && (
        <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700 dark:bg-red-900/40 dark:text-red-300">
          Tükendi
        </span>
      )}
      {!product.is_active && (
        <span className="rounded-full bg-black/10 px-2 py-0.5 text-xs dark:bg-white/15">
          Pasif
        </span>
      )}
      <Link href={`/admin/products/${product.id}`} className="text-sm font-medium underline">
        Düzenle
      </Link>
      <button
        type="button"
        onClick={handleDelete}
        disabled={isPending}
        className="text-sm font-medium text-red-600 underline disabled:opacity-50 dark:text-red-400"
      >
        Sil
      </button>
    </li>
  );
}

export function ProductsBrowser({
  categories,
  products,
  currency,
}: {
  categories: Category[];
  products: Product[];
  currency: CurrencySettings;
}) {
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLocaleLowerCase("tr");

  const categoryNames = useMemo(() => {
    const map = new Map<string, string>();
    for (const category of categories) {
      map.set(category.id, (category.name as Record<string, string> | null)?.tr ?? category.slug);
    }
    return map;
  }, [categories]);

  const searchResults = useMemo(() => {
    if (!normalizedQuery) return [];
    return products.filter((product) => productMatches(product, normalizedQuery));
  }, [products, normalizedQuery]);

  return (
    <div className="flex flex-col gap-6">
      <input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Ürün ara..."
        className="w-full max-w-sm rounded-lg border border-black/10 px-4 py-2 dark:border-white/15"
      />

      {normalizedQuery ? (
        searchResults.length === 0 ? (
          <p className="text-sm text-black/60 dark:text-white/60">Eşleşen ürün bulunamadı.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {searchResults.map((product) => (
              <SearchResultRow
                key={product.id}
                product={product}
                categoryName={categoryNames.get(product.category_id) ?? ""}
                currency={currency}
              />
            ))}
          </ul>
        )
      ) : (
        <div className="flex flex-col gap-8">
          {categories.map((category) => {
            const categoryProducts = products.filter(
              (product) => product.category_id === category.id,
            );
            return (
              <section key={category.id}>
                <h2 className="mb-3 font-medium">{categoryNames.get(category.id)}</h2>
                {categoryProducts.length === 0 ? (
                  <p className="text-sm text-black/60 dark:text-white/60">
                    Bu kategoride ürün yok.
                  </p>
                ) : (
                  <ProductList
                    key={categoryProducts.map((product) => product.id).join(",")}
                    categoryId={category.id}
                    products={categoryProducts}
                    currency={currency}
                  />
                )}
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
