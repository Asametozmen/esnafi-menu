import Image from "next/image";
import Link from "next/link";
import { locales, type Locale } from "@/lib/i18n/config";
import { getRestaurant } from "@/lib/restaurant";
import { getPublicImageUrl } from "@/lib/supabase/storage";

const LANGUAGE_LABELS: Record<Locale, string> = {
  tr: "Türkçe",
  en: "English",
  ar: "العربية",
  ru: "Русский",
};

export default async function LanguageSelectPage() {
  const restaurant = await getRestaurant();

  return (
    <main className="brand-glow flex flex-1 flex-col items-center justify-center gap-10 px-6 py-16 text-center">
      {restaurant.settings.logo_path ? (
        <Image
          src={getPublicImageUrl(restaurant.settings.logo_path)}
          alt={restaurant.settings.name}
          width={280}
          height={280}
          priority
          className="h-auto w-56 sm:w-64"
        />
      ) : (
        <h1 className="text-2xl font-semibold text-neutral-900">{restaurant.settings.name}</h1>
      )}
      <ul className="flex w-full max-w-xs flex-col gap-3">
        {locales.map((locale) => (
          <li key={locale}>
            <Link
              href={`/${locale}`}
              className="block w-full rounded-full bg-primary px-6 py-3.5 text-lg font-medium text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-secondary/25 hover:brightness-110 active:scale-[0.98]"
            >
              {LANGUAGE_LABELS[locale]}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
