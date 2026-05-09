"use client";

import { useState } from "react";

export default function ArticleNewsletter() {
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
        body: JSON.stringify({ email, source: "article" }),
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
    <div className="rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 p-8 text-white">
      <div className="max-w-md">
        <span className="inline-block text-xs font-bold uppercase tracking-widest text-amber-400 mb-2">
          Newsletter
        </span>
        <h3 className="text-2xl font-black mb-2">L&apos;actualité africaine chaque matin</h3>
        <p className="text-sm text-gray-400 mb-5">
          Rejoignez nos lecteurs qui font confiance à GoldenNews7 pour rester informés. Gratuit, sans spam.
        </p>

        {status === "success" ? (
          <div className="flex items-center gap-3 py-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-emerald-400">{message}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setStatus("idle"); }}
              placeholder="votre@email.com"
              required
              className="flex-1 px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 text-sm focus:outline-none focus:border-amber-400 transition-colors"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-white font-semibold text-sm rounded-lg transition-colors whitespace-nowrap disabled:opacity-70"
            >
              {status === "loading" ? "…" : "S'abonner"}
            </button>
          </form>
        )}
        {status === "error" && (
          <p className="text-xs text-red-400 mt-2">{message}</p>
        )}
      </div>
    </div>
  );
}
