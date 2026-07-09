import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Geist, Geist_Mono } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { locales, isRtl, isLocale } from "@/lib/i18n/config";
import { LanguageSwitcher } from "@/components/menu/language-switcher";
import { getRestaurant } from "@/lib/restaurant";
import { getPublicImageUrl } from "@/lib/supabase/storage";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Esnafi Lokanta",
  description: "Esnafi Lokanta dijital menü",
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    notFound();
  }

  const t = await getTranslations({ locale, namespace: "languageSwitcher" });
  const restaurant = await getRestaurant();

  return (
    <html
      lang={locale}
      dir={isRtl(locale) ? "rtl" : "ltr"}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      style={
        {
          "--brand-primary": restaurant.settings.theme_primary_color,
          "--brand-secondary": restaurant.settings.theme_secondary_color,
          "--brand-accent": restaurant.settings.theme_accent_color,
        } as React.CSSProperties
      }
    >
      <body className="flex min-h-full flex-col bg-neutral-50 dark:bg-neutral-950">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-black/5 bg-white/90 px-4 py-3 backdrop-blur-sm sm:px-6 dark:border-white/10 dark:bg-neutral-950/90">
          <Link href={`/${locale}`} className="flex items-center gap-2">
            {restaurant.settings.logo_path ? (
              <Image
                src={getPublicImageUrl(restaurant.settings.logo_path)}
                alt={restaurant.settings.name}
                width={40}
                height={40}
                className="h-9 w-9 object-contain"
              />
            ) : null}
            <span className="text-sm font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
              {restaurant.settings.name}
            </span>
          </Link>
          <LanguageSwitcher locale={locale} label={t("label")} />
        </header>
        {children}
      </body>
    </html>
  );
}
