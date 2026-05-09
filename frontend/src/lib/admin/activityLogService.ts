"use client";

import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { Database } from "@/lib/supabase/types";

type LogRow = Database["public"]["Tables"]["admin_activity_logs"]["Row"];

export type ActivityAction =
  | "article_created"
  | "article_updated"
  | "article_published"
  | "article_archived"
  | "article_deleted"
  | "category_created"
  | "category_updated"
  | "category_deleted"
  | "author_created"
  | "author_updated"
  | "author_deleted"
  | "homepage_slot_assigned"
  | "homepage_slot_removed"
  | "static_page_updated"
  | "settings_updated";

export interface LogEntry {
  action: ActivityAction;
  entity_type?: string;
  entity_id?: string;
  description?: string;
  metadata?: Record<string, unknown>;
}

export async function logActivity(entry: LogEntry): Promise<void> {
  try {
    const supabase = getSupabaseBrowserClient();
    const { data: { user } } = await supabase.auth.getUser();

    await supabase.from("admin_activity_logs").insert({
      actor_id: user?.id ?? null,
      action: entry.action,
      entity_type: entry.entity_type ?? null,
      entity_id: entry.entity_id as unknown as string ?? null,
      description: entry.description ?? null,
      metadata: entry.metadata ?? null,
    });
  } catch {
    // Never throw — logging must not break the main operation
  }
}

export async function getAdminActivityLogs(opts?: {
  action?: string;
  entity_type?: string;
  limit?: number;
}): Promise<LogRow[]> {
  const supabase = getSupabaseBrowserClient();
  let q = supabase
    .from("admin_activity_logs")
    .select("*, actor:actor_id(id, email, full_name)")
    .order("created_at", { ascending: false })
    .limit(opts?.limit ?? 100);

  if (opts?.action) q = q.eq("action", opts.action);
  if (opts?.entity_type) q = q.eq("entity_type", opts.entity_type);

  const { data, error } = await q;
  if (error) throw new Error(error.message);
  return (data as LogRow[]) ?? [];
}
