"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useToast } from "@/components/admin/ToastProvider";
import ConfirmModal from "@/components/admin/ConfirmModal";
import { getAdminAuthors, deleteAuthor } from "@/lib/admin/authorAdminService";
import type { Database } from "@/lib/supabase/types";

type AuthorRow = Database["public"]["Tables"]["authors"]["Row"];

export default function AdminAuthorsPage() {
  const { toast } = useToast();
  const [authors, setAuthors] = useState<AuthorRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<AuthorRow | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const data = await getAdminAuthors();
        if (active) { setAuthors(data); setLoading(false); }
      } catch {
        if (active) { toast("Erreur lors du chargement des auteurs.", "error"); setLoading(false); }
      }
    }
    load();
    return () => { active = false; };
  }, [toast, refreshKey]);

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await deleteAuthor(deleteTarget.id);
      toast("Auteur supprimé.", "success");
      setDeleteTarget(null);
      setRefreshKey((k) => k + 1);
    } catch (err: unknown) {
      toast(err instanceof Error ? err.message : "Erreur lors de la suppression.", "error");
    } finally {
      setDeleteLoading(false);
    }
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-white">Auteurs</h1>
          <p className="text-sm text-gray-500 mt-0.5">{authors.length} auteur{authors.length !== 1 ? "s" : ""}</p>
        </div>
        <Link
          href="/admin/authors/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-white text-sm font-bold rounded-full transition-all active:scale-95"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nouvel auteur
        </Link>
      </div>

      <div className="bg-gray-900 border border-white/5 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500 text-sm">Chargement…</div>
        ) : authors.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-4">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <p className="text-sm text-gray-500 mb-3">Aucun auteur pour l&apos;instant.</p>
            <Link href="/admin/authors/new" className="text-xs text-amber-400 hover:text-amber-300 font-semibold">
              Créer le premier auteur →
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {authors.map((author) => (
              <div key={author.id} className="flex items-center gap-4 px-5 py-4 hover:bg-white/2 transition-colors group">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0 overflow-hidden">
                  {author.avatar_url ? (
                    <Image src={author.avatar_url} alt={author.name} width={40} height={40} className="object-cover w-full h-full" />
                  ) : (
                    <span className="text-sm font-bold text-amber-400">{author.name.charAt(0)}</span>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-200 group-hover:text-white transition-colors">
                    {author.name}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {author.role ?? "—"} {author.email ? `· ${author.email}` : ""}
                  </p>
                </div>

                {/* Slug */}
                <code className="hidden sm:block text-xs text-gray-600 shrink-0">/auteur/{author.slug}</code>

                {/* Socials */}
                <div className="hidden md:flex items-center gap-1 shrink-0">
                  {author.twitter_url && (
                    <a href={author.twitter_url} target="_blank" rel="noopener noreferrer" className="p-1.5 text-gray-600 hover:text-sky-400 transition-colors" title="Twitter">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    </a>
                  )}
                  {author.facebook_url && (
                    <a href={author.facebook_url} target="_blank" rel="noopener noreferrer" className="p-1.5 text-gray-600 hover:text-blue-400 transition-colors" title="Facebook">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                    </a>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  <Link
                    href={`/admin/authors/${author.id}`}
                    className="p-1.5 rounded-md text-gray-500 hover:text-amber-400 hover:bg-amber-400/10 transition-colors"
                    title="Modifier"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </Link>
                  <button
                    onClick={() => setDeleteTarget(author)}
                    className="p-1.5 rounded-md text-gray-500 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                    title="Supprimer"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmModal
        open={!!deleteTarget}
        title="Supprimer l'auteur"
        message={`Êtes-vous sûr de vouloir supprimer « ${deleteTarget?.name ?? ""} » ? Cette action est irréversible.`}
        confirmLabel="Supprimer"
        danger
        loading={deleteLoading}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
