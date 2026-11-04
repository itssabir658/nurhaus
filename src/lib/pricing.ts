/**
 * Markdown maths. The storefront never invents a sale price: `price` is what
 * Shopify charges, `compareAt` is the original price set in Shopify admin.
 * A markdown only exists when Shopify says the original was higher.
 *
 * Dependency-free so it can be tested in plain Node.
 */

export interface Markdown {
  price: number;
  compareAt: number;
  savings: number;
  /** Whole-number percentage, as a customer would read it. */
  percentOff: number;
}

export function getMarkdown(price: number, compareAt: number | null | undefined): Markdown | null {
  if (compareAt == null || !Number.isFinite(compareAt) || !Number.isFinite(price)) return null;
  if (compareAt <= 0 || compareAt <= price) return null;
  const savings = Math.round((compareAt - price) * 100) / 100;
  return {
    price,
    compareAt,
    savings,
    percentOff: Math.round((savings / compareAt) * 100),
  };
}

/** True when a markdown matches the advertised campaign percentage (±1pt for cent rounding). */
export function matchesCampaignPercent(markdown: Markdown | null, percent: number): boolean {
  return markdown !== null && Math.abs(markdown.percentOff - percent) <= 1;
}

/** "$360", "$359.20" — whole dollars stay whole, cents only when present. */
export function formatMoney(amount: number): string {
  const rounded = Math.round(amount * 100) / 100;
  return `$${rounded.toLocaleString('en-US', {
    minimumFractionDigits: Number.isInteger(rounded) ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;
}

/** Total saved across cart lines, from each line's Shopify compare-at price. */
export function getCartSavings(lines: { price: number; compareAtPrice: number | null; quantity: number }[]): number {
  const total = lines.reduce((sum, l) => {
    const m = getMarkdown(l.price, l.compareAtPrice);
    return m ? sum + m.savings * l.quantity : sum;
  }, 0);
  return Math.round(total * 100) / 100;
}
