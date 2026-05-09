"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { navItems } from "@/data/mock-news";

const menuVariants = {
  closed: { opacity: 0, x: "-100%" },
  open: {
    opacity: 1,
    x: 0,
    transition: { type: "tween" as const, duration: 0.3, ease: "easeOut" as const },
  },
  exit: {
    opacity: 0,
    x: "-100%",
    transition: { type: "tween" as const, duration: 0.22, ease: "easeIn" as const },
  },
};

const backdropVariants = {
  closed: { opacity: 0 },
  open: { opacity: 1, transition: { duration: 0.25 } },
  exit: { opacity: 0, transition: { duration: 0.22 } },
};


export default function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);

  function close() {
    setMobileOpen(false);
  }

  return (
    <>
      <nav className="bg-gray-900 text-white" aria-label="Navigation principale">
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

          {/* Mobile top bar */}
          <div className="md:hidden flex items-center justify-between py-2">
            <span className="text-sm font-semibold text-gray-300">Rubriques</span>
            <button
              onClick={() => setMobileOpen(true)}
              className="p-1.5 rounded hover:bg-gray-700 transition-colors"
              aria-label="Ouvrir le menu"
              aria-expanded={mobileOpen}
            >
              <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Fullscreen mobile menu overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              variants={backdropVariants}
              initial="closed"
              animate="open"
              exit="exit"
              className="fixed inset-0 bg-black/60 z-40 md:hidden"
              onClick={close}
              aria-hidden="true"
            />

            {/* Drawer */}
            <motion.div
              key="drawer"
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="exit"
              className="fixed top-0 left-0 bottom-0 w-72 bg-gray-900 z-50 flex flex-col md:hidden"
              role="dialog"
              aria-modal="true"
              aria-label="Menu de navigation"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-700">
                <div className="flex items-center gap-1">
                  <span className="text-lg font-black text-white font-serif">Golden</span>
                  <span className="text-lg font-black text-amber-400 font-serif">News</span>
                  <span className="text-lg font-black text-red-500 font-serif">7</span>
                </div>
                <button
                  onClick={close}
                  className="p-1.5 rounded-full hover:bg-gray-700 transition-colors text-gray-300"
                  aria-label="Fermer le menu"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Nav items */}
              <nav className="flex-1 overflow-y-auto py-4 px-3">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-500 px-3 mb-3">
                  Toutes les rubriques
                </p>
                {navItems.map((item, i) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.08 + i * 0.04, duration: 0.25 }}
                  >
                    <Link
                      href={item.href}
                      onClick={close}
                      className="flex items-center gap-3 px-3 py-3 rounded-lg text-base font-medium text-gray-200 hover:text-amber-400 hover:bg-gray-800 transition-colors group"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Drawer footer */}
              <div className="px-5 py-4 border-t border-gray-700">
                <Link
                  href="/newsletter"
                  onClick={close}
                  className="flex items-center justify-center gap-2 w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-white text-sm font-semibold rounded-full transition-colors"
                >
                  Newsletter gratuite
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
