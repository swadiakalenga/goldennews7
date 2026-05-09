import type { MetadataRoute } from "next";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const SITE_URL = "https://goldennews7.com";

const STATIC_SLUGS = [
  "actualite", "politique", "securite", "economie", "societe",
  "afrique", "monde", "technologie", "sport", "culture", "sante", "opinion",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createServerSupabaseClient();

  // Fetch all published articles
  const { data: articles } = await supabase
    .from("articles")
    .select("slug, updated_at, categories:category_id(slug)")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  // Fetch all authors with public pages
  const { data: authors } = await supabase
    .from("authors")
    .select("slug, updated_at");

  const articleEntries: MetadataRoute.Sitemap = (articles ?? []).map((a) => {
    const catSlug = (a.categories as { slug: string } | null)?.slug ?? "actualite";
    return {
      url: `${SITE_URL}/${catSlug}/${a.slug}`,
      lastModified: a.updated_at ?? new Date().toISOString(),
      changeFrequency: "weekly",
      priority: 0.8,
    };
  });

  const authorEntries: MetadataRoute.Sitemap = (authors ?? []).map((a) => ({
    url: `${SITE_URL}/auteur/${a.slug}`,
    lastModified: a.updated_at ?? new Date().toISOString(),
    changeFrequency: "weekly",
    priority: 0.5,
  }));

  const categoryEntries: MetadataRoute.Sitemap = STATIC_SLUGS.map((slug) => ({
    url: `${SITE_URL}/${slug}`,
    changeFrequency: "daily",
    priority: 0.7,
  }));

  return [
    { url: SITE_URL, changeFrequency: "hourly", priority: 1.0 },
    { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${SITE_URL}/contact`, changeFrequency: "monthly", priority: 0.4 },
    ...categoryEntries,
    ...articleEntries,
    ...authorEntries,
  ];
}
