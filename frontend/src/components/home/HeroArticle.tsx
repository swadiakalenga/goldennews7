import Image from "next/image";
import Link from "next/link";
import Badge from "@/components/ui/Badge";
import { formatDate, categoryToSlug } from "@/lib/utils";
import type { Article } from "@/types";

interface HeroArticleProps {
  article: Article;
}

export default function HeroArticle({ article }: HeroArticleProps) {
  return (
    <Link
      href={`/${categoryToSlug(article.category)}/${article.slug}`}
      className="group relative flex flex-col justify-end overflow-hidden rounded-xl bg-gray-900 min-h-[420px] md:min-h-[520px]"
    >
      {/* Background image */}
      {article.imageUrl && (
        <Image
          src={article.imageUrl}
          alt={article.imageAlt}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          priority
          sizes="(max-width: 1024px) 100vw, 66vw"
        />
      )}

      {/* Gradient overlay — stronger at bottom for readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/10 transition-opacity duration-500" />

      {/* Content */}
      <div className="relative z-10 p-6 md:p-8">
        <div className="flex items-center gap-3 mb-3">
          <Badge category={article.category} size="md" />
          {article.isBreaking && (
            <span className="bg-red-600 text-white text-xs font-bold uppercase px-2 py-0.5 rounded animate-pulse">
              Urgent
            </span>
          )}
        </div>
        <h1 className="text-shadow-strong text-2xl md:text-3xl lg:text-4xl font-black text-white leading-tight group-hover:text-amber-300 transition-colors duration-300 max-w-2xl">
          {article.title}
        </h1>
        <p className="mt-3 text-sm md:text-base text-gray-300 max-w-xl line-clamp-2">
          {article.excerpt}
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-gray-400">
          <span className="font-semibold text-gray-200">{article.author.name}</span>
          <span>·</span>
          <span>{article.author.role}</span>
          <span>·</span>
          <span>{formatDate(article.publishedAt)}</span>
          <span>·</span>
          <span>{article.readingTime} min de lecture</span>
        </div>
      </div>
    </Link>
  );
}
