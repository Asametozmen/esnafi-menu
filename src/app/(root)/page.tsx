import Link from "next/link";
import { locales, type Locale } from "@/lib/i18n/config";

const LANGUAGE_LABELS: Record<Locale, string> = {
  tr: "Türkçe",
  en: "English",
  ar: "العربية",
};

export default function LanguageSelectPage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-8 px-6 text-center">
      <h1 className="text-2xl font-semibold">ESNAFİ LOKANTA</h1>
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
