/**
 * ArticleService — Data access layer.
 *
 * This is the ONLY file that knows where article data lives.
 * To swap mock data for Supabase: replace the import below with
 * a Supabase client call inside each method. The API layer and
 * pages above never change.
 */
import { articles } from "@/data/mock-news";
import type { Article, Category } from "@/types";

export const ArticleService = {
  async findAll(): Promise<Article[]> {
    return articles;
  },

  async findBySlug(slug: string): Promise<Article | null> {
    return articles.find((a) => a.slug === slug) ?? null;
  },

  async findByCategory(category: Category): Promise<Article[]> {
    return articles.filter((a) => a.category === category);
  },

  async findFeatured(): Promise<Article[]> {
    return articles.filter((a) => a.isFeatured);
  },

  async findRelated(article: Article, limit = 3): Promise<Article[]> {
    return articles
      .filter((a) => a.id !== article.id && a.category === article.category)
      .slice(0, limit);
  },

  async search(query: string): Promise<Article[]> {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return articles.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        a.author.name.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q) ||
        a.tags?.some((t) => t.toLowerCase().includes(q))
    );
  },

  async findPaginated(
    category: Category | null,
    page: number,
    pageSize: number
  ): Promise<{ articles: Article[]; total: number }> {
    const source = category
      ? articles.filter((a) => a.category === category)
      : articles;
    const total = source.length;
    const start = (page - 1) * pageSize;
    return { articles: source.slice(start, start + pageSize), total };
  },
};
