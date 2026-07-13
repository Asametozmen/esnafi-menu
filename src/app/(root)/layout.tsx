import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { getRestaurant } from "@/lib/restaurant";
import { getPublicImageUrl } from "@/lib/supabase/storage";
import { defaultLocale, type Locale } from "@/lib/i18n/config";
import { InstagramButton } from "@/components/menu/instagram-button";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const restaurant = await getRestaurant();
  const seoTitle = (restaurant.settings.seo_title as Partial<Record<Locale, string>> | null) ?? {};
  const seoDescription =
    (restaurant.settings.seo_description as Partial<Record<Locale, string>> | null) ?? {};
  const title = seoTitle[defaultLocale] || restaurant.settings.name;
  const description = seoDescription[defaultLocale] || undefined;
  const ogImage = restaurant.settings.seo_og_image_path
    ? getPublicImageUrl(restaurant.settings.seo_og_image_path)
    : undefined;

  return {
    title,
    description,
    openGraph: { title, description, images: ogImage ? [ogImage] : undefined },
    icons: restaurant.settings.favicon_path
      ? { icon: getPublicImageUrl(restaurant.settings.favicon_path) }
      : undefined,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const restaurant = await getRestaurant();

  return (
    <html
      lang="tr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      style={
        {
          "--brand-primary": restaurant.settings.theme_primary_color,
          "--brand-secondary": restaurant.settings.theme_secondary_color,
          "--brand-accent": restaurant.settings.theme_accent_color,
        } as React.CSSProperties
      }
    >
      <body className="flex min-h-full flex-col bg-white">
        {children}
        {restaurant.settings.instagram_url && (
          <InstagramButton url={restaurant.settings.instagram_url} />
        )}
      </body>
    </html>
  );
}
