export interface CurrencySettings {
  currency_code: string;
  currency_symbol: string;
}

/**
 * The only place a currency symbol is rendered. Prices are stored as plain
 * decimals with no currency baked in; the symbol/code come from
 * `restaurant_settings` and are applied here at render time.
 *
 * Postgres `numeric` columns come back from Supabase as strings (to avoid
 * float precision loss), so this accepts both.
 */
export function formatPrice(price: number | string, settings: CurrencySettings): string {
  const value = typeof price === "string" ? parseFloat(price) : price;
  return `${value.toFixed(2)} ${settings.currency_symbol}`;
}
