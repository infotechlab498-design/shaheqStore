export default function StoreLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 space-y-8 animate-pulse">
      <div className="h-4 w-40 rounded bg-zinc-200" />
      <div className="h-10 w-80 max-w-full rounded bg-zinc-200" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="h-80 rounded-lg border border-zinc-200 bg-white">
            <div className="aspect-square bg-zinc-100" />
            <div className="p-4 space-y-2">
              <div className="h-3 w-24 rounded bg-zinc-100" />
              <div className="h-5 w-3/4 rounded bg-zinc-100" />
              <div className="h-3 w-full rounded bg-zinc-100" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
