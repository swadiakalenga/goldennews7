"use client";

import { useEffect } from "react";

interface ArticleViewTrackerProps {
  slug: string;
}

export default function ArticleViewTracker({ slug }: ArticleViewTrackerProps) {
  useEffect(() => {
    // Fire-and-forget — don't block render or surface errors to user
    fetch("/api/articles/views", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
    }).catch(() => {/* ignore */});
  }, [slug]);

  return null;
}
