import Link from "next/link";
import ArticleCard from "@/components/ui/ArticleCard";
import { navItems, sidebarArticles } from "@/data/mock-news";
import type { Article } from "@/types";

interface SidebarProps {
  articles?: Article[];
}

export default function Sidebar({ articles = sidebarArticles }: SidebarProps) {
  return (
    <aside className="flex flex-col gap-8">
      {/* Newsletter widget */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
        <h3 className="text-sm font-black text-gray-900 uppercase tracking-wide mb-1">
          Newsletter
        </h3>
        <p className="text-xs text-gray-600 mb-3">
          Recevez l&apos;essentiel de l&apos;actualité africaine chaque matin.
        </p>
        <input
          type="email"
          placeholder="votre@email.com"
          className="w-full px-3 py-2 text-sm border border-amber-200 rounded-lg focus:outline-none focus:border-amber-500 bg-white mb-2"
        />
        <button className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold rounded-lg transition-colors">
          S&apos;abonner
        </button>
      </div>

      {/* Most read */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-5 bg-red-500 rounded-full" />
          <h3 className="text-sm font-black text-gray-900 uppercase tracking-wide">
            Les plus lus
          </h3>
        </div>
        <div className="flex flex-col gap-4">
          {articles.slice(0, 5).map((article, i) => (
            <div key={article.id} className="flex gap-3 items-start">
              <span className="shrink-0 w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-xs font-black text-gray-400">
                {i + 1}
              </span>
              <ArticleCard article={article} variant="compact" />
            </div>
          ))}
        </div>
      </div>

      {/* Categories widget */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-5 bg-blue-500 rounded-full" />
          <h3 className="text-sm font-black text-gray-900 uppercase tracking-wide">
            Rubriques
          </h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-xs font-medium text-gray-700 bg-gray-100 hover:bg-amber-100 hover:text-amber-700 px-2.5 py-1 rounded-full transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Ad placeholder */}
      <div className="rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center h-64 text-xs text-gray-300 font-medium tracking-wider">
        PUBLICITÉ
      </div>
    </aside>
  );
}
