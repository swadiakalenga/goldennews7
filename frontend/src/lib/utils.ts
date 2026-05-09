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

// Bidirectional mapping: URL slug ↔ display Category
const CATEGORY_SLUG_MAP: Record<string, Category> = {
  actualite: "Actualité",
  politique: "Politique",
  securite: "Sécurité",
  economie: "Économie",
  societe: "Société",
  afrique: "Afrique",
  monde: "Monde",
  technologie: "Technologie",
  sport: "Sport",
  culture: "Culture",
  sante: "Santé",
  opinion: "Opinion",
};

export function slugToCategory(slug: string): Category | null {
  return CATEGORY_SLUG_MAP[slug] ?? null;
}

export function categoryToSlug(category: Category): string {
  return slugify(category);
}

export function getAllCategorySlugs(): string[] {
  return Object.keys(CATEGORY_SLUG_MAP);
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

const categoryBgLight: Record<Category, string> = {
  Actualité: "bg-blue-50 text-blue-700 border-blue-200",
  Politique: "bg-indigo-50 text-indigo-700 border-indigo-200",
  Sécurité: "bg-red-50 text-red-700 border-red-200",
  Économie: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Société: "bg-orange-50 text-orange-700 border-orange-200",
  Afrique: "bg-amber-50 text-amber-700 border-amber-200",
  Monde: "bg-cyan-50 text-cyan-700 border-cyan-200",
  Technologie: "bg-violet-50 text-violet-700 border-violet-200",
  Sport: "bg-green-50 text-green-700 border-green-200",
  Culture: "bg-pink-50 text-pink-700 border-pink-200",
  Santé: "bg-teal-50 text-teal-700 border-teal-200",
  Opinion: "bg-gray-50 text-gray-700 border-gray-200",
};

export function getCategoryColor(category: Category): string {
  return categoryColors[category] ?? "bg-gray-500 text-white";
}

export function getCategoryColorLight(category: Category): string {
  return categoryBgLight[category] ?? "bg-gray-50 text-gray-700 border-gray-200";
}
