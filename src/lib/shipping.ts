/**
 * Free-shipping threshold, expressed in the visitor's own currency.
 *
 * ⚠️ This number must match the shipping rule configured in Shopify for each
 * market. The site only *describes* the offer — Shopify decides what the
 * customer is actually charged. If the two drift apart the storefront promises
 * something checkout will not honour, which is worse than charging openly.
 *
 * Shopify Markets prices the US and Canada separately, so "$150" means 150 in
 * whichever currency the visitor is checking out in, not a converted figure.
 */
export const FREE_SHIPPING_THRESHOLD = 150;

/**
 * Duties are prepaid (DDP) on cross-border orders, so a US customer sees one
 * price rather than a customs bill at the door. Canadian orders ship
 * domestically and never incur them, which is why the duty line is only worth
 * mentioning outside Canada.
 */
export const DUTIES_PREPAID = true;

/** Headline shipping promise, tailored to where the visitor is. */
export function shippingPromise(isCanadaVisitor: boolean): string {
  if (isCanadaVisitor) {
    return `Complimentary shipping across Canada on orders above $${FREE_SHIPPING_THRESHOLD}`;
  }
  return `Complimentary shipping on orders above $${FREE_SHIPPING_THRESHOLD}, duties included`;
}
