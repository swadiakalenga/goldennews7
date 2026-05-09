import { notFound } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getArticleBySlugAnyStatus } from "@/lib/api/articles";
import ArticleHero from "@/components/article/ArticleHero";
import ArticleContent from "@/components/article/ArticleContent";
import ArticleBreadcrumb from "@/components/article/ArticleBreadcrumb";
import ArticleAuthorCard from "@/components/article/ArticleAuthorCard";
import Link from "next/link";

interface Params { id: string }

export default async function ArticlePreviewPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();

  // Fetch slug from id
  const { data: row } = await supabase
    .from("articles")
    .select("slug")
    .eq("id", id)
    .single() as unknown as { data: { slug: string } | null };

  if (!row?.slug) notFound();

  const article = await getArticleBySlugAnyStatus(row.slug);
  if (!article) notFound();

  const statusColors: Record<string, string> = {
    draft: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
    scheduled: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    published: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    archived: "bg-gray-500/20 text-gray-300 border-gray-500/30",
  };
  const statusLabels: Record<string, string> = {
    draft: "Brouillon",
    scheduled: "Planifié",
    published: "Publié",
    archived: "Archivé",
  };

  const statusKey = (article as unknown as { status: string }).status ?? "draft";

  return (
    <div className="min-h-screen bg-white">
      {/* Admin preview banner */}
      <div className="sticky top-0 z-50 flex items-center justify-between px-4 py-2.5 bg-gray-900 border-b border-white/10 text-sm">
        <div className="flex items-center gap-3">
          <span className="text-gray-400 text-xs font-mono">APERÇU ADMIN</span>
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold border ${statusColors[statusKey] ?? statusColors.draft}`}>
            {statusLabels[statusKey] ?? statusKey}
          </span>
          <span className="text-gray-500 text-xs">{article.title}</span>
        </div>
        <Link
          href={`/admin/articles/${id}`}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/15 text-gray-300 text-xs font-semibold rounded-lg transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Retour à l&apos;éditeur
        </Link>
      </div>

      {/* Render with public styling */}
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <ArticleBreadcrumb
          category={article.category}
          title={article.title}
        />
        <ArticleHero article={article} />
        <ArticleContent content={article.content ?? ""} />
        <ArticleAuthorCard author={article.author} />
      </div>
    </div>
  );
}
