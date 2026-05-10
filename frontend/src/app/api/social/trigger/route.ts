/**
 * POST /api/social/trigger
 *
 * Called after an article is published. Detects transitions and triggers
 * Twitter/Facebook posting if conditions are met. Checks for duplicate posts
 * (status=success) unless force=true.
 *
 * Body: { articleId: string, previousStatus?: string, force?: boolean }
 */
import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://goldennews7.com";

interface TriggerBody {
  articleId: string;
  previousStatus?: string;
  force?: boolean;
}

interface PostResult {
  platform: string;
  status: "skipped" | "success" | "failed" | "missing_credentials";
  reason?: string;
  logId?: string;
  url?: string;
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as TriggerBody;
  const { articleId, previousStatus, force = false } = body;

  if (!articleId) {
    return NextResponse.json({ error: "articleId required" }, { status: 400 });
  }

  const supabase = await createServerSupabaseClient();

  // Auth check
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // If not a force-post, skip if article was already published (no transition)
  if (!force && previousStatus === "published") {
    return NextResponse.json({ skipped: true, reason: "already_published" });
  }

  // Fetch article + global settings in parallel
  const [articleRes, settingsRes] = await Promise.all([
    supabase
      .from("articles")
      .select("id, title, slug, excerpt, social_twitter, social_facebook, auto_share_twitter, auto_share_facebook, status, categories:category_id(slug)")
      .eq("id", articleId)
      .single(),
    supabase
      .from("site_settings")
      .select("enable_auto_share_twitter, enable_auto_share_facebook")
      .limit(1)
      .maybeSingle(),
  ]);

  const article = articleRes.data as {
    id: string; title: string; slug: string; excerpt: string | null;
    social_twitter: string | null; social_facebook: string | null;
    auto_share_twitter: boolean; auto_share_facebook: boolean; status: string;
    categories: { slug: string } | null;
  } | null;

  const settings = settingsRes.data as {
    enable_auto_share_twitter: boolean;
    enable_auto_share_facebook: boolean;
  } | null;

  if (!article) {
    return NextResponse.json({ error: "Article not found" }, { status: 404 });
  }

  if (article.status !== "published") {
    return NextResponse.json({ skipped: true, reason: "article_not_published" });
  }

  // Build article URL
  const categorySlug = article.categories?.slug ?? "actualite";
  const articleUrl = `${SITE_URL}/${categorySlug}/${article.slug}`;

  const results: PostResult[] = [];
  const baseUrl = `${req.nextUrl.protocol}//${req.nextUrl.host}`;

  async function callPlatform(platform: "twitter" | "facebook", postText: string | null) {
    if (!postText?.trim()) {
      // Auto-generate fallback from title + excerpt
      postText = `${article!.title}${article!.excerpt ? ` — ${article!.excerpt.slice(0, 180)}` : ""}`;
    }

    // Dedup check (skip if already successfully posted, unless force)
    if (!force) {
      const { data: existing } = await supabase
        .from("social_posts")
        .select("id")
        .eq("article_id", articleId)
        .eq("platform", platform)
        .eq("status", "success")
        .limit(1)
        .maybeSingle();

      if (existing) {
        results.push({ platform, status: "skipped", reason: "already_posted" });
        return;
      }
    }

    const endpoint = `${baseUrl}/api/social/${platform}`;
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Forward auth cookie so the route can verify the user
          "Cookie": req.headers.get("cookie") ?? "",
        },
        body: JSON.stringify({ articleId, postText, articleUrl }),
      });

      const data = (await res.json()) as { success?: boolean; error?: string; url?: string; logId?: string };

      if (res.status === 422) {
        results.push({ platform, status: "missing_credentials", reason: data.error, logId: data.logId });
      } else if (!res.ok) {
        results.push({ platform, status: "failed", reason: data.error, logId: data.logId });
      } else {
        results.push({ platform, status: "success", url: data.url, logId: data.logId });
      }
    } catch (err) {
      results.push({ platform, status: "failed", reason: err instanceof Error ? err.message : "Network error" });
    }
  }

  // Twitter
  const twitterEnabled = (settings?.enable_auto_share_twitter ?? false) || force;
  if (twitterEnabled && (article.auto_share_twitter || force)) {
    await callPlatform("twitter", article.social_twitter);
  } else {
    results.push({ platform: "twitter", status: "skipped", reason: force ? "auto_share_disabled" : "disabled" });
  }

  // Facebook
  const facebookEnabled = (settings?.enable_auto_share_facebook ?? false) || force;
  if (facebookEnabled && (article.auto_share_facebook || force)) {
    await callPlatform("facebook", article.social_facebook);
  } else {
    results.push({ platform: "facebook", status: "skipped", reason: force ? "auto_share_disabled" : "disabled" });
  }

  return NextResponse.json({ results });
}
