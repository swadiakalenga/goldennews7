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

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: "Article non trouvé | GoldenNews7" };

  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
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

  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="mb-6">
          <ArticleBreadcrumb category={article.category} title={article.title} />
        </div>

        {/* Two-column layout: article + sticky sidebar */}
        <div className="flex gap-10 items-start">
          {/* Main article column */}
          <article className="min-w-0 flex-1 max-w-3xl">
            <ArticleHero article={article} />

            {/* Mobile share */}
            <div className="mt-6 lg:hidden">
              <ArticleShare title={article.title} orientation="horizontal" />
            </div>

            {/* Article body */}
            {article.content ? (
              <div className="mt-8">
                <ArticleContent content={article.content} />
              </div>
            ) : (
              <p className="mt-8 text-gray-500 italic">
                Contenu complet bientôt disponible.
              </p>
            )}

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Bottom share */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <p className="text-sm font-semibold text-gray-500 mb-3">
                Partager cet article
              </p>
              <ArticleShare title={article.title} orientation="horizontal" />
            </div>

            {/* Newsletter CTA */}
            <div className="mt-10">
              <ArticleNewsletter />
            </div>

            {/* Related articles */}
            <div className="mt-12">
              <RelatedArticles articles={related} />
            </div>
          </article>

          {/* Sticky desktop sidebar */}
          <aside className="hidden lg:flex flex-col items-center gap-3 shrink-0 w-12 sticky top-24 self-start">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest rotate-0 mb-2">
              Partager
            </p>
            <ArticleShare title={article.title} orientation="vertical" />
          </aside>
        </div>
      </div>
    </div>
  );
}
