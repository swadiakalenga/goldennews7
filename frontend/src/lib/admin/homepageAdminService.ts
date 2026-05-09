"use client";

import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { Database } from "@/lib/supabase/types";

type SectionRow = Database["public"]["Tables"]["homepage_sections"]["Row"];
type SectionUpdate = Database["public"]["Tables"]["homepage_sections"]["Update"];

export type SlotArticlePreview = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image_url: string | null;
  status: string;
  categories: { id: string; name: string; slug: string } | null;
};

export type AdminSlot = {
  id: string;
  section_id: string;
  article_id: string;
  slot_type: string;
  position: number;
  is_active: boolean;
  article: SlotArticlePreview;
};

export type SectionWithSlots = SectionRow & { slots: AdminSlot[] };

export async function getAdminHomepageSections(): Promise<SectionWithSlots[]> {
  const supabase = getSupabaseBrowserClient();

  const { data: sections, error } = await supabase
    .from("homepage_sections")
    .select("*")
    .order("sort_order");

  if (error) throw new Error(error.message);

  const withSlots: SectionWithSlots[] = await Promise.all(
    (sections ?? []).map(async (section) => {
      const { data: slots } = await supabase
        .from("homepage_slots")
        .select(
          "id, section_id, article_id, slot_type, position, is_active, article:article_id(id, title, slug, excerpt, cover_image_url, status, categories:category_id(id, name, slug))"
        )
        .eq("section_id", section.id)
        .order("position");

      return {
        ...section,
        slots: ((slots ?? []) as unknown as AdminSlot[]).filter(
          (s) => s.article != null
        ),
      };
    })
  );

  return withSlots;
}

export async function updateSection(
  id: string,
  data: Partial<SectionUpdate>
): Promise<void> {
  const supabase = getSupabaseBrowserClient();
  const { error } = await supabase
    .from("homepage_sections")
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw new Error(error.message);
}

export async function addSlot(data: {
  section_id: string;
  article_id: string;
  slot_type: string;
  position: number;
}): Promise<void> {
  const supabase = getSupabaseBrowserClient();
  const { error } = await supabase.from("homepage_slots").insert({
    ...data,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });
  if (error) throw new Error(error.message);
}

export async function removeSlot(id: string): Promise<void> {
  const supabase = getSupabaseBrowserClient();
  const { error } = await supabase
    .from("homepage_slots")
    .delete()
    .eq("id", id);
  if (error) throw new Error(error.message);
}

export async function updateSlotPosition(
  id: string,
  position: number
): Promise<void> {
  const supabase = getSupabaseBrowserClient();
  const { error } = await supabase
    .from("homepage_slots")
    .update({ position, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw new Error(error.message);
}

export async function searchPublishedArticles(
  query: string
): Promise<SlotArticlePreview[]> {
  const supabase = getSupabaseBrowserClient();

  let q = supabase
    .from("articles")
    .select(
      "id, title, slug, excerpt, cover_image_url, status, categories:category_id(id, name, slug)"
    )
    .eq("status", "published")
    .order("published_at", { ascending: false, nullsFirst: false });

  if (query.trim()) {
    q = q.ilike("title", `%${query.trim()}%`);
  }

  const { data, error } = await q.limit(20);
  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as SlotArticlePreview[];
}
