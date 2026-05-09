"use client";

import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export interface TopArticle {
  id: string;
  title: string;
  slug: string;
  views_count: number;
  status: string;
  published_at: string | null;
  category_name: string | null;
}

export interface CategoryViews {
  name: string;
  views: number;
}

export interface AnalyticsSummary {
  totalViews: number;
  publishedCount: number;
  topArticles: TopArticle[];
  categoryViews: CategoryViews[];
  recentlyViewed: TopArticle[];
}

export async function getAnalyticsSummary(): Promise<AnalyticsSummary> {
  const supabase = getSupabaseBrowserClient();

  const [articlesRes, topRes, recentRes] = await Promise.all([
    // All published articles with views + category
    supabase
      .from("articles")
      .select("views_count, categories:category_id(name)")
      .eq("status", "published"),

    // Top 10 by views
    supabase
      .from("articles")
      .select("id, title, slug, views_count, status, published_at, categories:category_id(name)")
      .eq("status", "published")
      .order("views_count", { ascending: false })
      .limit(10),

    // 10 most recently viewed (highest views_count updated recently, approximate via published_at desc + views > 0)
    supabase
      .from("articles")
      .select("id, title, slug, views_count, status, published_at, categories:category_id(name)")
      .eq("status", "published")
      .gt("views_count", 0)
      .order("views_count", { ascending: false })
      .order("published_at", { ascending: false })
      .limit(5),
  ]);

  const allArticles = (articlesRes.data ?? []) as Array<{
    views_count: number;
    categories: { name: string } | null;
  }>;

  const totalViews = allArticles.reduce((sum, a) => sum + (a.views_count ?? 0), 0);
  const publishedCount = allArticles.length;

  // Aggregate views by category
  const catMap = new Map<string, number>();
  for (const a of allArticles) {
    const name = a.categories?.name ?? "Sans catégorie";
    catMap.set(name, (catMap.get(name) ?? 0) + (a.views_count ?? 0));
  }
  const categoryViews: CategoryViews[] = Array.from(catMap.entries())
    .map(([name, views]) => ({ name, views }))
    .sort((a, b) => b.views - a.views);

  function mapRow(r: Record<string, unknown>): TopArticle {
    const cat = r.categories as { name: string } | null;
    return {
      id: r.id as string,
      title: r.title as string,
      slug: r.slug as string,
      views_count: (r.views_count as number) ?? 0,
      status: r.status as string,
      published_at: r.published_at as string | null,
      category_name: cat?.name ?? null,
    };
  }

  const topArticles = (topRes.data ?? []).map((r) => mapRow(r as Record<string, unknown>));
  const recentlyViewed = (recentRes.data ?? []).map((r) => mapRow(r as Record<string, unknown>));

  return { totalViews, publishedCount, topArticles, categoryViews, recentlyViewed };
}
