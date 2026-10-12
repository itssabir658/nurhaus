'use client';

/**
 * Meta click identifiers.
 *
 * `_fbp` is a browser ID the pixel sets on first load. `_fbc` encodes the
 * `fbclid` that Meta appends to an ad click. Together they are the strongest
 * signal Meta has for attributing a purchase back to the ad that caused it —
 * far stronger than hashed name and address.
 *
 * They only exist in the browser on this storefront. Checkout completes on
 * Shopify's hosted domain and the order then reaches us server-side through a
 * webhook, so unless we carry these across deliberately they are lost and every
 * purchase looks unattributed.
 */

function readCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

/**
 * The pixel normally writes `_fbc` itself when it sees an `fbclid`, but only
 * once it has loaded. A visitor who lands and adds to cart immediately can beat
 * it, so derive the value ourselves when the parameter is present and the
 * cookie is not. Format is Meta's: fb.<subdomainIndex>.<timestamp>.<fbclid>
 */
function deriveFbc(): string | null {
  if (typeof window === 'undefined') return null;
  const fbclid = new URLSearchParams(window.location.search).get('fbclid');
  if (!fbclid) return null;
  return `fb.1.${Date.now()}.${fbclid}`;
}

export interface MetaClickIds {
  fbp: string | null;
  fbc: string | null;
}

export function getMetaClickIds(): MetaClickIds {
  return {
    fbp: readCookie('_fbp'),
    fbc: readCookie('_fbc') ?? deriveFbc(),
  };
}
