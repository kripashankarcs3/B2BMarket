import { api, type ApiResponse } from './api-client';
import type { CartItem } from '@/types';

export interface AddToCartRequest {
  productId: string;
  quantity: number;
}

export const cartService = {
  async list(): Promise<CartItem[]> {
    const response = await api.get<ApiResponse<CartItem[]>>('/api/cart');
    return response.data;
  },

  async add(data: AddToCartRequest): Promise<CartItem[]> {
    const response = await api.post<ApiResponse<CartItem[]>>('/api/cart', data);
    return response.data;
  },

  async updateQuantity(productId: string, quantity: number): Promise<CartItem[]> {
    const response = await api.patch<ApiResponse<CartItem[]>>(`/api/cart?productId=${productId}`, { quantity });
    return response.data;
  },

  async remove(productId: string): Promise<CartItem[]> {
    const response = await api.delete<ApiResponse<CartItem[]>>(`/api/cart?productId=${productId}`);
    return response.data;
  },

  async clear(): Promise<void> {
    await api.delete('/api/cart');
  },
};
