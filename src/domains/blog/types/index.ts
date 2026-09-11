export interface BlogPost {
  id: string;
  slug: string;
  titleId: string;
  titleEn: string;
  contentId: string;
  contentEn: string;
  excerpt?: string | null;
  coverImage?: string | null;
  author: string;
  category: string;
  tags: string[];
  isPublished: boolean;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BlogFilterParams {
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
}
