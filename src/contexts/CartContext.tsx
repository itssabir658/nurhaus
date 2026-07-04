'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import {
  fetchCartAction,
  addToCartAction,
  updateCartLineAction,
  removeCartLineAction,
} from '@/lib/shopify/actions';
import type { AppCart } from '@/lib/shopify/types';

interface CartContextValue {
  cart: AppCart | null;
  isLoading: boolean;
  isMutating: boolean;
  addItem: (merchandiseId: string, quantity?: number) => Promise<AppCart>;
  updateItem: (lineId: string, quantity: number) => Promise<AppCart>;
  removeItem: (lineId: string) => Promise<AppCart>;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<AppCart | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);

  useEffect(() => {
    fetchCartAction()
      .then(setCart)
      .finally(() => setIsLoading(false));
  }, []);

  const addItem = useCallback(async (merchandiseId: string, quantity = 1) => {
    setIsMutating(true);
    try {
      const updated = await addToCartAction(merchandiseId, quantity);
      setCart(updated);
      return updated;
    } finally {
      setIsMutating(false);
    }
  }, []);

  const updateItem = useCallback(async (lineId: string, quantity: number) => {
    setIsMutating(true);
    try {
      const updated = await updateCartLineAction(lineId, quantity);
      setCart(updated);
      return updated;
    } finally {
      setIsMutating(false);
    }
  }, []);

  const removeItem = useCallback(async (lineId: string) => {
    setIsMutating(true);
    try {
      const updated = await removeCartLineAction(lineId);
      setCart(updated);
      return updated;
    } finally {
      setIsMutating(false);
    }
  }, []);

  return (
    <CartContext.Provider value={{ cart, isLoading, isMutating, addItem, updateItem, removeItem }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
}
