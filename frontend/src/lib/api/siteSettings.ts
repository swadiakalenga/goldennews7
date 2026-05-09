import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";

export type SiteSettings = Database["public"]["Tables"]["site_settings"]["Row"];

const FALLBACK: Partial<SiteSettings> = {
  site_name: "GoldenNews7",
  site_tagline: "L'information africaine sans frontières",
  site_description:
    "GoldenNews7 est votre source de référence pour l'information africaine et internationale. Indépendant, rigoureux, accessible.",
  facebook_url: null,
  twitter_url: null,
  youtube_url: null,
  telegram_url: null,
  contact_email: null,
};

export async function getSiteSettings(): Promise<Partial<SiteSettings>> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data } = await supabase
      .from("site_settings")
      .select("*")
      .limit(1)
      .maybeSingle();
    if (!data) return FALLBACK;
    return data;
  } catch {
    return FALLBACK;
  }
}
