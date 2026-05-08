import BreakingNews from "@/components/home/BreakingNews";
import HeroArticle from "@/components/home/HeroArticle";
import NewsGrid from "@/components/home/NewsGrid";
import Sidebar from "@/components/home/Sidebar";
import { featuredArticle, latestArticles } from "@/data/mock-news";

export default function HomePage() {
  return (
    <>
      <BreakingNews />

      <div className="container mx-auto px-4 py-6">
        {/* Hero + sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          <div className="lg:col-span-2">
            <HeroArticle article={featuredArticle} />
          </div>
          <div className="lg:col-span-1">
            <Sidebar />
          </div>
        </div>

        {/* Latest news grid */}
        <NewsGrid articles={latestArticles} title="Dernières actualités" />
      </div>
    </>
  );
}
