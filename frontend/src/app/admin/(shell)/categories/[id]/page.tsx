import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import CategoryForm from "@/components/admin/CategoryForm";
import type { Database } from "@/lib/supabase/types";

type CategoryRow = Database["public"]["Tables"]["categories"]["Row"];

interface Params { id: string }

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase.from("categories").select("name").eq("id", id).single();
  return { title: data ? `${data.name} — Catégories` : "Catégorie — Admin" };
}

export default async function EditCategoryPage({ params }: { params: Promise<Params> }) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.from("categories").select("*").eq("id", id).single();

  if (error || !data) notFound();

  return <CategoryForm category={data as CategoryRow} />;
}
