import { formatDate } from "@/lib/utils";

interface ArticleSummaryProps {
  aiSummary?: string;
  readingTime: number;
  publishedAt: string;
  updatedAt?: string;
}

export default function ArticleSummary({
  aiSummary,
  readingTime,
  publishedAt,
  updatedAt,
}: ArticleSummaryProps) {
  const bullets = aiSummary
    ? aiSummary
        .split("\n")
        .map((l) => l.replace(/^[•\-\*]\s*/, "").trim())
        .filter(Boolean)
    : [];

  const showUpdated =
    updatedAt && updatedAt !== publishedAt &&
    new Date(updatedAt).getTime() - new Date(publishedAt).getTime() > 60_000;

  return (
    <div className="my-6 rounded-xl border border-amber-200 bg-amber-50 overflow-hidden">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-amber-500">
        <div className="flex items-center gap-2">
          <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <span className="text-xs font-black uppercase tracking-widest text-white">En bref</span>
        </div>
        <div className="flex items-center gap-3 text-amber-100 text-xs">
          <span className="flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {readingTime} min
          </span>
          <span>·</span>
          <span>{formatDate(publishedAt)}</span>
          {showUpdated && (
            <>
              <span>·</span>
              <span className="italic">Mis à jour {formatDate(updatedAt!)}</span>
            </>
          )}
        </div>
      </div>

      {/* Bullet points */}
      {bullets.length > 0 && (
        <ul className="px-4 py-3 space-y-2">
          {bullets.map((point, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-gray-800 leading-snug">
              <span className="mt-1 w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
              {point}
            </li>
          ))}
        </ul>
      )}

      {/* No summary: show meta only */}
      {bullets.length === 0 && (
        <div className="px-4 py-3 text-xs text-amber-700">
          Temps de lecture estimé : {readingTime} min · Publié {formatDate(publishedAt)}
        </div>
      )}
    </div>
  );
}
