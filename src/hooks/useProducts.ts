'use client';

import { useQuery } from '@tanstack/react-query';
import { productsService, type ProductFilters } from '@/lib/services/products.service';

export function useProducts(filters: ProductFilters = {}) {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => productsService.list(filters),
    staleTime: 30_000,
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => productsService.getById(id),
    enabled: !!id,
    staleTime: 60_000,
  });
}

export function useFeaturedProducts() {
  return useQuery({
    queryKey: ['products', 'featured'],
    queryFn: () => productsService.getFeatured(),
    staleTime: 120_000,
  });
}

export function useRelatedProducts(productId: string, categoryId: string) {
  return useQuery({
    queryKey: ['products', 'related', productId],
    queryFn: () => productsService.getRelated(productId, categoryId),
    enabled: !!productId && !!categoryId,
    staleTime: 60_000,
  });
}

export function useSearchResults(query: string) {
  return useQuery({
    queryKey: ['search', query],
    queryFn: () => productsService.search(query),
    enabled: query.length >= 2,
    staleTime: 30_000,
  });
}

export function useProductReviews(productId: string) {
  return useQuery({
    queryKey: ['reviews', productId],
    queryFn: () => productsService.getReviews(productId),
    enabled: !!productId,
    staleTime: 60_000,
  });
}
