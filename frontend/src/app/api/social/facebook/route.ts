import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

interface FacebookPostPayload {
  articleId: string;
  postText: string;
  articleUrl: string;
  logId?: string;
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as FacebookPostPayload;
  const { articleId, postText, articleUrl, logId } = body;

  if (!articleId || !postText) {
    return NextResponse.json({ error: "articleId and postText required" }, { status: 400 });
  }

  const supabase = await createServerSupabaseClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const fullText = `${postText}\n\n${articleUrl}`;

  // Create log row
  let rowId = logId;
  if (!rowId) {
    const { data: newRow } = await supabase
      .from("social_posts")
      .insert({ article_id: articleId, platform: "facebook", post_text: fullText, status: "pending" })
      .select("id")
      .single();
    rowId = newRow?.id;
  }

  const pageId          = process.env.FACEBOOK_PAGE_ID;
  const pageAccessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;

  if (!pageId || !pageAccessToken) {
    const errMsg = "Facebook credentials missing. Set FACEBOOK_PAGE_ID and FACEBOOK_PAGE_ACCESS_TOKEN.";
    if (rowId) {
      await supabase
        .from("social_posts")
        .update({ status: "failed", error_message: errMsg })
        .eq("id", rowId);
    }
    return NextResponse.json({ error: errMsg, logId: rowId }, { status: 422 });
  }

  try {
    const response = await fetch(
      `https://graph.facebook.com/v19.0/${pageId}/feed`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: fullText,
          link: articleUrl,
          access_token: pageAccessToken,
        }),
      }
    );

    const fbData = (await response.json()) as { id?: string; error?: { message: string } };

    if (!response.ok || fbData.error) {
      const errMsg = fbData.error?.message ?? `Facebook API error ${response.status}`;
      if (rowId) {
        await supabase
          .from("social_posts")
          .update({ status: "failed", error_message: errMsg.slice(0, 500) })
          .eq("id", rowId);
      }
      return NextResponse.json({ error: errMsg, logId: rowId }, { status: 500 });
    }

    const postUrl = fbData.id
      ? `https://www.facebook.com/${fbData.id.replace("_", "/posts/")}`
      : undefined;

    if (rowId) {
      await supabase
        .from("social_posts")
        .update({ status: "success", post_url: postUrl ?? null, posted_at: new Date().toISOString() })
        .eq("id", rowId);
    }

    return NextResponse.json({ success: true, fbPostId: fbData.id, logId: rowId });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    if (rowId) {
      await supabase
        .from("social_posts")
        .update({ status: "failed", error_message: msg.slice(0, 500) })
        .eq("id", rowId);
    }
    return NextResponse.json({ error: msg, logId: rowId }, { status: 500 });
  }
}
