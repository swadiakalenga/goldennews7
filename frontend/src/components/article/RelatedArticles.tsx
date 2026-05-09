import ArticleCard from "@/components/ui/ArticleCard";
import type { Article } from "@/types";

interface RelatedArticlesProps {
  articles: Article[];
}

export default function RelatedArticles({ articles }: RelatedArticlesProps) {
  if (articles.length === 0) return null;

  return (
    <section className="border-t border-gray-100 pt-10">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1 h-6 bg-amber-500 rounded-full" />
        <h2 className="text-lg font-black text-gray-900 uppercase tracking-wide">
          À lire aussi
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </section>
  );
}
