export default function Loading() {
  return (
    <main className="flex-1 pb-12">
      <div className="h-48 w-full animate-pulse bg-neutral-100 sm:h-64 dark:bg-neutral-900" />
      <div className="px-6 pt-8">
        <div className="mb-6 h-7 w-40 animate-pulse rounded-lg bg-neutral-100 dark:bg-neutral-900" />
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
          {Array.from({ length: 9 }).map((_, i) => (
            <li
              key={i}
              className="h-24 animate-pulse rounded-2xl bg-neutral-100 sm:h-28 dark:bg-neutral-900"
            />
          ))}
        </ul>
      </div>
    </main>
  );
}
