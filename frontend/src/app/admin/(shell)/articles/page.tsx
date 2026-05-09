"use client";

import { useState, useEffect, useCallback, useTransition } from "react";
import Link from "next/link";
import StatusBadge from "@/components/admin/StatusBadge";
import ConfirmModal from "@/components/admin/ConfirmModal";
import { useToast } from "@/components/admin/ToastProvider";
import { TableSkeleton } from "@/components/admin/Skeleton";
import {
  getAdminArticles,
  deleteArticle,
  toggleArticleField,
  type ArticleWithRelations,
} from "@/lib/admin/articleAdminService";

const PAGE_SIZE = 20;

const STATUS_OPTIONS = [
  { value: "all", label: "Tous" },
  { value: "published", label: "Publiés" },
  { value: "draft", label: "Brouillons" },
  { value: "archived", label: "Archivés" },
];

export default function AdminArticlesPage() {
  const { toast } = useToast();
  const [, startTransition] = useTransition();

  const [articles, setArticles] = useState<ArticleWithRelations[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("all");
  const [q, setQ] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [sortBy, setSortBy] = useState<"created_at" | "views_count">("created_at");

  const [deleteTarget, setDeleteTarget] = useState<ArticleWithRelations | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const totalPages = Math.ceil(count / PAGE_SIZE);

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getAdminArticles({ status, q, page, pageSize: PAGE_SIZE, sortBy });
      setArticles(result.data);
      setCount(result.count);
    } catch {
      toast("Erreur lors du chargement des articles.", "error");
    } finally {
      setLoading(false);
    }
  }, [status, q, page, toast, sortBy]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setQ(searchInput);
    setPage(1);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await deleteArticle(deleteTarget.id);
      toast("Article supprimé.", "success");
      setDeleteTarget(null);
      fetchArticles();
    } catch {
      toast("Erreur lors de la suppression.", "error");
    } finally {
      setDeleteLoading(false);
    }
  }

  async function handleToggle(
    article: ArticleWithRelations,
    field: "is_featured" | "is_breaking"
  ) {
    const newValue = !article[field];
    // Optimistic update
    setArticles((prev) =>
      prev.map((a) => (a.id === article.id ? { ...a, [field]: newValue } : a))
    );
    try {
      await toggleArticleField(article.id, field, newValue);
    } catch {
      // Revert
      setArticles((prev) =>
        prev.map((a) => (a.id === article.id ? { ...a, [field]: !newValue } : a))
      );
      toast("Erreur lors de la mise à jour.", "error");
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-white">Articles</h1>
          <p className="text-sm text-gray-500 mt-0.5">{count} article{count !== 1 ? "s" : ""}</p>
        </div>
        <Link
          href="/admin/articles/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-white text-sm font-bold rounded-full transition-all active:scale-95"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nouvel article
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <form onSubmit={handleSearch} className="flex gap-2 flex-1">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Rechercher un article…"
              className="w-full pl-9 pr-4 py-2 bg-gray-900 border border-white/8 rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none focus:border-amber-500/60"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/8 text-gray-300 text-sm font-semibold rounded-lg transition-colors"
          >
            Filtrer
          </button>
        </form>

        <div className="flex gap-1 bg-gray-900 border border-white/5 rounded-lg p-1">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => { setStatus(opt.value); setPage(1); }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                status === opt.value
                  ? "bg-amber-500 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => { setSortBy((s) => s === "created_at" ? "views_count" : "created_at"); setPage(1); }}
          title={sortBy === "views_count" ? "Trier par date" : "Trier par vues"}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-semibold transition-colors ${
            sortBy === "views_count"
              ? "bg-amber-500/15 border-amber-500/30 text-amber-400"
              : "bg-gray-900 border-white/5 text-gray-400 hover:text-white"
          }`}
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          {sortBy === "views_count" ? "Par vues" : "Vues"}
        </button>
      </div>

      {/* Table */}
      <div className="bg-gray-900 border border-white/5 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 text-left">
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-500">Titre</th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-500 hidden sm:table-cell">Catégorie</th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-500 hidden md:table-cell">Auteur</th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-500">Statut</th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-500 hidden lg:table-cell">Une</th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-500 hidden lg:table-cell">Urgent</th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-500 hidden md:table-cell">Date</th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-500 hidden lg:table-cell text-right">Vues</th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <TableSkeleton rows={8} cols={8} />
              ) : articles.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-20 text-center text-gray-500 text-sm">
                    Aucun article trouvé.
                  </td>
                </tr>
              ) : (
                articles.map((article) => (
                  <tr key={article.id} className="hover:bg-white/2 transition-colors group">
                    <td className="px-4 py-3 max-w-[260px]">
                      <Link
                        href={`/admin/articles/${article.id}`}
                        className="font-semibold text-gray-200 hover:text-amber-400 transition-colors line-clamp-2 leading-snug"
                      >
                        {article.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell text-gray-500 text-xs">
                      {article.categories?.name ?? "—"}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-gray-500 text-xs">
                      {article.authors?.name ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={article.status} />
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <button
                        onClick={() => startTransition(() => handleToggle(article, "is_featured"))}
                        title={article.is_featured ? "Retirer de la une" : "Mettre à la une"}
                        className={`w-9 h-5 rounded-full transition-all ${article.is_featured ? "bg-amber-500" : "bg-gray-700 hover:bg-gray-600"}`}
                      >
                        <span className={`block w-4 h-4 rounded-full bg-white shadow transition-transform mx-0.5 ${article.is_featured ? "translate-x-4" : ""}`} />
                      </button>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <button
                        onClick={() => startTransition(() => handleToggle(article, "is_breaking"))}
                        title={article.is_breaking ? "Retirer urgent" : "Marquer urgent"}
                        className={`w-9 h-5 rounded-full transition-all ${article.is_breaking ? "bg-red-500" : "bg-gray-700 hover:bg-gray-600"}`}
                      >
                        <span className={`block w-4 h-4 rounded-full bg-white shadow transition-transform mx-0.5 ${article.is_breaking ? "translate-x-4" : ""}`} />
                      </button>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-gray-600 text-xs whitespace-nowrap">
                      {new Date(article.created_at).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-right">
                      <span className="text-xs font-semibold text-gray-400 tabular-nums">
                        {(article.views_count ?? 0).toLocaleString("fr-FR")}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Link
                          href={`/admin/articles/${article.id}`}
                          className="p-1.5 rounded-md text-gray-500 hover:text-amber-400 hover:bg-amber-400/10 transition-colors"
                          title="Modifier"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </Link>
                        <button
                          onClick={() => setDeleteTarget(article)}
                          className="p-1.5 rounded-md text-gray-500 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                          title="Supprimer"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-white/5">
            <p className="text-xs text-gray-500">
              Page {page} / {totalPages}
            </p>
            <div className="flex gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-3 py-1.5 text-xs font-semibold text-gray-400 border border-white/8 rounded-md hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Précédent
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="px-3 py-1.5 text-xs font-semibold text-gray-400 border border-white/8 rounded-md hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Suivant
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete confirmation */}
      <ConfirmModal
        open={!!deleteTarget}
        title="Supprimer l'article"
        message={`Êtes-vous sûr de vouloir supprimer « ${deleteTarget?.title ?? ""} » ? Cette action est irréversible.`}
        confirmLabel="Supprimer"
        danger
        loading={deleteLoading}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
