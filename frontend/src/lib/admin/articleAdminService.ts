"use client";

import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { Database } from "@/lib/supabase/types";

type ArticleRow = Database["public"]["Tables"]["articles"]["Row"];
type ArticleInsert = Database["public"]["Tables"]["articles"]["Insert"];
type ArticleUpdate = Database["public"]["Tables"]["articles"]["Update"];
type CategoryRow = Database["public"]["Tables"]["categories"]["Row"];
type AuthorRow = Database["public"]["Tables"]["authors"]["Row"];

export interface ArticleWithRelations extends ArticleRow {
  categories: Pick<CategoryRow, "id" | "name" | "slug"> | null;
  authors: Pick<AuthorRow, "id" | "name"> | null;
}

export interface AdminStats {
  total: number;
  published: number;
  drafts: number;
  archived: number;
  categoriesCount: number;
}

export interface ArticleListOptions {
  status?: string;
  q?: string;
  page?: number;
  pageSize?: number;
  sortBy?: "created_at" | "views_count";
  sortAsc?: boolean;
}

export interface ArticleListResult {
  data: ArticleWithRelations[];
  count: number;
}

// ─── Read ─────────────────────────────────────────────────────

export async function getAdminStats(): Promise<AdminStats> {
  const supabase = getSupabaseBrowserClient();

  const [totalRes, publishedRes, draftsRes, archivedRes, catRes] =
    await Promise.all([
      supabase.from("articles").select("*", { count: "exact", head: true }),
      supabase.from("articles").select("*", { count: "exact", head: true }).eq("status", "published"),
      supabase.from("articles").select("*", { count: "exact", head: true }).eq("status", "draft"),
      supabase.from("articles").select("*", { count: "exact", head: true }).eq("status", "archived"),
      supabase.from("categories").select("*", { count: "exact", head: true }),
    ]);

  return {
    total: totalRes.count ?? 0,
    published: publishedRes.count ?? 0,
    drafts: draftsRes.count ?? 0,
    archived: archivedRes.count ?? 0,
    categoriesCount: catRes.count ?? 0,
  };
}

export async function getAdminArticles(
  opts: ArticleListOptions = {}
): Promise<ArticleListResult> {
  const { status, q, page = 1, pageSize = 20, sortBy = "created_at", sortAsc = false } = opts;
  const supabase = getSupabaseBrowserClient();

  let query = supabase
    .from("articles")
    .select(
      "*, categories:category_id(id, name, slug), authors:author_id(id, name)",
      { count: "exact" }
    )
    .order(sortBy, { ascending: sortAsc })
    .range((page - 1) * pageSize, page * pageSize - 1);

  if (status && status !== "all") {
    query = query.eq("status", status as "draft" | "published" | "archived");
  }
  if (q) {
    query = query.ilike("title", `%${q}%`);
  }

  const { data, count, error } = await query;
  if (error) throw error;

  return { data: (data as ArticleWithRelations[]) ?? [], count: count ?? 0 };
}

export async function getAdminArticleById(
  id: string
): Promise<ArticleWithRelations | null> {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("articles")
    .select("*, categories:category_id(id, name, slug), authors:author_id(id, name)")
    .eq("id", id)
    .single();

  if (error) return null;
  return data as ArticleWithRelations;
}

export async function getAdminRecentArticles(
  limit = 5
): Promise<ArticleWithRelations[]> {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("articles")
    .select("*, categories:category_id(id, name, slug), authors:author_id(id, name)")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) return [];
  return (data as ArticleWithRelations[]) ?? [];
}

export async function getAdminCategories(): Promise<CategoryRow[]> {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name");
  if (error) return [];
  return data ?? [];
}

export async function getAdminAuthors(): Promise<AuthorRow[]> {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("authors")
    .select("*")
    .order("name");
  if (error) return [];
  return data ?? [];
}

// ─── Write ────────────────────────────────────────────────────

export async function createArticle(payload: ArticleInsert): Promise<ArticleRow> {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("articles")
    .insert(payload)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateArticle(
  id: string,
  payload: ArticleUpdate
): Promise<ArticleRow> {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("articles")
    .update(payload)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteArticle(id: string): Promise<void> {
  const supabase = getSupabaseBrowserClient();
  const { error } = await supabase.from("articles").delete().eq("id", id);
  if (error) throw error;
}

export async function toggleArticleField(
  id: string,
  field: "is_featured" | "is_breaking",
  value: boolean
): Promise<void> {
  const supabase = getSupabaseBrowserClient();
  const payload: ArticleUpdate = field === "is_featured" ? { is_featured: value } : { is_breaking: value };
  const { error } = await supabase
    .from("articles")
    .update(payload)
    .eq("id", id);
  if (error) throw error;
}
