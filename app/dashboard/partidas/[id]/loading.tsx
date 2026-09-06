export default function LoadingPartidaPage() {
  return (
    <main className="flex-1 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto w-full max-w-6xl animate-pulse">
        <div className="mb-6">
          <div className="h-4 w-40 rounded bg-slate-200" />
          <div className="mt-4 h-8 w-72 rounded bg-slate-200" />
          <div className="mt-2 h-4 w-80 rounded bg-slate-200" />
        </div>

        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-6">
            <div className="h-5 w-24 rounded bg-slate-200" />
          </div>
          <div className="grid gap-4 p-6 sm:grid-cols-2">
            <div className="h-28 rounded-lg bg-slate-100" />
            <div className="h-28 rounded-lg bg-slate-100" />
          </div>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-28 rounded-xl bg-slate-100" />
          ))}
        </div>
      </div>
    </main>
  );
}
