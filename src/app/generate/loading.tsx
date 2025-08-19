export default function GenerateLoading() {
  return (
    <div className="min-h-screen bg-[#0F172A] text-white">
      <main className="container mx-auto px-4 py-8">
        {/* Page Header skeleton */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-2 h-7 w-64 animate-pulse rounded bg-gray-800" />
          <div className="mx-auto h-4 w-80 animate-pulse rounded bg-gray-800/80" />
        </div>

        {/* 3-col grid like the final page */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left: sticky controls skeleton */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6 rounded-lg border border-gray-800 bg-gray-900 p-6">
              {/* title row */}
              <div className="h-5 w-40 animate-pulse rounded bg-gray-800" />

              {/* ingredient chips */}
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="h-6 w-20 animate-pulse rounded-full bg-gray-800" />
                ))}
              </div>

              {/* textarea */}
              <div className="h-24 w-full animate-pulse rounded bg-gray-800" />

              {/* buttons */}
              <div className="space-y-3">
                <div className="h-10 w-full animate-pulse rounded bg-purple-700/40" />
                <div className="h-10 w-full animate-pulse rounded border border-gray-800 bg-gray-900" />
              </div>
            </div>
          </div>

          {/* Right: results list skeleton */}
          <div className="lg:col-span-2 space-y-6">
            {/* header row */}
            <div className="flex items-center justify-between">
              <div className="h-5 w-48 animate-pulse rounded bg-gray-800" />
              <div className="h-5 w-24 animate-pulse rounded bg-gray-800" />
            </div>

            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-lg border border-gray-800 bg-gray-900"
              >
                <div className="md:flex">
                  <div className="h-48 w-full animate-pulse bg-gray-800 md:h-44 md:w-1/3" />
                  <div className="space-y-3 p-6 md:w-2/3">
                    <div className="h-5 w-60 animate-pulse rounded bg-gray-800" />
                    <div className="h-4 w-full animate-pulse rounded bg-gray-800/80" />
                    <div className="h-4 w-2/3 animate-pulse rounded bg-gray-800/80" />
                    <div className="flex gap-3 pt-2">
                      <div className="h-8 w-28 animate-pulse rounded bg-purple-700/40" />
                      <div className="h-8 w-32 animate-pulse rounded border border-gray-800 bg-gray-900" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
