"use client";

import { useEffect } from "react";

interface ArticleViewTrackerProps {
  articleId: string;
  slug: string;
}

const DEDUP_PREFIX = "gn7_view_";
const DEDUP_TTL_MS = 30 * 60 * 1000; // 30 minutes

function shouldCount(articleId: string): boolean {
  try {
    const key = DEDUP_PREFIX + articleId;
    const raw = sessionStorage.getItem(key) ?? localStorage.getItem(key);
    if (raw) {
      const ts = parseInt(raw, 10);
      if (!isNaN(ts) && Date.now() - ts < DEDUP_TTL_MS) return false;
    }
    const now = String(Date.now());
    sessionStorage.setItem(key, now);
    localStorage.setItem(key, now);
    return true;
  } catch {
    // Private browsing or storage blocked — still count
    return true;
  }
}

export default function ArticleViewTracker({ articleId, slug }: ArticleViewTrackerProps) {
  useEffect(() => {
    if (!shouldCount(articleId)) return;

    const url = "/api/articles/views";
    const body = JSON.stringify({ slug });

    // sendBeacon: fire-and-forget, survives page navigation
    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      const blob = new Blob([body], { type: "application/json" });
      const sent = navigator.sendBeacon(url, blob);
      if (sent) return;
    }

    // Fallback: keepalive keeps the request alive through navigation
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => {/* ignore */});
  }, [articleId, slug]);

  return null;
}
