// Raw shapes returned by the Shopify Storefront API (subset of fields we query).

export interface ShopifyImage {
  url: string;
  altText: string | null;
  width?: number;
  height?: number;
}

export interface ShopifyMoney {
  amount: string;
  currencyCode: string;
}

export interface ShopifySelectedOption {
  name: string;
  value: string;
}

export interface ShopifyStoreAvailability {
  available: boolean;
  pickUpTime: string;
  location: {
    name: string;
    address: { formatted: string[] };
  };
}

export interface ShopifyVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  quantityAvailable: number | null;
  selectedOptions: ShopifySelectedOption[];
  price: ShopifyMoney;
  /** Original price set in Shopify admin; null when the variant is not marked down. */
  compareAtPrice?: ShopifyMoney | null;
  image: ShopifyImage | null;
  storeAvailability?: { edges: { node: ShopifyStoreAvailability }[] };
}

export interface ShopifyProductOption {
  name: string;
  values: string[];
}

export interface ShopifyProduct {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  productType: string;
  tags: string[];
  availableForSale: boolean;
  options: ShopifyProductOption[];
  priceRange: { minVariantPrice: ShopifyMoney };
  compareAtPriceRange?: { maxVariantPrice: ShopifyMoney };
  images: { edges: { node: ShopifyImage }[] };
  variants: { edges: { node: ShopifyVariant }[] };
}

export interface ShopifyCartLine {
  id: string;
  quantity: number;
  cost: { totalAmount: ShopifyMoney };
  merchandise: ShopifyVariant & { product: { handle: string; title: string } };
}

export interface ShopifyCart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    totalAmount: ShopifyMoney;
    subtotalAmount: ShopifyMoney;
  };
  lines: { edges: { node: ShopifyCartLine }[] };
}

// App-facing shapes — what the existing UI components expect.

export interface AppVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  quantityAvailable: number | null;
  price: number;
  /** Shopify's compare-at (original) price — only set when it is above `price`. */
  compareAtPrice: number | null;
  image: string | null;
  selectedOptions: ShopifySelectedOption[];
}

export interface AppPickupInfo {
  locationName: string;
  address: string;
  pickupTime: string;
}

export interface AppProduct {
  id: string;
  handle: string;
  name: string;
  kind: string;
  description: string;
  descriptionHtml: string;
  /** Optional per-product care instructions (newline-separated lines). Falls back to a shared default when unset. */
  care?: string;
  price: number;
  /**
   * Compare-at price of the lowest-priced variant (the one `price` comes from),
   * so the product-level markdown always pairs a price with its own original.
   * Null when that variant is not marked down in Shopify.
   */
  compareAtPrice: number | null;
  currency: string;
  images: string[];
  sizes: string[];
  variants: AppVariant[];
  availableForSale: boolean;
  tags: string[];
  /** In-store pickup location, when the store has local pickup enabled for this product. */
  pickup?: AppPickupInfo | null;
}

export interface AppCartLine {
  id: string;
  quantity: number;
  lineTotal: number;
  variantId: string;
  variantTitle: string;
  productHandle: string;
  productTitle: string;
  image: string | null;
  price: number;
  /** Shopify's compare-at (original) unit price — only set when it is above `price`. */
  compareAtPrice: number | null;
  size: string | null;
}

export interface AppCart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  subtotal: number;
  total: number;
  currency: string;
  lines: AppCartLine[];
}
