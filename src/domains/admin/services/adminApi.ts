import { api } from '@/shared/lib/api';
import { DashboardStats, AdminProductPayload, AdminBlogPayload } from '../types';

export const adminApi = {
  getStats: async (token?: string): Promise<DashboardStats> => {
    const res = await api.get<DashboardStats>('/admin/dashboard', token ? { token } : undefined);
    return res.data;
  },

  // Products
  createProduct: async (payload: AdminProductPayload, token?: string) => {
    const res = await api.post('/products', payload, token ? { token } : undefined);
    return res.data;
  },

  updateProduct: async (id: string, payload: Partial<AdminProductPayload>, token?: string) => {
    const res = await api.put(`/products/${id}`, payload, token ? { token } : undefined);
    return res.data;
  },

  deleteProduct: async (id: string, token?: string) => {
    const res = await api.delete(`/products/${id}`, token ? { token } : undefined);
    return res.data;
  },

  // Orders
  getAllOrders: async (params?: { page?: number; status?: string; paymentStatus?: string }, token?: string) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', String(params.page));
    if (params?.status) searchParams.append('status', params.status);
    if (params?.paymentStatus) searchParams.append('paymentStatus', params.paymentStatus);

    const queryString = searchParams.toString();
    const endpoint = `/orders/admin/all${queryString ? `?${queryString}` : ''}`;
    const res = await api.get(endpoint, token ? { token } : undefined);
    return res;
  },

  updateOrderStatus: async (id: string, status: string, token?: string) => {
    const res = await api.put(`/orders/${id}/status`, { status }, token ? { token } : undefined);
    return res.data;
  },

  updatePaymentStatus: async (id: string, paymentStatus: string, token?: string) => {
    const res = await api.put(`/orders/${id}/payment`, { paymentStatus }, token ? { token } : undefined);
    return res.data;
  },

  // Blog
  createBlogPost: async (payload: AdminBlogPayload, token?: string) => {
    const res = await api.post('/blog', payload, token ? { token } : undefined);
    return res.data;
  },

  updateBlogPost: async (id: string, payload: Partial<AdminBlogPayload>, token?: string) => {
    const res = await api.put(`/blog/${id}`, payload, token ? { token } : undefined);
    return res.data;
  },

  deleteBlogPost: async (id: string, token?: string) => {
    const res = await api.delete(`/blog/${id}`, token ? { token } : undefined);
    return res.data;
  },
};
