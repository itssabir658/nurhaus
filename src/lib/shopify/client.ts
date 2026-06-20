const domain = process.env.SHOPIFY_STORE_DOMAIN;
const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const apiVersion = process.env.SHOPIFY_STOREFRONT_API_VERSION || '2024-10';

export const isShopifyConfigured = Boolean(domain && token);

export class ShopifyNotConfiguredError extends Error {
  constructor() {
    super(
      'Shopify is not configured. Set SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_ACCESS_TOKEN ' +
      '(see DEPLOYMENT.md) to connect this storefront to your Shopify store.'
    );
    this.name = 'ShopifyNotConfiguredError';
  }
}

interface ShopifyFetchOptions {
  query: string;
  variables?: Record<string, unknown>;
  /** Seconds to cache the response for (Next.js ISR). Omit for mutations (always fresh). */
  revalidate?: number;
}

interface ShopifyGraphQLResponse<T> {
  data?: T;
  errors?: { message: string; path?: string[] }[];
}

export async function shopifyFetch<T>({ query, variables, revalidate }: ShopifyFetchOptions): Promise<T> {
  if (!isShopifyConfigured) {
    throw new ShopifyNotConfiguredError();
  }

  const endpoint = `https://${domain}/api/${apiVersion}/graphql.json`;

  // Shopify's Headless channel issues two token types: a "public" token (used with the
  // standard X-Shopify-Storefront-Access-Token header, safe for client-side use) and a
  // "private" token — prefixed `shpat_` — meant for server-only contexts, which Shopify
  // requires you to send via a *different* header. We run everything server-side, so the
  // private-token path is what's expected here.
  const isPrivateToken = (token as string).startsWith('shpat_');
  const authHeader = isPrivateToken ? 'Shopify-Storefront-Private-Token' : 'X-Shopify-Storefront-Access-Token';

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      [authHeader]: token as string,
    },
    body: JSON.stringify({ query, variables }),
    ...(revalidate !== undefined ? { next: { revalidate } } : { cache: 'no-store' as const }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Shopify Storefront API request failed: ${res.status} ${res.statusText} ${text}`);
  }

  const json = (await res.json()) as ShopifyGraphQLResponse<T>;

  if (json.errors?.length) {
    console.error('Shopify GraphQL errors:', JSON.stringify(json.errors, null, 2));
    throw new Error(json.errors.map((e) => e.message).join('; '));
  }

  return json.data as T;
}
