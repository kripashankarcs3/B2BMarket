'use client';

import { useState, useCallback } from 'react';
import { wishlistService } from '@/lib/services/wishlist.service';
import type { Product } from '@/types';

export function useWishlist() {
  const [items, setItems] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchWishlist = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await wishlistService.list();
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
        const data = await wishlistService.remove(product.id);
        setItems(data);
      } else {
        const data = await wishlistService.add(product.id);
        setItems(data);
      }
    } catch {
      if (exists) {
        setItems((prev) => prev.filter((item) => item.id !== product.id));
      } else {
        setItems((prev) => [...prev, product]);
      }
    }
  }, [items]);

  const removeItem = useCallback(async (productId: string) => {
    try {
      const data = await wishlistService.remove(productId);
      setItems(data);
    } catch {
      setItems((prev) => prev.filter((item) => item.id !== productId));
    }
  }, []);

  const isWishlisted = useCallback((productId: string) => {
    return items.some((item) => item.id === productId);
  }, [items]);

  return { items, toggleItem, removeItem, isWishlisted, isLoading, fetchWishlist };
}
