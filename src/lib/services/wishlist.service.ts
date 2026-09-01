import { api, type ApiResponse } from './api-client';
import type { Product } from '@/types';

export const wishlistService = {
  async list(): Promise<Product[]> {
    const response = await api.get<ApiResponse<Product[]>>('/api/wishlist');
    return response.data;
  },

  async add(productId: string): Promise<Product[]> {
    const response = await api.post<ApiResponse<Product[]>>('/api/wishlist', { productId });
    return response.data;
  },

  async remove(productId: string): Promise<Product[]> {
    const response = await api.delete<ApiResponse<Product[]>>(`/api/wishlist?productId=${productId}`);
    return response.data;
  },

  async clear(): Promise<void> {
    await api.delete('/api/wishlist');
  },
};
