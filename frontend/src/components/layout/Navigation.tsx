"use client";

import Link from "next/link";
import { useState } from "react";
import { navItems } from "@/data/mock-news";

export default function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="bg-gray-900 text-white">
      <div className="container mx-auto px-4">
        {/* Desktop nav */}
        <div className="hidden md:flex items-center overflow-x-auto scrollbar-hide">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="shrink-0 px-3 py-3 text-sm font-medium text-gray-300 hover:text-amber-400 hover:bg-gray-800 transition-colors whitespace-nowrap border-b-2 border-transparent hover:border-amber-400"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Mobile nav toggle */}
        <div className="md:hidden flex items-center justify-between py-2">
          <span className="text-sm font-semibold text-gray-300">Rubriques</span>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-1.5 rounded hover:bg-gray-700 transition-colors"
            aria-label="Menu"
          >
            <svg
              className="w-5 h-5 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile dropdown */}
        {mobileOpen && (
          <div className="md:hidden grid grid-cols-2 gap-px pb-2 border-t border-gray-700">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2.5 text-sm font-medium text-gray-300 hover:text-amber-400 hover:bg-gray-800 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
