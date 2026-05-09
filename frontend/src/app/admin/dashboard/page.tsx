import { createServerSupabaseClient } from "@/lib/supabase/server";
import Link from "next/link";
import StatusBadge from "@/components/admin/StatusBadge";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Tableau de bord" };

function StatCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: number;
  sub?: string;
  accent?: string;
}) {
  return (
    <div className="bg-gray-900 border border-white/5 rounded-xl p-5">
      <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">{label}</p>
      <p className={`text-4xl font-black tabular-nums ${accent ?? "text-white"}`}>{value}</p>
      {sub && <p className="text-xs text-gray-600 mt-1">{sub}</p>}
    </div>
  );
}

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient();

  // Parallel queries for stats
  const [totalRes, publishedRes, draftsRes, archivedRes, catRes, recentRes] =
    await Promise.all([
      supabase.from("articles").select("*", { count: "exact", head: true }),
      supabase.from("articles").select("*", { count: "exact", head: true }).eq("status", "published"),
      supabase.from("articles").select("*", { count: "exact", head: true }).eq("status", "draft"),
      supabase.from("articles").select("*", { count: "exact", head: true }).eq("status", "archived"),
      supabase.from("categories").select("*", { count: "exact", head: true }),
      supabase
        .from("articles")
        .select("id, title, status, created_at, categories:category_id(name)")
        .order("created_at", { ascending: false })
        .limit(8),
    ]);

  const stats = {
    total: totalRes.count ?? 0,
    published: publishedRes.count ?? 0,
    drafts: draftsRes.count ?? 0,
    archived: archivedRes.count ?? 0,
    categories: catRes.count ?? 0,
  };

  const recentArticles = (recentRes.data ?? []) as Array<{
    id: string;
    title: string;
    status: "draft" | "published" | "archived";
    created_at: string;
    categories: { name: string } | null;
  }>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-white mb-1">Tableau de bord</h1>
        <p className="text-sm text-gray-500">Vue d&apos;ensemble de la salle de rédaction.</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <StatCard label="Articles" value={stats.total} sub="total" />
        <StatCard
          label="Publiés"
          value={stats.published}
          accent="text-emerald-400"
          sub="en ligne"
        />
        <StatCard
          label="Brouillons"
          value={stats.drafts}
          accent="text-amber-400"
          sub="en cours"
        />
        <StatCard
          label="Archivés"
          value={stats.archived}
          accent="text-gray-500"
        />
        <StatCard
          label="Catégories"
          value={stats.categories}
          accent="text-blue-400"
          sub="rubriques"
        />
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-3 mb-8">
        <Link
          href="/admin/articles/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-white text-sm font-bold rounded-full transition-all active:scale-95"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nouvel article
        </Link>
        <Link
          href="/admin/articles"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 text-sm font-semibold rounded-full transition-all border border-white/8"
        >
          Tous les articles
        </Link>
      </div>

      {/* Recent articles */}
      <div className="bg-gray-900 border border-white/5 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
          <h2 className="text-sm font-bold text-white">Articles récents</h2>
          <Link
            href="/admin/articles"
            className="text-xs text-amber-400 hover:text-amber-300 font-semibold"
          >
            Voir tout →
          </Link>
        </div>

        {recentArticles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center px-4">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-sm text-gray-500 mb-3">Aucun article pour l&apos;instant.</p>
            <Link
              href="/admin/articles/new"
              className="text-xs text-amber-400 hover:text-amber-300 font-semibold"
            >
              Créer le premier article →
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {recentArticles.map((article) => (
              <Link
                key={article.id}
                href={`/admin/articles/${article.id}`}
                className="flex items-center gap-4 px-5 py-3.5 hover:bg-white/3 transition-colors group"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-200 truncate group-hover:text-white transition-colors">
                    {article.title}
                  </p>
                  <p className="text-xs text-gray-600 mt-0.5">
                    {article.categories?.name ?? "—"} ·{" "}
                    {new Date(article.created_at).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <StatusBadge status={article.status} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
