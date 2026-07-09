import Image from "next/image";
import Link from "next/link";
import { locales, type Locale } from "@/lib/i18n/config";
import { getRestaurant } from "@/lib/restaurant";
import { getPublicImageUrl } from "@/lib/supabase/storage";

const LANGUAGE_LABELS: Record<Locale, string> = {
  tr: "Türkçe",
  en: "English",
  ar: "العربية",
};

export default async function LanguageSelectPage() {
  const restaurant = await getRestaurant();

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-8 px-6 text-center">
      {restaurant.settings.logo_path ? (
        <Image
          src={getPublicImageUrl(restaurant.settings.logo_path)}
          alt={restaurant.settings.name}
          width={220}
          height={220}
          priority
          className="h-auto w-48"
        />
      ) : (
        <h1 className="text-2xl font-semibold">{restaurant.settings.name}</h1>
      )}
      <ul className="flex w-full max-w-xs flex-col gap-4">
        {locales.map((locale) => (
          <li key={locale}>
            <Link
              href={`/${locale}`}
              className="block w-full rounded-full border border-black/10 px-6 py-3 text-lg font-medium transition-colors hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/10"
            >
              {LANGUAGE_LABELS[locale]}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
