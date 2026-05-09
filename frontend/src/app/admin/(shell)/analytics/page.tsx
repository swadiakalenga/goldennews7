"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAnalyticsSummary, type AnalyticsSummary } from "@/lib/admin/analyticsService";

function StatCard({
  label,
  value,
  sub,
  icon,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-gray-900 border border-white/5 rounded-xl p-5 flex items-start gap-4">
      <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-2xl font-black text-white">{value.toLocaleString("fr-FR")}</p>
        <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mt-0.5">{label}</p>
        {sub && <p className="text-xs text-gray-600 mt-1">{sub}</p>}
      </div>
    </div>
  );
}

function CategoryBar({ name, views, max }: { name: string; views: number; max: number }) {
  const pct = max > 0 ? Math.round((views / max) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-gray-400 w-28 shrink-0 truncate">{name}</span>
      <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-amber-500 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs font-semibold text-gray-300 w-14 text-right tabular-nums">
        {views.toLocaleString("fr-FR")}
      </span>
    </div>
  );
}

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAnalyticsSummary()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-8 text-center text-gray-500 text-sm">
        Impossible de charger les analytics.
      </div>
    );
  }

  const maxCatViews = data.categoryViews[0]?.views ?? 1;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-xl font-black text-white">Analytics</h1>
        <p className="text-sm text-gray-500 mt-0.5">Statistiques de lecture des articles publiés</p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          label="Vues totales"
          value={data.totalViews}
          sub="Tous articles publiés"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          }
        />
        <StatCard
          label="Articles publiés"
          value={data.publishedCount}
          sub="Avec compteur de vues actif"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          }
        />
        <StatCard
          label="Vues moyennes"
          value={data.publishedCount > 0 ? Math.round(data.totalViews / data.publishedCount) : 0}
          sub="Par article publié"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          }
        />
      </div>

      {/* Main grid: top articles + category breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Top 10 most-read */}
        <div className="lg:col-span-3 bg-gray-900 border border-white/5 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
            <h2 className="text-sm font-bold text-white">Articles les plus lus</h2>
            <Link
              href="/admin/articles?sort=views"
              className="text-xs text-amber-400 hover:text-amber-300 transition-colors"
            >
              Voir tous →
            </Link>
          </div>
          {data.topArticles.length === 0 ? (
            <p className="px-5 py-8 text-center text-gray-500 text-sm">Aucune vue enregistrée.</p>
          ) : (
            <ol className="divide-y divide-white/5">
              {data.topArticles.map((article, i) => (
                <li key={article.id} className="flex items-center gap-4 px-5 py-3 hover:bg-white/3 transition-colors">
                  <span className="text-xs font-black text-gray-600 w-5 shrink-0 tabular-nums">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/admin/articles/${article.id}`}
                      className="text-sm font-semibold text-gray-200 hover:text-amber-400 transition-colors line-clamp-1"
                    >
                      {article.title}
                    </Link>
                    <p className="text-xs text-gray-500 mt-0.5">{article.category_name ?? "—"}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-black text-white tabular-nums">
                      {article.views_count.toLocaleString("fr-FR")}
                    </p>
                    <p className="text-[10px] text-gray-600">vues</p>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </div>

        {/* Views by category */}
        <div className="lg:col-span-2 bg-gray-900 border border-white/5 rounded-xl p-5">
          <h2 className="text-sm font-bold text-white mb-5">Vues par catégorie</h2>
          {data.categoryViews.length === 0 ? (
            <p className="text-center text-gray-500 text-sm py-6">Aucune donnée.</p>
          ) : (
            <div className="space-y-3">
              {data.categoryViews.map((cat) => (
                <CategoryBar key={cat.name} name={cat.name} views={cat.views} max={maxCatViews} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recently active */}
      {data.recentlyViewed.length > 0 && (
        <div className="bg-gray-900 border border-white/5 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-white/5">
            <h2 className="text-sm font-bold text-white">Articles récemment actifs</h2>
            <p className="text-xs text-gray-500 mt-0.5">Articles publiés avec le plus de lectures</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs font-bold uppercase tracking-wider text-gray-500 border-b border-white/5">
                  <th className="text-left px-5 py-3">Article</th>
                  <th className="text-left px-5 py-3 hidden sm:table-cell">Catégorie</th>
                  <th className="text-left px-5 py-3 hidden md:table-cell">Publié</th>
                  <th className="text-right px-5 py-3">Vues</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {data.recentlyViewed.map((a) => (
                  <tr key={a.id} className="hover:bg-white/3 transition-colors">
                    <td className="px-5 py-3">
                      <Link
                        href={`/admin/articles/${a.id}`}
                        className="font-semibold text-gray-200 hover:text-amber-400 transition-colors line-clamp-1"
                      >
                        {a.title}
                      </Link>
                    </td>
                    <td className="px-5 py-3 hidden sm:table-cell text-gray-400 text-xs">
                      {a.category_name ?? "—"}
                    </td>
                    <td className="px-5 py-3 hidden md:table-cell text-gray-500 text-xs whitespace-nowrap">
                      {a.published_at
                        ? new Date(a.published_at).toLocaleDateString("fr-FR", {
                            day: "numeric", month: "short", year: "numeric",
                          })
                        : "—"}
                    </td>
                    <td className="px-5 py-3 text-right font-black text-white tabular-nums">
                      {a.views_count.toLocaleString("fr-FR")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
