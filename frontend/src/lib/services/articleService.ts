/**
 * ArticleService — Data access layer (server-only).
 * Reads published articles from Supabase.
 * Do NOT import from client components; use @/lib/utils/articleMapper directly
 * with getSupabaseBrowserClient() for client-side queries instead.
 */
import { createServerSupabaseClient } from "@/lib/supabase/server";
import {
  mapArticleRow,
  type ArticleRow,
  ARTICLE_SELECT_LIGHT,
  ARTICLE_SELECT_FULL,
} from "@/lib/utils/articleMapper";
import type { Article, Category } from "@/types";

async function getCategoryId(category: Category): Promise<string | null> {
  const supabase = await createServerSupabaseClient();
  const result = (await supabase
    .from("categories")
    .select("id")
    .eq("name", category)
    .maybeSingle()) as unknown as { data: { id: string } | null };
  return result.data?.id ?? null;
}

export const ArticleService = {
  async findAll(): Promise<Article[]> {
    const supabase = await createServerSupabaseClient();
    const result = (await supabase
      .from("articles")
      .select(ARTICLE_SELECT_LIGHT)
      .eq("status", "published")
      .order("published_at", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false })) as unknown as {
      data: ArticleRow[] | null;
    };
    return (result.data ?? []).map(mapArticleRow);
  },

  async findBySlug(slug: string): Promise<Article | null> {
    const supabase = await createServerSupabaseClient();
    const result = (await supabase
      .from("articles")
      .select(ARTICLE_SELECT_FULL)
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle()) as unknown as { data: ArticleRow | null };
    if (!result.data) return null;
    return mapArticleRow(result.data);
  },

  async findByCategory(category: Category): Promise<Article[]> {
    const categoryId = await getCategoryId(category);
    if (!categoryId) return [];
    const supabase = await createServerSupabaseClient();
    const result = (await supabase
      .from("articles")
      .select(ARTICLE_SELECT_LIGHT)
      .eq("category_id", categoryId)
      .eq("status", "published")
      .order("published_at", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false })) as unknown as {
      data: ArticleRow[] | null;
    };
    return (result.data ?? []).map(mapArticleRow);
  },

  async findFeatured(): Promise<Article[]> {
    const supabase = await createServerSupabaseClient();
    const result = (await supabase
      .from("articles")
      .select(ARTICLE_SELECT_LIGHT)
      .eq("is_featured", true)
      .eq("status", "published")
      .order("published_at", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false })) as unknown as {
      data: ArticleRow[] | null;
    };
    return (result.data ?? []).map(mapArticleRow);
  },

  async findRelated(article: Article, limit = 3): Promise<Article[]> {
    const categoryId = await getCategoryId(article.category);
    if (!categoryId) return [];
    const supabase = await createServerSupabaseClient();
    const result = (await supabase
      .from("articles")
      .select(ARTICLE_SELECT_LIGHT)
      .eq("category_id", categoryId)
      .eq("status", "published")
      .neq("id", article.id)
      .order("published_at", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false })
      .limit(limit)) as unknown as { data: ArticleRow[] | null };
    return (result.data ?? []).map(mapArticleRow);
  },

  async search(query: string): Promise<Article[]> {
    if (!query.trim()) return [];
    const supabase = await createServerSupabaseClient();
    const result = (await supabase
      .from("articles")
      .select(ARTICLE_SELECT_LIGHT)
      .eq("status", "published")
      .or(`title.ilike.%${query}%,excerpt.ilike.%${query}%`)
      .order("published_at", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false })
      .limit(50)) as unknown as { data: ArticleRow[] | null };
    return (result.data ?? []).map(mapArticleRow);
  },

  async findPaginated(
    category: Category | null,
    page: number,
    pageSize: number
  ): Promise<{ articles: Article[]; total: number }> {
    let categoryId: string | null = null;
    if (category) {
      categoryId = await getCategoryId(category);
      if (!categoryId) return { articles: [], total: 0 };
    }

    const supabase = await createServerSupabaseClient();
    const from = (page - 1) * pageSize;
    const to = page * pageSize - 1;

    const base = supabase
      .from("articles")
      .select(ARTICLE_SELECT_LIGHT, { count: "exact" })
      .eq("status", "published")
      .order("published_at", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false })
      .range(from, to);

    const raw = categoryId
      ? await base.eq("category_id", categoryId)
      : await base;

    const result = raw as unknown as {
      data: ArticleRow[] | null;
      count: number | null;
    };

    return {
      articles: (result.data ?? []).map(mapArticleRow),
      total: result.count ?? 0,
    };
  },
};
