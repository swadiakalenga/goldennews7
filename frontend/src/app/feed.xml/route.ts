import { createServerSupabaseClient } from "@/lib/supabase/server";
import { mapArticleRow, ARTICLE_SELECT_LIGHT, type ArticleRow } from "@/lib/utils/articleMapper";

const SITE_URL = "https://goldennews7.com";
const SITE_NAME = "GoldenNews7";
const SITE_DESCRIPTION = "L'information africaine sans frontières";

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const supabase = await createServerSupabaseClient();

  const result = (await supabase
    .from("articles")
    .select(ARTICLE_SELECT_LIGHT)
    .eq("status", "published")
    .order("published_at", { ascending: false, nullsFirst: false })
    .limit(50)) as unknown as { data: ArticleRow[] | null };

  const articles = (result.data ?? []).map(mapArticleRow);

  const items = articles
    .map((a) => {
      const catSlug = a.category.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-");
      const url = `${SITE_URL}/${catSlug}/${a.slug}`;
      return `  <item>
    <title>${escapeXml(a.title)}</title>
    <link>${url}</link>
    <guid isPermaLink="true">${url}</guid>
    <description>${escapeXml(a.excerpt)}</description>
    <author>${escapeXml(a.author.name)}</author>
    <category>${escapeXml(a.category)}</category>
    <pubDate>${new Date(a.publishedAt).toUTCString()}</pubDate>
    ${a.imageUrl ? `<enclosure url="${escapeXml(a.imageUrl)}" type="image/jpeg" length="0" />` : ""}
  </item>`;
    })
    .join("\n");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/">
<channel>
  <title>${SITE_NAME}</title>
  <link>${SITE_URL}</link>
  <description>${SITE_DESCRIPTION}</description>
  <language>fr</language>
  <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
  <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
  <image>
    <url>${SITE_URL}/logo.png</url>
    <title>${SITE_NAME}</title>
    <link>${SITE_URL}</link>
  </image>
${items}
</channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
