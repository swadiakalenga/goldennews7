"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useToast } from "@/components/admin/ToastProvider";
import { getAdminStaticPageBySlug, updateStaticPage } from "@/lib/admin/staticPagesService";
import { logActivity } from "@/lib/admin/activityLogService";

const RichTextEditor = dynamic(() => import("@/components/admin/RichTextEditor"), { ssr: false });

interface PageForm {
  title: string;
  excerpt: string;
  content: string;
  status: string;
  seo_title: string;
  seo_description: string;
}

const labelClass = "block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1.5";
const fieldClass = "w-full px-3 py-2 bg-gray-800 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-colors";

export default function AdminPageEditorPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const { toast: showToast } = useToast();

  const [pageId, setPageId] = useState<string | null>(null);
  const [form, setForm] = useState<PageForm>({
    title: "",
    excerpt: "",
    content: "",
    status: "draft",
    seo_title: "",
    seo_description: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getAdminStaticPageBySlug(slug)
      .then((data) => {
        if (!data) { router.push("/admin/pages"); return; }
        setPageId(data.id);
        setForm({
          title: data.title ?? "",
          excerpt: data.excerpt ?? "",
          content: data.content ?? "",
          status: data.status ?? "draft",
          seo_title: data.seo_title ?? "",
          seo_description: data.seo_description ?? "",
        });
      })
      .finally(() => setLoading(false));
  }, [slug, router]);

  function set<K extends keyof PageForm>(key: K, value: PageForm[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSave() {
    if (!pageId) return;
    setSaving(true);
    try {
      await updateStaticPage(pageId, {
        title: form.title,
        excerpt: form.excerpt || null,
        content: form.content,
        status: form.status as "draft" | "published" | "archived",
        seo_title: form.seo_title || null,
        seo_description: form.seo_description || null,
      });
      await logActivity({
        action: "static_page_updated",
        entity_type: "static_page",
        entity_id: pageId,
        description: `Page "${form.title}" mise à jour`,
      });
      showToast("Page enregistrée", "success");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Erreur", "error");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/pages" className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 className="text-xl font-black text-white">{form.title || "Page"}</h1>
            <p className="text-xs text-gray-500 font-mono mt-0.5">/{slug}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={form.status}
            onChange={(e) => set("status", e.target.value)}
            className="px-3 py-2 bg-gray-800 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-amber-500/50"
          >
            <option value="draft">Brouillon</option>
            <option value="published">Publié</option>
            <option value="archived">Archivé</option>
          </select>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-white text-sm font-bold rounded-lg transition-colors"
          >
            {saving ? "Enregistrement…" : "Enregistrer"}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-gray-900 border border-white/5 rounded-xl p-5 space-y-4">
            <div>
              <label className={labelClass}>Titre</label>
              <input value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Titre de la page" className={fieldClass} />
            </div>
            <div>
              <label className={labelClass}>Résumé</label>
              <textarea rows={2} value={form.excerpt} onChange={(e) => set("excerpt", e.target.value)} placeholder="Courte description affichée sous le titre…" className={`${fieldClass} resize-none`} />
            </div>
          </div>

          <div className="bg-gray-900 border border-white/5 rounded-xl p-5">
            <label className={`${labelClass} mb-3`}>Contenu</label>
            <RichTextEditor value={form.content} onChange={(html) => set("content", html)} placeholder="Rédigez le contenu de la page…" />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="bg-gray-900 border border-white/5 rounded-xl p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">SEO</h3>
            <div>
              <label className={labelClass}>Titre SEO</label>
              <input value={form.seo_title} onChange={(e) => set("seo_title", e.target.value)} placeholder={form.title} className={fieldClass} />
            </div>
            <div>
              <label className={labelClass}>Description SEO</label>
              <textarea rows={3} value={form.seo_description} onChange={(e) => set("seo_description", e.target.value)} placeholder={form.excerpt || "Description pour les moteurs de recherche…"} className={`${fieldClass} resize-none`} />
              <p className="text-xs text-gray-600 mt-1">{form.seo_description.length}/160 caractères</p>
            </div>
          </div>

          <div className="bg-gray-900 border border-white/5 rounded-xl p-5">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Aperçu</h3>
            <a
              href={slug === "a-propos" ? "/a-propos" : `/${slug}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-sm text-amber-400 hover:text-amber-300 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Voir la page publique
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
