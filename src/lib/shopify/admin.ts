/**
 * Minimal server-only Shopify Admin API client, used for customer sign-ups
 * (newsletter and waiting list). The storefront's Storefront API token can't
 * create subscribers on a store using new customer accounts, so this needs an
 * Admin API access token with the `read_customers` and `write_customers`
 * scopes in SHOPIFY_ADMIN_ACCESS_TOKEN. Never expose it to the browser.
 */

const domain = process.env.SHOPIFY_STORE_DOMAIN;
const adminToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
const adminVersion = process.env.SHOPIFY_ADMIN_API_VERSION || '2024-10';

export const isShopifyAdminConfigured = Boolean(domain && adminToken);

async function adminFetch<T>(query: string, variables: Record<string, unknown>): Promise<T> {
  const res = await fetch(`https://${domain}/admin/api/${adminVersion}/graphql.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': adminToken as string },
    body: JSON.stringify({ query, variables }),
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`Shopify Admin API ${res.status} ${res.statusText}`);
  const json = (await res.json()) as { data?: T; errors?: { message: string }[] };
  if (json.errors?.length) throw new Error(json.errors.map((e) => e.message).join('; '));
  return json.data as T;
}

interface UserError { field: string[] | null; message: string }

function assertOk(errors: UserError[] | undefined) {
  if (errors?.length) throw new Error(errors.map((e) => e.message).join('; '));
}

const FIND_CUSTOMER = `
  query FindCustomer($q: String!) {
    customers(first: 1, query: $q) { nodes { id } }
  }
`;

const CREATE_CUSTOMER = `
  mutation CreateCustomer($input: CustomerInput!) {
    customerCreate(input: $input) {
      customer { id }
      userErrors { field message }
    }
  }
`;

const ADD_TAGS = `
  mutation AddTags($id: ID!, $tags: [String!]!) {
    tagsAdd(id: $id, tags: $tags) { userErrors { field message } }
  }
`;

const SUBSCRIBE = `
  mutation Subscribe($input: CustomerEmailMarketingConsentUpdateInput!) {
    customerEmailMarketingConsentUpdate(input: $input) {
      userErrors { field message }
    }
  }
`;

/**
 * Creates the customer if needed, adds tags, and (only when `subscribe` is
 * true) records email-marketing consent. Existing customers keep everything
 * they already have; nothing is ever unsubscribed or overwritten here.
 */
export async function upsertCustomerSignup({
  email,
  tags,
  subscribe,
}: {
  email: string;
  tags: string[];
  subscribe: boolean;
}): Promise<{ created: boolean }> {
  const consent = {
    marketingState: 'SUBSCRIBED',
    marketingOptInLevel: 'SINGLE_OPT_IN',
    consentUpdatedAt: new Date().toISOString(),
  };

  const found = await adminFetch<{ customers: { nodes: { id: string }[] } }>(FIND_CUSTOMER, {
    q: `email:"${email}"`,
  });
  const existingId = found.customers.nodes[0]?.id;

  if (!existingId) {
    const created = await adminFetch<{ customerCreate: { customer: { id: string } | null; userErrors: UserError[] } }>(
      CREATE_CUSTOMER,
      { input: { email, tags, ...(subscribe ? { emailMarketingConsent: consent } : {}) } },
    );
    assertOk(created.customerCreate.userErrors);
    return { created: true };
  }

  const tagged = await adminFetch<{ tagsAdd: { userErrors: UserError[] } }>(ADD_TAGS, { id: existingId, tags });
  assertOk(tagged.tagsAdd.userErrors);
  if (subscribe) {
    const sub = await adminFetch<{ customerEmailMarketingConsentUpdate: { userErrors: UserError[] } }>(SUBSCRIBE, {
      input: { customerId: existingId, emailMarketingConsent: consent },
    });
    assertOk(sub.customerEmailMarketingConsentUpdate.userErrors);
  }
  return { created: false };
}
