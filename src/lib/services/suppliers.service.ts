import { api, type ApiResponse } from './api-client';
import type { Supplier } from '@/types';

export const suppliersService = {
  async list(): Promise<Supplier[]> {
    const response = await api.get<ApiResponse<Supplier[]>>('/api/suppliers');
    return response.data;
  },

  async getById(id: string): Promise<Supplier> {
    const response = await api.get<ApiResponse<Supplier>>(`/api/suppliers/${id}`);
    return response.data;
  },

  async getPremium(): Promise<Supplier[]> {
    const response = await api.get<ApiResponse<Supplier[]>>('/api/suppliers?premium=true');
    return response.data;
  },
};
