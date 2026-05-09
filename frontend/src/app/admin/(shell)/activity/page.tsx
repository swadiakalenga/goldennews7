"use client";

import { useEffect, useState } from "react";
import { getAdminActivityLogs, type ActivityAction } from "@/lib/admin/activityLogService";

type LogEntry = {
  id: string;
  action: string;
  entity_type: string | null;
  entity_id: string | null;
  description: string | null;
  created_at: string;
  actor: { id: string; email: string; full_name: string | null } | null;
};

const ACTION_LABELS: Record<string, string> = {
  article_created: "Article créé",
  article_updated: "Article modifié",
  article_published: "Article publié",
  article_archived: "Article archivé",
  article_deleted: "Article supprimé",
  category_created: "Catégorie créée",
  category_updated: "Catégorie modifiée",
  category_deleted: "Catégorie supprimée",
  author_created: "Auteur créé",
  author_updated: "Auteur modifié",
  author_deleted: "Auteur supprimé",
  homepage_slot_assigned: "Slot homepage assigné",
  homepage_slot_removed: "Slot homepage retiré",
  static_page_updated: "Page statique modifiée",
  settings_updated: "Paramètres mis à jour",
};

const ACTION_COLORS: Record<string, string> = {
  article_created: "text-emerald-400 bg-emerald-500/10",
  article_updated: "text-blue-400 bg-blue-500/10",
  article_published: "text-emerald-400 bg-emerald-500/10",
  article_archived: "text-gray-400 bg-gray-500/10",
  article_deleted: "text-red-400 bg-red-500/10",
  category_created: "text-purple-400 bg-purple-500/10",
  category_updated: "text-purple-400 bg-purple-500/10",
  category_deleted: "text-red-400 bg-red-500/10",
  author_created: "text-amber-400 bg-amber-500/10",
  author_updated: "text-amber-400 bg-amber-500/10",
  author_deleted: "text-red-400 bg-red-500/10",
  homepage_slot_assigned: "text-cyan-400 bg-cyan-500/10",
  homepage_slot_removed: "text-orange-400 bg-orange-500/10",
  static_page_updated: "text-indigo-400 bg-indigo-500/10",
  settings_updated: "text-yellow-400 bg-yellow-500/10",
};

const ALL_ACTIONS: ActivityAction[] = [
  "article_created", "article_updated", "article_published", "article_archived", "article_deleted",
  "category_created", "category_updated", "category_deleted",
  "author_created", "author_updated", "author_deleted",
  "homepage_slot_assigned", "homepage_slot_removed",
  "static_page_updated", "settings_updated",
];

const ENTITY_TYPES = ["article", "category", "author", "static_page", "homepage_slot", "settings"];

export default function AdminActivityPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionFilter, setActionFilter] = useState<string>("");
  const [entityFilter, setEntityFilter] = useState<string>("");

  useEffect(() => {
    setLoading(true);
    getAdminActivityLogs({
      action: actionFilter || undefined,
      entity_type: entityFilter || undefined,
      limit: 200,
    })
      .then((data) => setLogs(data as unknown as LogEntry[]))
      .finally(() => setLoading(false));
  }, [actionFilter, entityFilter]);

  const selectClass = "px-3 py-2 bg-gray-800 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-amber-500/50 transition-colors";

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-black text-white">Journal d&apos;activité</h1>
          <p className="text-sm text-gray-500 mt-0.5">Historique des actions administratives</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <select value={actionFilter} onChange={(e) => setActionFilter(e.target.value)} className={selectClass}>
          <option value="">Toutes les actions</option>
          {ALL_ACTIONS.map((a) => (
            <option key={a} value={a}>{ACTION_LABELS[a] ?? a}</option>
          ))}
        </select>
        <select value={entityFilter} onChange={(e) => setEntityFilter(e.target.value)} className={selectClass}>
          <option value="">Tous les types</option>
          {ENTITY_TYPES.map((e) => (
            <option key={e} value={e}>{e}</option>
          ))}
        </select>
        {(actionFilter || entityFilter) && (
          <button
            onClick={() => { setActionFilter(""); setEntityFilter(""); }}
            className="px-3 py-2 bg-white/5 hover:bg-white/10 text-gray-400 text-sm rounded-lg transition-colors"
          >
            Réinitialiser
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : logs.length === 0 ? (
        <div className="text-center py-16 text-gray-500 text-sm">Aucune entrée dans le journal.</div>
      ) : (
        <div className="bg-gray-900 border border-white/5 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 text-xs font-bold uppercase tracking-widest text-gray-500">
                <th className="text-left px-5 py-3">Date</th>
                <th className="text-left px-5 py-3">Action</th>
                <th className="text-left px-5 py-3">Description</th>
                <th className="text-left px-5 py-3">Acteur</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {logs.map((log) => {
                const colorClass = ACTION_COLORS[log.action] ?? "text-gray-400 bg-gray-500/10";
                return (
                  <tr key={log.id} className="hover:bg-white/3 transition-colors">
                    <td className="px-5 py-3 text-gray-500 text-xs whitespace-nowrap">
                      {new Date(log.created_at).toLocaleString("fr-FR", {
                        day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
                      })}
                    </td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${colorClass}`}>
                        {ACTION_LABELS[log.action] ?? log.action}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-300 max-w-sm truncate">
                      {log.description ?? (log.entity_type ? `${log.entity_type} ${log.entity_id ?? ""}` : "—")}
                    </td>
                    <td className="px-5 py-3 text-gray-400 text-xs">
                      {log.actor?.full_name ?? log.actor?.email ?? "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
