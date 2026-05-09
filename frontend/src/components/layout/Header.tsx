"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SearchDropdown from "@/components/search/SearchDropdown";

export default function Header() {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-0.5">
              <span className="text-2xl font-black text-gray-900 tracking-tight font-serif">
                Golden
              </span>
              <span className="text-2xl font-black text-amber-500 tracking-tight font-serif">
                News
              </span>
              <span className="text-2xl font-black text-red-600 tracking-tight font-serif">
                7
              </span>
            </div>
          </Link>

          {/* Tagline — hidden on small screens */}
          <p className="hidden lg:block text-xs text-gray-500 italic border-l border-gray-200 pl-4 shrink-0">
            L&apos;information africaine sans frontières
          </p>

          {/* Desktop search */}
          <div className="flex-1 max-w-xs hidden md:block">
            <SearchDropdown />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Link
              href="/newsletter"
              className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-white bg-amber-500 hover:bg-amber-600 px-4 py-1.5 rounded-full transition-colors"
            >
              Newsletter
            </Link>

            {/* Mobile search toggle */}
            <button
              className="md:hidden p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label={searchOpen ? "Fermer la recherche" : "Rechercher"}
              onClick={() => setSearchOpen((v) => !v)}
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              className="md:hidden border-t border-gray-100 overflow-hidden"
            >
              <div className="px-4 py-3">
                <SearchDropdown
                  autoFocus
                  onClose={() => setSearchOpen(false)}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
