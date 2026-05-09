import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import AuthorForm from "@/components/admin/AuthorForm";
import type { Database } from "@/lib/supabase/types";

type AuthorRow = Database["public"]["Tables"]["authors"]["Row"];

interface Params { id: string }

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase.from("authors").select("name").eq("id", id).single();
  return { title: data ? `${data.name} — Auteurs` : "Auteur — Admin" };
}

export default async function EditAuthorPage({ params }: { params: Promise<Params> }) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.from("authors").select("*").eq("id", id).single();

  if (error || !data) notFound();

  return <AuthorForm author={data as AuthorRow} />;
}
