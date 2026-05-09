interface Source {
  id: string;
  source_name: string;
  source_type: string;
  source_url: string | null;
}

interface ArticleSourcesProps {
  sources: Source[];
}

const TYPE_LABEL: Record<string, string> = {
  web: "Web",
  press: "Presse",
  official: "Officiel",
  ngo: "ONG",
  witness: "Témoin",
  agency: "Agence",
  other: "Autre",
};

export default function ArticleSources({ sources }: ArticleSourcesProps) {
  if (sources.length === 0) return null;

  return (
    <div className="mt-8 pt-6 border-t border-gray-100">
      <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3">Sources</h3>
      <ul className="space-y-1.5">
        {sources.map((s) => (
          <li key={s.id} className="flex items-start gap-2 text-sm">
            <span className="mt-0.5 text-gray-300">•</span>
            <span className="flex flex-wrap items-center gap-1.5">
              {s.source_url ? (
                <a
                  href={s.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-amber-700 hover:text-amber-600 underline underline-offset-2 transition-colors"
                >
                  {s.source_name}
                </a>
              ) : (
                <span className="font-semibold text-gray-700">{s.source_name}</span>
              )}
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">
                {TYPE_LABEL[s.source_type] ?? s.source_type}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
