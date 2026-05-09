interface PaginationProps {
  page: number;
  totalPages: number;
  basePath: string;
}

export default function Pagination({ page, totalPages, basePath }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-1.5 mt-10">
      <a
        href={page > 1 ? `${basePath}?page=${page - 1}` : undefined}
        aria-disabled={page <= 1}
        className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
          page <= 1
            ? "text-gray-300 cursor-not-allowed"
            : "text-gray-600 border border-gray-200 hover:border-amber-400 hover:text-amber-600 hover:bg-amber-50 active:scale-95 shadow-sm"
        }`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Précédent
      </a>

      <div className="flex items-center gap-1">
        {pages.map((p) => (
          <a
            key={p}
            href={`${basePath}?page=${p}`}
            aria-current={p === page ? "page" : undefined}
            className={`w-9 h-9 flex items-center justify-center rounded-full text-sm font-bold transition-all duration-200 ${
              p === page
                ? "bg-amber-500 text-white shadow-md ring-2 ring-amber-500/30 scale-110"
                : "text-gray-600 border border-gray-200 hover:border-amber-400 hover:text-amber-600 hover:bg-amber-50 shadow-sm active:scale-95"
            }`}
          >
            {p}
          </a>
        ))}
      </div>

      <a
        href={page < totalPages ? `${basePath}?page=${page + 1}` : undefined}
        aria-disabled={page >= totalPages}
        className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
          page >= totalPages
            ? "text-gray-300 cursor-not-allowed"
            : "text-gray-600 border border-gray-200 hover:border-amber-400 hover:text-amber-600 hover:bg-amber-50 active:scale-95 shadow-sm"
        }`}
      >
        Suivant
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </a>
    </nav>
  );
}
