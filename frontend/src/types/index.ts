export type Category =
  | "Actualité"
  | "Politique"
  | "Sécurité"
  | "Économie"
  | "Société"
  | "Afrique"
  | "Monde"
  | "Technologie"
  | "Sport"
  | "Culture"
  | "Santé"
  | "Opinion";

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
}

export interface NavItem {
  label: Category | string;
  href: string;
}
