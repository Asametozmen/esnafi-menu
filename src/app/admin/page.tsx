import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/auth";
import { signOut } from "./actions";

export default async function AdminDashboardPage() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect("/admin/login");
  }

  return (
    <main className="flex flex-1 flex-col gap-6 px-6 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Yönetim Paneli</h1>
        <form action={signOut}>
          <button type="submit" className="text-sm font-medium underline">
            Çıkış Yap
          </button>
        </form>
      </div>
      <p className="text-black/60 dark:text-white/60">
        Hoş geldin, {admin.profile.full_name ?? admin.user.email}.
      </p>
    </main>
  );
}
