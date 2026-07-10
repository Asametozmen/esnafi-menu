export default function Loading() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-10 bg-white px-6 py-16 text-center">
      <div className="h-24 w-56 animate-pulse rounded-xl bg-neutral-100 sm:w-64" />
      <ul className="flex w-full max-w-xs flex-col gap-3">
        {[0, 1, 2].map((i) => (
          <li key={i} className="h-[52px] animate-pulse rounded-full bg-neutral-100" />
        ))}
      </ul>
    </main>
  );
}
