"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, type Locale } from "@/lib/i18n/config";

const LANGUAGE_LABELS: Record<Locale, string> = {
  tr: "TR",
  en: "EN",
  ar: "AR",
};

export function LanguageSwitcher({
  locale,
  label,
}: {
  locale: Locale;
  label: string;
}) {
  const pathname = usePathname();

  return (
    <nav aria-label={label} className="flex gap-2 text-sm font-medium">
      {locales.map((target) => {
        if (target === locale) {
          return (
            <span
              key={target}
              className="rounded-full bg-black/10 px-3 py-1 dark:bg-white/15"
            >
              {LANGUAGE_LABELS[target]}
            </span>
          );
        }

        const segments = pathname.split("/");
        segments[1] = target;

        return (
          <Link
            key={target}
            href={segments.join("/") || "/"}
            className="rounded-full px-3 py-1 transition-colors hover:bg-black/5 dark:hover:bg-white/10"
          >
            {LANGUAGE_LABELS[target]}
          </Link>
        );
      })}
    </nav>
  );
}
