import type { AppProduct } from './shopify/types';

/**
 * No size can be bought. Checked per variant as well as Shopify's
 * product-level flag, which can lag behind real variant inventory.
 */
export function isFullySoldOut(p: AppProduct): boolean {
  if (!p.availableForSale) return true;
  return p.variants.length > 0 && p.variants.every((v) => !v.availableForSale);
}

/**
 * Bestseller is set in Shopify admin by tagging the product `bestseller`
 * (same mechanism as the `new` tag), so the claim always reflects a
 * decision made from real sales data rather than anything inferred here.
 */
export function isBestseller(p: AppProduct): boolean {
  return p.tags.some((t) => t.toLowerCase() === 'bestseller');
}
