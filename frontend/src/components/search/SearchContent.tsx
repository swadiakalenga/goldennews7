"use client";

import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import Link from "next/link";
import { articles } from "@/data/mock-news";
import { categoryToSlug } from "@/lib/utils";
import ArticleCard from "@/components/ui/ArticleCard";
import Badge from "@/components/ui/Badge";
import type { Article } from "@/types";

function highlight(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escaped})`, "gi");
  const parts = text.split(regex);
  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark key={i} className="bg-amber-200 text-amber-900 rounded px-0.5">
        {part}
      </mark>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

function HighlightCard({ article, query }: { article: Article; query: string }) {
  const catSlug = categoryToSlug(article.category);
  return (
    <Link
      href={`/${catSlug}/${article.slug}`}
      className="group flex flex-col sm:flex-row gap-4 bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md hover:border-amber-200 transition-all"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2">
          <Badge category={article.category} />
          <span className="text-xs text-gray-400">{article.readingTime} min</span>
        </div>
        <h3 className="text-base font-bold text-gray-900 group-hover:text-amber-600 transition-colors leading-snug mb-1">
          {highlight(article.title, query)}
        </h3>
        <p className="text-sm text-gray-600 line-clamp-2">
          {highlight(article.excerpt, query)}
        </p>
        <p className="mt-2 text-xs text-gray-400">
          {article.author.name} · {article.category}
        </p>
      </div>
    </Link>
  );
}

export default function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "";

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.trim().toLowerCase();
    return articles.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        a.author.name.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q) ||
        a.tags?.some((t) => t.toLowerCase().includes(q))
    );
  }, [query]);

  if (!query.trim()) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h2 className="text-lg font-bold text-gray-700 mb-1">Que recherchez-vous ?</h2>
        <p className="text-sm text-gray-400">
          Saisissez un mot-clé dans la barre de recherche pour trouver des articles.
        </p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-lg font-bold text-gray-700 mb-1">Aucun résultat</h2>
        <p className="text-sm text-gray-400">
          Aucun article ne correspond à «<strong>{query}</strong>». Essayez d&apos;autres mots-clés.
        </p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm text-gray-500 mb-6">
        <span className="font-bold text-gray-900">{results.length}</span> résultat
        {results.length > 1 ? "s" : ""} pour «<strong>{query}</strong>»
      </p>
      <div className="flex flex-col gap-4">
        {results.map((article) => (
          <HighlightCard key={article.id} article={article} query={query} />
        ))}
      </div>
    </div>
  );
}
