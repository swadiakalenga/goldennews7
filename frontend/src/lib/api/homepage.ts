import { createServerSupabaseClient } from "@/lib/supabase/server";
import {
  mapArticleRow,
  type ArticleRow,
  ARTICLE_SELECT_LIGHT,
} from "@/lib/utils/articleMapper";
import type { Article } from "@/types";

export type HomepageSlot = {
  id: string;
  slot_type: string;
  position: number;
  article: Article;
};

export type HomepageSection = {
  id: string;
  section_key: string;
  title: string;
  layout_type: string;
  sort_order: number;
  slots: HomepageSlot[];
};

// Extend ArticleRow to include status for filtering
type ArticleRowWithStatus = ArticleRow & { status: string };

const SLOT_SELECT = `id, slot_type, position, article:article_id(${ARTICLE_SELECT_LIGHT}, status)`;

export async function getHomepageConfig(): Promise<HomepageSection[]> {
  const supabase = await createServerSupabaseClient();

  // Public RLS restricts this to is_active = true sections
  const { data: sections } = await supabase
    .from("homepage_sections")
    .select("id, section_key, title, layout_type, sort_order")
    .order("sort_order");

  if (!sections?.length) return [];

  const result: HomepageSection[] = await Promise.all(
    sections.map(async (section) => {
      const { data: slots } = await supabase
        .from("homepage_slots")
        .select(SLOT_SELECT)
        .eq("section_id", section.id)
        .eq("is_active", true)
        .order("position");

      const mapped = ((slots ?? []) as unknown as Array<{
        id: string;
        slot_type: string;
        position: number;
        article: ArticleRowWithStatus | null;
      }>)
        .filter((s) => s.article && s.article.status === "published")
        .map((s) => ({
          id: s.id,
          slot_type: s.slot_type,
          position: s.position,
          article: mapArticleRow(s.article as unknown as ArticleRow),
        }));

      return { ...section, slots: mapped };
    })
  );

  return result;
}
