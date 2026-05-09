import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllCategorySlugs, slugToCategory } from "@/lib/utils";
import { getPaginatedArticles, getArticlesByCategory, getFeaturedArticles } from "@/lib/api/articles";
import CategoryHero from "@/components/category/CategoryHero";
import ArticleCard from "@/components/ui/ArticleCard";
import Sidebar from "@/components/home/Sidebar";
import HeroArticle from "@/components/home/HeroArticle";
import Pagination from "@/components/ui/Pagination";

interface Params {
  category: string;
}

interface SearchParams {
  page?: string;
}

export function generateStaticParams(): Params[] {
  return getAllCategorySlugs().map((slug) => ({ category: slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { category: slug } = await params;
  const category = slugToCategory(slug);
  if (!category) return { title: "Catégorie introuvable | GoldenNews7" };

  return {
    title: `${category} — Actualités | GoldenNews7`,
    description: `Toute l'actualité ${category} sur GoldenNews7 — analyses, reportages et informations en continu.`,
    openGraph: {
      title: `${category} | GoldenNews7`,
      description: `Toute l'actualité ${category} en continu.`,
    },
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<SearchParams>;
}) {
  const { category: slug } = await params;
  const { page: pageParam } = await searchParams;

  const category = slugToCategory(slug);
  if (!category) notFound();

  const page = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);
  const PAGE_SIZE = 6;

  const { data: articles, pagination } = await getPaginatedArticles(category, page, PAGE_SIZE);
  const allCategoryArticles = await getArticlesByCategory(category);
  const featured = allCategoryArticles.find((a) => a.isFeatured) ?? allCategoryArticles[0];
  const gridArticles = articles.filter((a) => a.id !== featured?.id);

  const [globalFeatured] = await getFeaturedArticles();
  void globalFeatured;
  const sidebarArticles = allCategoryArticles.slice(0, 5);

  return (
    <div className="container mx-auto px-4 py-6">
      <CategoryHero category={category} count={pagination.total} />

      {articles.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-gray-700 mb-1">Aucun article disponible</h2>
          <p className="text-sm text-gray-400">
            Les articles de la rubrique {category} seront bientôt disponibles.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-8">
            {featured && page === 1 && (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-1 h-5 bg-amber-500 rounded-full" />
                  <h2 className="text-sm font-black text-gray-900 uppercase tracking-wide">
                    À la une — {category}
                  </h2>
                </div>
                <HeroArticle article={featured} />
              </div>
            )}
            {gridArticles.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-1 h-5 bg-gray-300 rounded-full" />
                  <h2 className="text-sm font-black text-gray-900 uppercase tracking-wide">
                    Tous les articles
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {gridArticles.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              </div>
            )}
            <Pagination page={pagination.page} totalPages={pagination.totalPages} basePath={`/${slug}`} />
          </div>
          <aside className="lg:col-span-1">
            <Sidebar articles={sidebarArticles.length > 0 ? sidebarArticles : undefined} />
          </aside>
        </div>
      )}
    </div>
  );
}
