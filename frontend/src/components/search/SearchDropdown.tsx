"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { articles } from "@/data/mock-news";
import { categoryToSlug } from "@/lib/utils";
import Badge from "@/components/ui/Badge";
import type { Article } from "@/types";

interface SearchDropdownProps {
  onClose?: () => void;
  autoFocus?: boolean;
}

function highlight(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
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

export default function SearchDropdown({ onClose, autoFocus }: SearchDropdownProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Article[]>([]);
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  useEffect(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      setResults([]);
      setOpen(false);
      return;
    }
    const filtered = articles
      .filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.excerpt.toLowerCase().includes(q) ||
          a.author.name.toLowerCase().includes(q) ||
          a.category.toLowerCase().includes(q) ||
          a.tags?.some((t) => t.toLowerCase().includes(q))
      )
      .slice(0, 5);
    setResults(filtered);
    setOpen(true);
  }, [query]);

  // Close on outside click
  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, []);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && query.trim()) {
      router.push(`/recherche?q=${encodeURIComponent(query.trim())}`);
      setOpen(false);
      onClose?.();
    }
    if (e.key === "Escape") {
      setOpen(false);
      onClose?.();
    }
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim() && setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Rechercher un article..."
          className="w-full pl-9 pr-4 py-1.5 text-sm bg-gray-100 rounded-full border border-transparent focus:outline-none focus:border-amber-400 focus:bg-white transition-colors"
          aria-label="Rechercher"
          aria-expanded={open}
          aria-autocomplete="list"
          role="combobox"
        />
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        {query && (
          <button
            onClick={() => { setQuery(""); setOpen(false); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            aria-label="Effacer"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Dropdown */}
      {open && (
        <div className="animate-slide-down absolute top-full mt-2 left-0 right-0 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
          {results.length > 0 ? (
            <>
              <ul role="listbox">
                {results.map((article) => (
                  <li key={article.id} role="option">
                    <Link
                      href={`/${categoryToSlug(article.category)}/${article.slug}`}
                      onClick={() => { setOpen(false); onClose?.(); }}
                      className="flex items-start gap-3 px-4 py-3 hover:bg-amber-50 transition-colors"
                    >
                      <div className="shrink-0 mt-0.5">
                        <Badge category={article.category} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 line-clamp-1">
                          {highlight(article.title, query)}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">{article.author.name}</p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="border-t border-gray-100 px-4 py-2">
                <Link
                  href={`/recherche?q=${encodeURIComponent(query)}`}
                  onClick={() => { setOpen(false); onClose?.(); }}
                  className="text-xs text-amber-600 font-semibold hover:text-amber-700 flex items-center gap-1"
                >
                  Voir tous les résultats pour «{query}»
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </>
          ) : (
            <div className="px-4 py-6 text-center text-sm text-gray-400">
              Aucun résultat pour «{query}»
            </div>
          )}
        </div>
      )}
    </div>
  );
}
