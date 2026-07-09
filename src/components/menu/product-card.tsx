import Image from "next/image";
import { formatPrice } from "@/lib/currency";
import { getPublicImageUrl } from "@/lib/supabase/storage";
import { localizedText } from "@/lib/i18n/localized-content";
import type { Locale } from "@/lib/i18n/config";
import type { Database } from "@/types/database";

type Product = Database["public"]["Tables"]["products"]["Row"];
type RestaurantSettings = Database["public"]["Tables"]["restaurant_settings"]["Row"];

export function ProductCard({
  product,
  locale,
  currency,
  outOfStockLabel,
}: {
  product: Product;
  locale: Locale;
  currency: Pick<RestaurantSettings, "currency_code" | "currency_symbol">;
  outOfStockLabel: string;
}) {
  const isOutOfStock = product.availability === "out_of_stock";
  const name = localizedText(product.name, locale);

  return (
    <li className="flex gap-4 rounded-2xl border border-black/5 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-neutral-900">
      {product.image_path ? (
        <Image
          src={getPublicImageUrl(product.image_path)}
          alt={name}
          width={80}
          height={80}
          className="h-20 w-20 shrink-0 rounded-xl object-cover"
        />
      ) : (
        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-neutral-100 dark:bg-neutral-800">
          <span className="text-lg font-semibold text-neutral-300 dark:text-neutral-600">
            {name.charAt(0)}
          </span>
        </div>
      )}
      <div className="flex flex-1 flex-col gap-1">
        <div className="flex items-start justify-between gap-2">
          <h2 className="font-medium text-neutral-900 dark:text-neutral-50">{name}</h2>
          {isOutOfStock && (
            <span className="shrink-0 rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-600 dark:bg-red-900/40 dark:text-red-300">
              {outOfStockLabel}
            </span>
          )}
        </div>
        {product.description && (
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {localizedText(product.description, locale)}
          </p>
        )}
        <span className="mt-auto font-semibold text-primary">
          {formatPrice(product.price, currency)}
        </span>
      </div>
    </li>
  );
}
