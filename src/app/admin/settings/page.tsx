import Link from "next/link";
import { getRestaurant } from "@/lib/restaurant";
import { SettingsForm } from "@/components/admin/settings-form";
import { updateSettings } from "./actions";

export default async function AdminSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const restaurant = await getRestaurant();

  return (
    <main className="flex-1 px-6 py-8">
      <Link href="/admin" className="mb-6 inline-block text-sm font-medium underline">
        Geri
      </Link>
      <h1 className="mb-6 text-xl font-semibold">Restoran Ayarları</h1>
      <SettingsForm
        action={updateSettings}
        settings={restaurant.settings}
        restaurantId={restaurant.id}
        error={error}
      />
    </main>
  );
}
