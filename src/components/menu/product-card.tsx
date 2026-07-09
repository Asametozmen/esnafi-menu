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

  return (
    <li className="flex gap-4 rounded-2xl border border-black/10 p-4 dark:border-white/15">
      {product.image_path && (
        <Image
          src={getPublicImageUrl(product.image_path)}
          alt={localizedText(product.name, locale)}
          width={80}
          height={80}
          className="h-20 w-20 shrink-0 rounded-xl object-cover"
        />
      )}
      <div className="flex flex-1 flex-col gap-1">
        <div className="flex items-start justify-between gap-2">
          <h2 className="font-medium">{localizedText(product.name, locale)}</h2>
          {isOutOfStock && (
            <span className="shrink-0 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700 dark:bg-red-900/40 dark:text-red-300">
              {outOfStockLabel}
            </span>
          )}
        </div>
        {product.description && (
          <p className="text-sm text-black/60 dark:text-white/60">
            {localizedText(product.description, locale)}
          </p>
        )}
        <span className="mt-auto font-medium">
          {formatPrice(product.price, currency)}
        </span>
      </div>
    </li>
  );
}
