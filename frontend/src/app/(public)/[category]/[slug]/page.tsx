import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getArticleBySlug, getArticles, getRelatedArticles } from "@/lib/api/articles";
import { categoryToSlug, slugToCategory } from "@/lib/utils";
import ArticleBreadcrumb from "@/components/article/ArticleBreadcrumb";
import ArticleHero from "@/components/article/ArticleHero";
import ArticleContent from "@/components/article/ArticleContent";
import ArticleShare from "@/components/article/ArticleShare";
import RelatedArticles from "@/components/article/RelatedArticles";
import ArticleNewsletter from "@/components/article/ArticleNewsletter";
import ReadingProgressBar from "@/components/ui/ReadingProgressBar";
import BackToTop from "@/components/ui/BackToTop";
import JsonLd from "@/components/ui/JsonLd";

interface Params {
  category: string;
  slug: string;
}

export async function generateStaticParams(): Promise<Params[]> {
  const articles = await getArticles();
  return articles.map((a) => ({
    category: categoryToSlug(a.category),
    slug: a.slug,
  }));
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
      authors: [article.author.name],
      images: [{ url: article.imageUrl, alt: article.imageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: [article.imageUrl],
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { category: categorySlug, slug } = await params;

  const category = slugToCategory(categorySlug);
  if (!category) notFound();

  const article = await getArticleBySlug(slug);
  if (!article || categoryToSlug(article.category) !== categorySlug) notFound();

  const related = await getRelatedArticles(article, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.excerpt,
    image: article.imageUrl,
    datePublished: article.publishedAt,
    dateModified: article.publishedAt,
    author: { "@type": "Person", name: article.author.name },
    publisher: {
      "@type": "Organization",
      name: "GoldenNews7",
      logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.png` },
    },
    url: `${SITE_URL}/${categorySlug}/${article.slug}`,
    inLanguage: "fr-FR",
    isAccessibleForFree: true,
  };

  return (
    <div className="bg-white min-h-screen">
      <ReadingProgressBar />
      <JsonLd data={jsonLd} />
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <ArticleBreadcrumb category={article.category} title={article.title} />
        </div>
        <div className="flex gap-10 items-start">
          <article className="min-w-0 flex-1 max-w-3xl">
            <ArticleHero article={article} />
            <div className="mt-6 lg:hidden">
              <ArticleShare title={article.title} orientation="horizontal" />
            </div>
            {article.content ? (
              <div className="mt-8">
                <ArticleContent content={article.content} />
              </div>
            ) : (
              <p className="mt-8 text-gray-500 italic">Contenu complet bientôt disponible.</p>
            )}
            {article.tags && article.tags.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full font-medium">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <p className="text-sm font-semibold text-gray-500 mb-3">Partager cet article</p>
              <ArticleShare title={article.title} orientation="horizontal" />
            </div>
            <div className="mt-10">
              <ArticleNewsletter />
            </div>
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
