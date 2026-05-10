"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import {
  getAdminHomepageSections,
  updateSection,
  addSlot,
  removeSlot,
  updateSlotPosition,
  searchPublishedArticles,
  type SectionWithSlots,
  type AdminSlot,
  type SlotArticlePreview,
} from "@/lib/admin/homepageAdminService";

// ─── Helpers ────────────────────────────────────────────────────────────────

const LAYOUT_LABELS: Record<string, string> = {
  hero: "Hero",
  ticker: "Fil urgent",
  grid: "Grille (auto)",
  featured: "Mise en avant",
};

const SLOT_TYPES: Record<string, { key: string; label: string; max: number }[]> = {
  hero: [
    { key: "hero_main", label: "Article principal", max: 1 },
    { key: "hero_secondary", label: "Articles secondaires", max: 4 },
  ],
  ticker: [{ key: "breaking", label: "Fil urgent", max: 10 }],
  grid: [],
  featured: [{ key: "category_featured", label: "Article mis en avant", max: 1 }],
};

function slotLabel(slot_type: string): string {
  const labels: Record<string, string> = {
    hero_main: "Principal",
    hero_secondary: "Secondaire",
    breaking: "Urgent",
    category_featured: "Mis en avant",
  };
  return labels[slot_type] ?? slot_type;
}

// ─── Toast ──────────────────────────────────────────────────────────────────

type ToastType = { id: number; message: string; kind: "ok" | "err" };

function Toast({ toasts }: { toasts: ToastType[] }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`px-4 py-2.5 rounded-lg text-sm font-medium shadow-lg text-white animate-fade-in ${
            t.kind === "ok" ? "bg-emerald-600" : "bg-red-600"
          }`}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}

// ─── Article search modal ────────────────────────────────────────────────────

