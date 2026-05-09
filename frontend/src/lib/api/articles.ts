/**
 * Public API — what pages and components call.
 *
 * Pages never import ArticleService directly; they use these
 * functions. This boundary means caching, error handling, and
 * data-source changes stay isolated here.
 */
import { ArticleService } from "@/lib/services/articleService";
import type { Article, Category, PaginationInfo } from "@/types";
import type { PaginatedArticles } from "@/lib/types/api";

export async function getArticles(): Promise<Article[]> {
  return ArticleService.findAll();
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  return ArticleService.findBySlug(slug);
}

export async function getArticlesByCategory(category: Category): Promise<Article[]> {
  return ArticleService.findByCategory(category);
}

export async function getFeaturedArticles(): Promise<Article[]> {
  return ArticleService.findFeatured();
}

export async function getRelatedArticles(article: Article, limit = 3): Promise<Article[]> {
  return ArticleService.findRelated(article, limit);
}

export async function searchArticles(query: string): Promise<Article[]> {
  return ArticleService.search(query);
}

export async function getPaginatedArticles(
  category: Category | null,
  page: number,
  pageSize = 6
): Promise<PaginatedArticles> {
  const { articles, total } = await ArticleService.findPaginated(category, page, pageSize);
  const totalPages = Math.ceil(total / pageSize);
  const pagination: PaginationInfo = { page, pageSize, total, totalPages };
  return { data: articles, pagination };
}

export async function getArticlesByCategoryId(categoryId: string): Promise<Article[]> {
  return ArticleService.findByCategoryId(categoryId);
}

export async function getPaginatedArticlesByCategoryId(
  categoryId: string,
  page: number,
  pageSize = 6
): Promise<PaginatedArticles> {
  const { articles, total } = await ArticleService.findPaginatedByCategoryId(categoryId, page, pageSize);
  const totalPages = Math.ceil(total / pageSize);
  const pagination: PaginationInfo = { page, pageSize, total, totalPages };
  return { data: articles, pagination };
}

export async function getArticleBySlugAnyStatus(slug: string): Promise<Article | null> {
  return ArticleService.findBySlugAnyStatus(slug);
}
