import Link from 'next/link'

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-gray-950/70 bg-gray-950/90 border-b border-gray-800">
      <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-semibold tracking-wide">
          COOKSMART
        </Link>
        <nav className="hidden sm:flex items-center gap-6 text-sm">
          <Link className="text-gray-300 hover:text-white transition-colors" href="/pantry">Pantry</Link>
          <Link className="text-gray-300 hover:text-white transition-colors" href="/generate">Generate</Link>
          <Link className="text-gray-300 hover:text-white transition-colors" href="/meals">Meals</Link>
          <Link className="text-gray-300 hover:text-white transition-colors" href="/planner">Planner</Link>
        </nav>
      </div>
    </header>
  )
}