function ArticleSearchDropdown({
  onSelect,
  onClose,
  excludeIds,
}: {
  onSelect: (article: SlotArticlePreview) => void;
  onClose: () => void;
  excludeIds: string[];
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SlotArticlePreview[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
    void searchPublishedArticles("").then(setResults);
  }, []);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await searchPublishedArticles(query);
        setResults(data);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [query]);

  const filtered = results.filter((r) => !excludeIds.includes(r.id));

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-gray-900 border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="p-4 border-b border-white/5 flex gap-3 items-center">
          <svg className="w-4 h-4 text-gray-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un article publié…"
            className="flex-1 bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none"
          />
          {loading && (
            <div className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin shrink-0" />
          )}
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors shrink-0">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="py-10 text-center text-sm text-gray-500">
              {loading ? "Chargement…" : "Aucun article trouvé"}
            </div>
          ) : (
            <ul>
              {filtered.map((article) => (
                <li key={article.id}>
                  <button
                    onClick={() => onSelect(article)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left group"
                  >
                    <div className="relative w-12 h-10 rounded overflow-hidden bg-gray-800 shrink-0">
                      {article.cover_image_url && (
                        <Image
                          src={article.cover_image_url.startsWith("http") ? article.cover_image_url : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/article-images/${article.cover_image_url}`}
                          alt={article.title}
                          fill
                          className="object-cover"
                          sizes="48px"
                          unoptimized
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      {article.categories && (
                        <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 block mb-0.5">
                          {article.categories.name}
                        </span>
                      )}
                      <p className="text-sm text-gray-200 group-hover:text-white font-medium line-clamp-1 transition-colors">
                        {article.title}
                      </p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Slot card ────────────────────────────────────────────────────────────────

function SlotCard({
  slot,
  onRemove,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}: {
  slot: AdminSlot;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
}) {
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const imageUrl = slot.article.cover_image_url
    ? slot.article.cover_image_url.startsWith("http")
      ? slot.article.cover_image_url
      : `${SUPABASE_URL}/storage/v1/object/public/article-images/${slot.article.cover_image_url}`
    : "";

  return (
    <div className="flex items-center gap-3 bg-gray-800/60 hover:bg-gray-800 border border-white/5 rounded-xl p-3 transition-colors group">
      {/* Thumbnail */}
      <div className="relative w-14 h-12 rounded-lg overflow-hidden bg-gray-700 shrink-0">
        {imageUrl && (
          <Image src={imageUrl} alt={slot.article.title} fill className="object-cover" sizes="56px" unoptimized />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-[10px] font-bold uppercase tracking-widest text-amber-500">
            {slotLabel(slot.slot_type)}
          </span>
          {slot.article.categories && (
            <span className="text-[10px] text-gray-500">
              · {(slot.article as unknown as { categories: { name: string } }).categories.name}
            </span>
          )}
        </div>
        <p className="text-sm text-gray-200 font-medium line-clamp-1">{slot.article.title}</p>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        <button
          onClick={onMoveUp}
          disabled={isFirst}
          className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          title="Monter"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>
        <button
          onClick={onMoveDown}
          disabled={isLast}
          className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          title="Descendre"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <button
          onClick={onRemove}
          className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
          title="Retirer"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// ─── Section card ─────────────────────────────────────────────────────────────

function SectionCard({
  section: initialSection,
  onToast,
}: {
  section: SectionWithSlots;
  onToast: (msg: string, kind: "ok" | "err") => void;
}) {
  const [section, setSection] = useState(initialSection);
  const [expanded, setExpanded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showSearch, setShowSearch] = useState<string | null>(null); // slot_type key
  const [dirty, setDirty] = useState(false);
  const [editTitle, setEditTitle] = useState(section.title);

  const slotDefs = SLOT_TYPES[section.layout_type] ?? [];
  const isAutomatic = slotDefs.length === 0;

  const slotsForType = (key: string) =>
    section.slots.filter((s) => s.slot_type === key);

  async function toggleActive() {
    try {
      await updateSection(section.id, { is_active: !section.is_active });
      setSection((s) => ({ ...s, is_active: !s.is_active }));
      onToast(
        section.is_active ? "Section désactivée" : "Section activée",
        "ok"
      );
    } catch {
      onToast("Erreur lors de la mise à jour", "err");
    }
  }

  async function saveTitle() {
    if (editTitle.trim() === section.title) { setDirty(false); return; }
    setSaving(true);
    try {
      await updateSection(section.id, { title: editTitle.trim() });
      setSection((s) => ({ ...s, title: editTitle.trim() }));
      setDirty(false);
      onToast("Titre sauvegardé", "ok");
    } catch {
      onToast("Erreur lors de la sauvegarde", "err");
    } finally {
      setSaving(false);
    }
  }

  async function handleAddArticle(article: SlotArticlePreview, slotType: string) {
    const existing = slotsForType(slotType);
    const def = slotDefs.find((d) => d.key === slotType);
    if (def && existing.length >= def.max) {
      onToast(`Maximum ${def.max} article(s) pour ce slot`, "err");
      setShowSearch(null);
      return;
    }
    // Check duplicate
    if (section.slots.some((s) => s.article_id === article.id)) {
      onToast("Cet article est déjà assigné à cette section", "err");
      setShowSearch(null);
      return;
    }
    try {
      await addSlot({
        section_id: section.id,
        article_id: article.id,
        slot_type: slotType,
        position: existing.length,
      });
      const newSlot: AdminSlot = {
        id: crypto.randomUUID(),
        section_id: section.id,
        article_id: article.id,
        slot_type: slotType,
        position: existing.length,
        is_active: true,
        article: article as unknown as AdminSlot["article"],
      };
      setSection((s) => ({ ...s, slots: [...s.slots, newSlot] }));
      onToast("Article ajouté", "ok");
    } catch {
      onToast("Erreur lors de l'ajout", "err");
    }
    setShowSearch(null);
  }

  async function handleRemove(slotId: string) {
    try {
      await removeSlot(slotId);
      setSection((s) => ({
        ...s,
        slots: s.slots.filter((sl) => sl.id !== slotId),
      }));
      onToast("Article retiré", "ok");
    } catch {
      onToast("Erreur lors de la suppression", "err");
    }
  }

  async function handleMove(slotId: string, direction: "up" | "down") {
    const slotIdx = section.slots.findIndex((s) => s.id === slotId);
    if (slotIdx === -1) return;
    const slot = section.slots[slotIdx];
    const sameType = section.slots.filter((s) => s.slot_type === slot.slot_type);
    const typeIdx = sameType.findIndex((s) => s.id === slotId);
    const targetIdx = direction === "up" ? typeIdx - 1 : typeIdx + 1;
    if (targetIdx < 0 || targetIdx >= sameType.length) return;

    const target = sameType[targetIdx];
    const newSlots = section.slots.map((s) => {
      if (s.id === slot.id) return { ...s, position: target.position };
      if (s.id === target.id) return { ...s, position: slot.position };
      return s;
    });
    setSection((s) => ({ ...s, slots: newSlots }));

    try {
      await Promise.all([
        updateSlotPosition(slot.id, target.position),
        updateSlotPosition(target.id, slot.position),
      ]);
    } catch {
      onToast("Erreur lors du réordonnancement", "err");
    }
  }

  const assignedIds = section.slots.map((s) => s.article_id);

  return (
    <div className={`bg-gray-900 border rounded-2xl overflow-hidden transition-all ${section.is_active ? "border-white/10" : "border-white/5 opacity-60"}`}>
      {/* Header */}
      <div className="flex items-center gap-4 px-5 py-4">
        {/* Toggle */}
        <button
          onClick={toggleActive}
          className={`relative w-9 h-5 rounded-full transition-colors shrink-0 ${section.is_active ? "bg-amber-500" : "bg-gray-700"}`}
          title={section.is_active ? "Désactiver" : "Activer"}
        >
          <span
            className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${section.is_active ? "translate-x-4" : "translate-x-0.5"}`}
          />
        </button>

        {/* Title + description */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-white truncate">{section.title}</h3>
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-600 bg-white/5 px-1.5 py-0.5 rounded shrink-0">
              {section.section_key}
            </span>
            <span className="text-[10px] font-medium text-gray-500 bg-white/5 px-1.5 py-0.5 rounded shrink-0">
              {LAYOUT_LABELS[section.layout_type] ?? section.layout_type}
            </span>
          </div>
          {section.description && (
            <p className="text-xs text-gray-500 mt-0.5 truncate">{section.description}</p>
          )}
        </div>

        {/* Slot count badge */}
        {!isAutomatic && (
          <span className="text-xs font-bold text-gray-400 bg-white/5 px-2 py-1 rounded-full shrink-0">
            {section.slots.length} article{section.slots.length !== 1 ? "s" : ""}
          </span>
        )}

        {/* Expand/collapse */}
        {!isAutomatic && (
          <button
            onClick={() => setExpanded((e) => !e)}
            className="text-gray-500 hover:text-white transition-colors shrink-0"
          >
            <svg
              className={`w-4 h-4 transition-transform ${expanded ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        )}
      </div>

      {/* Automatic section notice */}
      {isAutomatic && (
        <div className="px-5 pb-4">
          <p className="text-xs text-gray-600 italic">
            Cette section est gérée automatiquement — aucun slot manuel requis.
          </p>
        </div>
      )}

      {/* Expanded body */}
      {!isAutomatic && expanded && (
        <div className="px-5 pb-5 border-t border-white/5 space-y-6 pt-5">
          {/* Title edit */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1.5">
              Titre de la section
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => { setEditTitle(e.target.value); setDirty(true); }}
                className="flex-1 bg-gray-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20"
              />
              {dirty && (
                <button
                  onClick={saveTitle}
                  disabled={saving}
                  className="px-3 py-2 bg-amber-500 hover:bg-amber-400 text-white text-xs font-bold rounded-lg transition-colors disabled:opacity-60"
                >
                  {saving ? "…" : "Sauvegarder"}
                </button>
              )}
            </div>
          </div>

          {/* Slot groups */}
          {slotDefs.map((def) => {
            const typeSlots = slotsForType(def.key).sort(
              (a, b) => a.position - b.position
            );
            const canAdd = typeSlots.length < def.max;

            return (
              <div key={def.key}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    {def.label}
                    <span className="ml-1 text-gray-600 font-normal normal-case">
                      ({typeSlots.length}/{def.max})
                    </span>
                  </p>
                  {canAdd && (
                    <button
                      onClick={() => setShowSearch(def.key)}
                      className="flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Ajouter
                    </button>
                  )}
                </div>

                {typeSlots.length === 0 ? (
                  <div
                    onClick={() => canAdd && setShowSearch(def.key)}
                    className={`border-2 border-dashed border-white/10 rounded-xl py-6 flex flex-col items-center justify-center gap-2 ${canAdd ? "cursor-pointer hover:border-amber-500/30 hover:bg-amber-500/5 transition-all" : ""}`}
                  >
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                    <span className="text-xs text-gray-600">
                      {canAdd ? "Cliquer pour ajouter un article" : "Slot complet"}
                    </span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {typeSlots.map((slot, idx) => (
                      <SlotCard
                        key={slot.id}
                        slot={slot}
                        onRemove={() => handleRemove(slot.id)}
                        onMoveUp={() => handleMove(slot.id, "up")}
                        onMoveDown={() => handleMove(slot.id, "down")}
                        isFirst={idx === 0}
                        isLast={idx === typeSlots.length - 1}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Article search modal */}
      {showSearch !== null && (
        <ArticleSearchDropdown
          excludeIds={assignedIds}
          onSelect={(article) => handleAddArticle(article, showSearch!)}
          onClose={() => setShowSearch(null)}
        />
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomepagePage() {
  const [sections, setSections] = useState<SectionWithSlots[]>([]);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState<ToastType[]>([]);
  const toastId = useRef(0);

  const toast = useCallback((message: string, kind: "ok" | "err") => {
    const id = ++toastId.current;
    setToasts((prev) => [...prev, { id, message, kind }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
  }, []);

  useEffect(() => {
    getAdminHomepageSections()
      .then(setSections)
      .catch(() => toast("Erreur lors du chargement", "err"))
      .finally(() => setLoading(false));
  }, [toast]);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-black text-white mb-1">Composition de la homepage</h1>
        <p className="text-sm text-gray-500">
          Contrôlez quels articles apparaissent sur la page d&apos;accueil publique. Les sections désactivées reviennent au mode automatique.
        </p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-6 p-4 bg-gray-900 border border-white/5 rounded-xl">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-amber-500" />
          <span className="text-xs text-gray-400">Section active</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gray-700" />
          <span className="text-xs text-gray-400">Section inactive (mode automatique)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gray-500" />
          <span className="text-xs text-gray-400">Grille auto (pas de slots)</span>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 bg-gray-900 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : sections.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <svg className="w-10 h-10 mx-auto mb-3 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
          </svg>
          <p className="text-sm">Aucune section trouvée.</p>
          <p className="text-xs mt-1">Exécutez la migration SQL pour initialiser les sections.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sections.map((section) => (
            <SectionCard key={section.id} section={section} onToast={toast} />
          ))}
        </div>
      )}

      <Toast toasts={toasts} />
    </div>
  );
}
