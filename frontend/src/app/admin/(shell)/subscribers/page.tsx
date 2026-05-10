"use client";

import { useState, useEffect, useRef } from "react";
import { useToast } from "@/components/admin/ToastProvider";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { Database } from "@/lib/supabase/types";

type SubscriberRow = Database["public"]["Tables"]["newsletter_subscribers"]["Row"];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
}

export default function SubscribersPage() {
  const { toast } = useToast();
  const [subscribers, setSubscribers] = useState<SubscriberRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const supabaseRef = useRef(getSupabaseBrowserClient());

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const { data, error } = await supabaseRef.current
          .from("newsletter_subscribers")
          .select("*")
          .order("subscribed_at", { ascending: false });
        if (error) throw error;
        if (active) { setSubscribers((data as SubscriberRow[]) ?? []); setLoading(false); }
      } catch {
        if (active) { toast("Erreur lors du chargement des abonnés.", "error"); setLoading(false); }
      }
    }
    load();
    return () => { active = false; };
  }, [toast]);

  function exportCsv() {
    const rows = [
      ["Email", "Date d'inscription", "Source", "Confirmé"],
      ...subscribers.map((s) => [
        s.email,
        formatDate(s.subscribed_at),
        s.source ?? "",
        s.confirmed ? "Oui" : "Non",
      ]),
    ];
    const csv = rows.map((r) => r.map((v) => `"${v}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `abonnes-goldennews7-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const filtered = subscribers.filter((s) =>
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-white">Abonnés Newsletter</h1>
          <p className="text-sm text-gray-500 mt-0.5">{subscribers.length} abonné{subscribers.length !== 1 ? "s" : ""}</p>
        </div>
        <button
          onClick={exportCsv}
          disabled={subscribers.length === 0}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 text-sm font-semibold rounded-full transition-colors border border-white/8 disabled:opacity-40"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Exporter CSV
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filtrer par email…"
          className="w-full pl-9 pr-4 py-2 bg-gray-900 border border-white/8 rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none focus:border-amber-500/60"
        />
      </div>

      <div className="bg-gray-900 border border-white/5 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500 text-sm">Chargement…</div>
        ) : subscribers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-4">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-sm text-gray-500">Aucun abonné pour l&apos;instant.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500 hidden sm:table-cell">Inscription</th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500 hidden md:table-cell">Source</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((sub) => (
                  <tr key={sub.id} className="hover:bg-white/2 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-200">{sub.email}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs hidden sm:table-cell">{formatDate(sub.subscribed_at)}</td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-xs text-gray-600 bg-white/5 px-2 py-0.5 rounded-full">{sub.source ?? "direct"}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <p className="text-center text-gray-500 text-sm py-8">Aucun résultat pour « {search} ».</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
