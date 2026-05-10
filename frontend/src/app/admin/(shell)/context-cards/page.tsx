"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useToast } from "@/components/admin/ToastProvider";
import ConfirmModal from "@/components/admin/ConfirmModal";
import { getContextCards, deleteContextCard } from "@/lib/admin/contextCardService";
import type { ContextCard } from "@/lib/admin/contextCardService";

export default function AdminContextCardsPage() {
  const { toast } = useToast();
  const [cards, setCards] = useState<ContextCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<ContextCard | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const data = await getContextCards();
        if (active) { setCards(data); setLoading(false); }
      } catch {
        if (active) { toast("Erreur lors du chargement des cartes contexte.", "error"); setLoading(false); }
      }
    }
    load();
    return () => { active = false; };
  }, [toast, refreshKey]);

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await deleteContextCard(deleteTarget.id);
      toast("Carte supprimée.", "success");
      setDeleteTarget(null);
      setRefreshKey((k) => k + 1);
    } catch (err: unknown) {
      toast(err instanceof Error ? err.message : "Erreur lors de la suppression.", "error");
    } finally {
      setDeleteLoading(false);
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-white">Cartes Contexte</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {cards.length} carte{cards.length !== 1 ? "s" : ""} — survol de mots-clés dans les articles
          </p>
        </div>
        <Link
          href="/admin/context-cards/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-white text-sm font-bold rounded-full transition-all active:scale-95"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nouvelle carte
        </Link>
      </div>

      <div className="bg-gray-900 border border-white/5 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500 text-sm">Chargement…</div>
        ) : cards.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-4">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
            </div>
            <p className="text-sm text-gray-500 mb-3">Aucune carte contexte.</p>
            <Link href="/admin/context-cards/new" className="text-xs text-amber-400 hover:text-amber-300 font-semibold">
              Créer la première carte →
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 text-left">
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-500">Mot-clé</th>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-500">Titre</th>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-500 hidden md:table-cell">Contenu</th>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {cards.map((card) => (
                  <tr key={card.id} className="hover:bg-white/2 transition-colors group">
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2.5 py-1 bg-amber-500/15 text-amber-400 text-xs font-bold rounded-full border border-amber-500/20">
                        {card.keyword}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-gray-200">{card.title}</span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <p className="text-xs text-gray-500 line-clamp-2 max-w-xs">{card.content}</p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Link
                          href={`/admin/context-cards/${card.id}`}
                          className="p-1.5 rounded-md text-gray-500 hover:text-amber-400 hover:bg-amber-400/10 transition-colors"
                          title="Modifier"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </Link>
                        <button
                          onClick={() => setDeleteTarget(card)}
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
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmModal
        open={!!deleteTarget}
        title="Supprimer la carte contexte"
        message={`Supprimer la carte pour le mot-clé « ${deleteTarget?.keyword ?? ""} » ? Cette action est irréversible.`}
        confirmLabel="Supprimer"
        danger
        loading={deleteLoading}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
