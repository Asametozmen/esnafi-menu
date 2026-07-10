export default function Loading() {
  return (
    <main className="flex-1 px-6 py-8">
      <div className="mb-4 h-8 w-16 animate-pulse rounded-lg bg-neutral-100 dark:bg-neutral-900" />
      <div className="mb-6 h-7 w-48 animate-pulse rounded-lg bg-neutral-100 dark:bg-neutral-900" />
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <li
            key={i}
            className="flex h-28 animate-pulse gap-4 rounded-2xl border border-black/5 bg-white p-4 dark:border-white/10 dark:bg-neutral-900"
          >
            <div className="h-20 w-20 shrink-0 rounded-xl bg-neutral-100 dark:bg-neutral-800" />
            <div className="flex flex-1 flex-col gap-2 pt-1">
              <div className="h-4 w-2/3 rounded bg-neutral-100 dark:bg-neutral-800" />
              <div className="h-3 w-full rounded bg-neutral-100 dark:bg-neutral-800" />
              <div className="mt-auto h-4 w-16 rounded bg-neutral-100 dark:bg-neutral-800" />
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
