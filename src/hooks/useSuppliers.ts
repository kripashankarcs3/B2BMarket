'use client';

import { useQuery } from '@tanstack/react-query';
import { suppliersService } from '@/lib/services/suppliers.service';

export function useSuppliers() {
  return useQuery({
    queryKey: ['suppliers'],
    queryFn: () => suppliersService.list(),
    staleTime: 120_000,
  });
}

export function useSupplier(id: string) {
  return useQuery({
    queryKey: ['supplier', id],
    queryFn: () => suppliersService.getById(id),
    enabled: !!id,
    staleTime: 120_000,
  });
}

export function usePremiumSuppliers() {
  return useQuery({
    queryKey: ['suppliers', 'premium'],
    queryFn: () => suppliersService.getPremium(),
    staleTime: 120_000,
  });
}
