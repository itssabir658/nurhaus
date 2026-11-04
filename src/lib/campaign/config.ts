/**
 * Promotional campaign configuration — the single place to change a sale.
 *
 * Everything campaign-related on the storefront (announcement bar, homepage
 * hero + countdown, shop "Sale" filter, product badges, cart savings line)
 * reads from `ACTIVE_CAMPAIGN`. To retire a campaign, set it to `null`. To run
 * the next one, add a new `Campaign` object and point `ACTIVE_CAMPAIGN` at it.
 *
 * ⚠️ Pricing source of truth is Shopify, not this file. The storefront never
 * calculates a discounted price itself. A product only shows a sale price when
 * Shopify reports a `compareAtPrice` above its selling price — i.e. the price
 * the customer is actually charged at checkout has already been reduced in
 * Shopify admin. `discountPercent` below is only used to (a) write the
 * headline copy and (b) confirm the Shopify markdowns actually match that
 * headline before any sitewide messaging is shown (see `requireShopifyMarkdown`).
 */

export interface CampaignCopy {
  /** Announcement bar headline. */
  announcement: string;
  /** Announcement bar call to action. */
  announcementCta: string;
  /** Homepage hero. */
  heroEyebrow: string;
  heroHeadline: string;
  heroBody: string;
  heroCta: string;
  /** Countdown heading. */
  countdownLabel: string;
  /** Human-readable deadline, in the campaign's own timezone (never the visitor's). */
  deadlineLabel: string;
  /** Short deadline used in tight spaces (product page, cart). */
  deadlineShort: string;
  /** Product page note beside the buy buttons. */
  productNote: string;
  /** Shop hero eyebrow while the campaign runs. */
  shopEyebrow: string;
  /** Label for the shop's sale-only filter chip. */
  shopFilterLabel: string;
  /** Shown in the cart beside the savings figure. */
  cartSavingsLabel: string;
  /** Shown in place of the hero copy if the campaign ends while a visitor is on the page. */
  endedHeadline: string;
  endedBody: string;
  endedCta: string;
}

export interface Campaign {
  /** Stable id — useful for analytics and for keying UI state. */
  id: string;
  name: string;
  /** Headline percentage. Must match the markdowns configured in Shopify. */
  discountPercent: number;
  /** ISO-8601 with an explicit UTC offset, so it is the same instant everywhere. */
  startsAt: string | null;
  endsAt: string;
  /**
   * The live Days/Hours/Minutes/Seconds countdown only appears once this
   * many hours remain before `endsAt`; before that the true end date is
   * shown instead. The countdown always targets the real deadline and never
   * resets. Use null to show it for the whole campaign.
   */
  countdownWindowHours: number | null;
  /**
   * When true, sitewide sale messaging only appears once at least one product
   * in the live Shopify catalog carries a markdown matching `discountPercent`.
   * Keeps the storefront from advertising a discount checkout will not honour
   * (e.g. if prices have not been updated in Shopify yet). Leave this on.
   */
  requireShopifyMarkdown: boolean;
  /** Where every "Shop the Sale" CTA points. */
  shopHref: string;
  /** Value of `?category=` that selects the shop's sale-only filter. */
  shopFilterParam: string;
  copy: CampaignCopy;
}

export const END_OF_SEASON_2026: Campaign = {
  id: 'eos-2026',
  name: 'End of Season Sale',
  discountPercent: 20,
  startsAt: null,
  // Runs until Black Friday begins: 12:00 AM Eastern Standard Time (UTC-5)
  // on Friday 27 November 2026 = 05:00 UTC. US daylight time ends
  // 1 November, so EST (-05:00) is correct. Shown to shoppers as
  // "Thursday 26 November, 11:59 PM EST".
  endsAt: '2026-11-27T00:00:00-05:00',
  // Live countdown for the final 3 days only (from Tue 24 Nov, 12 AM EST).
  countdownWindowHours: 72,
  requireShopifyMarkdown: true,
  shopHref: '/shop?category=sale',
  shopFilterParam: 'sale',
  copy: {
    announcement: 'End of Season Sale — Enjoy 20% Off',
    announcementCta: 'Shop the Sale',
    heroEyebrow: 'End of Season Sale',
    heroHeadline: 'The Season’s Lasting Impressions',
    heroBody: 'Discover timeless modest essentials. Enjoy 20% off selected styles during our End of Season Sale.',
    heroCta: 'Shop the Sale',
    countdownLabel: 'The Sale Ends In',
    deadlineLabel: 'Thursday 26 November, 11:59 PM EST',
    deadlineShort: 'Thu 26 Nov, 11:59 PM EST',
    productNote: 'End of Season Sale',
    shopEyebrow: 'End of Season Sale · 20% Off',
    shopFilterLabel: 'Sale',
    cartSavingsLabel: 'End of Season Sale savings',
    endedHeadline: 'The End of Season Sale Has Closed',
    endedBody: 'Thank you for shopping the season with us. The collection remains available to explore.',
    endedCta: 'Explore the Collection',
  },
};

/** The campaign currently configured to run, or null for the normal storefront. */
export const ACTIVE_CAMPAIGN: Campaign | null = END_OF_SEASON_2026;
