import type { AppProduct } from '../shopify/types';
import { getMarkdown, matchesCampaignPercent } from '../pricing';
import type { Campaign } from './config';

/**
 * Server-side check that Shopify is actually charging the advertised discount.
 *
 * Returns true when at least one product (or variant) in the live catalog has
 * a compare-at markdown matching the campaign's headline percentage. Sitewide
 * messaging (announcement bar, hero, countdown) is gated on this, so the
 * storefront cannot promise "20% off" before the prices are changed in
 * Shopify, or if they are changed to something else.
 */
export function catalogHonoursCampaign(products: AppProduct[], campaign: Campaign | null): boolean {
  if (!campaign) return false;
  if (!campaign.requireShopifyMarkdown) return true;
  return products.some((p) =>
    [{ price: p.price, compareAtPrice: p.compareAtPrice }, ...p.variants].some((v) =>
      matchesCampaignPercent(getMarkdown(v.price, v.compareAtPrice), campaign.discountPercent),
    ),
  );
}
