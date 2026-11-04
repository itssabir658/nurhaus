import type {
  ShopifyProduct,
  ShopifyVariant,
  ShopifyCart,
  ShopifyCartLine,
  AppProduct,
  AppVariant,
  AppCart,
  AppCartLine,
  AppPickupInfo,
} from './types';

/** Shopify returns compareAtPrice even when it equals price; only a higher value is a markdown. */
function toCompareAt(price: string, compareAt: string | null | undefined): number | null {
  if (compareAt == null) return null;
  const c = Number(compareAt);
  return Number.isFinite(c) && c > Number(price) ? c : null;
}

function toVariant(v: ShopifyVariant): AppVariant {
  return {
    id: v.id,
    title: v.title,
    availableForSale: v.availableForSale,
    quantityAvailable: v.quantityAvailable ?? null,
    price: Number(v.price.amount),
    compareAtPrice: toCompareAt(v.price.amount, v.compareAtPrice?.amount),
    image: v.image?.url ?? null,
    selectedOptions: v.selectedOptions,
  };
}

/** Reads the first available in-store pickup location off any variant that has one. */
function extractPickup(p: ShopifyProduct): AppPickupInfo | null {
  for (const { node: v } of p.variants.edges) {
    const edge = v.storeAvailability?.edges.find((e) => e.node.available);
    if (edge) {
      return {
        locationName: edge.node.location.name,
        address: edge.node.location.address.formatted.join(', '),
        pickupTime: edge.node.pickUpTime,
      };
    }
  }
  return null;
}

/** Pulls the "Size" option's values across all variants, in first-seen order, deduped. */
function extractSizes(variants: AppVariant[]): string[] {
  const sizes: string[] = [];
  for (const v of variants) {
    const sizeOption = v.selectedOptions.find((o) => o.name.toLowerCase() === 'size');
    if (sizeOption && !sizes.includes(sizeOption.value)) sizes.push(sizeOption.value);
  }
  return sizes;
}

export function toAppProduct(p: ShopifyProduct): AppProduct {
  const variants = p.variants.edges.map((e) => toVariant(e.node));
  const images = p.images.edges.map((e) => e.node.url);
  const price = Number(p.priceRange.minVariantPrice.amount);

  // Pair the headline price with the compare-at of the *same* variant. Using
  // compareAtPriceRange.max against priceRange.min (as before) could pair a
  // cheap unmarked size with an expensive marked-down one and overstate the
  // saving. Falls back to the range only if no variant data came back.
  const cheapest = variants.reduce<AppVariant | null>(
    (best, v) => (best === null || v.price < best.price ? v : best),
    null,
  );
  const rangeCompareAt = p.compareAtPriceRange?.maxVariantPrice
    ? Number(p.compareAtPriceRange.maxVariantPrice.amount)
    : null;
  const compareAt = cheapest ? cheapest.compareAtPrice : rangeCompareAt;

  // Use Shopify's Product Type field for categorization (confirmed live via direct API query)
  const kind = p.productType && p.productType.toLowerCase().includes('abaya') ? 'Abaya' : 'Dress';

  return {
    id: p.id,
    handle: p.handle,
    name: p.title,
    kind,
    description: p.description,
    descriptionHtml: p.descriptionHtml,
    price,
    compareAtPrice: compareAt && compareAt > price ? compareAt : null,
    currency: p.priceRange.minVariantPrice.currencyCode,
    images,
    sizes: extractSizes(variants),
    variants,
    availableForSale: p.availableForSale,
    tags: p.tags,
    pickup: extractPickup(p),
  };
}

function toCartLine(line: ShopifyCartLine): AppCartLine {
  const sizeOption = line.merchandise.selectedOptions.find((o) => o.name.toLowerCase() === 'size');
  return {
    id: line.id,
    quantity: line.quantity,
    lineTotal: Number(line.cost.totalAmount.amount),
    variantId: line.merchandise.id,
    variantTitle: line.merchandise.title,
    productHandle: line.merchandise.product.handle,
    productTitle: line.merchandise.product.title,
    image: line.merchandise.image?.url ?? null,
    price: Number(line.merchandise.price.amount),
    compareAtPrice: toCompareAt(line.merchandise.price.amount, line.merchandise.compareAtPrice?.amount),
    size: sizeOption?.value ?? null,
  };
}

export function toAppCart(c: ShopifyCart): AppCart {
  return {
    id: c.id,
    checkoutUrl: c.checkoutUrl,
    totalQuantity: c.totalQuantity,
    subtotal: Number(c.cost.subtotalAmount.amount),
    total: Number(c.cost.totalAmount.amount),
    currency: c.cost.totalAmount.currencyCode,
    lines: c.lines.edges.map((e) => toCartLine(e.node)),
  };
}
