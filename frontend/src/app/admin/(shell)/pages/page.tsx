"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAdminStaticPages } from "@/lib/admin/staticPagesService";

type PageRow = {
  id: string;
  slug: string;
  title: string;
  status: string;
  updated_at: string | null;
  excerpt: string | null;
};

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  published: { label: "Publié", color: "text-emerald-400 bg-emerald-500/10" },
  draft: { label: "Brouillon", color: "text-yellow-400 bg-yellow-500/10" },
  archived: { label: "Archivé", color: "text-gray-400 bg-gray-500/10" },
};

export default function AdminPagesPage() {
  const [pages, setPages] = useState<PageRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminStaticPages()
      .then((data) => setPages(data as PageRow[]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-black text-white">Pages statiques</h1>
          <p className="text-sm text-gray-500 mt-0.5">À propos, Contact, CGU, Confidentialité…</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : pages.length === 0 ? (
        <div className="text-center py-16 text-gray-500 text-sm">Aucune page trouvée.</div>
      ) : (
        <div className="bg-gray-900 border border-white/5 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 text-xs font-bold uppercase tracking-widest text-gray-500">
                <th className="text-left px-5 py-3">Titre</th>
                <th className="text-left px-5 py-3">Slug</th>
                <th className="text-left px-5 py-3">Statut</th>
                <th className="text-left px-5 py-3">Modifié</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {pages.map((page) => {
                const statusMeta = STATUS_LABELS[page.status] ?? { label: page.status, color: "text-gray-400 bg-gray-500/10" };
                return (
                  <tr key={page.id} className="hover:bg-white/3 transition-colors">
                    <td className="px-5 py-3.5 font-semibold text-white">{page.title}</td>
                    <td className="px-5 py-3.5 text-gray-400 font-mono text-xs">/{page.slug}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${statusMeta.color}`}>
                        {statusMeta.label}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-500 text-xs">
                      {page.updated_at
                        ? new Date(page.updated_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })
                        : "—"}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <Link
                        href={`/admin/pages/${page.slug}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-semibold rounded-lg transition-colors"
                      >
                        Modifier
                      </Link>
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
