import { api } from '@/shared/lib/api';
import { Category, Product, ProductFilterParams, ProductListResponse } from '../types';

export const shopApi = {
  getProducts: async (params?: ProductFilterParams): Promise<ProductListResponse> => {
    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.append('category', params.category);
    if (params?.search) searchParams.append('search', params.search);
    if (params?.minPrice) searchParams.append('minPrice', String(params.minPrice));
    if (params?.maxPrice) searchParams.append('maxPrice', String(params.maxPrice));
    if (params?.sort) searchParams.append('sort', params.sort);
    if (params?.page) searchParams.append('page', String(params.page));
    if (params?.limit) searchParams.append('limit', String(params.limit));

    const queryString = searchParams.toString();
    const endpoint = `/products${queryString ? `?${queryString}` : ''}`;
    const res = await api.get<Product[]>(endpoint);

    return {
      data: res.data || [],
      pagination: res.pagination || { page: 1, limit: 12, total: 0, totalPages: 1 },
    };
  },

  getCategories: async (): Promise<Category[]> => {
    const res = await api.get<Category[]>('/products/categories');
    return res.data || [];
  },

  getProductBySlug: async (slug: string): Promise<Product> => {
    const res = await api.get<Product>(`/products/${slug}`);
    return res.data;
  },

  getRelatedProducts: async (slug: string): Promise<Product[]> => {
    const res = await api.get<Product[]>(`/products/${slug}/related`);
    return res.data || [];
  },
};
