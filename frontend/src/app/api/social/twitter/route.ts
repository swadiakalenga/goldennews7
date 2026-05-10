import { NextRequest, NextResponse } from "next/server";
import { TwitterApi, ApiResponseError } from "twitter-api-v2";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

interface TwitterPostPayload {
  articleId: string;
  postText: string;
  articleUrl: string;
  logId?: string; // existing social_posts row to update
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as TwitterPostPayload;
  const { articleId, postText, articleUrl, logId } = body;

  if (!articleId || !postText) {
    return NextResponse.json({ error: "articleId and postText required" }, { status: 400 });
  }

  const supabase = await createServerSupabaseClient();

  // Verify authenticated admin
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const fullText = `${postText}\n\n${articleUrl}`.slice(0, 280);

  // Create or update log row as pending
  let rowId = logId;
  if (!rowId) {
    const { data: newRow } = await supabase
      .from("social_posts")
      .insert({ article_id: articleId, platform: "twitter", post_text: fullText, status: "pending" })
      .select("id")
      .single();
    rowId = newRow?.id;
  }

  // Trim all credentials to prevent whitespace/newline issues from env files
  const apiKey       = process.env.X_API_KEY?.trim();
  const apiSecret    = process.env.X_API_SECRET?.trim();
  const accessToken  = process.env.X_ACCESS_TOKEN?.trim();
  const accessSecret = process.env.X_ACCESS_SECRET?.trim();

  if (!apiKey || !apiSecret || !accessToken || !accessSecret) {
    const missing = (
      [
        !apiKey       && "X_API_KEY",
        !apiSecret    && "X_API_SECRET",
        !accessToken  && "X_ACCESS_TOKEN",
        !accessSecret && "X_ACCESS_SECRET",
      ] as (string | false)[]
    ).filter(Boolean).join(", ");
    const errMsg = `Missing X/Twitter credentials: ${missing}. Set these environment variables with OAuth 1.0a keys (not Bearer Token).`;
    if (rowId) {
      await supabase
        .from("social_posts")
        .update({ status: "failed", error_message: errMsg })
        .eq("id", rowId);
    }
    return NextResponse.json({ error: errMsg, logId: rowId }, { status: 422 });
  }

  try {
    const client = new TwitterApi({
      appKey: apiKey,
      appSecret: apiSecret,
      accessToken,
      accessSecret,
    });

    const tweet = await client.v2.tweet(fullText);
    const tweetUrl = `https://x.com/i/web/status/${tweet.data.id}`;

    if (rowId) {
      await supabase
        .from("social_posts")
        .update({ status: "success", post_url: tweetUrl, posted_at: new Date().toISOString() })
        .eq("id", rowId);
    }

    return NextResponse.json({ success: true, tweetId: tweet.data.id, url: tweetUrl, logId: rowId });
  } catch (err: unknown) {
    let errMsg: string;

    if (err instanceof ApiResponseError && err.code === 401) {
      errMsg =
        "X API returned 401 Unauthorized. " +
        "Check: (1) X app permissions must be Read+Write at developer.x.com — " +
        "if you changed them, regenerate the access token/secret and update X_ACCESS_TOKEN / X_ACCESS_SECRET; " +
        "(2) X_API_KEY and X_API_SECRET must match the app that owns the access token; " +
        "(3) ensure you are using OAuth 1.0a user context credentials, not a Bearer Token.";
    } else {
      errMsg = err instanceof Error ? err.message : String(err);
    }

    if (rowId) {
      await supabase
        .from("social_posts")
        .update({ status: "failed", error_message: errMsg.slice(0, 500) })
        .eq("id", rowId);
    }
    return NextResponse.json({ error: errMsg, logId: rowId }, { status: 500 });
  }
}
