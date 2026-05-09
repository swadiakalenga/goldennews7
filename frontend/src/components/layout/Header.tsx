"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SearchDropdown from "@/components/search/SearchDropdown";

export default function Header({ tagline }: { tagline?: string }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-md"
          : "bg-white shadow-sm"
      }`}
    >
      <div className="container mx-auto px-4 h-14 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="shrink-0 flex items-center">
          <span className="text-xl font-black text-gray-900 tracking-tight font-serif leading-none">
            Golden
          </span>
          <span className="text-xl font-black text-amber-500 tracking-tight font-serif leading-none">
            News
          </span>
          <span className="text-xl font-black text-red-600 tracking-tight font-serif leading-none">
            7
          </span>
        </Link>

        {/* Tagline */}
        {(tagline ?? "L'information africaine sans frontières") && (
          <p className="hidden xl:block text-[11px] text-gray-400 italic border-l border-gray-200 pl-4 shrink-0 leading-tight">
            {tagline ?? "L'information africaine sans frontières"}
          </p>
        )}

        {/* Desktop search */}
        <div className="flex-1 max-w-sm hidden md:block">
          <SearchDropdown />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/newsletter"
            className="hidden sm:inline-flex items-center text-xs font-bold text-white bg-amber-500 hover:bg-amber-600 active:scale-95 px-4 py-2 rounded-full transition-all duration-200 tracking-wide uppercase"
          >
            Newsletter
          </Link>

          {/* Mobile search toggle */}
          <button
            className="md:hidden p-2 rounded-full hover:bg-gray-100 active:scale-90 transition-all"
            aria-label={searchOpen ? "Fermer la recherche" : "Rechercher"}
            onClick={() => setSearchOpen((v) => !v)}
          >
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              {searchOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile search overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            key="mobile-search"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="md:hidden border-t border-gray-100 overflow-hidden bg-white"
          >
            <div className="px-4 py-3">
              <SearchDropdown autoFocus onClose={() => setSearchOpen(false)} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
