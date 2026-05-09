"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useToast } from "@/components/admin/ToastProvider";
import { getContextCardById, updateContextCard } from "@/lib/admin/contextCardService";

export default function EditContextCardPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ keyword: "", title: "", content: "" });

  useEffect(() => {
    getContextCardById(params.id)
      .then((card) => {
        if (!card) { router.push("/admin/context-cards"); return; }
        setForm({ keyword: card.keyword, title: card.title, content: card.content });
      })
      .catch(() => toast("Carte introuvable.", "error"))
      .finally(() => setLoading(false));
  }, [params.id, router, toast]);

  function set(field: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.keyword.trim() || !form.title.trim() || !form.content.trim()) {
      toast("Tous les champs sont requis.", "error");
      return;
    }
    setSaving(true);
    try {
      await updateContextCard(params.id, { keyword: form.keyword.trim(), title: form.title.trim(), content: form.content.trim() });
      toast("Carte mise à jour.", "success");
      router.push("/admin/context-cards");
    } catch (err: unknown) {
      toast(err instanceof Error ? err.message : "Erreur lors de la mise à jour.", "error");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div className="h-8 w-48 bg-white/5 rounded animate-pulse mb-6" />
        <div className="bg-gray-900 border border-white/5 rounded-xl p-5 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-1.5">
              <div className="h-3 w-20 bg-white/5 rounded animate-pulse" />
              <div className="h-9 bg-white/5 rounded-lg animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/context-cards" className="text-gray-500 hover:text-gray-300 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </Link>
        <h1 className="text-2xl font-black text-white">Modifier la carte contexte</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="bg-gray-900 border border-white/5 rounded-xl p-5 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
              Mot-clé <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={form.keyword}
              onChange={(e) => set("keyword", e.target.value)}
              className="w-full bg-gray-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
              Titre de la carte <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              className="w-full bg-gray-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
              Explication <span className="text-red-400">*</span>
            </label>
            <textarea
              value={form.content}
              onChange={(e) => set("content", e.target.value)}
              rows={4}
              className="w-full bg-gray-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 resize-none"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <Link
            href="/admin/context-cards"
            className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            Annuler
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-white text-sm font-bold rounded-full transition-all active:scale-95"
          >
            {saving ? "Enregistrement…" : "Enregistrer"}
          </button>
        </div>
      </form>
    </div>
  );
}
