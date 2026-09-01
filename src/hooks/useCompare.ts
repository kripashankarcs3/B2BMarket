'use client';

import { useState, useCallback } from 'react';
import { compareService } from '@/lib/services/compare.service';
import type { Product } from '@/types';

const MAX_COMPARE = 4;

export function useCompare() {
  const [items, setItems] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCompare = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await compareService.list();
      setItems(data);
    } catch {
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const toggleItem = useCallback(async (product: Product) => {
    const exists = items.find((item) => item.id === product.id);
    try {
      if (exists) {
        const data = await compareService.remove(product.id);
        setItems(data);
      } else {
        if (items.length >= MAX_COMPARE) return;
        const data = await compareService.add(product.id);
        setItems(data);
      }
    } catch {
      if (exists) {
        setItems((prev) => prev.filter((item) => item.id !== product.id));
      } else if (items.length < MAX_COMPARE) {
        setItems((prev) => [...prev, product]);
      }
    }
  }, [items]);

  const removeItem = useCallback(async (productId: string) => {
    try {
      const data = await compareService.remove(productId);
      setItems(data);
    } catch {
      setItems((prev) => prev.filter((item) => item.id !== productId));
    }
  }, []);

  const clearAll = useCallback(async () => {
    try {
      await compareService.clear();
      setItems([]);
    } catch {
      setItems([]);
    }
  }, []);

  const isInCompare = useCallback((productId: string) => {
    return items.some((item) => item.id === productId);
  }, [items]);

  return { items, toggleItem, removeItem, clearAll, isInCompare, isLoading, fetchCompare, maxCompare: MAX_COMPARE };
}
