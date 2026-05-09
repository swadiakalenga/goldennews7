export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import ArticleCard from "@/components/ui/ArticleCard";
import { mapArticleRow, ARTICLE_SELECT_LIGHT, type ArticleRow } from "@/lib/utils/articleMapper";
import { formatDate } from "@/lib/utils";
import type { Database } from "@/lib/supabase/types";

type AuthorRow = Database["public"]["Tables"]["authors"]["Row"];

interface Params { slug: string }

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase.from("authors").select("name, bio, avatar_url").eq("slug", slug).maybeSingle();
  if (!data) return { title: "Auteur introuvable | GoldenNews7" };

  const siteName = "GoldenNews7";
  const title = `${data.name} | ${siteName}`;
  const description = data.bio?.slice(0, 160) ?? `Articles de ${data.name} sur GoldenNews7.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: data.avatar_url ? [{ url: data.avatar_url }] : [],
    },
  };
}

export default async function AuthorPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const supabase = await createServerSupabaseClient();

  const { data: authorData } = await supabase
    .from("authors")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (!authorData) notFound();
  const author = authorData as AuthorRow;

  // Fetch published articles by this author
  const articlesResult = (await supabase
    .from("articles")
    .select(ARTICLE_SELECT_LIGHT)
    .eq("author_id", author.id)
    .eq("status", "published")
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false })
    .limit(12)) as unknown as { data: ArticleRow[] | null };

  const articles = (articlesResult.data ?? []).map(mapArticleRow);

  return (
    <div className="container mx-auto px-4 py-10">
      {/* Author card */}
      <div className="max-w-3xl mx-auto mb-12">
        <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
          {/* Avatar */}
          <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shrink-0 ring-4 ring-amber-400/20">
            {author.avatar_url ? (
              <Image src={author.avatar_url} alt={author.name} width={96} height={96} className="object-cover w-full h-full" />
            ) : (
              <span className="text-3xl font-black text-white">{author.name.charAt(0)}</span>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-3xl font-black text-gray-900 mb-1">{author.name}</h1>
            {author.role && (
              <p className="text-sm font-semibold text-amber-600 mb-3">{author.role}</p>
            )}
            {author.bio && (
              <p className="text-base text-gray-600 leading-relaxed mb-4">{author.bio}</p>
            )}

            {/* Socials + email */}
            <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
              {author.email && (
                <a href={`mailto:${author.email}`} className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-amber-600 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {author.email}
                </a>
              )}
              {author.twitter_url && (
                <a href={author.twitter_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-sky-500 transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  Twitter / X
                </a>
              )}
              {author.facebook_url && (
                <a href={author.facebook_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-500 transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  Facebook
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-6 mt-6 pt-6 border-t border-gray-100">
          <div>
            <p className="text-2xl font-black text-gray-900">{articles.length}</p>
            <p className="text-xs text-gray-500">article{articles.length !== 1 ? "s" : ""} publié{articles.length !== 1 ? "s" : ""}</p>
          </div>
          {articles[0] && (
            <div>
              <p className="text-sm font-semibold text-gray-900">{formatDate(articles[0].publishedAt)}</p>
              <p className="text-xs text-gray-500">dernier article</p>
            </div>
          )}
        </div>
      </div>

      {/* Articles section */}
      {articles.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-gray-400">Aucun article publié pour l&apos;instant.</p>
          <Link href="/" className="mt-3 text-sm text-amber-600 hover:text-amber-500 font-semibold transition-colors">
            Retour à l&apos;accueil →
          </Link>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-3 mb-6 max-w-4xl mx-auto">
            <div className="w-1 h-5 bg-amber-500 rounded-full" />
            <h2 className="text-sm font-black text-gray-900 uppercase tracking-wide">
              Articles de {author.name}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
