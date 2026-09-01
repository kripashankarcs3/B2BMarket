import { api, type ApiResponse } from './api-client';
import type { Order } from '@/types';

export interface CreateOrderRequest {
  items: { productId: string; quantity: number }[];
  shippingAddressId: string;
  billingAddressId?: string;
  notes?: string;
}

export const ordersService = {
  async list(): Promise<Order[]> {
    const response = await api.get<ApiResponse<Order[]>>('/api/orders');
    return response.data;
  },

  async getById(id: string): Promise<Order> {
    const response = await api.get<ApiResponse<Order>>(`/api/orders/${id}`);
    return response.data;
  },

  async create(data: CreateOrderRequest): Promise<Order> {
    const response = await api.post<ApiResponse<Order>>('/api/orders', data);
    return response.data;
  },

  async cancel(id: string): Promise<Order> {
    const response = await api.patch<ApiResponse<Order>>(`/api/orders/${id}/cancel`);
    return response.data;
  },
};
