import type { Article, Category } from "@/types";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const STORAGE_BUCKET = "article-images";

function toPublicImageUrl(coverUrl: string | null): string {
  if (!coverUrl) return "";
  if (coverUrl.startsWith("http")) return coverUrl;
  return `${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/${coverUrl}`;
}

export type ArticleRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content?: string | null;
  cover_image_url: string | null;
  is_featured: boolean;
  is_breaking: boolean;
  is_live?: boolean;
  views_count?: number;
  published_at: string | null;
  updated_at?: string | null;
  created_at: string;
  ai_summary?: string | null;
  reading_time_minutes?: number | null;
  why_it_matters?: string | null;
  categories: { id: string; name: string; slug: string } | null;
  authors: {
    name: string;
    slug: string | null;
    avatar_url: string | null;
    role: string | null;
    bio: string | null;
    twitter_url: string | null;
    facebook_url: string | null;
  } | null;
};

function estimateReadingTime(content: string | null | undefined, storedMinutes?: number | null): number {
  if (storedMinutes && storedMinutes > 0) return storedMinutes;
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
      slug: row.authors?.slug ?? undefined,
      avatar: row.authors?.avatar_url ?? undefined,
      role: row.authors?.role ?? "Journaliste",
      bio: row.authors?.bio ?? undefined,
      twitterUrl: row.authors?.twitter_url ?? undefined,
      facebookUrl: row.authors?.facebook_url ?? undefined,
    },
    publishedAt: row.published_at ?? row.created_at,
    updatedAt: row.updated_at ?? undefined,
    readingTime: estimateReadingTime(row.content, row.reading_time_minutes),
    imageUrl: toPublicImageUrl(row.cover_image_url),
    imageAlt: row.title,
    isFeatured: row.is_featured,
    isBreaking: row.is_breaking,
    isLive: row.is_live ?? false,
    tags: [],
    views: row.views_count ?? 0,
    aiSummary: row.ai_summary ?? undefined,
    whyItMatters: row.why_it_matters ?? undefined,
  };
}

// SELECT strings — light for lists (no content), full for article detail
export const ARTICLE_SELECT_LIGHT =
  "id, slug, title, excerpt, cover_image_url, is_featured, is_breaking, is_live, views_count, published_at, created_at, categories:category_id(id, name, slug), authors:author_id(name, slug, avatar_url, role, bio, twitter_url, facebook_url)";

export const ARTICLE_SELECT_FULL =
  "id, slug, title, excerpt, content, cover_image_url, is_featured, is_breaking, is_live, views_count, published_at, updated_at, created_at, ai_summary, reading_time_minutes, why_it_matters, categories:category_id(id, name, slug), authors:author_id(name, slug, avatar_url, role, bio, twitter_url, facebook_url)";
