#!/usr/bin/env node
/**
 * Minimal Shopify Admin MCP server.
 *
 * Exposes two tools over the Model Context Protocol (stdio):
 *   - admin_graphql : run any Shopify Admin GraphQL query/mutation (full power,
 *                     bounded only by your access token's scopes)
 *   - list_products : read-only convenience to discover products (id/handle/type)
 *
 * Credentials are read from the environment so the token never lives in code:
 *   SHOPIFY_STORE_DOMAIN        e.g. pzg1g0-q9.myshopify.com
 *   SHOPIFY_ADMIN_ACCESS_TOKEN  e.g. shpat_xxxxx...
 *   SHOPIFY_ADMIN_API_VERSION   optional, defaults to 2024-10
 */
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';

const RAW_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN || '';
const TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN || '';
const API_VERSION = process.env.SHOPIFY_ADMIN_API_VERSION || '2024-10';

// Normalise the domain: strip any protocol/path so only the host remains.
const HOST = RAW_DOMAIN.replace(/^https?:\/\//, '').replace(/\/.*$/, '').trim();

if (!HOST || !TOKEN) {
  console.error(
    'shopify-admin MCP: missing credentials. Set SHOPIFY_STORE_DOMAIN and ' +
    'SHOPIFY_ADMIN_ACCESS_TOKEN in the environment.'
  );
  process.exit(1);
}

const ENDPOINT = `https://${HOST}/admin/api/${API_VERSION}/graphql.json`;

async function adminGraphql(query, variables) {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': TOKEN,
    },
    body: JSON.stringify({ query, variables: variables || {} }),
  });
  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error(`Non-JSON response (HTTP ${res.status}): ${text.slice(0, 500)}`);
  }
  if (!res.ok) {
    throw new Error(`Shopify HTTP ${res.status}: ${JSON.stringify(json)}`);
  }
  // Surface GraphQL-level errors clearly.
  if (json.errors) {
    throw new Error(`GraphQL errors: ${JSON.stringify(json.errors)}`);
  }
  return json;
}

const tools = [
  {
    name: 'admin_graphql',
    description:
      'Run an arbitrary Shopify Admin GraphQL query or mutation against the ' +
      'store. Provide `query` (the GraphQL string) and optional `variables`. ' +
      'Use this for reads and writes alike — e.g. productUpdate to rename a ' +
      'product or set its productType. Bounded by the access token scopes.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'GraphQL query or mutation string.' },
        variables: { type: 'object', description: 'Optional variables object for the query.' },
      },
      required: ['query'],
    },
  },
  {
    name: 'list_products',
    description:
      'List products with id, title, handle, productType, status and total ' +
      'inventory. Optional `query` uses Shopify search syntax ' +
      "(e.g. \"title:Dahlia\" or \"product_type:Abaya\").",
    inputSchema: {
      type: 'object',
      properties: {
        first: { type: 'number', description: 'How many to return (default 50, max 250).' },
        query: { type: 'string', description: 'Shopify product search query (optional).' },
      },
    },
  },
];

const server = new Server(
  { name: 'shopify-admin', version: '1.0.0' },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools }));

server.setRequestHandler(CallToolRequestSchema, async (req) => {
  const { name, arguments: args = {} } = req.params;
  try {
    let result;
    if (name === 'admin_graphql') {
      if (!args.query) throw new Error('`query` is required.');
      result = await adminGraphql(args.query, args.variables);
    } else if (name === 'list_products') {
      const q = `query($first:Int!,$query:String){
        products(first:$first, query:$query){
          edges{ node{ id title handle productType status totalInventory } }
        }
      }`;
      result = await adminGraphql(q, {
        first: Math.min(args.first ?? 50, 250),
        query: args.query ?? null,
      });
    } else {
      throw new Error(`Unknown tool: ${name}`);
    }
    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
  } catch (err) {
    return { content: [{ type: 'text', text: `Error: ${err.message}` }], isError: true };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
// Logs go to stderr so they never corrupt the stdio JSON-RPC stream.
console.error(`shopify-admin MCP running for ${HOST} (API ${API_VERSION})`);
