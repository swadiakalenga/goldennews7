export const dynamic = "force-dynamic";

import BreakingNews from "@/components/home/BreakingNews";
import HeroArticle from "@/components/home/HeroArticle";
import NewsGrid from "@/components/home/NewsGrid";
import Sidebar from "@/components/home/Sidebar";
import DailyBriefing from "@/components/home/DailyBriefing";
import ArticleCard from "@/components/ui/ArticleCard";
import { getArticles, getFeaturedArticles } from "@/lib/api/articles";
import { getHomepageConfig } from "@/lib/api/homepage";
import type { Article } from "@/types";

// Empty state shown when no published articles exist at all
function EmptyState() {
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

export default async function HomePage() {
  const [config, featured, all] = await Promise.all([
    getHomepageConfig(),
    getFeaturedArticles(),
    getArticles(),
  ]);

  if (!all.length) return <EmptyState />;

  // ── Resolve hero ──────────────────────────────────────────────────────────
  const heroSection = config.find((s) => s.section_key === "hero");
  const heroMainSlot = heroSection?.slots.find((s) => s.slot_type === "hero_main");
  const heroSecondarySlots = heroSection?.slots.filter((s) => s.slot_type === "hero_secondary") ?? [];

  const hero: Article = heroMainSlot?.article ?? featured[0] ?? all[0];

  // Sidebar: configured secondaries, or fallback to latest (excluding hero)
  const sidebarArticles: Article[] =
    heroSecondarySlots.length > 0
      ? heroSecondarySlots.map((s) => s.article)
      : all.filter((a) => a.id !== hero.id).slice(0, 5);

  // ── Resolve breaking ticker ───────────────────────────────────────────────
  // BreakingNews component reads is_breaking articles directly from Supabase.
  // If a 'breaking' section has configured slots, those articles are used by
  // the BreakingNewsConfigured component; otherwise the component self-fetches.

  const breakingSection = config.find((s) => s.section_key === "breaking");
  const breakingArticles = breakingSection?.slots.map((s) => s.article) ?? [];

  // ── Resolve latest grid ───────────────────────────────────────────────────
  const pinnedIds = new Set<string>([
    hero.id,
    ...heroSecondarySlots.map((s) => s.article.id),
    ...breakingArticles.map((a) => a.id),
  ]);
  const latestArticles = all.filter((a) => !pinnedIds.has(a.id)).slice(0, 6);

  // ── Resolve category sections ─────────────────────────────────────────────
  const categorySections = config
    .filter(
      (s) =>
        s.layout_type === "featured" &&
        s.slots.length > 0
    )
    .map((s) => ({
      title: s.title,
      article: s.slots.find((sl) => sl.slot_type === "category_featured")?.article,
    }))
    .filter((s): s is { title: string; article: Article } => s.article != null);

  return (
    <>
      {/* Breaking news ticker */}
      {breakingArticles.length > 0 ? (
        <ConfiguredBreakingTicker articles={breakingArticles} />
      ) : (
        <BreakingNews />
      )}

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

        {/* Daily briefing */}
        <DailyBriefing articles={all.slice(0, 5)} />

        {/* Category featured sections */}
        {categorySections.map((cs) => (
          <div key={cs.title} className="mb-10">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-1 h-6 bg-amber-500 rounded-full" />
              <h2 className="text-lg font-black text-gray-900 uppercase tracking-wide">
                {cs.title}
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <ArticleCard article={cs.article} />
            </div>
          </div>
        ))}

        {/* Latest news grid */}
        {latestArticles.length > 0 && (
          <NewsGrid articles={latestArticles} title="Dernières actualités" />
        )}
      </div>
    </>
  );
}

// Inline ticker using pre-fetched configured breaking articles
function ConfiguredBreakingTicker({ articles }: { articles: Article[] }) {
  const items = articles.map((a) => a.title);
  const doubled = [...items, ...items];

  return (
    <div className="bg-red-600 text-white py-2 overflow-hidden">
      <div className="flex items-center gap-0">
        <div className="shrink-0 flex items-center pl-4 pr-3 z-10 bg-red-600">
          <span
            className="text-[10px] font-black uppercase tracking-widest bg-white text-red-600 px-2.5 py-1 rounded"
            style={{ boxShadow: "0 0 10px rgba(255,255,255,0.5)" }}
          >
            Urgent
          </span>
        </div>
        <div className="shrink-0 w-6 bg-gradient-to-r from-red-600 to-transparent z-10" />
        <div className="overflow-hidden flex-1 relative">
          <div className="animate-marquee">
            {doubled.map((item, i) => (
              <span
                key={i}
                className="inline-flex items-center shrink-0 text-sm font-medium pr-16 whitespace-nowrap"
              >
                {item}
                <span className="ml-16 text-red-300 text-xs" aria-hidden="true">◆</span>
              </span>
            ))}
          </div>
        </div>
        <div className="shrink-0 w-8 bg-gradient-to-l from-red-600 to-transparent z-10" />
      </div>
    </div>
  );
}
