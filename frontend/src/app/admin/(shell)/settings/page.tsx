"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useToast } from "@/components/admin/ToastProvider";
import { getAdminSiteSettings, upsertSiteSettings } from "@/lib/admin/siteSettingsService";
import { logActivity } from "@/lib/admin/activityLogService";

interface SettingsForm {
  site_name: string;
  site_tagline: string;
  site_description: string;
  contact_email: string;
  facebook_url: string;
  twitter_url: string;
  youtube_url: string;
  telegram_url: string;
  default_seo_title: string;
  default_seo_description: string;
  logo_url: string;
  favicon_url: string;
  enable_auto_share_twitter: boolean;
  enable_auto_share_facebook: boolean;
  twitter_account_label: string;
  facebook_page_label: string;
}

const EMPTY: SettingsForm = {
  site_name: "",
  site_tagline: "",
  site_description: "",
  contact_email: "",
  facebook_url: "",
  twitter_url: "",
  youtube_url: "",
  telegram_url: "",
  default_seo_title: "",
  default_seo_description: "",
  logo_url: "",
  favicon_url: "",
  enable_auto_share_twitter: false,
  enable_auto_share_facebook: false,
  twitter_account_label: "",
  facebook_page_label: "",
};

const labelClass = "block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1.5";
const fieldClass = "w-full px-3 py-2 bg-gray-800 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-colors";

