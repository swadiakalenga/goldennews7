"use client";

import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export interface SocialPost {
  id: string;
  article_id: string;
  platform: "twitter" | "facebook";
  post_text: string;
  post_url: string | null;
  status: "pending" | "success" | "failed";
  error_message: string | null;
  created_at: string;
  posted_at: string | null;
  article_title?: string;
  article_slug?: string;
}

export async function getSocialPosts(limit = 50): Promise<SocialPost[]> {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("social_posts")
    .select("*, articles:article_id(title, slug)")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);

  return ((data ?? []) as Array<Record<string, unknown>>).map((row) => {
    const art = row.articles as { title: string; slug: string } | null;
    return {
      ...(row as unknown as SocialPost),
      article_title: art?.title,
      article_slug: art?.slug,
    };
  });
}

export async function deleteSocialPost(id: string): Promise<void> {
  const supabase = getSupabaseBrowserClient();
  const { error } = await supabase.from("social_posts").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
