"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/admin/ToastProvider";
import { createCategory, updateCategory } from "@/lib/admin/categoryAdminService";
import type { Database } from "@/lib/supabase/types";

type CategoryRow = Database["public"]["Tables"]["categories"]["Row"];

interface CategoryFormProps {
  category?: CategoryRow;
}

interface FormState {
  name: string;
  slug: string;
  description: string;
  color: string;
  sortOrder: string;
  isActive: boolean;
}

const COLOR_PRESETS = [
  "#f59e0b", "#ef4444", "#3b82f6", "#10b981", "#8b5cf6",
  "#f97316", "#06b6d4", "#84cc16", "#ec4899", "#6b7280",
];

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);
}

export default function CategoryForm({ category }: CategoryFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const slugManualRef = useRef(false);

  const isEdit = !!category;

  const [form, setForm] = useState<FormState>({
    name: category?.name ?? "",
    slug: category?.slug ?? "",
    description: category?.description ?? "",
    color: category?.color ?? "#f59e0b",
    sortOrder: String(category?.sort_order ?? 0),
    isActive: category?.is_active ?? true,
  });

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
      const payload = {
        name: form.name.trim(),
        slug: form.slug.trim(),
        description: form.description.trim() || null,
        color: form.color || null,
        sort_order: parseInt(form.sortOrder, 10) || 0,
        is_active: form.isActive,
      };

      if (isEdit && category) {
        await updateCategory(category.id, payload);
        toast("Catégorie mise à jour.", "success");
        router.refresh();
      } else {
        const created = await createCategory(payload);
        toast("Catégorie créée.", "success");
        router.push(`/admin/categories/${created.id}`);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("duplicate") || msg.includes("unique")) {
        toast("Ce slug ou ce nom est déjà utilisé.", "error");
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
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
        <div className="flex-1">
          <h1 className="text-2xl font-black text-white">
            {isEdit ? "Modifier la catégorie" : "Nouvelle catégorie"}
          </h1>
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

      <div className="flex flex-col gap-5">
        {/* Name + slug */}
        <div className="bg-gray-900 border border-white/5 rounded-xl p-5 space-y-4">
          <div>
            <label className={labelClass}>Nom *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="Actualité"
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
                placeholder="actualite"
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

        {/* Description */}
        <div className="bg-gray-900 border border-white/5 rounded-xl p-5">
          <label className={labelClass}>Description</label>
          <textarea
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            rows={3}
            placeholder="Description de la catégorie…"
            className={fieldClass()}
          />
        </div>

        {/* Color + sort + active */}
        <div className="bg-gray-900 border border-white/5 rounded-xl p-5 space-y-5">
          {/* Color */}
          <div>
            <label className={labelClass}>Couleur</label>
            <div className="flex items-center gap-3 flex-wrap">
              {COLOR_PRESETS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => set("color", c)}
                  className={`w-7 h-7 rounded-full transition-all ${form.color === c ? "ring-2 ring-offset-2 ring-offset-gray-900 ring-white scale-110" : "hover:scale-110"}`}
                  style={{ backgroundColor: c }}
                  title={c}
                />
              ))}
              <input
                type="color"
                value={form.color}
                onChange={(e) => set("color", e.target.value)}
                className="w-7 h-7 rounded-full cursor-pointer bg-transparent border-0"
                title="Couleur personnalisée"
              />
              <span className="text-xs text-gray-500 font-mono">{form.color}</span>
            </div>
          </div>

          {/* Sort order */}
          <div>
            <label className={labelClass}>Ordre de tri</label>
            <input
              type="number"
              value={form.sortOrder}
              onChange={(e) => set("sortOrder", e.target.value)}
              min="0"
              className={`${fieldClass()} w-24`}
            />
            <p className="text-xs text-gray-600 mt-1">0 = premier. Plus le chiffre est élevé, plus la catégorie apparaît tard.</p>
          </div>

          {/* Active toggle */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-white">Catégorie active</p>
              <p className="text-xs text-gray-500">Si inactive, elle n&apos;apparaît pas dans la navigation</p>
            </div>
            <button
              type="button"
              onClick={() => set("isActive", !form.isActive)}
              className={`w-10 h-6 rounded-full transition-all ${form.isActive ? "bg-emerald-500" : "bg-gray-700"}`}
            >
              <span className={`block w-4 h-4 rounded-full bg-white shadow transition-transform mx-1 ${form.isActive ? "translate-x-4" : ""}`} />
            </button>
          </div>
        </div>

        {/* Preview */}
        {form.name && (
          <div className="bg-gray-900 border border-white/5 rounded-xl p-5">
            <p className={labelClass}>Aperçu du badge</p>
            <div className="flex items-center gap-3">
              <span
                className="inline-block text-xs font-bold px-2.5 py-1 rounded-full text-white"
                style={{ backgroundColor: form.color }}
              >
                {form.name}
              </span>
              <span className="text-xs text-gray-500">/{form.slug}</span>
            </div>
          </div>
        )}
      </div>
    </form>
  );
}
