import { signIn } from "./actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6">
      <form action={signIn} className="flex w-full max-w-sm flex-col gap-4">
        <h1 className="text-xl font-semibold">Admin Girişi</h1>
        {error && (
          <p className="rounded-lg bg-red-100 px-4 py-2 text-sm text-red-700 dark:bg-red-900/40 dark:text-red-300">
            {error}
          </p>
        )}
        <input
          type="email"
          name="email"
          placeholder="E-posta"
          required
          autoComplete="email"
          className="rounded-lg border border-black/10 px-4 py-2 dark:border-white/15"
        />
        <input
          type="password"
          name="password"
          placeholder="Şifre"
          required
          autoComplete="current-password"
          className="rounded-lg border border-black/10 px-4 py-2 dark:border-white/15"
        />
        <button
          type="submit"
          className="rounded-full bg-black px-6 py-2 font-medium text-white dark:bg-white dark:text-black"
        >
          Giriş Yap
        </button>
      </form>
    </main>
  );
}
