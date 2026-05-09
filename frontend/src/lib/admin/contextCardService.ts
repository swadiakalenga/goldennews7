"use client";

import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export interface ContextCard {
  id: string;
  keyword: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export async function getContextCards(): Promise<ContextCard[]> {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("context_cards")
    .select("*")
    .order("keyword");
  if (error) throw new Error(error.message);
  return (data ?? []) as ContextCard[];
}

export async function getContextCardById(id: string): Promise<ContextCard | null> {
  const supabase = getSupabaseBrowserClient();
  const { data } = await supabase
    .from("context_cards")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  return data as ContextCard | null;
}

export async function createContextCard(payload: Omit<ContextCard, "id" | "created_at" | "updated_at">): Promise<void> {
  const supabase = getSupabaseBrowserClient();
  const { error } = await supabase.from("context_cards").insert(payload);
  if (error) throw new Error(error.message);
}

export async function updateContextCard(id: string, payload: Partial<Omit<ContextCard, "id" | "created_at">>): Promise<void> {
  const supabase = getSupabaseBrowserClient();
  const { error } = await supabase
    .from("context_cards")
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw new Error(error.message);
}

export async function deleteContextCard(id: string): Promise<void> {
  const supabase = getSupabaseBrowserClient();
  const { error } = await supabase.from("context_cards").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
