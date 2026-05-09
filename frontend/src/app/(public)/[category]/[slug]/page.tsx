export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getArticleBySlug, getRelatedArticles } from "@/lib/api/articles";
import { getCategoryBySlug } from "@/lib/api/categories";
import { categoryToSlug } from "@/lib/utils";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import ArticleBreadcrumb from "@/components/article/ArticleBreadcrumb";
import ArticleHero from "@/components/article/ArticleHero";
import ArticleContent from "@/components/article/ArticleContent";
import ArticleShare from "@/components/article/ArticleShare";
import RelatedArticles from "@/components/article/RelatedArticles";
import ArticleNewsletter from "@/components/article/ArticleNewsletter";
import ArticleAuthorCard from "@/components/article/ArticleAuthorCard";
import ArticleViewTracker from "@/components/article/ArticleViewTracker";
import ArticleSummary from "@/components/article/ArticleSummary";
import AudioPlayer from "@/components/article/AudioPlayer";
import WhyItMatters from "@/components/article/WhyItMatters";
import LiveUpdates from "@/components/article/LiveUpdates";
import ArticleSources from "@/components/article/ArticleSources";
import ContextCardLayer from "@/components/article/ContextCardLayer";
import SimplifyMode from "@/components/article/SimplifyMode";
import ReadingProgressBar from "@/components/ui/ReadingProgressBar";
import BackToTop from "@/components/ui/BackToTop";
import JsonLd from "@/components/ui/JsonLd";

interface Params {
  category: string;
  slug: string;
}

const SITE_URL = "https://goldennews7.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { category: categorySlug, slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: "Article non trouvé | GoldenNews7" };

  const canonical = `${SITE_URL}/${categorySlug}/${slug}`;

  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      url: canonical,
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt ?? article.publishedAt,
      authors: [article.author.name],
      images: article.imageUrl
        ? [{ url: article.imageUrl, alt: article.imageAlt }]
        : [],
      locale: "fr_FR",
      siteName: "GoldenNews7",
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: article.imageUrl ? [article.imageUrl] : [],
      site: "@GoldenNews7",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large" },
    },
  };
}

interface Source {
  id: string;
  source_name: string;
  source_type: string;
  source_url: string | null;
}

interface ContextCardDB {
  keyword: string;
  title: string;
  content: string;
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { category: categorySlug, slug } = await params;

  const dbCategory = await getCategoryBySlug(categorySlug);
  if (!dbCategory) notFound();

  const article = await getArticleBySlug(slug);
  if (!article || categoryToSlug(article.category) !== categorySlug) notFound();

  // Fetch related, sources, context cards, and live updates in parallel
  const [related, sourcesResult, contextCardsResult, liveUpdatesResult] = await Promise.all([
    getRelatedArticles(article, 3),
    createServerSupabaseClient().then((sb) =>
      sb.from("article_sources").select("id, source_name, source_type, source_url").eq("article_id", article.id)
    ),
    createServerSupabaseClient().then((sb) =>
      sb.from("context_cards").select("keyword, title, content")
    ),
    article.isLive
      ? createServerSupabaseClient().then((sb) =>
          sb.from("live_updates")
            .select("id, content, author_note, created_at")
            .eq("article_id", article.id)
            .order("created_at", { ascending: false })
        )
      : Promise.resolve({ data: [] }),
  ]);

  const sources: Source[] = (sourcesResult.data ?? []) as Source[];
  const contextCards: ContextCardDB[] = (contextCardsResult.data ?? []) as ContextCardDB[];
  const initialLiveUpdates = (liveUpdatesResult.data ?? []) as Array<{
    id: string; content: string; author_note: string | null; created_at: string;
  }>;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.excerpt,
    image: article.imageUrl || undefined,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt ?? article.publishedAt,
    author: {
      "@type": "Person",
      name: article.author.name,
      url: article.author.slug ? `${SITE_URL}/auteur/${article.author.slug}` : undefined,
    },
    publisher: {
      "@type": "Organization",
      name: "GoldenNews7",
      logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.png` },
    },
    url: `${SITE_URL}/${categorySlug}/${article.slug}`,
    mainEntityOfPage: `${SITE_URL}/${categorySlug}/${article.slug}`,
    inLanguage: "fr-FR",
    isAccessibleForFree: true,
    ...(article.isLive && { liveBlogUpdate: true }),
  };

  return (
    <div className="bg-white min-h-screen">
      <ReadingProgressBar />
      <ArticleViewTracker articleId={article.id} slug={article.slug} />
      <JsonLd data={jsonLd} />

      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <ArticleBreadcrumb category={article.category} title={article.title} />
        </div>

        <div className="flex gap-10 items-start">
          <article className="min-w-0 flex-1 max-w-3xl">
            {/* Hero */}
            <ArticleHero article={article} />

            {/* Audio player */}
            {article.content && (
              <div className="mt-4">
                <AudioPlayer title={article.title} content={article.content} />
              </div>
            )}

            {/* AI Summary / EN BREF */}
            <div className="mt-5">
              <ArticleSummary
                aiSummary={article.aiSummary}
                readingTime={article.readingTime}
                publishedAt={article.publishedAt}
                updatedAt={article.updatedAt}
              />
            </div>

            {/* Live Updates (if live coverage) */}
            {article.isLive && (
              <div className="mt-5">
                <LiveUpdates articleId={article.id} initialUpdates={initialLiveUpdates} />
              </div>
            )}

            {/* Mobile share */}
            <div className="mt-6 lg:hidden">
              <ArticleShare title={article.title} orientation="horizontal" />
            </div>

            {/* Article content with context card hover layer */}
            {article.content ? (
              <div className="mt-8">
                <SimplifyMode content={article.content} />
                <ContextCardLayer cards={contextCards}>
                  <ArticleContent content={article.content} />
                </ContextCardLayer>
              </div>
            ) : (
              <p className="mt-8 text-gray-500 italic">Contenu complet bientôt disponible.</p>
            )}

            {/* Why It Matters */}
            {article.whyItMatters && (
              <div className="mt-8">
                <WhyItMatters text={article.whyItMatters} />
              </div>
            )}

            {/* Sources */}
            {sources.length > 0 && (
              <ArticleSources sources={sources} />
            )}

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full font-medium">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Share */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <p className="text-sm font-semibold text-gray-500 mb-3">Partager cet article</p>
              <ArticleShare title={article.title} orientation="horizontal" />
            </div>

            {/* Author */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">À propos de l&apos;auteur</p>
              <ArticleAuthorCard author={article.author} />
            </div>

            {/* Newsletter */}
            <div className="mt-10">
              <ArticleNewsletter />
            </div>

            {/* Related */}
            <div className="mt-12">
              <RelatedArticles articles={related} />
            </div>
          </article>

          <BackToTop />

          <aside className="hidden lg:flex flex-col items-center gap-3 shrink-0 w-12 sticky top-24 self-start">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest rotate-0 mb-2">Partager</p>
            <ArticleShare title={article.title} orientation="vertical" />
          </aside>
        </div>
      </div>
    </div>
  );
}
