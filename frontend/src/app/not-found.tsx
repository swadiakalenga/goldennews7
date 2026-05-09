import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <span className="text-7xl font-black text-amber-400 font-serif">404</span>
      <h1 className="mt-4 text-2xl font-black text-gray-900">Page introuvable</h1>
      <p className="mt-2 text-sm text-gray-500 max-w-xs">
        La page que vous recherchez n&apos;existe pas ou a été déplacée.
      </p>
      <div className="mt-6 flex gap-3">
        <Link
          href="/"
          className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold rounded-full transition-colors"
        >
          Retour à l&apos;accueil
        </Link>
        <Link
          href="/recherche"
          className="px-5 py-2.5 border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-semibold rounded-full transition-colors"
        >
          Rechercher
        </Link>
      </div>
    </div>
  );
}
