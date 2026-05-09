import Image from "next/image";
import Link from "next/link";
import Badge from "@/components/ui/Badge";
import { formatDateShort, categoryToSlug } from "@/lib/utils";
import type { Article } from "@/types";

interface ArticleCardProps {
  article: Article;
  variant?: "default" | "compact" | "horizontal";
}

export default function ArticleCard({
  article,
  variant = "default",
}: ArticleCardProps) {
  if (variant === "horizontal") {
    return (
      <Link
        href={`/${categoryToSlug(article.category)}/${article.slug}`}
        className="group flex gap-4 items-start"
      >
        <div className="relative shrink-0 w-24 h-20 rounded overflow-hidden bg-gray-100">
          {article.imageUrl && (
            <Image
              src={article.imageUrl}
              alt={article.imageAlt}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="96px"
            />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <Badge category={article.category} />
          <h3 className="mt-1 text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-amber-600 transition-colors leading-snug">
            {article.title}
          </h3>
          <p className="mt-1 text-xs text-gray-500">
            {formatDateShort(article.publishedAt)}
          </p>
        </div>
      </Link>
    );
  }

  if (variant === "compact") {
    return (
      <Link
        href={`/${categoryToSlug(article.category)}/${article.slug}`}
        className="group block border-b border-gray-100 pb-3 last:border-0 last:pb-0"
      >
        <Badge category={article.category} />
        <h3 className="mt-1 text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-amber-600 transition-colors leading-snug">
          {article.title}
        </h3>
        <p className="mt-1 text-xs text-gray-500">
          {article.author.name} · {formatDateShort(article.publishedAt)}
        </p>
      </Link>
    );
  }

  return (
    <Link
      href={`/${article.category.toLowerCase()}/${article.slug}`}
      className="group flex flex-col bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-gray-100"
    >
      <div className="relative h-48 w-full overflow-hidden bg-gray-100">
        {article.imageUrl && (
          <Image
            src={article.imageUrl}
            alt={article.imageAlt}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        )}
        {article.isBreaking && (
          <div className="absolute top-2 left-2">
            <span className="bg-red-600 text-white text-xs font-bold uppercase px-2 py-0.5 rounded animate-pulse">
              Urgent
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-col flex-1 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Badge category={article.category} />
          <span className="text-xs text-gray-400">{article.readingTime} min</span>
        </div>
        <h3 className="text-base font-bold text-gray-900 line-clamp-2 group-hover:text-amber-600 transition-colors leading-snug">
          {article.title}
        </h3>
        <p className="mt-2 text-sm text-gray-600 line-clamp-2 flex-1">
          {article.excerpt}
        </p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs text-gray-500 font-medium">
            {article.author.name}
          </span>
          <span className="text-xs text-gray-400">
            {formatDateShort(article.publishedAt)}
          </span>
        </div>
      </div>
    </Link>
  );
}
