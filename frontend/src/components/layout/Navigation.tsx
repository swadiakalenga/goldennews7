"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import type { NavItem } from "@/types";

const drawerVariants = {
  closed: { opacity: 0, x: "-100%" },
  open: {
    opacity: 1,
    x: 0,
    transition: { type: "tween" as const, duration: 0.28, ease: "easeOut" as const },
  },
  exit: {
    opacity: 0,
    x: "-100%",
    transition: { type: "tween" as const, duration: 0.2, ease: "easeIn" as const },
  },
};

const backdropVariants = {
  closed: { opacity: 0 },
  open: { opacity: 1, transition: { duration: 0.25 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

export default function Navigation({ navItems }: { navItems: NavItem[] }) {
  // Track which pathname the drawer was opened on — auto-closes on navigation
  const [openPathname, setOpenPathname] = useState<string | null>(null);
  const pathname = usePathname();
  const mobileOpen = openPathname === pathname;

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  }

  function close() {
    setOpenPathname(null);
  }

  return (
    <>
      <nav className="bg-gray-900 text-white" aria-label="Navigation principale">
        <div className="container mx-auto px-4">
          {/* Desktop nav */}
          <div className="hidden md:flex items-center overflow-x-auto scrollbar-hide">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative shrink-0 px-3.5 py-3 text-sm font-medium transition-colors whitespace-nowrap group ${
                    active ? "text-amber-400" : "text-gray-300 hover:text-white"
                  }`}
                >
                  {item.label}
                  {/* Animated underline */}
                  <span
                    className={`absolute bottom-0 left-0 h-0.5 bg-amber-400 transition-all duration-300 ${
                      active ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </Link>
              );
            })}
          </div>

          {/* Mobile toggle */}
          <div className="md:hidden flex items-center justify-between py-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Rubriques
            </span>
            <button
              onClick={() => setOpenPathname(pathname)}
              className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
              aria-label="Ouvrir le menu"
              aria-expanded={mobileOpen}
            >
              <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="backdrop"
              variants={backdropVariants}
              initial="closed"
              animate="open"
              exit="exit"
              className="fixed inset-0 bg-black/65 z-40 md:hidden"
              onClick={close}
              aria-hidden="true"
            />

            <motion.div
              key="drawer"
              variants={drawerVariants}
              initial="closed"
              animate="open"
              exit="exit"
              className="fixed top-0 left-0 bottom-0 w-72 max-w-[85vw] bg-gray-900 z-50 flex flex-col md:hidden"
              role="dialog"
              aria-modal="true"
              aria-label="Menu de navigation"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-700/60">
                <div className="flex items-center">
                  <span className="text-lg font-black text-white font-serif">Golden</span>
                  <span className="text-lg font-black text-amber-400 font-serif">News</span>
                  <span className="text-lg font-black text-red-500 font-serif">7</span>
                </div>
                <button
                  onClick={close}
                  className="p-2 rounded-full hover:bg-gray-700 transition-colors text-gray-400 hover:text-white"
                  aria-label="Fermer le menu"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Nav links with staggered entrance */}
              <nav className="flex-1 overflow-y-auto py-4 px-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-500 px-3 mb-2">
                  Toutes les rubriques
                </p>
                {navItems.map((item, i) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.06 + i * 0.035, duration: 0.2 }}
                  >
                    <Link
                      href={item.href}
                      onClick={close}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                        isActive(item.href)
                          ? "text-amber-400 bg-amber-400/10"
                          : "text-gray-300 hover:text-white hover:bg-gray-800"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full shrink-0 transition-colors ${
                          isActive(item.href) ? "bg-amber-400" : "bg-gray-600 group-hover:bg-amber-400"
                        }`}
                      />
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Footer CTA */}
              <div className="px-5 py-4 border-t border-gray-700/60">
                <Link
                  href="/newsletter"
                  onClick={close}
                  className="flex items-center justify-center w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-white text-sm font-bold rounded-full transition-colors tracking-wide"
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
