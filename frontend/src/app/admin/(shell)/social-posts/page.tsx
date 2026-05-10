"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useToast } from "@/components/admin/ToastProvider";
import { getSocialPosts, deleteSocialPost } from "@/lib/admin/socialPostsService";
import type { SocialPost } from "@/lib/admin/socialPostsService";

const STATUS_CONFIG = {
  success: { label: "Publié", className: "bg-emerald-500/15 text-emerald-400" },
  failed:  { label: "Échec",  className: "bg-red-500/15 text-red-400" },
  pending: { label: "En attente", className: "bg-amber-500/15 text-amber-400" },
};

const PLATFORM_CONFIG = {
  twitter:  { label: "X / Twitter", icon: "𝕏", className: "text-sky-400" },
  facebook: { label: "Facebook",    icon: "f",  className: "text-blue-400" },
};

export default function AdminSocialPostsPage() {
  const { toast } = useToast();
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const data = await getSocialPosts(100);
        if (active) { setPosts(data); setLoading(false); }
      } catch {
        if (active) { toast("Erreur de chargement.", "error"); setLoading(false); }
      }
    }
    load();
    return () => { active = false; };
  }, [toast]);

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      await deleteSocialPost(id);
      setPosts((p) => p.filter((x) => x.id !== id));
      toast("Entrée supprimée.", "success");
    } catch {
      toast("Erreur lors de la suppression.", "error");
    } finally {
      setDeletingId(null);
    }
  }

  function fmt(iso: string | null) {
    if (!iso) return "—";
    return new Date(iso).toLocaleString("fr-FR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
  }

  const byStatus = (s: string) => posts.filter((p) => p.status === s).length;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-white">Partages sociaux</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {posts.length} entrée{posts.length !== 1 ? "s" : ""}
            {byStatus("success") > 0 && <> · <span className="text-emerald-400">{byStatus("success")} publiés</span></>}
            {byStatus("failed") > 0  && <> · <span className="text-red-400">{byStatus("failed")} échecs</span></>}
          </p>
        </div>
        <Link
          href="/admin/settings"
          className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
        >
          Configurer l&apos;auto-partage →
        </Link>
      </div>

      <div className="bg-gray-900 border border-white/5 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500 text-sm">Chargement…</div>
        ) : posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-4">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </div>
            <p className="text-sm text-gray-500">Aucun partage enregistré pour l&apos;instant.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 text-left">
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-500">Plateforme</th>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-500">Article</th>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-500 hidden md:table-cell">Texte</th>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-500">Statut</th>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-500 hidden lg:table-cell">Publié le</th>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {posts.map((post) => {
                  const plat = PLATFORM_CONFIG[post.platform] ?? { label: post.platform, icon: "•", className: "text-gray-400" };
                  const stat = STATUS_CONFIG[post.status] ?? STATUS_CONFIG.pending;
                  return (
                    <tr key={post.id} className="hover:bg-white/2 transition-colors">
                      <td className="px-4 py-3">
                        <span className={`font-bold ${plat.className}`}>{plat.label}</span>
                      </td>
                      <td className="px-4 py-3">
                        {post.article_slug ? (
                          <Link
                            href={`/admin/articles/${post.article_id}`}
                            className="text-gray-200 hover:text-amber-400 transition-colors text-xs font-semibold line-clamp-1"
                          >
                            {post.article_title ?? post.article_id}
                          </Link>
                        ) : (
                          <span className="text-xs text-gray-500">{post.article_id.slice(0, 8)}…</span>
                        )}
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <p className="text-xs text-gray-500 line-clamp-2 max-w-xs">{post.post_text}</p>
                        {post.status === "failed" && post.error_message && (
                          <p className="text-[10px] text-red-400 mt-0.5 line-clamp-1">{post.error_message}</p>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold w-fit ${stat.className}`}>
                            {stat.label}
                          </span>
                          {post.post_url && (
                            <a
                              href={post.post_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] text-amber-400 hover:text-amber-300"
                            >
                              Voir le post →
                            </a>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <span className="text-xs text-gray-500">{fmt(post.posted_at ?? post.created_at)}</span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleDelete(post.id)}
                          disabled={deletingId === post.id}
                          className="p-1.5 rounded-md text-gray-600 hover:text-red-400 hover:bg-red-400/10 transition-colors disabled:opacity-40"
                          title="Supprimer l'entrée"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
