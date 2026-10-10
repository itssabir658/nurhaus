'use client';

import { META_PIXEL_ID, metaPixelEnabled, type MetaStandardEvent } from './config';
import type { AppCart, AppProduct, AppVariant } from '@/lib/shopify/types';

declare global {
  interface Window {
    fbq?: ((...args: unknown[]) => void) & { callMethod?: (...args: unknown[]) => void };
    _fbq?: unknown;
  }
}

/**
 * Every browser event carries an event_id. If the same event is ever also sent
 * server-side through the Conversions API, Meta collapses the pair instead of
 * counting it twice. Purchase is server-only today (checkout is Shopify-hosted),
 * but the funnel events are ready for mirroring if we add it.
 */
export function newEventId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

/**
 * Storefront API returns GIDs ("gid://shopify/ProductVariant/4455"); the
 * orders webhook returns bare numeric IDs (4455). Every event has to use the
 * same form or Meta cannot tie ViewContent → AddToCart → Purchase together,
 * and nothing will match a Shopify product feed later. Numeric variant ID is
 * the common denominator, so everything normalises to that.
 */
export function shopifyNumericId(id: string): string {
  const match = /(\d+)\s*$/.exec(id);
  return match ? match[1] : id;
}

function track(
  event: MetaStandardEvent,
  data?: Record<string, unknown>,
  eventId?: string,
): void {
  if (!metaPixelEnabled || typeof window === 'undefined' || !window.fbq) return;
  window.fbq('track', event, data ?? {}, eventId ? { eventID: eventId } : undefined);
}

export function trackPageView(): void {
  track('PageView');
}

export function trackViewContent(product: AppProduct, variant?: AppVariant | null): void {
  // Fall back to the first variant rather than the product GID, so the id
  // matches what AddToCart and the Purchase webhook will send.
  const identified = variant ?? product.variants[0] ?? null;
  track('ViewContent', {
    content_ids: [shopifyNumericId(identified?.id ?? product.id)],
    content_name: product.name,
    content_type: 'product',
    content_category: product.kind,
    value: identified?.price ?? product.price,
    currency: product.currency,
  });
}

export function trackAddToCart(args: {
  variantId: string;
  name: string;
  price: number;
  currency: string;
  quantity: number;
}): void {
  const id = shopifyNumericId(args.variantId);
  track('AddToCart', {
    content_ids: [id],
    content_name: args.name,
    content_type: 'product',
    value: args.price * args.quantity,
    currency: args.currency,
    contents: [{ id, quantity: args.quantity, item_price: args.price }],
  });
}

export function trackInitiateCheckout(cart: AppCart): void {
  track('InitiateCheckout', {
    content_ids: cart.lines.map((l) => shopifyNumericId(l.variantId)),
    content_type: 'product',
    contents: cart.lines.map((l) => ({
      id: shopifyNumericId(l.variantId),
      quantity: l.quantity,
      item_price: l.price,
    })),
    num_items: cart.totalQuantity,
    value: cart.total,
    currency: cart.currency,
  });
}

export { META_PIXEL_ID, metaPixelEnabled };
