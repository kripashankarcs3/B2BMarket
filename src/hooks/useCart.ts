'use client';

import { useState, useCallback } from 'react';
import { cartService } from '@/lib/services/cart.service';
import type { Product, CartItem } from '@/types';

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await cartService.list();
      setItems(data);
    } catch {
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addItem = useCallback(async (product: Product, quantity: number = 1) => {
    try {
      const data = await cartService.add({ productId: product.id, quantity });
      setItems(data);
    } catch {
      const existing = items.find((item) => item.product.id === product.id);
      if (existing) {
        setItems((prev) =>
          prev.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          )
        );
      } else {
        setItems((prev) => [...prev, { product, quantity }]);
      }
    }
  }, [items]);

  const removeItem = useCallback(async (productId: string) => {
    try {
      const data = await cartService.remove(productId);
      setItems(data);
    } catch {
      setItems((prev) => prev.filter((item) => item.product.id !== productId));
    }
  }, []);

  const updateQuantity = useCallback(async (productId: string, quantity: number) => {
    try {
      const data = await cartService.updateQuantity(productId, quantity);
      setItems(data);
    } catch {
      setItems((prev) =>
        prev.map((item) =>
          item.product.id === productId ? { ...item, quantity: Math.max(1, quantity) } : item
        )
      );
    }
  }, []);

  const clearCart = useCallback(async () => {
    try {
      await cartService.clear();
      setItems([]);
    } catch {
      setItems([]);
    }
  }, []);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return { items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice, isLoading, fetchCart };
}
