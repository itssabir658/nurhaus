import { getProducts, isShopifyConfigured } from '../shopify';
import type { AppProduct } from '../shopify/types';
import { DEMO_PRODUCTS } from '../demoProducts';
import { ACTIVE_CAMPAIGN } from './config';
import { getCampaignPhase } from './schedule';
import { catalogHonoursCampaign } from './verify';

/**
 * Server-side campaign status for the current request: inside its window AND
 * honoured by live Shopify prices. Used for metadata (titles, share cards) so
 * search and social previews only mention the sale while it is real.
 *
 * Pass the catalog if it was already fetched; otherwise it is fetched here
 * (Next de-duplicates identical cached fetches within a request).
 */
export async function getServerCampaignState(catalog?: AppProduct[]) {
  const products =
    catalog ?? (isShopifyConfigured ? await getProducts({ first: 48 }).catch(() => []) : DEMO_PRODUCTS);
  const verified = catalogHonoursCampaign(products, ACTIVE_CAMPAIGN);
  const live = Boolean(ACTIVE_CAMPAIGN) && verified && getCampaignPhase(ACTIVE_CAMPAIGN!, Date.now()) === 'live';
  return { campaign: ACTIVE_CAMPAIGN, verified, live };
}
