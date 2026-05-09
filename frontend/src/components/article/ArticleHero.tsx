import Image from "next/image";
import Badge from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";
import type { Article } from "@/types";

interface ArticleHeroProps {
  article: Article;
}

export default function ArticleHero({ article }: ArticleHeroProps) {
  return (
    <div className="space-y-6">
      {/* Meta row */}
      <div className="flex items-center gap-3 flex-wrap">
        <Badge category={article.category} size="md" />
        {article.isBreaking && (
          <span className="bg-red-600 text-white text-xs font-bold uppercase px-2.5 py-1 rounded">
            Urgent
          </span>
        )}
        <span className="text-sm text-gray-500">{article.readingTime} min de lecture</span>
      </div>

      {/* Title */}
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 leading-tight tracking-tight font-serif">
        {article.title}
      </h1>

      {/* Excerpt */}
      <p className="text-lg sm:text-xl text-gray-600 leading-relaxed border-l-4 border-amber-400 pl-4">
        {article.excerpt}
      </p>

      {/* Author + date row */}
      <div className="flex items-center gap-4 py-4 border-t border-b border-gray-100">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
          {article.author.name.charAt(0)}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-900">{article.author.name}</p>
          <p className="text-xs text-gray-500">{article.author.role}</p>
        </div>
        <div className="ml-auto text-right shrink-0">
          <p className="text-xs text-gray-500">{formatDate(article.publishedAt)}</p>
          {article.views && (
            <p className="text-xs text-gray-400 mt-0.5">
              {article.views.toLocaleString("fr-FR")} vues
            </p>
          )}
        </div>
      </div>

      {/* Hero image */}
      {article.imageUrl && (
        <div className="relative w-full aspect-video rounded-xl overflow-hidden">
          <Image
            src={article.imageUrl}
            alt={article.imageAlt}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 1024px) 100vw, 800px"
          />
        </div>
      )}
    </div>
  );
}
