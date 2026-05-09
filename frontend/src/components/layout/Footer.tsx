import Link from "next/link";
import type { NavItem } from "@/types";

interface FooterProps {
  navItems?: NavItem[];
  socials?: { label: string; href: string }[];
}

export default function Footer({
  navItems = [],
  socials = [
    { label: "Facebook", href: "#" },
    { label: "Twitter / X", href: "#" },
    { label: "YouTube", href: "#" },
    { label: "Telegram", href: "#" },
  ],
}: FooterProps) {
  const currentYear = new Date().getFullYear();
  const col1 = navItems.slice(0, 6);
  const col2 = navItems.slice(6);

  return (
    <footer className="bg-gray-900 text-gray-300 mt-12">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-1 mb-3">
              <span className="text-xl font-black text-white font-serif">Golden</span>
              <span className="text-xl font-black text-amber-500 font-serif">News</span>
              <span className="text-xl font-black text-red-500 font-serif">7</span>
            </div>
            <p className="text-sm text-gray-400 max-w-xs leading-relaxed">
              GoldenNews7 est votre source de référence pour l&apos;information africaine
              et internationale. Indépendant, rigoureux, accessible.
            </p>
            <div className="flex gap-3 mt-4 flex-wrap">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target={s.href !== "#" ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="text-xs text-gray-400 hover:text-amber-400 transition-colors"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          {/* Categories col 1 */}
          {col1.length > 0 && (
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
                Rubriques
              </h4>
              <ul className="space-y-1.5">
                {col1.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-gray-400 hover:text-amber-400 transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Categories col 2 + static links */}
          <div>
            {col2.length > 0 && (
              <>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
                  Plus
                </h4>
                <ul className="space-y-1.5 mb-4">
                  {col2.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="text-sm text-gray-400 hover:text-amber-400 transition-colors"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            )}
            <ul className="space-y-1.5">
              <li>
                <Link href="/a-propos" className="text-sm text-gray-400 hover:text-amber-400 transition-colors">
                  À propos
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-gray-400 hover:text-amber-400 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
          <p>© {currentYear} GoldenGroup7. Tous droits réservés.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-amber-400 transition-colors">
              Confidentialité
            </Link>
            <Link href="/terms" className="hover:text-amber-400 transition-colors">
              CGU
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
