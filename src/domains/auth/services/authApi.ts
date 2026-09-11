import { api } from '@/shared/lib/api';
import { User, LoginCredentials, RegisterCredentials, AuthResponse } from '../types';

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>('/auth/login', credentials);
    return res.data;
  },

  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>('/auth/register', credentials);
    return res.data;
  },

  getMe: async (token?: string): Promise<User> => {
    const res = await api.get<User>('/auth/me', token ? { token } : undefined);
    return res.data;
  },

  updateMe: async (data: Partial<User>, token?: string): Promise<User> => {
    const res = await api.put<User>('/auth/me', data, token ? { token } : undefined);
    return res.data;
  },
};
