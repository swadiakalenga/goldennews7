import { notFound } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import ArticleForm from "@/components/admin/ArticleForm";
import type { Metadata } from "next";
import type { ArticleWithRelations } from "@/lib/admin/articleAdminService";
import type { Database } from "@/lib/supabase/types";

interface Params {
  id: string;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();
  const result = (await supabase
    .from("articles")
    .select("title")
    .eq("id", id)
    .single()) as unknown as { data: { title: string } | null };
  return { title: result.data?.title ? `Modifier — ${result.data.title}` : "Article introuvable" };
}

export default async function EditArticlePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();

  type QueryResult = { data: unknown; error: unknown };
  const [articleRes, catRes, authorRes] = (await Promise.all([
    supabase
      .from("articles")
      .select("*, categories:category_id(id, name, slug), authors:author_id(id, name)")
      .eq("id", id)
      .single(),
    supabase.from("categories").select("*").order("name"),
    supabase.from("authors").select("*").order("name"),
  ])) as [QueryResult, QueryResult, QueryResult];

  if (articleRes.error || !articleRes.data) notFound();

  const article = articleRes.data as ArticleWithRelations;
  const categories = (catRes.data as Database["public"]["Tables"]["categories"]["Row"][] | null) ?? [];
  const authors = (authorRes.data as Database["public"]["Tables"]["authors"]["Row"][] | null) ?? [];

  return <ArticleForm article={article} categories={categories} authors={authors} />;
}
