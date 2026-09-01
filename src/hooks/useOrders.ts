'use client';

import { useQuery } from '@tanstack/react-query';
import { ordersService } from '@/lib/services/orders.service';

export function useOrders() {
  return useQuery({
    queryKey: ['orders'],
    queryFn: () => ordersService.list(),
    staleTime: 30_000,
  });
}
