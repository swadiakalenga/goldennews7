import { NextResponse, type NextRequest } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const { slug } = await request.json() as { slug: string };
    if (!slug || typeof slug !== "string") {
      return NextResponse.json({ error: "Slug requis." }, { status: 400 });
    }

    const supabase = await createServerSupabaseClient();

    // Get article ID first
    const { data: article } = await supabase
      .from("articles")
      .select("id")
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();

    if (!article) {
      return NextResponse.json({ error: "Article non trouvé." }, { status: 404 });
    }

    // Use the RPC function for atomic increment
    await supabase.rpc("increment_article_views", { article_id: article.id });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
