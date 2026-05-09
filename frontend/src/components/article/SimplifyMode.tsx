"use client";

import { useState } from "react";

interface SimplifyModeProps {
  content: string;
}

function simplifyText(html: string): string {
  // Strip HTML tags
  const plain = html
    .replace(/<h[1-6][^>]*>/gi, "\n\n")
    .replace(/<\/h[1-6]>/gi, ".\n")
    .replace(/<p[^>]*>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<li[^>]*>/gi, "\n• ")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  // Split into sentences and simplify
  const sentences = plain
    .split(/(?<=[.!?])\s+/)
    .filter((s) => s.trim().length > 10);

  // Keep first 60% of sentences (remove trailing detail)
  const keep = Math.max(3, Math.ceil(sentences.length * 0.6));
  return sentences.slice(0, keep).join(" ");
}

export default function SimplifyMode({ content }: SimplifyModeProps) {
  const [simplified, setSimplified] = useState(false);
  const [text, setText] = useState<string>("");

  function toggle() {
    if (!simplified) {
      setText(simplifyText(content));
    }
    setSimplified((s) => !s);
  }

  return (
    <div className="mt-4 mb-2">
      <button
        onClick={toggle}
        className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
          simplified
            ? "bg-blue-50 border-blue-300 text-blue-700"
            : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
        }`}
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h12M4 14h8M4 18h6" />
        </svg>
        {simplified ? "Voir l'article complet" : "Simplifier cet article"}
      </button>

      {simplified && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-black uppercase tracking-widest text-blue-600">Version simplifiée</span>
            <span className="text-[10px] text-blue-400 bg-blue-100 px-2 py-0.5 rounded-full">Langage clair</span>
          </div>
          <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">{text}</p>
          <p className="mt-3 text-[10px] text-gray-400">
            Cette version simplifiée est générée automatiquement. Lisez l&apos;article complet pour tous les détails.
          </p>
        </div>
      )}
    </div>
  );
}
