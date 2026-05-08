import Link from "next/link";
import { navItems } from "@/data/mock-news";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 mt-12">
      {/* Main footer */}
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
            <div className="flex gap-3 mt-4">
              {["Facebook", "Twitter", "YouTube", "Telegram"].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="text-xs text-gray-400 hover:text-amber-400 transition-colors"
                >
                  {social}
                </a>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
              Rubriques
            </h4>
            <ul className="space-y-1.5">
              {navItems.slice(0, 6).map((item) => (
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

          {/* More categories + links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
              Plus
            </h4>
            <ul className="space-y-1.5">
              {navItems.slice(6).map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-gray-400 hover:text-amber-400 transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/a-propos"
                  className="text-sm text-gray-400 hover:text-amber-400 transition-colors"
                >
                  À propos
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-gray-400 hover:text-amber-400 transition-colors"
                >
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
          <p>© {currentYear} GoldenNews7. Tous droits réservés.</p>
          <div className="flex gap-4">
            <Link href="/confidentialite" className="hover:text-amber-400 transition-colors">
              Confidentialité
            </Link>
            <Link href="/mentions-legales" className="hover:text-amber-400 transition-colors">
              Mentions légales
            </Link>
            <Link href="/cgu" className="hover:text-amber-400 transition-colors">
              CGU
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
