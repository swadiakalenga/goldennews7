import type { Article, Category } from "@/types";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const STORAGE_BUCKET = "article-images";

/**
 * Ensure cover_image_url is always a full public URL.
 * - null / empty  → empty string (caller guards the <Image> render)
 * - already "http…" → returned as-is (correct format from uploadService)
 * - bare storage path → prefixed with the Supabase Storage public URL
 *   (handles legacy rows that stored just the path, e.g. "covers/file.jpg")
 */
function toPublicImageUrl(coverUrl: string | null): string {
  if (!coverUrl) return "";
  if (coverUrl.startsWith("http")) return coverUrl;
  return `${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/${coverUrl}`;
}

// Shape returned by all Supabase article queries that include joins.
// content is optional so both light (list) and full (detail) queries can use it.
export type ArticleRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content?: string | null;
  cover_image_url: string | null;
  is_featured: boolean;
  is_breaking: boolean;
  published_at: string | null;
  created_at: string;
  categories: { id: string; name: string; slug: string } | null;
  authors: { name: string; avatar_url: string | null; role: string | null } | null;
};

function estimateReadingTime(content: string | null | undefined): number {
  if (!content) return 1;
  const words = content
    .replace(/<[^>]+>/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export function mapArticleRow(row: ArticleRow): Article {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt ?? "",
    content: row.content ?? undefined,
    category: (row.categories?.name ?? "Actualité") as Category,
    author: {
      name: row.authors?.name ?? "Rédaction",
      avatar: row.authors?.avatar_url ?? undefined,
      role: row.authors?.role ?? "Journaliste",
    },
    publishedAt: row.published_at ?? row.created_at,
    readingTime: estimateReadingTime(row.content),
    imageUrl: toPublicImageUrl(row.cover_image_url),
    imageAlt: row.title,
    isFeatured: row.is_featured,
    isBreaking: row.is_breaking,
    tags: [],
    views: 0,
  };
}

// SELECT strings — light for lists (no content), full for article detail
export const ARTICLE_SELECT_LIGHT =
  "id, slug, title, excerpt, cover_image_url, is_featured, is_breaking, published_at, created_at, categories:category_id(id, name, slug), authors:author_id(name, avatar_url, role)";

export const ARTICLE_SELECT_FULL =
  "id, slug, title, excerpt, content, cover_image_url, is_featured, is_breaking, published_at, created_at, categories:category_id(id, name, slug), authors:author_id(name, avatar_url, role)";
