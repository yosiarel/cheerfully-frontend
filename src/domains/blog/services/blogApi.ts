import { api } from '@/shared/lib/api';
import { BlogPost, BlogFilterParams } from '../types';

export const blogApi = {
  getPosts: async (params?: BlogFilterParams): Promise<{ data: BlogPost[]; pagination: any }> => {
    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.append('category', params.category);
    if (params?.search) searchParams.append('search', params.search);
    if (params?.page) searchParams.append('page', String(params.page));
    if (params?.limit) searchParams.append('limit', String(params.limit));

    const queryString = searchParams.toString();
    const endpoint = `/blog${queryString ? `?${queryString}` : ''}`;
    const res = await api.get<BlogPost[]>(endpoint);

    return {
      data: res.data || [],
      pagination: res.pagination || { page: 1, limit: 9, total: 0, totalPages: 1 },
    };
  },

  getPostBySlug: async (slug: string): Promise<BlogPost> => {
    const res = await api.get<BlogPost>(`/blog/${slug}`);
    return res.data;
  },
};
