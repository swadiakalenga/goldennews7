export const CATEGORIES = [
  "Actualité",
  "Politique",
  "Sécurité",
  "Économie",
  "Société",
  "Afrique",
  "Monde",
  "Technologie",
  "Sport",
  "Culture",
  "Santé",
  "Opinion",
] as const;

export type Category = (typeof CATEGORIES)[number];

export interface Author {
  name: string;
  avatar?: string;
  role: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content?: string;
  category: Category;
  author: Author;
  publishedAt: string;
  readingTime: number;
  imageUrl: string;
  imageAlt: string;
  isFeatured?: boolean;
  isBreaking?: boolean;
  tags?: string[];
  views?: number;
}

export interface NavItem {
  label: string;
  href: string;
}

export interface PaginationInfo {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}
