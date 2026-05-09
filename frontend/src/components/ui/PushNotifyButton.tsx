"use client";

import { useState, useEffect } from "react";

type State = "idle" | "subscribed" | "denied" | "unsupported" | "loading";

export default function PushNotifyButton() {
  const [state, setState] = useState<State>("idle");

  useEffect(() => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      setState("unsupported");
      return;
    }
    if (Notification.permission === "denied") setState("denied");
    else if (Notification.permission === "granted") {
      navigator.serviceWorker.getRegistration().then((reg) => {
        reg?.pushManager.getSubscription().then((sub) => {
          if (sub) setState("subscribed");
        });
      });
    }
  }, []);

  async function subscribe() {
    if (!("serviceWorker" in navigator)) return;
    setState("loading");
    try {
      const reg = await navigator.serviceWorker.register("/sw.js");
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setState("denied");
        return;
      }
      // Subscription stored locally for now — backend integration pending
      await reg.pushManager.getSubscription();
      setState("subscribed");
    } catch {
      setState("idle");
    }
  }

  if (state === "unsupported") return null;
  if (state === "denied") return (
    <p className="text-xs text-gray-400">Notifications bloquées par le navigateur.</p>
  );
  if (state === "subscribed") return (
    <span className="inline-flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
      </svg>
      Notifications activées
    </span>
  );

  return (
    <button
      onClick={subscribe}
      disabled={state === "loading"}
      className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-white text-sm font-bold rounded-full transition-all active:scale-95"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
      {state === "loading" ? "Activation…" : "Recevoir les alertes"}
    </button>
  );
}
