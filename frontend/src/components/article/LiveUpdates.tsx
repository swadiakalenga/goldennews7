"use client";

import { useState, useEffect, useCallback } from "react";

interface LiveUpdate {
  id: string;
  content: string;
  author_note: string | null;
  created_at: string;
}

interface LiveUpdatesProps {
  articleId: string;
  initialUpdates: LiveUpdate[];
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

function formatDateShort(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

export default function LiveUpdates({ articleId, initialUpdates }: LiveUpdatesProps) {
  const [updates, setUpdates] = useState<LiveUpdate[]>(initialUpdates);
  const [isNew, setIsNew] = useState(false);

  const fetchUpdates = useCallback(async () => {
    try {
      const res = await fetch(`/api/live-updates?articleId=${articleId}`);
      if (!res.ok) return;
      const data: LiveUpdate[] = await res.json();
      setUpdates((prev) => {
        if (data.length > prev.length) setIsNew(true);
        return data;
      });
    } catch {/* ignore */}
  }, [articleId]);

  // Auto-refresh every 45 seconds
  useEffect(() => {
    const id = setInterval(fetchUpdates, 45_000);
    return () => clearInterval(id);
  }, [fetchUpdates]);

  // Clear "new" indicator after 3s
  useEffect(() => {
    if (!isNew) return;
    const t = setTimeout(() => setIsNew(false), 3000);
    return () => clearTimeout(t);
  }, [isNew]);

  if (updates.length === 0) return null;

  return (
    <div className="my-8 rounded-xl border border-red-200 overflow-hidden">
      {/* Live header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-red-600">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
          <span className="text-xs font-black uppercase tracking-widest text-white">Direct</span>
          {isNew && (
            <span className="px-1.5 py-0.5 bg-white text-red-600 text-[10px] font-black rounded-full">
              Nouveau
            </span>
          )}
        </div>
        <button
          onClick={fetchUpdates}
          className="text-red-100 hover:text-white transition-colors"
          aria-label="Actualiser"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      {/* Timeline */}
      <div className="divide-y divide-gray-100">
        {updates.map((u, i) => (
          <div key={u.id} className={`px-4 py-3 flex gap-4 ${i === 0 ? "bg-red-50" : "bg-white"}`}>
            <div className="shrink-0 text-center min-w-[52px]">
              <p className="text-sm font-black text-red-600 tabular-nums">{formatTime(u.created_at)}</p>
              <p className="text-[10px] text-gray-400">{formatDateShort(u.created_at)}</p>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-800 leading-relaxed">{u.content}</p>
              {u.author_note && (
                <p className="mt-1 text-xs text-gray-400 italic">{u.author_note}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
