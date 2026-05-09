"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { articles } from "@/data/mock-news";
import { categoryToSlug } from "@/lib/utils";
import Badge from "@/components/ui/Badge";
import type { Article } from "@/types";

const RECENT_KEY = "gn7_recent_searches";
const MAX_RECENT = 5;

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

function loadRecent(): string[] {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function saveRecent(term: string) {
  try {
    const prev = loadRecent().filter((t) => t !== term);
    localStorage.setItem(RECENT_KEY, JSON.stringify([term, ...prev].slice(0, MAX_RECENT)));
  } catch {
    // localStorage unavailable
  }
}

function removeRecent(term: string) {
  try {
    const prev = loadRecent().filter((t) => t !== term);
    localStorage.setItem(RECENT_KEY, JSON.stringify(prev));
  } catch {
    // localStorage unavailable
  }
}

export default function SearchDropdown({ onClose, autoFocus }: SearchDropdownProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Article[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  useEffect(() => {
    setRecentSearches(loadRecent());
  }, []);

  useEffect(() => {
    const q = query.trim().toLowerCase();
    setSelectedIndex(-1);
    if (!q) {
      setResults([]);
      // Show recent searches panel if there are any
      setOpen(recentSearches.length > 0);
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
  }, [query, recentSearches.length]);

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

  const navigateToSearch = useCallback(
    (term: string) => {
      saveRecent(term);
      setRecentSearches(loadRecent());
      router.push(`/recherche?q=${encodeURIComponent(term)}`);
      setOpen(false);
      onClose?.();
    },
    [router, onClose]
  );

  const navigateToArticle = useCallback(
    (article: Article) => {
      saveRecent(query.trim());
      setRecentSearches(loadRecent());
      router.push(`/${categoryToSlug(article.category)}/${article.slug}`);
      setOpen(false);
      onClose?.();
    },
    [router, query, onClose]
  );

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open) return;

    const itemCount = query.trim() ? results.length : recentSearches.length;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, itemCount - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (query.trim()) {
        if (selectedIndex >= 0 && results[selectedIndex]) {
          navigateToArticle(results[selectedIndex]);
        } else if (query.trim()) {
          navigateToSearch(query.trim());
        }
      } else if (selectedIndex >= 0 && recentSearches[selectedIndex]) {
        setQuery(recentSearches[selectedIndex]);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
      onClose?.();
    }
  }

  const showRecent = !query.trim() && open && recentSearches.length > 0;
  const showResults = query.trim().length > 0 && open;

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Rechercher un article..."
          className="w-full pl-9 pr-4 py-1.5 text-sm bg-gray-100 rounded-full border border-transparent focus:outline-none focus:border-amber-400 focus:bg-white transition-colors"
          aria-label="Rechercher"
          aria-expanded={open}
          aria-autocomplete="list"
          role="combobox"
          aria-activedescendant={selectedIndex >= 0 ? `search-item-${selectedIndex}` : undefined}
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
            onClick={() => { setQuery(""); setSelectedIndex(-1); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            aria-label="Effacer"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Recent searches panel */}
      {showRecent && (
        <div className="animate-slide-down absolute top-full mt-2 left-0 right-0 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
          <div className="flex items-center justify-between px-4 pt-3 pb-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
              Recherches récentes
            </span>
            <button
              onClick={() => {
                try { localStorage.removeItem(RECENT_KEY); } catch { /* unavailable */ }
                setRecentSearches([]);
                setOpen(false);
              }}
              className="text-[10px] text-gray-400 hover:text-red-500 transition-colors font-medium"
            >
              Tout effacer
            </button>
          </div>
          <ul role="listbox">
            {recentSearches.map((term, i) => (
              <li
                key={term}
                id={`search-item-${i}`}
                role="option"
                aria-selected={i === selectedIndex}
              >
                <div
                  className={`flex items-center gap-3 px-4 py-2.5 transition-colors cursor-pointer ${
                    i === selectedIndex ? "bg-amber-50" : "hover:bg-gray-50"
                  }`}
                  onClick={() => setQuery(term)}
                >
                  <svg className="w-3.5 h-3.5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm text-gray-700 flex-1">{term}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeRecent(term);
                      setRecentSearches(loadRecent());
                    }}
                    className="text-gray-300 hover:text-gray-500 transition-colors"
                    aria-label={`Supprimer "${term}"`}
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Search results dropdown */}
      {showResults && (
        <div className="animate-slide-down absolute top-full mt-2 left-0 right-0 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
          {results.length > 0 ? (
            <>
              <ul role="listbox">
                {results.map((article, i) => (
                  <li
                    key={article.id}
                    id={`search-item-${i}`}
                    role="option"
                    aria-selected={i === selectedIndex}
                  >
                    <Link
                      href={`/${categoryToSlug(article.category)}/${article.slug}`}
                      onClick={() => {
                        saveRecent(query.trim());
                        setRecentSearches(loadRecent());
                        setOpen(false);
                        onClose?.();
                      }}
                      className={`flex items-start gap-3 px-4 py-3 transition-colors ${
                        i === selectedIndex ? "bg-amber-50" : "hover:bg-amber-50"
                      }`}
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
                  onClick={() => {
                    saveRecent(query.trim());
                    setRecentSearches(loadRecent());
                    setOpen(false);
                    onClose?.();
                  }}
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
