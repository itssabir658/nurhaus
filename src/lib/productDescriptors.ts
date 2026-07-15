// Per-product display labels used across the site (home, shop, product pages).
// Keyed by product name (lowercase, accent-stripped).
export const PRODUCT_DESCRIPTORS: Record<string, string> = {
  dahlia:  'Dress',
  alaia:   'Dress',
  saphira: 'Dress',
  elayna:  'Dress',
  faye:    'Dress',
  amelie:  'Dress',
  laylah:  'Purple Garden Abaya',
  yara:    'Abaya',
};

export function getProductDescriptor(name: string, fallback: string): string {
  const key = name.toLowerCase().trim().normalize('NFD').replace(/[̀-ͯ]/g, '');
  return PRODUCT_DESCRIPTORS[key] ?? fallback;
}
