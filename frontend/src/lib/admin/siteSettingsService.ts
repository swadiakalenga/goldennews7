"use client";

import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { Database } from "@/lib/supabase/types";

type SettingsRow = Database["public"]["Tables"]["site_settings"]["Row"];
type SettingsUpdate = Database["public"]["Tables"]["site_settings"]["Update"];

export async function getAdminSiteSettings(): Promise<SettingsRow | null> {
  const supabase = getSupabaseBrowserClient();
  const { data } = await supabase
    .from("site_settings")
    .select("*")
    .limit(1)
    .maybeSingle();
  return data;
}

export async function upsertSiteSettings(
  payload: Omit<SettingsUpdate, "id" | "created_at">
): Promise<void> {
  const supabase = getSupabaseBrowserClient();

  // Get existing row id
  const { data: existing } = await supabase
    .from("site_settings")
    .select("id")
    .limit(1)
    .maybeSingle();

  if (existing?.id) {
    const { error } = await supabase
      .from("site_settings")
      .update({ ...payload, updated_at: new Date().toISOString() })
      .eq("id", existing.id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase
      .from("site_settings")
      .insert({ ...payload, updated_at: new Date().toISOString() });
    if (error) throw new Error(error.message);
  }
}
