"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useToast } from "@/components/admin/ToastProvider";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

const BUCKET = "article-images";

interface MediaFile {
  name: string;
  id: string;
  created_at: string;
  metadata: {
    size: number;
    mimetype: string;
  } | null;
  publicUrl: string;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
  return `${(bytes / 1024 / 1024).toFixed(1)} Mo`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function AdminMediaPage() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<MediaFile | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [preview, setPreview] = useState<MediaFile | null>(null);

  const supabaseRef = useRef(getSupabaseBrowserClient());
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let active = true;
    const supabase = supabaseRef.current;
    async function load() {
      try {
        const { data, error } = await supabase.storage.from(BUCKET).list("", {
          limit: 200,
          offset: 0,
          sortBy: { column: "created_at", order: "desc" },
        });
        if (error) throw error;

        const items: MediaFile[] = await Promise.all(
          (data ?? [])
            .filter((f) => f.name !== ".emptyFolderPlaceholder")
            .map(async (f) => {
              const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(f.name);
              return {
                name: f.name,
                id: f.id ?? f.name,
                created_at: f.created_at ?? new Date().toISOString(),
                metadata: f.metadata as MediaFile["metadata"],
                publicUrl: urlData.publicUrl,
              };
            })
        );

        if (active) { setFiles(items); setLoading(false); }
      } catch {
        if (active) { toast("Erreur lors du chargement des médias.", "error"); setLoading(false); }
      }
    }
    load();
    return () => { active = false; };
  }, [toast, refreshKey]);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFiles = Array.from(e.target.files ?? []);
    if (selectedFiles.length === 0) return;

    const invalid = selectedFiles.filter((f) => !f.type.startsWith("image/"));
    if (invalid.length > 0) {
      toast("Seules les images sont acceptées.", "error");
      return;
    }

    const tooBig = selectedFiles.filter((f) => f.size > 10 * 1024 * 1024);
    if (tooBig.length > 0) {
      toast("Chaque fichier ne doit pas dépasser 10 Mo.", "error");
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    let done = 0;
    for (const file of selectedFiles) {
      const ext = file.name.split(".").pop() ?? "jpg";
      const safeName = file.name.replace(/\.[^/.]+$/, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 60);
      const path = `${safeName}-${Date.now()}.${ext}`;

      const { error } = await supabaseRef.current.storage.from(BUCKET).upload(path, file, { upsert: false, cacheControl: "31536000" });
      if (error) {
        toast(`Erreur pour ${file.name}: ${error.message}`, "error");
      }
      done++;
      setUploadProgress(Math.round((done / selectedFiles.length) * 100));
    }

    setUploading(false);
    setUploadProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = "";
    toast(`${done} fichier${done !== 1 ? "s" : ""} importé${done !== 1 ? "s" : ""}.`, "success");
    setRefreshKey((k) => k + 1);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      const { error } = await supabaseRef.current.storage.from(BUCKET).remove([deleteTarget.name]);
      if (error) throw error;
      toast("Fichier supprimé.", "success");
      setDeleteTarget(null);
      setRefreshKey((k) => k + 1);
    } catch {
      toast("Erreur lors de la suppression.", "error");
    } finally {
      setDeleteLoading(false);
    }
  }

  function copyUrl(url: string) {
    navigator.clipboard.writeText(url).then(
      () => toast("URL copiée dans le presse-papiers.", "success"),
      () => toast("Impossible de copier.", "error")
    );
  }

  const filtered = files.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  const imageFiles = filtered.filter((f) => {
    const ext = f.name.split(".").pop()?.toLowerCase();
    return ["jpg", "jpeg", "png", "webp", "gif", "svg", "avif"].includes(ext ?? "");
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-white">Médiathèque</h1>
          <p className="text-sm text-gray-500 mt-0.5">{files.length} fichier{files.length !== 1 ? "s" : ""}</p>
        </div>
        <div className="flex gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-white text-sm font-bold rounded-full transition-all active:scale-95 disabled:opacity-50"
          >
            {uploading ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                {uploadProgress}%
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Importer
              </>
            )}
          </button>
        </div>
      </div>

      {/* Upload progress bar */}
      {uploading && (
        <div className="mb-4 bg-gray-900 rounded-lg overflow-hidden h-2">
          <div
            className="h-full bg-amber-500 transition-all duration-300"
            style={{ width: `${uploadProgress}%` }}
          />
        </div>
      )}

      {/* Search */}
      <div className="relative mb-5">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un fichier…"
          className="w-full pl-9 pr-4 py-2.5 bg-gray-900 border border-white/8 rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none focus:border-amber-500/60"
        />
      </div>

      {/* Drop zone hint when empty */}
      {!loading && files.length === 0 && (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-white/10 hover:border-amber-500/40 rounded-xl p-16 text-center cursor-pointer transition-colors group"
        >
          <svg className="w-12 h-12 text-gray-700 group-hover:text-amber-500/50 mx-auto mb-4 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-gray-500 text-sm font-semibold">Cliquer pour importer des images</p>
          <p className="text-gray-700 text-xs mt-1">PNG, JPG, WebP, GIF · max 10 Mo par fichier</p>
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="aspect-square bg-gray-900 rounded-xl animate-pulse" />
          ))}
        </div>
      )}

      {/* Grid */}
      {!loading && imageFiles.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {imageFiles.map((file) => (
            <div
              key={file.id}
              className="group relative bg-gray-900 rounded-xl overflow-hidden border border-white/5 hover:border-white/10 transition-all"
            >
              {/* Image */}
              <div
                className="aspect-square cursor-pointer"
                onClick={() => setPreview(file)}
              >
                <Image
                  src={file.publicUrl}
                  alt={file.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                />
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                <button
                  onClick={() => copyUrl(file.publicUrl)}
                  className="p-2 bg-white/90 hover:bg-white rounded-lg text-gray-800 transition-colors"
                  title="Copier l'URL"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                </button>
                <button
                  onClick={() => setDeleteTarget(file)}
                  className="p-2 bg-red-500/90 hover:bg-red-500 rounded-lg text-white transition-colors"
                  title="Supprimer"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>

              {/* Meta */}
              <div className="p-2 border-t border-white/5">
                <p className="text-xs text-gray-400 truncate font-medium">{file.name.split("/").pop()}</p>
                <p className="text-[10px] text-gray-600 mt-0.5">
                  {file.metadata?.size ? formatBytes(file.metadata.size) : "—"} · {formatDate(file.created_at)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No results */}
      {!loading && files.length > 0 && imageFiles.length === 0 && (
        <p className="text-center text-gray-500 text-sm py-12">Aucun résultat pour « {search} ».</p>
      )}

      {/* Delete confirm */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-base font-black text-white mb-2">Supprimer le fichier</h3>
            <p className="text-sm text-gray-400 mb-5">
              Supprimer <span className="text-white font-semibold">{deleteTarget.name.split("/").pop()}</span> ? Cette action est irréversible.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2 text-sm font-semibold text-gray-400 border border-white/10 hover:border-white/20 rounded-lg transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteLoading}
                className="flex-1 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-500 rounded-lg transition-colors disabled:opacity-50"
              >
                {deleteLoading ? "…" : "Supprimer"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview lightbox */}
      {preview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
          onClick={() => setPreview(null)}
        >
          <div className="relative max-w-3xl w-full" onClick={(e) => e.stopPropagation()}>
            <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-900">
              <Image src={preview.publicUrl} alt={preview.name} fill className="object-contain" />
            </div>
            <div className="flex items-center justify-between mt-3 px-1">
              <div>
                <p className="text-sm font-semibold text-white">{preview.name.split("/").pop()}</p>
                <p className="text-xs text-gray-400">
                  {preview.metadata?.size ? formatBytes(preview.metadata.size) : ""} · {formatDate(preview.created_at)}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => copyUrl(preview.publicUrl)}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-amber-500 hover:bg-amber-400 rounded-lg transition-colors"
                >
                  Copier l&apos;URL
                </button>
                <button
                  onClick={() => setPreview(null)}
                  className="px-3 py-1.5 text-xs font-semibold text-gray-400 border border-white/10 hover:border-white/20 rounded-lg transition-colors"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
