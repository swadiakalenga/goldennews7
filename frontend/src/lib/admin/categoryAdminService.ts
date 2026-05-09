"use client";

import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { Database } from "@/lib/supabase/types";

type CategoryRow = Database["public"]["Tables"]["categories"]["Row"];
type CategoryInsert = Database["public"]["Tables"]["categories"]["Insert"];
type CategoryUpdate = Database["public"]["Tables"]["categories"]["Update"];

export async function getAdminCategories(): Promise<CategoryRow[]> {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order")
    .order("name");
  if (error) throw error;
  return (data as CategoryRow[]) ?? [];
}

export async function getAdminCategoryById(id: string): Promise<CategoryRow | null> {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase.from("categories").select("*").eq("id", id).single();
  if (error) return null;
  return data as CategoryRow;
}

export async function createCategory(payload: CategoryInsert): Promise<CategoryRow> {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase.from("categories").insert(payload).select().single();
  if (error) throw error;
  return data as CategoryRow;
}

export async function updateCategory(id: string, payload: CategoryUpdate): Promise<CategoryRow> {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase.from("categories").update(payload).eq("id", id).select().single();
  if (error) throw error;
  return data as CategoryRow;
}

export async function deleteCategory(id: string): Promise<void> {
  const supabase = getSupabaseBrowserClient();
  const { count } = await supabase
    .from("articles")
    .select("*", { count: "exact", head: true })
    .eq("category_id", id);
  if (count && count > 0) {
    throw new Error(`Cette catégorie contient ${count} article(s). Réassignez-les avant de supprimer.`);
  }
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) throw error;
}
