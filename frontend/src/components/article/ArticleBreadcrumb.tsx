import Link from "next/link";
import type { Category } from "@/types";
import { categoryToSlug } from "@/lib/utils";

interface ArticleBreadcrumbProps {
  category: Category;
  title: string;
}

export default function ArticleBreadcrumb({ category, title }: ArticleBreadcrumbProps) {
  return (
    <nav aria-label="Fil d'Ariane" className="flex items-center gap-2 text-sm text-gray-500 flex-wrap">
      <Link href="/" className="hover:text-amber-600 transition-colors shrink-0">
        Accueil
      </Link>
      <svg className="w-3 h-3 shrink-0 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
          clipRule="evenodd"
        />
      </svg>
      <Link
        href={`/${categoryToSlug(category)}`}
        className="hover:text-amber-600 transition-colors shrink-0"
      >
        {category}
      </Link>
      <svg className="w-3 h-3 shrink-0 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
          clipRule="evenodd"
        />
      </svg>
      <span className="text-gray-400 truncate max-w-xs" aria-current="page">
        {title}
      </span>
    </nav>
  );
}
