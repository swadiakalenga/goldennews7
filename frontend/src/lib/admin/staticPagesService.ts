"use client";

import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { Database } from "@/lib/supabase/types";

type PageRow = Database["public"]["Tables"]["static_pages"]["Row"];
type PageUpdate = Database["public"]["Tables"]["static_pages"]["Update"];

export async function getAdminStaticPages(): Promise<PageRow[]> {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("static_pages")
    .select("*")
    .order("slug");
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getAdminStaticPageBySlug(
  slug: string
): Promise<PageRow | null> {
  const supabase = getSupabaseBrowserClient();
  const { data } = await supabase
    .from("static_pages")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  return data;
}

export async function updateStaticPage(
  id: string,
  payload: Omit<PageUpdate, "id" | "created_at">
): Promise<void> {
  const supabase = getSupabaseBrowserClient();
  const { error } = await supabase
    .from("static_pages")
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw new Error(error.message);
}
