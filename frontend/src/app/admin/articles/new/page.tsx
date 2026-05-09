import { createServerSupabaseClient } from "@/lib/supabase/server";
import ArticleForm from "@/components/admin/ArticleForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Nouvel article" };

export default async function NewArticlePage() {
  const supabase = await createServerSupabaseClient();

  const [{ data: categories }, { data: authors }] = await Promise.all([
    supabase.from("categories").select("*").order("name"),
    supabase.from("authors").select("*").order("name"),
  ]);

  return (
    <ArticleForm
      categories={categories ?? []}
      authors={authors ?? []}
    />
  );
}
