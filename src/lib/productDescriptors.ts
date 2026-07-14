// Per-product display labels used across the site (home, shop, product pages).
// Keyed by product name (lowercase, accent-stripped).
export const PRODUCT_DESCRIPTORS: Record<string, string> = {
  dahlia:  'Black Floral Dress',
  alaia:   'Light Green Dress',
  saphira: 'Dark Mixed Purple Dress',
  elayna:  'Light Blue & Pink Dress',
  faye:    'Peach Floral Dress',
  amelie:  'Hot Pink Frill Dress',
  laylah:  'Purple Garden Abaya',
  yara:    'Pink Floral Abaya',
};

export function getProductDescriptor(name: string, fallback: string): string {
  const key = name.toLowerCase().trim().normalize('NFD').replace(/[̀-ͯ]/g, '');
  return PRODUCT_DESCRIPTORS[key] ?? fallback;
}
