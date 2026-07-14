# Shopify Admin MCP server

A tiny local [MCP](https://modelcontextprotocol.io) server that lets Claude Code
talk to your Shopify store's **Admin GraphQL API**. Your access token stays on
your machine — it is never sent to any third-party package or service.

It exposes two tools:

| Tool | What it does |
|------|--------------|
| `admin_graphql` | Run any Admin GraphQL query or mutation (reads **and** writes — rename products, set product types, edit descriptions, manage fulfillment, etc.). Bounded by your token's scopes. |
| `list_products` | Read-only convenience: list products with id / handle / productType / status. |

## One-time setup

From this folder (`shopify-mcp/`):

```bash
npm install
```

That installs the MCP SDK into `shopify-mcp/node_modules` (git-ignored).

## Register it with Claude Code

Run this in an **interactive** `claude` terminal (not inside a running task).
Replace the token with your real `shpat_…` value:

```bash
claude mcp add shopify-admin \
  -e SHOPIFY_STORE_DOMAIN=pzg1g0-q9.myshopify.com \
  -e SHOPIFY_ADMIN_ACCESS_TOKEN=shpat_your_real_token_here \
  -- node "C:/Users/ahmed/OneDrive/Desktop/nurhaus-master/nurhaus-main/shopify-mcp/index.mjs"
```

Optional: add `-e SHOPIFY_ADMIN_API_VERSION=2024-10` to pin the API version
(defaults to `2024-10`).

Then confirm it registered:

```bash
claude mcp list
```

Start a new Claude session and the tools appear as
`mcp__shopify-admin__admin_graphql` and `mcp__shopify-admin__list_products`.

## Test it works

Ask Claude something like *"list my Shopify products"*, or run a quick manual
check from this folder:

```bash
SHOPIFY_STORE_DOMAIN=pzg1g0-q9.myshopify.com \
SHOPIFY_ADMIN_ACCESS_TOKEN=shpat_your_real_token_here \
node -e "process.stdin.resume()" # (the MCP server is driven by Claude, not run directly)
```

The real test is simply asking Claude to list products once it's registered.

## Security notes

- The token is passed via `-e` flags, which Claude Code stores in its local MCP
  config file. Treat that file as sensitive.
- Grant the **least-privilege scopes** the task needs (e.g. `read_products`,
  `write_products`). Add more only when required.
- **Revoke** anytime: Shopify Admin → Settings → Apps → your custom app →
  Uninstall, or rotate the token.

## Remove it

```bash
claude mcp remove shopify-admin
```
