export default function GenerateLoading() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-10 space-y-6">
      <div className="animate-pulse rounded-lg border border-gray-800 p-4">
        <div className="h-5 w-56 rounded bg-gray-800 mb-4" />
        <div className="h-10 rounded bg-gray-800" />
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="animate-pulse rounded-lg border border-gray-800 p-4 bg-gray-900 space-y-3">
            <div className="h-5 w-3/5 rounded bg-gray-800" />
            <div className="h-4 w-full rounded bg-gray-800" />
            <div className="h-4 w-2/3 rounded bg-gray-800" />
            <div className="h-4 w-1/3 rounded bg-gray-800" />
          </div>
        ))}
      </div>
    </div>
  )
}
