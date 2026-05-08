import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1">
            <span className="text-2xl font-black text-gray-900 tracking-tight font-serif">
              Golden
            </span>
            <span className="text-2xl font-black text-amber-500 tracking-tight font-serif">
              News
            </span>
            <span className="text-2xl font-black text-red-600 tracking-tight font-serif">
              7
            </span>
          </div>
        </Link>

        {/* Tagline — hidden on small screens */}
        <p className="hidden lg:block text-xs text-gray-500 italic border-l border-gray-200 pl-4">
          L&apos;information africaine sans frontières
        </p>

        {/* Search */}
        <div className="flex-1 max-w-xs hidden md:block">
          <div className="relative">
            <input
              type="search"
              placeholder="Rechercher..."
              className="w-full pl-9 pr-4 py-1.5 text-sm bg-gray-100 rounded-full border border-transparent focus:outline-none focus:border-amber-400 focus:bg-white transition-colors"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <Link
            href="/newsletter"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-white bg-amber-500 hover:bg-amber-600 px-4 py-1.5 rounded-full transition-colors"
          >
            Newsletter
          </Link>
          {/* Mobile search icon */}
          <button
            className="md:hidden p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Rechercher"
          >
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
