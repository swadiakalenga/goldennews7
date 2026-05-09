"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useToast } from "@/components/admin/ToastProvider";
import { createContextCard } from "@/lib/admin/contextCardService";

export default function NewContextCardPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ keyword: "", title: "", content: "" });

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
      await createContextCard({ keyword: form.keyword.trim(), title: form.title.trim(), content: form.content.trim() });
      toast("Carte créée.", "success");
      router.push("/admin/context-cards");
    } catch (err: unknown) {
      toast(err instanceof Error ? err.message : "Erreur lors de la création.", "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/context-cards" className="text-gray-500 hover:text-gray-300 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </Link>
        <h1 className="text-2xl font-black text-white">Nouvelle carte contexte</h1>
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
              placeholder="ex: ONU, Franc CFA, CEDEAO…"
              className="w-full bg-gray-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20"
            />
            <p className="text-xs text-gray-600 mt-1">Ce mot sera mis en évidence dans les articles (insensible à la casse).</p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
              Titre de la carte <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="ex: Organisation des Nations Unies"
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
              placeholder="Brève explication affichée au survol du mot-clé dans les articles…"
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
            {saving ? "Enregistrement…" : "Créer la carte"}
          </button>
        </div>
      </form>
    </div>
  );
}
