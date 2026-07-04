'use server';

import { cookies } from 'next/headers';
import {
  isShopifyConfigured,
  ShopifyNotConfiguredError,
  createCart,
  getCartById,
  addCartLines,
  updateCartLines,
  removeCartLines,
} from './index';
import type { AppCart } from './types';

const CART_COOKIE = 'nh_cart_id';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

async function getOrCreateCart(): Promise<AppCart> {
  if (!isShopifyConfigured) throw new ShopifyNotConfiguredError();

  const cookieStore = cookies();
  const existingId = cookieStore.get(CART_COOKIE)?.value;

  if (existingId) {
    const cart = await getCartById(existingId);
    if (cart) return cart;
  }

  const cart = await createCart();
  cookieStore.set(CART_COOKIE, cart.id, {
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: COOKIE_MAX_AGE,
  });
  return cart;
}

export async function fetchCartAction(): Promise<AppCart | null> {
  if (!isShopifyConfigured) return null;
  try {
    return await getOrCreateCart();
  } catch {
    return null;
  }
}

export async function addToCartAction(merchandiseId: string, quantity = 1): Promise<AppCart> {
  const cart = await getOrCreateCart();
  return addCartLines(cart.id, [{ merchandiseId, quantity }]);
}

export async function updateCartLineAction(lineId: string, quantity: number): Promise<AppCart> {
  const cart = await getOrCreateCart();
  return updateCartLines(cart.id, [{ id: lineId, quantity }]);
}

export async function removeCartLineAction(lineId: string): Promise<AppCart> {
  const cart = await getOrCreateCart();
  return removeCartLines(cart.id, [lineId]);
}
