import { shopifyFetch, isShopifyConfigured, ShopifyNotConfiguredError } from './client';
import {
  getProductsQuery,
  getProductByHandleQuery,
  getCartQuery,
  cartCreateMutation,
  cartAttributesUpdateMutation,
  cartLinesAddMutation,
  cartLinesUpdateMutation,
  cartLinesRemoveMutation,
} from './queries';
import { toAppProduct, toAppCart } from './transform';
import type { ShopifyProduct, ShopifyCart, AppProduct, AppCart } from './types';

export { isShopifyConfigured, ShopifyNotConfiguredError };
export type { AppProduct, AppCart, AppCartLine, AppVariant } from './types';

interface CartMutationResponse {
  cart: ShopifyCart | null;
  userErrors: { field: string[]; message: string }[];
}

function assertNoUserErrors(userErrors: { field: string[]; message: string }[]) {
  if (userErrors?.length) {
    throw new Error(userErrors.map((e) => e.message).join('; '));
  }
}

/** Products list, optionally filtered by Shopify product type (maps to the UI's Abaya/Dress category filter). */
export async function getProducts(opts: { first?: number; productType?: string } = {}): Promise<AppProduct[]> {
  const { first = 48, productType } = opts;
  const data = await shopifyFetch<{ products: { edges: { node: ShopifyProduct }[] } }>({
    query: getProductsQuery,
    variables: { first, query: productType ? `product_type:'${productType}'` : undefined },
    revalidate: 60,
  });
  return data.products.edges.map((e) => toAppProduct(e.node));
}

/** Distinct product types present in the catalog, for building the category filter — derived, not a dedicated Shopify query. */
export async function getProductTypes(): Promise<string[]> {
  const products = await getProducts({ first: 100 });
  const types = new Set(products.map((p) => p.kind).filter(Boolean));
  return Array.from(types);
}

export async function getProductByHandle(handle: string): Promise<AppProduct | null> {
  const data = await shopifyFetch<{ product: ShopifyProduct | null }>({
    query: getProductByHandleQuery,
    variables: { handle },
    revalidate: 60,
  });
  return data.product ? toAppProduct(data.product) : null;
}

export async function getCartById(cartId: string): Promise<AppCart | null> {
  try {
    const data = await shopifyFetch<{ cart: ShopifyCart | null }>({
      query: getCartQuery,
      variables: { cartId },
    });
    return data.cart ? toAppCart(data.cart) : null;
  } catch {
    // Cart may have expired or been deleted server-side — treat as absent so a fresh one gets created.
    return null;
  }
}

export async function createCart(lines: { merchandiseId: string; quantity: number }[] = []): Promise<AppCart> {
  const data = await shopifyFetch<{ cartCreate: CartMutationResponse }>({
    query: cartCreateMutation,
    variables: { lines },
  });
  assertNoUserErrors(data.cartCreate.userErrors);
  if (!data.cartCreate.cart) throw new Error('Shopify did not return a cart.');
  return toAppCart(data.cartCreate.cart);
}

/**
 * Stamps key/value attributes onto the cart. Shopify carries these through to
 * the order as `note_attributes`, which is how the Meta click identifiers
 * (_fbp / _fbc) survive the jump from this storefront to Shopify's hosted
 * checkout and back out through the orders webhook. Without them the
 * Conversions API cannot tie a purchase to the ad click that caused it.
 */
export async function updateCartAttributes(
  cartId: string,
  attributes: { key: string; value: string }[]
): Promise<AppCart> {
  const data = await shopifyFetch<{ cartAttributesUpdate: CartMutationResponse }>({
    query: cartAttributesUpdateMutation,
    variables: { cartId, attributes },
  });
  assertNoUserErrors(data.cartAttributesUpdate.userErrors);
  if (!data.cartAttributesUpdate.cart) throw new Error('Shopify did not return a cart.');
  return toAppCart(data.cartAttributesUpdate.cart);
}

export async function addCartLines(
  cartId: string,
  lines: { merchandiseId: string; quantity: number }[]
): Promise<AppCart> {
  const data = await shopifyFetch<{ cartLinesAdd: CartMutationResponse }>({
    query: cartLinesAddMutation,
    variables: { cartId, lines },
  });
  assertNoUserErrors(data.cartLinesAdd.userErrors);
  if (!data.cartLinesAdd.cart) throw new Error('Shopify did not return a cart.');
  return toAppCart(data.cartLinesAdd.cart);
}

export async function updateCartLines(
  cartId: string,
  lines: { id: string; quantity: number }[]
): Promise<AppCart> {
  const data = await shopifyFetch<{ cartLinesUpdate: CartMutationResponse }>({
    query: cartLinesUpdateMutation,
    variables: { cartId, lines },
  });
  assertNoUserErrors(data.cartLinesUpdate.userErrors);
  if (!data.cartLinesUpdate.cart) throw new Error('Shopify did not return a cart.');
  return toAppCart(data.cartLinesUpdate.cart);
}

export async function removeCartLines(cartId: string, lineIds: string[]): Promise<AppCart> {
  const data = await shopifyFetch<{ cartLinesRemove: CartMutationResponse }>({
    query: cartLinesRemoveMutation,
    variables: { cartId, lineIds },
  });
  assertNoUserErrors(data.cartLinesRemove.userErrors);
  if (!data.cartLinesRemove.cart) throw new Error('Shopify did not return a cart.');
  return toAppCart(data.cartLinesRemove.cart);
}
