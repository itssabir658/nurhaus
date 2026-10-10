// Public Meta Pixel config. Safe to import from client components —
// everything here is either NEXT_PUBLIC_* or a constant.

export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? '';

/**
 * Tracking is a no-op until the pixel ID is set, so local dev and preview
 * builds never pollute production event data.
 */
export const metaPixelEnabled = META_PIXEL_ID.length > 0;

export type MetaStandardEvent =
  | 'PageView'
  | 'ViewContent'
  | 'AddToCart'
  | 'InitiateCheckout'
  | 'Purchase';
