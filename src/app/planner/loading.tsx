export default function PlannerLoading() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-10 space-y-6">
      <div className="animate-pulse rounded-lg border border-gray-800 p-4">
        <div className="h-5 w-72 rounded bg-gray-800 mb-3" />
        <div className="flex flex-wrap gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-8 w-40 rounded bg-gray-800" />
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="rounded-lg border border-gray-800 bg-gray-900 p-4">
            <div className="h-5 w-24 rounded bg-gray-800 mx-auto mb-4" />
            <div className="space-y-3">
              <div className="h-16 rounded border border-dashed border-gray-700" />
              <div className="h-16 rounded border border-dashed border-gray-700" />
              <div className="h-16 rounded border border-dashed border-gray-700" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
