import { api, type ApiResponse } from './api-client';
import type { Category } from '@/types';

export const categoriesService = {
  async list(): Promise<Category[]> {
    const response = await api.get<ApiResponse<Category[]>>('/api/categories');
    return response.data;
  },
};
