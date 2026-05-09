"use client";

import { useState } from "react";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "success">("idle");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("success");
  }

  const fieldClass = "w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 transition-colors placeholder-gray-400";
  const labelClass = "block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1.5";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
      {/* Form */}
      <div className="lg:col-span-3">
        {status === "success" ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-black text-gray-900 mb-2">Message envoyé !</h2>
            <p className="text-gray-600">Nous vous répondrons dans les meilleurs délais.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Nom *</label>
                <input type="text" required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Marie Dubois" className={fieldClass} />
              </div>
              <div>
                <label className={labelClass}>Email *</label>
                <input type="email" required value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} placeholder="marie@exemple.com" className={fieldClass} />
              </div>
            </div>
            <div>
              <label className={labelClass}>Sujet *</label>
              <input type="text" required value={form.subject} onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))} placeholder="Objet de votre message" className={fieldClass} />
            </div>
            <div>
              <label className={labelClass}>Message *</label>
              <textarea required rows={6} value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} placeholder="Votre message…" className={`${fieldClass} resize-none`} />
            </div>
            <button type="submit" className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-white font-bold rounded-full transition-colors">
              Envoyer le message
            </button>
          </form>
        )}
      </div>

      {/* Info */}
      <div className="lg:col-span-2 space-y-6">
        {[
          {
            icon: (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            ),
            label: "Email rédaction",
            value: "redaction@goldennews7.com",
          },
          {
            icon: (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            ),
            label: "Partenariats",
            value: "partenariats@goldennews7.com",
          },
        ].map((item) => (
          <div key={item.label} className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0 text-amber-600">
              {item.icon}
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-500">{item.label}</p>
              <p className="text-sm text-gray-800 font-semibold mt-0.5">{item.value}</p>
            </div>
          </div>
        ))}

        <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 mt-4">
          <p className="text-xs font-bold text-amber-800 mb-1">Vous avez une info ?</p>
          <p className="text-xs text-amber-700 leading-relaxed">
            Vous êtes témoin d&apos;un événement ou avez des informations à nous transmettre ? Contactez-nous en toute confidentialité.
          </p>
        </div>
      </div>
    </div>
  );
}
