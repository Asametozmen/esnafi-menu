import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { getRestaurant } from "@/lib/restaurant";
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
      <body className="flex min-h-full flex-col bg-white">{children}</body>
    </html>
  );
}
