export const dynamic = "force-dynamic";

import BreakingNews from "@/components/home/BreakingNews";
import HeroArticle from "@/components/home/HeroArticle";
import NewsGrid from "@/components/home/NewsGrid";
import Sidebar from "@/components/home/Sidebar";
import { getArticles, getFeaturedArticles } from "@/lib/api/articles";

export default async function HomePage() {
  const [featured, all] = await Promise.all([
    getFeaturedArticles(),
    getArticles(),
  ]);

  const hero = featured[0] ?? all[0] ?? null;
  const sidebarArticles = all.slice(0, 5);
  const latestArticles = hero
    ? all.filter((a) => a.id !== hero.id).slice(0, 6)
    : all.slice(0, 6);

  if (!hero) {
    return (
      <>
        <BreakingNews />
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-gray-700 mb-1">Aucun article publié</h2>
            <p className="text-sm text-gray-400">Les articles seront bientôt disponibles.</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <BreakingNews />

      <div className="container mx-auto px-4 py-6">
        {/* Hero + sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          <div className="lg:col-span-2">
            <HeroArticle article={hero} />
          </div>
          <div className="lg:col-span-1">
            <Sidebar articles={sidebarArticles} />
          </div>
        </div>

        {/* Latest news grid */}
        {latestArticles.length > 0 && (
          <NewsGrid articles={latestArticles} title="Dernières actualités" />
        )}
      </div>
    </>
  );
}
