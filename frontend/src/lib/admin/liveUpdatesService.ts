"use client";

import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export interface LiveUpdate {
  id: string;
  article_id: string;
  content: string;
  author_note: string | null;
  created_at: string;
}

export async function getLiveUpdates(articleId: string): Promise<LiveUpdate[]> {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("live_updates")
    .select("*")
    .eq("article_id", articleId)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as LiveUpdate[];
}

export async function addLiveUpdate(payload: { article_id: string; content: string; author_note?: string }): Promise<void> {
  const supabase = getSupabaseBrowserClient();
  const { error } = await supabase.from("live_updates").insert({
    article_id: payload.article_id,
    content: payload.content,
    author_note: payload.author_note ?? null,
  });
  if (error) throw new Error(error.message);
}

export async function deleteLiveUpdate(id: string): Promise<void> {
  const supabase = getSupabaseBrowserClient();
  const { error } = await supabase.from("live_updates").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
