"use client";

import { getSupabaseBrowserClient } from "@/lib/supabase/client";

const BUCKET = "article-images";

function slugifyFilename(name: string): string {
  const ext = name.split(".").pop() ?? "jpg";
  const base = name
    .replace(/\.[^/.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .slice(0, 60);
  return `${base}-${Date.now()}.${ext}`;
}

export async function uploadArticleImage(
  file: File,
  folder = "covers"
): Promise<string> {
  const supabase = getSupabaseBrowserClient();
  const filename = slugifyFilename(file.name);
  const path = `${folder}/${filename}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { upsert: true, cacheControl: "31536000" });

  if (error) throw new Error(`Upload failed: ${error.message}`);

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export async function deleteArticleImage(publicUrl: string): Promise<void> {
  const supabase = getSupabaseBrowserClient();

  // Extract path after the bucket name in the URL
  const marker = `/storage/v1/object/public/${BUCKET}/`;
  const idx = publicUrl.indexOf(marker);
  if (idx === -1) return; // not a Supabase Storage URL

  const path = publicUrl.slice(idx + marker.length);
  const { error } = await supabase.storage.from(BUCKET).remove([path]);
  if (error) throw new Error(`Delete failed: ${error.message}`);
}
