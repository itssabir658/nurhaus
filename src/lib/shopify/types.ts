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

export interface ShopifyVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  quantityAvailable: number | null;
  selectedOptions: ShopifySelectedOption[];
  price: ShopifyMoney;
  image: ShopifyImage | null;
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
  productTypeMetafield?: { value: string | null } | null;
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
  image: string | null;
  selectedOptions: ShopifySelectedOption[];
}

export interface AppProduct {
  id: string;
  handle: string;
  name: string;
  kind: string;
  description: string;
  descriptionHtml: string;
  price: number;
  compareAtPrice: number | null;
  currency: string;
  images: string[];
  sizes: string[];
  variants: AppVariant[];
  availableForSale: boolean;
  tags: string[];
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
