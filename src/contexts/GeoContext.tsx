'use client';

import { createContext, useContext } from 'react';

interface GeoContextValue {
  // True only when the visitor's location is positively confirmed as the US
  // (via Vercel's edge geolocation header, read once in the root layout).
  // Defaults to false so shipping/promo messaging stays visible whenever the
  // location can't be determined (local dev, non-Vercel hosting, etc).
  isUSVisitor: boolean;
  // True only when positively confirmed as Canada — swaps in the
  // Canada-specific "across Canada" shipping copy. Same fallback behavior:
  // defaults to false (generic international copy) when unknown.
  isCanadaVisitor: boolean;
}

const GeoContext = createContext<GeoContextValue>({ isUSVisitor: false, isCanadaVisitor: false });

export const GeoProvider = GeoContext.Provider;

export function useGeo() {
  return useContext(GeoContext);
}
