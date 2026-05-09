"use client";

import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { Database } from "@/lib/supabase/types";

type AuthorRow = Database["public"]["Tables"]["authors"]["Row"];
type AuthorInsert = Database["public"]["Tables"]["authors"]["Insert"];
type AuthorUpdate = Database["public"]["Tables"]["authors"]["Update"];

export interface AuthorWithCount extends AuthorRow {
  articles_count?: number;
}

export async function getAdminAuthors(): Promise<AuthorWithCount[]> {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("authors")
    .select("*")
    .order("name");
  if (error) throw error;
  return (data as AuthorRow[]) ?? [];
}

export async function getAdminAuthorById(id: string): Promise<AuthorRow | null> {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("authors")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return null;
  return data as AuthorRow;
}

export async function createAuthor(payload: AuthorInsert): Promise<AuthorRow> {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("authors")
    .insert(payload)
    .select()
    .single();
  if (error) throw error;
  return data as AuthorRow;
}

export async function updateAuthor(id: string, payload: AuthorUpdate): Promise<AuthorRow> {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("authors")
    .update(payload)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as AuthorRow;
}

export async function deleteAuthor(id: string): Promise<void> {
  const supabase = getSupabaseBrowserClient();
  // Check if author has articles
  const { count } = await supabase
    .from("articles")
    .select("*", { count: "exact", head: true })
    .eq("author_id", id);
  if (count && count > 0) {
    throw new Error(`Cet auteur a ${count} article(s). Réassignez-les avant de supprimer.`);
  }
  const { error } = await supabase.from("authors").delete().eq("id", id);
  if (error) throw error;
}

export async function getAuthorArticleCount(authorId: string): Promise<number> {
  const supabase = getSupabaseBrowserClient();
  const { count } = await supabase
    .from("articles")
    .select("*", { count: "exact", head: true })
    .eq("author_id", authorId);
  return count ?? 0;
}
