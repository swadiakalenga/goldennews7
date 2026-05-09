"use client";

import { useState } from "react";
import Link from "next/link";
import ArticleCard from "@/components/ui/ArticleCard";
import { navItems } from "@/data/mock-news";
import type { Article } from "@/types";

interface SidebarProps {
  articles?: Article[];
}

function NewsletterWidget({ source = "sidebar" }: { source?: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source }),
      });
      const data = await res.json() as { message?: string; error?: string };
      if (res.ok) {
        setStatus("success");
        setMessage(data.message ?? "Inscription confirmée !");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error ?? "Une erreur est survenue.");
      }
    } catch {
      setStatus("error");
      setMessage("Impossible de se connecter. Réessayez.");
    }
  }

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl p-5 text-white">
      <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full" />
      <div className="absolute -bottom-6 -left-2 w-16 h-16 bg-white/10 rounded-full" />
      <div className="relative">
        <h3 className="text-sm font-black uppercase tracking-wide mb-1">Newsletter</h3>
        <p className="text-xs text-amber-100 mb-3 leading-relaxed">
          Recevez l&apos;essentiel de l&apos;actualité africaine chaque matin.
        </p>
        {status === "success" ? (
          <div className="flex items-center gap-2 py-2">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-sm font-semibold text-white">{message}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setStatus("idle"); }}
              placeholder="votre@email.com"
              required
              className="w-full px-3 py-2 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-white/60 bg-white/20 placeholder-amber-200 text-white border border-white/30 mb-2"
            />
            {status === "error" && (
              <p className="text-xs text-amber-100 mb-2">{message}</p>
            )}
            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full py-2 bg-white hover:bg-amber-50 text-amber-600 text-sm font-black rounded-lg transition-colors tracking-wide disabled:opacity-70"
            >
              {status === "loading" ? "Inscription…" : "S'abonner"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function Sidebar({ articles = [] }: SidebarProps) {
  return (
    <aside className="flex flex-col gap-8">
      <NewsletterWidget />

      {/* Most read */}
      {articles.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-5 bg-red-500 rounded-full" />
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-wide">
              Les plus lus
            </h3>
          </div>
          <div className="flex flex-col gap-1">
            {articles.slice(0, 5).map((article, i) => (
              <div key={article.id} className="flex gap-3 items-start group/item hover:bg-gray-50 rounded-lg p-2 -mx-2 transition-all duration-200 cursor-pointer">
                <span className="shrink-0 w-7 h-7 rounded-full bg-gray-100 group-hover/item:bg-amber-100 flex items-center justify-center text-xs font-black text-gray-400 group-hover/item:text-amber-600 transition-colors mt-0.5">
                  {i + 1}
                </span>
                <ArticleCard article={article} variant="compact" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Categories widget */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-5 bg-blue-500 rounded-full" />
          <h3 className="text-sm font-black text-gray-900 uppercase tracking-wide">
            Rubriques
          </h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-xs font-medium text-gray-700 bg-gray-100 hover:bg-amber-100 hover:text-amber-700 px-2.5 py-1 rounded-full transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Ad placeholder */}
      <div className="rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center h-64 text-xs text-gray-300 font-medium tracking-wider">
        PUBLICITÉ
      </div>
    </aside>
  );
}
