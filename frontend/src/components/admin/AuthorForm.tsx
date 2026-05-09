"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useToast } from "@/components/admin/ToastProvider";
import { createAuthor, updateAuthor } from "@/lib/admin/authorAdminService";
import { uploadArticleImage } from "@/lib/admin/uploadService";
import type { Database } from "@/lib/supabase/types";

type AuthorRow = Database["public"]["Tables"]["authors"]["Row"];

interface AuthorFormProps {
  author?: AuthorRow;
}

interface FormState {
  name: string;
  slug: string;
  role: string;
  bio: string;
  email: string;
  avatarUrl: string;
  twitterUrl: string;
  facebookUrl: string;
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

export default function AuthorForm({ author }: AuthorFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const slugManualRef = useRef(false);

  const isEdit = !!author;

  const [form, setForm] = useState<FormState>({
    name: author?.name ?? "",
    slug: author?.slug ?? "",
    role: author?.role ?? "",
    bio: author?.bio ?? "",
    email: author?.email ?? "",
    avatarUrl: author?.avatar_url ?? "",
    twitterUrl: author?.twitter_url ?? "",
    facebookUrl: author?.facebook_url ?? "",
  });

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>(author?.avatar_url ?? "");
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => {
      const next = { ...f, [key]: value };
      if (key === "name" && !slugManualRef.current) {
        next.slug = generateSlug(String(value));
      }
      return next;
    });
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast("Seules les images sont acceptées.", "error");
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      toast("L'avatar ne doit pas dépasser 3 Mo.", "error");
      return;
    }
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  }

  function validate(): boolean {
    const errs: typeof errors = {};
    if (!form.name.trim()) errs.name = "Le nom est requis.";
    if (!form.slug.trim()) errs.slug = "Le slug est requis.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      let avatarUrl = form.avatarUrl;
      if (avatarFile) {
        try {
          avatarUrl = await uploadArticleImage(avatarFile, "avatars");
        } catch {
          toast("Erreur lors de l'upload de l'avatar.", "error");
          return;
        }
      }

      const payload = {
        name: form.name.trim(),
        slug: form.slug.trim(),
        role: form.role.trim() || null,
        bio: form.bio.trim() || null,
        email: form.email.trim() || null,
        avatar_url: avatarUrl || null,
        twitter_url: form.twitterUrl.trim() || null,
        facebook_url: form.facebookUrl.trim() || null,
      };

      if (isEdit && author) {
        await updateAuthor(author.id, payload);
        toast("Auteur mis à jour.", "success");
        router.refresh();
      } else {
        const created = await createAuthor(payload);
        toast("Auteur créé.", "success");
        router.push(`/admin/authors/${created.id}`);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("duplicate") || msg.includes("unique")) {
        toast("Ce slug est déjà utilisé.", "error");
      } else {
        toast("Une erreur est survenue.", "error");
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
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
        <div className="flex-1">
          <h1 className="text-2xl font-black text-white">
            {isEdit ? "Modifier l'auteur" : "Nouvel auteur"}
          </h1>
          {isEdit && <p className="text-xs text-gray-600 mt-1">ID: {author.id}</p>}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 text-sm font-semibold text-gray-400 border border-white/10 hover:border-white/20 rounded-lg transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2 bg-amber-500 hover:bg-amber-400 text-white text-sm font-bold rounded-lg transition-all active:scale-95 disabled:opacity-50"
          >
            {saving && (
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            )}
            {isEdit ? "Enregistrer" : "Créer"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          {/* Name + slug */}
          <div className="bg-gray-900 border border-white/5 rounded-xl p-5 space-y-4">
            <div>
              <label className={labelClass}>Nom complet *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="Marie Dubois"
                className={fieldClass("name")}
              />
              {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className={labelClass}>Slug *</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => { slugManualRef.current = true; set("slug", e.target.value); }}
                  placeholder="marie-dubois"
                  className={fieldClass("slug")}
                />
                <button
                  type="button"
                  onClick={() => { slugManualRef.current = false; set("slug", generateSlug(form.name)); }}
                  className="px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/8 text-gray-400 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap"
                >
                  Générer
                </button>
              </div>
              {errors.slug && <p className="text-xs text-red-400 mt-1">{errors.slug}</p>}
            </div>
          </div>

          {/* Role + email */}
          <div className="bg-gray-900 border border-white/5 rounded-xl p-5 space-y-4">
            <div>
              <label className={labelClass}>Titre / Rôle</label>
              <input
                type="text"
                value={form.role}
                onChange={(e) => set("role", e.target.value)}
                placeholder="Correspondante Afrique"
                className={fieldClass()}
              />
            </div>
            <div>
              <label className={labelClass}>Email (optionnel)</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                placeholder="marie@goldennews7.com"
                className={fieldClass()}
              />
            </div>
          </div>

          {/* Bio */}
          <div className="bg-gray-900 border border-white/5 rounded-xl p-5">
            <label className={labelClass}>Biographie</label>
            <textarea
              value={form.bio}
              onChange={(e) => set("bio", e.target.value)}
              rows={5}
              placeholder="Biographie de l'auteur…"
              className={fieldClass()}
            />
            <p className="text-xs text-gray-600 mt-1">{form.bio.length} caractères</p>
          </div>

          {/* Social links */}
          <div className="bg-gray-900 border border-white/5 rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1 h-4 bg-blue-500 rounded-full" />
              <h3 className="text-sm font-bold text-white">Réseaux sociaux</h3>
            </div>
            <div>
              <label className={labelClass}>Twitter / X</label>
              <input
                type="url"
                value={form.twitterUrl}
                onChange={(e) => set("twitterUrl", e.target.value)}
                placeholder="https://twitter.com/marie_dubois"
                className={fieldClass()}
              />
            </div>
            <div>
              <label className={labelClass}>Facebook</label>
              <input
                type="url"
                value={form.facebookUrl}
                onChange={(e) => set("facebookUrl", e.target.value)}
                placeholder="https://facebook.com/marie.dubois"
                className={fieldClass()}
              />
            </div>
          </div>
        </div>

        {/* Sidebar — avatar */}
        <div className="flex flex-col gap-5">
          <div className="bg-gray-900 border border-white/5 rounded-xl p-5">
            <label className={labelClass}>Photo de profil</label>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />

            {avatarPreview ? (
              <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-800 mx-auto mb-3">
                <Image src={avatarPreview} alt="Avatar" fill className="object-cover" unoptimized={avatarPreview.startsWith("blob:")} />
                <button
                  type="button"
                  onClick={() => { setAvatarFile(null); setAvatarPreview(""); set("avatarUrl", ""); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                  className="absolute top-1 right-1 p-1 bg-black/60 hover:bg-black/80 text-white rounded-full transition-colors"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-32 h-32 rounded-full border-2 border-dashed border-white/10 hover:border-amber-500/40 flex flex-col items-center justify-center cursor-pointer transition-colors mx-auto mb-3 group"
              >
                <svg className="w-8 h-8 text-gray-600 group-hover:text-amber-500/60 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            )}

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="block text-xs text-amber-400 hover:text-amber-300 font-semibold text-center w-full transition-colors"
            >
              {avatarPreview ? "Remplacer l'avatar" : "Choisir un avatar"}
            </button>
            <p className="text-[10px] text-gray-600 text-center mt-1">PNG, JPG · max 3 Mo</p>
          </div>

          {isEdit && (
            <div className="bg-gray-900 border border-white/5 rounded-xl p-5">
              <p className="text-xs text-gray-500 mb-1">Lien public</p>
              <code className="text-xs text-amber-400 break-all">/auteur/{author.slug}</code>
            </div>
          )}
        </div>
      </div>
    </form>
  );
}
