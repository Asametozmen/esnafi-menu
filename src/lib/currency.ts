export interface CurrencySettings {
  currency_code: string;
  currency_symbol: string;
}

/**
 * The only place a currency symbol is rendered. Prices are stored as plain
 * decimals with no currency baked in; the symbol/code come from
 * `restaurant_settings` and are applied here at render time.
 */
export function formatPrice(price: number, settings: CurrencySettings): string {
  return `${price.toFixed(2)} ${settings.currency_symbol}`;
}
