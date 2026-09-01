import { api, type ApiResponse, type PaginatedResponse } from './api-client';
import type { Product, Review } from '@/types';

export interface ProductFilters {
  search?: string;
  category?: string;
  categories?: string[];
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  supplierId?: string;
  sortBy?: string;
  page?: number;
  pageSize?: number;
}

export interface ProductListResponse {
  products: Product[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export const productsService = {
  async list(filters: ProductFilters = {}): Promise<ProductListResponse> {
    const params = new URLSearchParams();
    if (filters.search) params.set('search', filters.search);
    if (filters.category) params.set('category', filters.category);
    if (filters.categories?.length) params.set('categories', filters.categories.join(','));
    if (filters.minPrice) params.set('minPrice', String(filters.minPrice));
    if (filters.maxPrice) params.set('maxPrice', String(filters.maxPrice));
    if (filters.minRating) params.set('minRating', String(filters.minRating));
    if (filters.supplierId) params.set('supplierId', filters.supplierId);
    if (filters.sortBy) params.set('sortBy', filters.sortBy);
    if (filters.page) params.set('page', String(filters.page));
    if (filters.pageSize) params.set('pageSize', String(filters.pageSize));

    const response = await api.get<ApiResponse<ProductListResponse>>(`/api/products?${params.toString()}`);
    return response.data;
  },

  async getById(id: string): Promise<Product> {
    console.log('🔍 [productsService.getById] calling with id:', JSON.stringify(id));
    const response = await api.get<ApiResponse<Product>>(`/api/products/${id}`);
    console.log('🔍 [productsService.getById] response.data:', JSON.stringify(response.data).slice(0, 200));
    return response.data;
  },

  async getFeatured(): Promise<Product[]> {
    const response = await api.get<ApiResponse<Product[]>>('/api/products?featured=true');
    return response.data;
  },

  async getRelated(productId: string, categoryId: string): Promise<Product[]> {
    const response = await api.get<ApiResponse<Product[]>>(`/api/products?relatedTo=${productId}&category=${categoryId}`);
    return response.data;
  },

  async search(query: string): Promise<Product[]> {
    const response = await api.get<ApiResponse<Product[]>>(`/api/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },

  async getReviews(productId: string): Promise<Review[]> {
    const response = await api.get<ApiResponse<Review[]>>(`/api/reviews?productId=${productId}`);
    return response.data;
  },
};
