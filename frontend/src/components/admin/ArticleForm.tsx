"use client";

import { useState, useEffect, useRef, lazy, Suspense } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useToast } from "@/components/admin/ToastProvider";
import LiveUpdatesPanel from "@/components/admin/LiveUpdatesPanel";

const RichTextEditor = lazy(() => import("@/components/admin/RichTextEditor"));
import {
  createArticle,
  updateArticle,
  type ArticleWithRelations,
} from "@/lib/admin/articleAdminService";
import { uploadArticleImage } from "@/lib/admin/uploadService";
import type { Database } from "@/lib/supabase/types";

type CategoryRow = Database["public"]["Tables"]["categories"]["Row"];
type AuthorRow = Database["public"]["Tables"]["authors"]["Row"];
type ArticleRow = Database["public"]["Tables"]["articles"]["Row"];

interface ArticleFormProps {
  article?: ArticleWithRelations;
  categories: CategoryRow[];
  authors: AuthorRow[];
}

interface FormState {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImageUrl: string;
  categoryId: string;
  authorId: string;
  status: ArticleRow["status"];
  isFeatured: boolean;
  isBreaking: boolean;
  isLive: boolean;
  scheduledAt: string;
  breakingExpiresAt: string;
  seoTitle: string;
  seoDescription: string;
  aiSummary: string;
  whyItMatters: string;
  readingTimeMinutes: string;
  socialTwitter: string;
  socialFacebook: string;
  socialTelegram: string;
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

export default function ArticleForm({ article, categories, authors }: ArticleFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const slugManualRef = useRef(false);

  const isEdit = !!article;

  const [form, setForm] = useState<FormState>({
    title: article?.title ?? "",
    slug: article?.slug ?? "",
    excerpt: article?.excerpt ?? "",
    content: article?.content ?? "",
    coverImageUrl: article?.cover_image_url ?? "",
    categoryId: article?.category_id ?? "",
    authorId: article?.author_id ?? "",
    status: article?.status ?? "draft",
    isFeatured: article?.is_featured ?? false,
    isBreaking: article?.is_breaking ?? false,
    isLive: (article as ArticleRow & { is_live?: boolean })?.is_live ?? false,
    scheduledAt: article?.scheduled_at
      ? new Date(article.scheduled_at).toISOString().slice(0, 16)
      : "",
    breakingExpiresAt: article?.breaking_expires_at
      ? new Date(article.breaking_expires_at).toISOString().slice(0, 16)
      : "",
    seoTitle: article?.seo_title ?? "",
    seoDescription: article?.seo_description ?? "",
    aiSummary: (article as ArticleRow & { ai_summary?: string | null })?.ai_summary ?? "",
    whyItMatters: (article as ArticleRow & { why_it_matters?: string | null })?.why_it_matters ?? "",
    readingTimeMinutes: String((article as ArticleRow & { reading_time_minutes?: number | null })?.reading_time_minutes ?? ""),
    socialTwitter: (article as ArticleRow & { social_twitter?: string | null })?.social_twitter ?? "",
    socialFacebook: (article as ArticleRow & { social_facebook?: string | null })?.social_facebook ?? "",
    socialTelegram: (article as ArticleRow & { social_telegram?: string | null })?.social_telegram ?? "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(article?.cover_image_url ?? "");
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  // Auto-generate slug from title (only if slug hasn't been manually edited)
  useEffect(() => {
    if (!slugManualRef.current && form.title) {
      setForm((f) => ({ ...f, slug: generateSlug(form.title) }));
    }
  }, [form.title]);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast("Seules les images sont acceptées.", "error");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast("L'image ne doit pas dépasser 5 Mo.", "error");
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  function validate(): boolean {
    const errs: typeof errors = {};
    if (!form.title.trim()) errs.title = "Le titre est requis.";
    if (!form.slug.trim()) errs.slug = "Le slug est requis.";
    if (!form.excerpt.trim()) errs.excerpt = "L'extrait est requis.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function generateSocialSnippets() {
    const title = form.title.trim();
    const excerpt = form.excerpt.trim().slice(0, 180);
    const twitter = `${title}\n\n${excerpt}${excerpt.length >= 180 ? "…" : ""}\n\n#GoldenNews7 #ActuRDC`;
    const facebook = `${title}\n\n${excerpt}${excerpt.length >= 180 ? "…" : ""}\n\nSuivez GoldenNews7 pour toute l'actualité congolaise.`;
    const telegram = `📰 ${title}\n\n${excerpt}${excerpt.length >= 180 ? "…" : ""}`;
    setForm((f) => ({ ...f, socialTwitter: twitter, socialFacebook: facebook, socialTelegram: telegram }));
  }

  async function handleSubmit(e: React.FormEvent, submitStatus?: ArticleRow["status"]) {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      let coverImageUrl = form.coverImageUrl;

      // Upload new image if selected
      if (imageFile) {
        try {
          coverImageUrl = await uploadArticleImage(imageFile, form.slug);
        } catch {
          toast("Erreur lors de l'upload de l'image. Vérifiez que le bucket article-images existe.", "error");
          return;
        }
      }

      const effectiveStatus = submitStatus ?? form.status;
      const payload = {
        title: form.title.trim(),
        slug: form.slug.trim(),
        excerpt: form.excerpt.trim(),
        content: form.content.trim() || null,
        cover_image_url: coverImageUrl || null,
        category_id: form.categoryId || null,
        author_id: form.authorId || null,
        status: effectiveStatus,
        is_featured: form.isFeatured,
        is_breaking: form.isBreaking,
        is_live: form.isLive,
        seo_title: form.seoTitle.trim() || null,
        seo_description: form.seoDescription.trim() || null,
        published_at: effectiveStatus === "published" ? new Date().toISOString() : (article?.published_at ?? null),
        scheduled_at: effectiveStatus === "scheduled" && form.scheduledAt
          ? new Date(form.scheduledAt).toISOString()
          : null,
        breaking_expires_at: form.isBreaking && form.breakingExpiresAt
          ? new Date(form.breakingExpiresAt).toISOString()
          : null,
        ai_summary: form.aiSummary.trim() || null,
        why_it_matters: form.whyItMatters.trim() || null,
        reading_time_minutes: form.readingTimeMinutes ? parseInt(form.readingTimeMinutes, 10) : null,
        social_twitter: form.socialTwitter.trim() || null,
        social_facebook: form.socialFacebook.trim() || null,
        social_telegram: form.socialTelegram.trim() || null,
      };

      if (isEdit && article) {
        await updateArticle(article.id, payload);
        toast("Article mis à jour.", "success");
        router.refresh();
      } else {
        const created = await createArticle(payload);
        toast("Article créé.", "success");
        router.push(`/admin/articles/${created.id}`);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("duplicate") || msg.includes("unique")) {
        toast("Ce slug est déjà utilisé. Choisissez-en un autre.", "error");
      } else {
        toast("Une erreur est survenue lors de la sauvegarde.", "error");
      }
    } finally {
      setSaving(false);
    }
  }

  const fieldClass = (field?: keyof FormState) =>
    `w-full px-4 py-2.5 bg-gray-800 border rounded-lg text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-1 transition-colors ${
      field && errors[field]
        ? "border-red-500 focus:border-red-400 focus:ring-red-500/20"
        : "border-white/8 focus:border-amber-500 focus:ring-amber-500/20"
    }`;

  const labelClass = "block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1.5";

  return (
    <form onSubmit={(e) => handleSubmit(e)} className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
        <div className="flex-1">
          <h1 className="text-2xl font-black text-white">
            {isEdit ? "Modifier l'article" : "Nouvel article"}
          </h1>
          {isEdit && (
            <p className="text-xs text-gray-600 mt-1">ID: {article.id}</p>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {isEdit && (
            <a
              href={`/admin/articles/${article.id}/preview`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 text-sm font-semibold text-gray-300 border border-white/10 hover:border-white/20 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Aperçu
            </a>
          )}
          <button
            type="button"
            onClick={(e) => handleSubmit(e, "draft")}
            disabled={saving}
            className="px-4 py-2 text-sm font-semibold text-gray-300 border border-white/10 hover:border-white/20 rounded-lg transition-colors disabled:opacity-50"
          >
            Brouillon
          </button>
          <button
            type="button"
            onClick={(e) => handleSubmit(e, "published")}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold rounded-lg transition-all active:scale-95 disabled:opacity-50"
          >
            {saving && (
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            )}
            Publier
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main column */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          {/* Title */}
          <div className="bg-gray-900 border border-white/5 rounded-xl p-5">
            <label className={labelClass}>Titre *</label>
            <textarea
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              rows={2}
              placeholder="Titre de l'article…"
              className={`${fieldClass("title")} resize-none text-base font-semibold`}
            />
            {errors.title && <p className="text-xs text-red-400 mt-1">{errors.title}</p>}

            <div className="mt-3">
              <label className={labelClass}>Slug *</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => {
                    slugManualRef.current = true;
                    set("slug", e.target.value);
                  }}
                  placeholder="slug-de-l-article"
                  className={fieldClass("slug")}
                />
                <button
                  type="button"
                  onClick={() => {
                    slugManualRef.current = false;
                    set("slug", generateSlug(form.title));
                  }}
                  className="px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/8 text-gray-400 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap"
                >
                  Générer
                </button>
              </div>
              {errors.slug && <p className="text-xs text-red-400 mt-1">{errors.slug}</p>}
            </div>
          </div>

          {/* Excerpt */}
          <div className="bg-gray-900 border border-white/5 rounded-xl p-5">
            <label className={labelClass}>Extrait *</label>
            <textarea
              value={form.excerpt}
              onChange={(e) => set("excerpt", e.target.value)}
              rows={3}
              placeholder="Résumé accrocheur de l'article (affiché en aperçu)…"
              className={fieldClass("excerpt")}
            />
            {errors.excerpt && <p className="text-xs text-red-400 mt-1">{errors.excerpt}</p>}
            <p className="text-xs text-gray-600 mt-1">{form.excerpt.length} caractères</p>
          </div>

          {/* Cover image */}
          <div className="bg-gray-900 border border-white/5 rounded-xl p-5">
            <label className={labelClass}>Image de couverture</label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            {imagePreview ? (
              <div className="relative rounded-lg overflow-hidden aspect-video bg-gray-800 mb-3">
                <Image
                  src={imagePreview}
                  alt="Aperçu"
                  fill
                  className="object-cover"
                  unoptimized={imagePreview.startsWith("blob:")}
                />
                <button
                  type="button"
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview("");
                    set("coverImageUrl", "");
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black/80 text-white rounded-full transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-white/10 hover:border-amber-500/40 rounded-lg p-8 text-center cursor-pointer transition-colors group"
              >
                <svg className="w-8 h-8 text-gray-600 group-hover:text-amber-500/60 mx-auto mb-2 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-sm text-gray-500 group-hover:text-gray-400">Cliquer pour choisir une image</p>
                <p className="text-xs text-gray-700 mt-1">PNG, JPG, WebP · max 5 Mo</p>
              </div>
            )}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="mt-2 text-xs text-amber-400 hover:text-amber-300 font-semibold transition-colors"
            >
              {imagePreview ? "Remplacer l'image" : "Choisir une image"}
            </button>
          </div>

          {/* Content */}
          <div className="bg-gray-900 border border-white/5 rounded-xl p-5">
            <label className={labelClass}>Contenu</label>
            <Suspense fallback={<div className="h-64 bg-gray-800 rounded-lg animate-pulse" />}>
              <RichTextEditor
                value={form.content}
                onChange={(html) => set("content", html)}
                placeholder="Commencez à écrire l'article…"
              />
            </Suspense>
          </div>

          {/* AI Summary */}
          <div className="bg-gray-900 border border-white/5 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-4 bg-amber-500 rounded-full" />
              <h3 className="text-sm font-bold text-white">Résumé IA (EN BREF)</h3>
            </div>
            <textarea
              value={form.aiSummary}
              onChange={(e) => set("aiSummary", e.target.value)}
              rows={4}
              placeholder={"• Point clé 1\n• Point clé 2\n• Point clé 3\nUn point par ligne — affiché sous forme de bullets en haut de l'article."}
              className={`${fieldClass()} font-mono text-xs`}
            />
            <div className="flex items-center gap-4 mt-2">
              <p className="text-xs text-gray-600">Un point par ligne (avec ou sans tiret/puce). Laisser vide pour masquer le bloc.</p>
              <div className="shrink-0">
                <label className="text-xs text-gray-500">Temps de lecture (min)</label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={form.readingTimeMinutes}
                  onChange={(e) => set("readingTimeMinutes", e.target.value)}
                  placeholder="Auto"
                  className="w-20 ml-2 px-2 py-1 bg-gray-800 border border-white/10 rounded text-xs text-white focus:outline-none focus:border-amber-500/50"
                />
              </div>
            </div>
          </div>

          {/* Why It Matters */}
          <div className="bg-gray-900 border border-white/5 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-4 bg-orange-500 rounded-full" />
              <h3 className="text-sm font-bold text-white">Pourquoi c&apos;est important</h3>
            </div>
            <textarea
              value={form.whyItMatters}
              onChange={(e) => set("whyItMatters", e.target.value)}
              rows={3}
              placeholder="Expliquez pourquoi cet article est important pour les lecteurs… (laisser vide pour masquer)"
              className={fieldClass()}
            />
          </div>

          {/* Social snippets */}
          <div className="bg-gray-900 border border-white/5 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-1 h-4 bg-sky-500 rounded-full" />
                <h3 className="text-sm font-bold text-white">Partage social</h3>
              </div>
              <button
                type="button"
                onClick={generateSocialSnippets}
                className="px-3 py-1.5 bg-sky-600/20 hover:bg-sky-600/30 text-sky-400 text-xs font-bold rounded-lg border border-sky-500/20 transition-colors"
              >
                ✨ Générer
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1 block">Twitter / X</label>
                <textarea
                  value={form.socialTwitter}
                  onChange={(e) => set("socialTwitter", e.target.value)}
                  rows={3}
                  placeholder="Tweet à copier…"
                  className={`${fieldClass()} text-xs`}
                />
                <p className="text-xs text-gray-600 mt-0.5">{form.socialTwitter.length}/280</p>
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1 block">Facebook</label>
                <textarea
                  value={form.socialFacebook}
                  onChange={(e) => set("socialFacebook", e.target.value)}
                  rows={3}
                  placeholder="Post Facebook à copier…"
                  className={`${fieldClass()} text-xs`}
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1 block">Telegram</label>
                <textarea
                  value={form.socialTelegram}
                  onChange={(e) => set("socialTelegram", e.target.value)}
                  rows={2}
                  placeholder="Message Telegram à copier…"
                  className={`${fieldClass()} text-xs`}
                />
              </div>
            </div>
          </div>

          {/* Live updates panel (edit mode only) */}
          {isEdit && article && <LiveUpdatesPanel articleId={article.id} />}

          {/* SEO */}
          <div className="bg-gray-900 border border-white/5 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-4 bg-blue-500 rounded-full" />
              <h3 className="text-sm font-bold text-white">SEO</h3>
            </div>
            <div className="flex flex-col gap-3">
              <div>
                <label className={labelClass}>Meta title</label>
                <input
                  type="text"
                  value={form.seoTitle}
                  onChange={(e) => set("seoTitle", e.target.value)}
                  placeholder={form.title || "Titre SEO…"}
                  className={fieldClass()}
                />
                <p className="text-xs text-gray-600 mt-1">{form.seoTitle.length}/60</p>
              </div>
              <div>
                <label className={labelClass}>Meta description</label>
                <textarea
                  value={form.seoDescription}
                  onChange={(e) => set("seoDescription", e.target.value)}
                  rows={2}
                  placeholder={form.excerpt || "Description SEO…"}
                  className={fieldClass()}
                />
                <p className="text-xs text-gray-600 mt-1">{form.seoDescription.length}/160</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar column */}
        <div className="flex flex-col gap-5">
          {/* Status + scheduling */}
          <div className="bg-gray-900 border border-white/5 rounded-xl p-5 space-y-3">
            <div>
              <label className={labelClass}>Mode de publication</label>
              <select
                value={form.status}
                onChange={(e) => set("status", e.target.value as ArticleRow["status"])}
                className={fieldClass()}
              >
                <option value="draft">Brouillon</option>
                <option value="published">Publié maintenant</option>
                <option value="scheduled">Planifié</option>
                <option value="archived">Archivé</option>
              </select>
            </div>
            {form.status === "scheduled" && (
              <div>
                <label className={labelClass}>Date de publication</label>
                <input
                  type="datetime-local"
                  value={form.scheduledAt}
                  onChange={(e) => set("scheduledAt", e.target.value)}
                  className={fieldClass()}
                />
                <p className="text-xs text-gray-500 mt-1">
                  L&apos;article sera visible à partir de cette date.
                </p>
              </div>
            )}
          </div>

          {/* Category */}
          <div className="bg-gray-900 border border-white/5 rounded-xl p-5">
            <label className={labelClass}>Catégorie</label>
            <select
              value={form.categoryId}
              onChange={(e) => set("categoryId", e.target.value)}
              className={fieldClass()}
            >
              <option value="">— Choisir —</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {categories.length === 0 && (
              <p className="text-xs text-amber-500 mt-1.5">
                Aucune catégorie. Exécutez seed.sql dans Supabase.
              </p>
            )}
          </div>

          {/* Author */}
          <div className="bg-gray-900 border border-white/5 rounded-xl p-5">
            <label className={labelClass}>Auteur</label>
            <select
              value={form.authorId}
              onChange={(e) => set("authorId", e.target.value)}
              className={fieldClass()}
            >
              <option value="">— Choisir —</option>
              {authors.map((author) => (
                <option key={author.id} value={author.id}>
                  {author.name}
                </option>
              ))}
            </select>
            {authors.length === 0 && (
              <p className="text-xs text-gray-600 mt-1.5">
                Ajoutez des auteurs dans la section Auteurs.
              </p>
            )}
          </div>

          {/* Toggles */}
          <div className="bg-gray-900 border border-white/5 rounded-xl p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-white">À la une</p>
                <p className="text-xs text-gray-500">Affiché en héro sur la homepage</p>
              </div>
              <button
                type="button"
                onClick={() => set("isFeatured", !form.isFeatured)}
                className={`w-10 h-6 rounded-full transition-all ${form.isFeatured ? "bg-amber-500" : "bg-gray-700"}`}
              >
                <span className={`block w-4 h-4 rounded-full bg-white shadow transition-transform mx-1 ${form.isFeatured ? "translate-x-4" : ""}`} />
              </button>
            </div>
            <div className="border-t border-white/5" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-white">Urgent / Breaking</p>
                <p className="text-xs text-gray-500">Affiché dans le ticker d&apos;urgence</p>
              </div>
              <button
                type="button"
                onClick={() => set("isBreaking", !form.isBreaking)}
                className={`w-10 h-6 rounded-full transition-all ${form.isBreaking ? "bg-red-500" : "bg-gray-700"}`}
              >
                <span className={`block w-4 h-4 rounded-full bg-white shadow transition-transform mx-1 ${form.isBreaking ? "translate-x-4" : ""}`} />
              </button>
            </div>
            <div className="border-t border-white/5" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-white">Mode Direct</p>
                <p className="text-xs text-gray-500">Affiche l&apos;indicateur LIVE + mises à jour</p>
              </div>
              <button
                type="button"
                onClick={() => set("isLive", !form.isLive)}
                className={`w-10 h-6 rounded-full transition-all ${form.isLive ? "bg-red-500" : "bg-gray-700"}`}
              >
                <span className={`block w-4 h-4 rounded-full bg-white shadow transition-transform mx-1 ${form.isLive ? "translate-x-4" : ""}`} />
              </button>
            </div>
            {form.isBreaking && (
              <div className="border-t border-white/5 pt-3">
                <label className={labelClass}>Expiration du fil urgent</label>
                <input
                  type="datetime-local"
                  value={form.breakingExpiresAt}
                  onChange={(e) => set("breakingExpiresAt", e.target.value)}
                  className={fieldClass()}
                />
                <p className="text-xs text-gray-500 mt-1">Vide = pas d&apos;expiration</p>
              </div>
            )}
          </div>

          {/* Submit (sticky on scroll) */}
          <div className="bg-gray-900 border border-white/5 rounded-xl p-5 flex flex-col gap-3 sticky top-4">
            <button
              type="button"
              onClick={(e) => handleSubmit(e, "published")}
              disabled={saving}
              className="flex items-center justify-center gap-2 w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold rounded-lg transition-all active:scale-95 disabled:opacity-50"
            >
              {saving ? (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : null}
              Publier
            </button>
            <button
              type="button"
              onClick={(e) => handleSubmit(e, "draft")}
              disabled={saving}
              className="w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/8 text-gray-300 text-sm font-semibold rounded-lg transition-colors disabled:opacity-50"
            >
              Enregistrer brouillon
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="w-full py-2 text-xs text-gray-600 hover:text-gray-400 transition-colors"
            >
              Annuler
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
