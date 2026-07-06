import type {
  ShopifyProduct,
  ShopifyVariant,
  ShopifyCart,
  ShopifyCartLine,
  AppProduct,
  AppVariant,
  AppCart,
  AppCartLine,
} from './types';

function toVariant(v: ShopifyVariant): AppVariant {
  return {
    id: v.id,
    title: v.title,
    availableForSale: v.availableForSale,
    quantityAvailable: v.quantityAvailable ?? null,
    price: Number(v.price.amount),
    image: v.image?.url ?? null,
    selectedOptions: v.selectedOptions,
  };
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
  const compareAt = p.compareAtPriceRange?.maxVariantPrice
    ? Number(p.compareAtPriceRange.maxVariantPrice.amount)
    : null;

  // Derive kind from tags: if "Abaya" tag exists, it's an Abaya; otherwise, Dress
  const kind = p.tags.some((tag) => tag.toLowerCase() === 'abaya') ? 'Abaya' : 'Dress';

  return {
    id: p.id,
    handle: p.handle,
    name: p.title,
    kind,
    description: p.description,
    descriptionHtml: p.descriptionHtml,
    price: Number(p.priceRange.minVariantPrice.amount),
    compareAtPrice: compareAt && compareAt > Number(p.priceRange.minVariantPrice.amount) ? compareAt : null,
    currency: p.priceRange.minVariantPrice.currencyCode,
    images,
    sizes: extractSizes(variants),
    variants,
    availableForSale: p.availableForSale,
    tags: p.tags,
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
