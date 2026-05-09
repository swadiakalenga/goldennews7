import type { Article, PaginationInfo } from "@/types";

export interface ApiResponse<T> {
  data: T;
  error?: string;
}

export interface PaginatedArticles {
  data: Article[];
  pagination: PaginationInfo;
}
