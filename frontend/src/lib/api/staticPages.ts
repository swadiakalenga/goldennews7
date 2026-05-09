import { createServerSupabaseClient } from "@/lib/supabase/server";

export interface PublicStaticPage {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  seo_title: string | null;
  seo_description: string | null;
  updated_at: string | null;
}

export async function getPublicStaticPage(slug: string): Promise<PublicStaticPage | null> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data } = await supabase
      .from("static_pages")
      .select("id, slug, title, excerpt, content, seo_title, seo_description, updated_at")
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();
    return data as PublicStaticPage | null;
  } catch {
    return null;
  }
}
