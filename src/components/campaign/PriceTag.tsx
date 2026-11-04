'use client';

import { useCampaign } from '@/contexts/CampaignContext';
import { formatMoney, type Markdown } from '@/lib/pricing';

/**
 * Small "20% Off" label. The percentage is computed from Shopify's own
 * price/compare-at pair, never taken from campaign config, so the label can
 * only ever describe the discount checkout actually charges.
 */
export function SaleBadge({ markdown, className = '' }: { markdown: Markdown; className?: string }) {
  return (
    <span
      className={`sale-badge inline-flex items-center gap-1.5 bg-primary/95 text-ink border border-gold/50 px-2.5 py-1 text-[0.58rem] tracking-[0.22em] uppercase font-medium ${className}`}
      style={{ fontFamily: 'var(--font-eyebrow)' }}
    >
      <span className="text-gold" aria-hidden="true">✦</span>
      {markdown.percentOff}% Off
    </span>
  );
}

/**
 * Card-sized price. Shows the sale price with the original struck through
 * only while a campaign is live and Shopify reports a markdown; otherwise it
 * renders exactly as the storefront always has.
 */
export function PriceTag({
  price,
  compareAt,
  soldOut = false,
  className = '',
}: {
  price: number;
  compareAt: number | null | undefined;
  /** Fully sold-out pieces never carry sale styling — there is nothing to buy at that price. */
  soldOut?: boolean;
  className?: string;
}) {
  const { saleFor } = useCampaign();
  const markdown = soldOut ? null : saleFor(price, compareAt);

  if (!markdown) {
    return <span className={`text-sm text-smoke ${className}`}>${price.toLocaleString()}</span>;
  }

  return (
    <span className={`inline-flex items-baseline gap-2 ${className}`}>
      <span className="sr-only">Sale price</span>
      <span className="text-sm text-ink font-medium">{formatMoney(markdown.price)}</span>
      <span className="sr-only">, originally</span>
      <s className="text-xs text-muted">{formatMoney(markdown.compareAt)}</s>
    </span>
  );
}

/** Hook form for components that need the markdown itself (badges, savings copy). */
export function useSale(price: number, compareAt: number | null | undefined): Markdown | null {
  return useCampaign().saleFor(price, compareAt);
}

/** "Bestseller" label, shown for products tagged `bestseller` in Shopify. */
export function BestsellerBadge({ className = '' }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 bg-primary/95 text-ink px-2.5 py-1 text-[0.58rem] tracking-[0.22em] uppercase font-medium ${className}`}
      style={{ fontFamily: 'var(--font-eyebrow)' }}
    >
      Bestseller
    </span>
  );
}
