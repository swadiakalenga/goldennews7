import type { Category } from "@/types";

export function formatDate(isoString: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(isoString));
}

export function formatDateShort(isoString: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(isoString));
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const categoryColors: Record<Category, string> = {
  Actualité: "bg-blue-600 text-white",
  Politique: "bg-indigo-600 text-white",
  Sécurité: "bg-red-600 text-white",
  Économie: "bg-emerald-600 text-white",
  Société: "bg-orange-500 text-white",
  Afrique: "bg-amber-500 text-white",
  Monde: "bg-cyan-600 text-white",
  Technologie: "bg-violet-600 text-white",
  Sport: "bg-green-600 text-white",
  Culture: "bg-pink-600 text-white",
  Santé: "bg-teal-600 text-white",
  Opinion: "bg-gray-600 text-white",
};

export function getCategoryColor(category: Category): string {
  return categoryColors[category] ?? "bg-gray-500 text-white";
}
