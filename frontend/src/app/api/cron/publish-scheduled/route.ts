import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

// Called by a cron job (e.g. Vercel Cron or external scheduler)
// Expects header: Authorization: Bearer <CRON_SECRET>
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = request.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const supabase = await createServerSupabaseClient();
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("articles")
    .update({ status: "published", published_at: now })
    .eq("status", "scheduled")
    .lte("scheduled_at", now)
    .select("id, title");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    published: data?.length ?? 0,
    articles: data?.map((a) => ({ id: a.id, title: (a as Record<string, unknown>).title })) ?? [],
    at: now,
  });
}
