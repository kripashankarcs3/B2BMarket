'use client';

import { useQuery } from '@tanstack/react-query';
import { categoriesService } from '@/lib/services/categories.service';

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesService.list(),
    staleTime: 300_000,
  });
}
