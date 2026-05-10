"use client";

import { useState, useEffect } from "react";
import { getLiveUpdates, addLiveUpdate, deleteLiveUpdate } from "@/lib/admin/liveUpdatesService";
import type { LiveUpdate } from "@/lib/admin/liveUpdatesService";

interface LiveUpdatesPanelProps {
  articleId: string;
}

export default function LiveUpdatesPanel({ articleId }: LiveUpdatesPanelProps) {
  const [updates, setUpdates] = useState<LiveUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState("");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const data = await getLiveUpdates(articleId);
        if (active) { setUpdates(data); setLoading(false); }
      } catch {
        if (active) setLoading(false);
      }
    }
    load();
    return () => { active = false; };
  }, [articleId, refreshKey]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;
    setSaving(true);
    try {
      await addLiveUpdate({ article_id: articleId, content: content.trim(), author_note: note.trim() || undefined });
      setContent("");
      setNote("");
      setRefreshKey((k) => k + 1);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Erreur");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      await deleteLiveUpdate(id);
      setRefreshKey((k) => k + 1);
    } catch {
      /* silent */
    } finally {
      setDeletingId(null);
    }
  }

  function formatTime(iso: string) {
    return new Date(iso).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  }

  return (
    <div className="bg-gray-900 border border-white/5 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-4">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
        </span>
        <h3 className="text-sm font-black uppercase tracking-widest text-red-400">Mises à jour en direct</h3>
        <span className="text-xs text-gray-500">{updates.length} entrée{updates.length !== 1 ? "s" : ""}</span>
      </div>

      <form onSubmit={handleAdd} className="space-y-2 mb-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Contenu de la mise à jour…"
          rows={2}
          className="w-full bg-gray-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20 resize-none"
        />
        <div className="flex gap-2">
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Note rédacteur (optionnel)"
            className="flex-1 bg-gray-800 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-red-500/50"
          />
          <button
            type="submit"
            disabled={saving || !content.trim()}
            className="px-4 py-1.5 bg-red-600 hover:bg-red-500 disabled:opacity-40 text-white text-xs font-bold rounded-lg transition-colors"
          >
            {saving ? "…" : "Publier"}
          </button>
        </div>
      </form>

      {loading ? (
        <div className="text-xs text-gray-600 py-3 text-center">Chargement…</div>
      ) : updates.length === 0 ? (
        <div className="text-xs text-gray-600 py-3 text-center">Aucune mise à jour publiée.</div>
      ) : (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {updates.map((u) => (
            <div key={u.id} className="flex gap-2 items-start group">
              <span className="text-xs font-mono text-gray-600 mt-0.5 shrink-0">{formatTime(u.created_at)}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-300">{u.content}</p>
                {u.author_note && (
                  <p className="text-[10px] text-gray-600 mt-0.5 italic">{u.author_note}</p>
                )}
              </div>
              <button
                onClick={() => handleDelete(u.id)}
                disabled={deletingId === u.id}
                className="p-1 text-gray-700 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 shrink-0"
                title="Supprimer"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
