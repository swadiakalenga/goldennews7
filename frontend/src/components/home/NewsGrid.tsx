import ArticleCard from "@/components/ui/ArticleCard";
import type { Article } from "@/types";

interface NewsGridProps {
  articles: Article[];
  title?: string;
}

export default function NewsGrid({ articles, title = "Dernières actualités" }: NewsGridProps) {
  return (
    <section>
      {/* Section header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-1 h-6 bg-amber-500 rounded-full" />
        <h2 className="text-lg font-black text-gray-900 uppercase tracking-wide">{title}</h2>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </section>
  );
}
