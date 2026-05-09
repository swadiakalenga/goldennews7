import Link from "next/link";
import { categoryToSlug } from "@/lib/utils";
import type { Article } from "@/types";

interface DailyBriefingProps {
  articles: Article[];
}

export default function DailyBriefing({ articles }: DailyBriefingProps) {
  if (articles.length === 0) return null;
  const items = articles.slice(0, 5);

  return (
    <section className="mb-10">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-1 h-6 bg-amber-500 rounded-full" />
        <h2 className="text-lg font-black text-gray-900 uppercase tracking-wide">
          Les 5 infos essentielles du jour
        </h2>
        <span className="ml-auto text-[10px] font-bold uppercase tracking-widest text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
          Briefing
        </span>
      </div>

      <div className="bg-gray-950 rounded-2xl overflow-hidden border border-white/5">
        {items.map((article, i) => {
          const href = `/${categoryToSlug(article.category)}/${article.slug}`;
          return (
            <Link
              key={article.id}
              href={href}
              className="flex items-start gap-4 px-5 py-4 border-b border-white/5 last:border-0 hover:bg-white/3 transition-colors group"
            >
              <span className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-amber-500/15 text-amber-400 text-sm font-black">
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white leading-snug group-hover:text-amber-300 transition-colors line-clamp-2">
                  {article.title}
                </p>
                {article.excerpt && (
                  <p className="text-xs text-gray-500 mt-1 line-clamp-1">{article.excerpt}</p>
                )}
              </div>
              {article.imageUrl && (
                <div
                  className="shrink-0 w-14 h-14 rounded-lg bg-gray-800 bg-cover bg-center hidden sm:block"
                  style={{ backgroundImage: `url(${article.imageUrl})` }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
