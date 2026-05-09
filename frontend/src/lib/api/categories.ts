import { createServerSupabaseClient } from "@/lib/supabase/server";

export type PublicCategory = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  color: string | null;
};

export async function getPublicCategories(): Promise<PublicCategory[]> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data } = await supabase
      .from("categories")
      .select("id, name, slug, description, color")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true });
    return (data ?? []) as PublicCategory[];
  } catch {
    return [];
  }
}

export async function getCategoryBySlug(
  slug: string
): Promise<PublicCategory | null> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data } = await supabase
      .from("categories")
      .select("id, name, slug, description, color")
      .eq("slug", slug)
      .eq("is_active", true)
      .maybeSingle();
    return data as PublicCategory | null;
  } catch {
    return null;
  }
}