export default function AdminSettingsPage() {
  const [form, setForm] = useState<SettingsForm>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast: showToast } = useToast();

  useEffect(() => {
    getAdminSiteSettings()
      .then((data) => {
        if (data) {
          setForm({
            site_name: data.site_name ?? "",
            site_tagline: data.site_tagline ?? "",
            site_description: data.site_description ?? "",
            contact_email: data.contact_email ?? "",
            facebook_url: data.facebook_url ?? "",
            twitter_url: data.twitter_url ?? "",
            youtube_url: data.youtube_url ?? "",
            telegram_url: data.telegram_url ?? "",
            default_seo_title: data.default_seo_title ?? "",
            default_seo_description: data.default_seo_description ?? "",
            logo_url: data.logo_url ?? "",
            favicon_url: data.favicon_url ?? "",
            enable_auto_share_twitter: data.enable_auto_share_twitter ?? false,
            enable_auto_share_facebook: data.enable_auto_share_facebook ?? false,
            twitter_account_label: data.twitter_account_label ?? "",
            facebook_page_label: data.facebook_page_label ?? "",
          });
        }
      })
      .finally(() => setLoading(false));
  }, []);

  function set(key: keyof SettingsForm, value: string | boolean) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      await upsertSiteSettings({
        site_name: form.site_name || "GoldenNews7",
        site_tagline: form.site_tagline || null,
        site_description: form.site_description || null,
        contact_email: form.contact_email || null,
        facebook_url: form.facebook_url || null,
        twitter_url: form.twitter_url || null,
        youtube_url: form.youtube_url || null,
        telegram_url: form.telegram_url || null,
        default_seo_title: form.default_seo_title || null,
        default_seo_description: form.default_seo_description || null,
        logo_url: form.logo_url || null,
        favicon_url: form.favicon_url || null,
        enable_auto_share_twitter: form.enable_auto_share_twitter,
        enable_auto_share_facebook: form.enable_auto_share_facebook,
        twitter_account_label: form.twitter_account_label || null,
        facebook_page_label: form.facebook_page_label || null,
      });
      await logActivity({ action: "settings_updated", description: "Paramètres du site mis à jour" });
      showToast("Paramètres enregistrés", "success");
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
    <div className="p-6 max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-white">Paramètres du site</h1>
          <p className="text-sm text-gray-500 mt-0.5">Configuration générale de GoldenNews7</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-white text-sm font-bold rounded-lg transition-colors"
        >
          {saving ? "Enregistrement…" : "Enregistrer"}
        </button>
      </div>

      {/* Identité */}
      <section className="bg-gray-900 border border-white/5 rounded-xl p-6 space-y-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-widest mb-4">Identité du site</h2>
        <div>
          <label className={labelClass}>Nom du site</label>
          <input value={form.site_name} onChange={(e) => set("site_name", e.target.value)} placeholder="GoldenNews7" className={fieldClass} />
        </div>
        <div>
          <label className={labelClass}>Tagline</label>
          <input value={form.site_tagline} onChange={(e) => set("site_tagline", e.target.value)} placeholder="L'actualité en continu" className={fieldClass} />
        </div>
        <div>
          <label className={labelClass}>Description</label>
          <textarea rows={3} value={form.site_description} onChange={(e) => set("site_description", e.target.value)} placeholder="Présentation courte du site…" className={`${fieldClass} resize-none`} />
        </div>
        <div>
          <label className={labelClass}>Email de contact</label>
          <input type="email" value={form.contact_email} onChange={(e) => set("contact_email", e.target.value)} placeholder="contact@goldennews7.com" className={fieldClass} />
        </div>
      </section>

      {/* Médias */}
      <section className="bg-gray-900 border border-white/5 rounded-xl p-6 space-y-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-widest mb-4">Logo & Favicon</h2>
        <div>
          <label className={labelClass}>URL du logo</label>
          <input value={form.logo_url} onChange={(e) => set("logo_url", e.target.value)} placeholder="https://…/logo.png" className={fieldClass} />
          {form.logo_url && (
            <div className="mt-2 p-2 bg-gray-800 rounded-lg inline-block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={form.logo_url} alt="Logo preview" className="h-10 object-contain" />
            </div>
          )}
        </div>
        <div>
          <label className={labelClass}>URL du favicon</label>
          <input value={form.favicon_url} onChange={(e) => set("favicon_url", e.target.value)} placeholder="https://…/favicon.ico" className={fieldClass} />
          {form.favicon_url && (
            <div className="mt-2 p-2 bg-gray-800 rounded-lg inline-block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={form.favicon_url} alt="Favicon preview" className="h-6 w-6 object-contain" />
            </div>
          )}
        </div>
        <p className="text-xs text-gray-600">Uploadez vos fichiers dans la médiathèque, puis collez l&apos;URL ici.</p>
      </section>

      {/* Réseaux sociaux */}
      <section className="bg-gray-900 border border-white/5 rounded-xl p-6 space-y-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-widest mb-4">Réseaux sociaux</h2>
        {(
          [
            { key: "facebook_url", label: "Facebook", placeholder: "https://facebook.com/goldennews7" },
            { key: "twitter_url", label: "Twitter / X", placeholder: "https://twitter.com/goldennews7" },
            { key: "youtube_url", label: "YouTube", placeholder: "https://youtube.com/@goldennews7" },
            { key: "telegram_url", label: "Telegram", placeholder: "https://t.me/goldennews7" },
          ] as { key: keyof SettingsForm; label: string; placeholder: string }[]
        ).map(({ key, label, placeholder }) => (
          <div key={key}>
            <label className={labelClass}>{label}</label>
            <input value={form[key] as string} onChange={(e) => set(key, e.target.value)} placeholder={placeholder} className={fieldClass} />
          </div>
        ))}
      </section>

      {/* SEO */}
      <section className="bg-gray-900 border border-white/5 rounded-xl p-6 space-y-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-widest mb-4">SEO par défaut</h2>
        <div>
          <label className={labelClass}>Titre SEO par défaut</label>
          <input value={form.default_seo_title} onChange={(e) => set("default_seo_title", e.target.value)} placeholder="GoldenNews7 – L'actualité en continu" className={fieldClass} />
        </div>
        <div>
          <label className={labelClass}>Description SEO par défaut</label>
          <textarea rows={3} value={form.default_seo_description} onChange={(e) => set("default_seo_description", e.target.value)} placeholder="Restez informé avec GoldenNews7, l'actualité africaine en temps réel." className={`${fieldClass} resize-none`} />
        </div>
      </section>

      {/* Auto-sharing */}
      <section className="bg-gray-900 border border-white/5 rounded-xl p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-widest">Partage automatique</h2>
            <p className="text-xs text-gray-500 mt-1">Publie automatiquement sur les réseaux lors de la publication d&apos;un article.</p>
          </div>
          <Link
            href="/admin/social-posts"
            className="text-xs text-amber-400 hover:text-amber-300 font-semibold"
          >
            Voir les logs →
          </Link>
        </div>

        <div className="space-y-4 border-t border-white/5 pt-4">
          {/* Twitter */}
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-white">Auto-partage X / Twitter</p>
              <p className="text-xs text-gray-500">Requiert les variables X_API_KEY, X_API_SECRET, X_ACCESS_TOKEN, X_ACCESS_SECRET</p>
            </div>
            <button
              type="button"
              onClick={() => set("enable_auto_share_twitter", !form.enable_auto_share_twitter)}
              className={`w-10 h-6 rounded-full transition-all shrink-0 ${form.enable_auto_share_twitter ? "bg-sky-500" : "bg-gray-700"}`}
            >
              <span className={`block w-4 h-4 rounded-full bg-white shadow transition-transform mx-1 ${form.enable_auto_share_twitter ? "translate-x-4" : ""}`} />
            </button>
          </div>
          {form.enable_auto_share_twitter && (
            <div>
              <label className={labelClass}>Compte Twitter (label d&apos;affichage)</label>
              <input
                value={form.twitter_account_label}
                onChange={(e) => set("twitter_account_label", e.target.value)}
                placeholder="@GoldenNews7"
                className={fieldClass}
              />
            </div>
          )}

          <div className="border-t border-white/5" />

          {/* Facebook */}
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-white">Auto-partage Facebook</p>
              <p className="text-xs text-gray-500">Requiert les variables FACEBOOK_PAGE_ID, FACEBOOK_PAGE_ACCESS_TOKEN</p>
            </div>
            <button
              type="button"
              onClick={() => set("enable_auto_share_facebook", !form.enable_auto_share_facebook)}
              className={`w-10 h-6 rounded-full transition-all shrink-0 ${form.enable_auto_share_facebook ? "bg-blue-500" : "bg-gray-700"}`}
            >
              <span className={`block w-4 h-4 rounded-full bg-white shadow transition-transform mx-1 ${form.enable_auto_share_facebook ? "translate-x-4" : ""}`} />
            </button>
          </div>
          {form.enable_auto_share_facebook && (
            <div>
              <label className={labelClass}>Page Facebook (label d&apos;affichage)</label>
              <input
                value={form.facebook_page_label}
                onChange={(e) => set("facebook_page_label", e.target.value)}
                placeholder="GoldenNews7 — Page officielle"
                className={fieldClass}
              />
            </div>
          )}
        </div>

        <div className="mt-3 p-3 bg-amber-500/5 border border-amber-500/20 rounded-lg">
          <p className="text-xs text-amber-400 leading-relaxed">
            <strong>Note :</strong> Le partage s&apos;effectue uniquement lors du passage au statut <em>Publié</em>. Chaque article doit également avoir son toggle individuel activé. Les identifiants API doivent être configurés dans les variables d&apos;environnement du serveur.
          </p>
        </div>
      </section>

      {/* Bottom save */}
      <div className="flex justify-end pb-8">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-white text-sm font-bold rounded-lg transition-colors"
        >
          {saving ? "Enregistrement…" : "Enregistrer les paramètres"}
        </button>
      </div>
    </div>
  );
}
