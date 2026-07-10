"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, type Locale } from "@/lib/i18n/config";

const LANGUAGE_LABELS: Record<Locale, string> = {
  tr: "TR",
  en: "EN",
  ar: "عربي",
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
              aria-current="true"
              className="rounded-full bg-primary px-3.5 py-2.5 text-white"
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
            className="rounded-full px-3.5 py-2.5 text-neutral-500 transition-colors hover:bg-primary/10 hover:text-primary"
          >
            {LANGUAGE_LABELS[target]}
          </Link>
        );
      })}
    </nav>
  );
}
