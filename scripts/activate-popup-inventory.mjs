#!/usr/bin/env node
// Ensures every tracked product variant in the store is stocked (activated)
// at a given Shopify location — e.g. a "Pop Up" location — with a baseline
// on-hand quantity, so Local Pickup becomes available for every variant at
// checkout instead of silently disappearing for variants that were never
// assigned to that location.
//
// Usage:
//   Find your Pop Up location's ID:
//     node --env-file=.env.popup-inventory.local scripts/activate-popup-inventory.mjs --list-locations
//
//   Dry run (reports what would change, writes nothing):
//     DRY_RUN=true node --env-file=.env.popup-inventory.local scripts/activate-popup-inventory.mjs
//
//   Apply for real:
//     node --env-file=.env.popup-inventory.local scripts/activate-popup-inventory.mjs
//
// Required environment variables:
//   SHOPIFY_STORE_DOMAIN         your-shop.myshopify.com
//   SHOPIFY_ADMIN_ACCESS_TOKEN   Admin API access token (custom app)
//   POPUP_LOCATION_ID            gid://shopify/Location/1234567890
//
// Optional environment variables:
//   SHOPIFY_ADMIN_API_VERSION    defaults to 2024-10
//   BASELINE_QTY                 defaults to 10
//   BATCH_SIZE                   variants set per mutation call, defaults to 100 (max 250)
//   DRY_RUN                      "true" to preview without writing

const {
  SHOPIFY_STORE_DOMAIN,
  SHOPIFY_ADMIN_ACCESS_TOKEN,
  SHOPIFY_ADMIN_API_VERSION = '2024-10',
  POPUP_LOCATION_ID,
  BASELINE_QTY = '10',
  BATCH_SIZE = '100',
  DRY_RUN,
} = process.env;

const listLocationsMode = process.argv.includes('--list-locations');

if (!SHOPIFY_STORE_DOMAIN || !SHOPIFY_ADMIN_ACCESS_TOKEN) {
  console.error('Missing SHOPIFY_STORE_DOMAIN or SHOPIFY_ADMIN_ACCESS_TOKEN.');
  console.error('Pass them via --env-file, see the usage comment at the top of this script.');
  process.exit(1);
}
if (!listLocationsMode && !POPUP_LOCATION_ID) {
  console.error('Missing POPUP_LOCATION_ID.');
  console.error('Run with --list-locations first to find it, e.g.:');
  console.error('  node --env-file=.env.popup-inventory.local scripts/activate-popup-inventory.mjs --list-locations');
  process.exit(1);
}

const ENDPOINT = `https://${SHOPIFY_STORE_DOMAIN}/admin/api/${SHOPIFY_ADMIN_API_VERSION}/graphql.json`;
const isDryRun = DRY_RUN === 'true';
const baselineQty = parseInt(BASELINE_QTY, 10);
const batchSize = Math.min(parseInt(BATCH_SIZE, 10) || 100, 250);

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function shopifyGraphQL(query, variables = {}) {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': SHOPIFY_ADMIN_ACCESS_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${await res.text()}`);
  }

  const json = await res.json();

  const throttled = json.errors?.some((e) => e.extensions?.code === 'THROTTLED');
  if (throttled) {
    console.log('  Rate limited — waiting 2s and retrying...');
    await sleep(2000);
    return shopifyGraphQL(query, variables);
  }

  if (json.errors) {
    throw new Error(`GraphQL error: ${JSON.stringify(json.errors, null, 2)}`);
  }

  return json.data;
}

// --- Step 2: identify the Pop Up location -----------------------------

async function listLocations() {
  const query = `
    query Locations {
      locations(first: 50) {
        edges {
          node { id name isActive fulfillsOnlineOrders }
        }
      }
    }
  `;
  const data = await shopifyGraphQL(query);
  console.log('\nLocations in this store:\n');
  for (const { node } of data.locations.edges) {
    console.log(`  ${node.name}${node.isActive ? '' : ' (inactive)'} — ${node.id}`);
  }
  console.log('\nCopy the "gid://shopify/Location/..." value for your Pop Up location into POPUP_LOCATION_ID.\n');
}

// --- Step 1: fetch all variants, find ones not stocked at the location -

const VARIANTS_QUERY = `
  query Variants($cursor: String, $locationId: ID!) {
    productVariants(first: 50, after: $cursor) {
      edges {
        cursor
        node {
          id
          title
          product { title handle }
          inventoryItem {
            id
            tracked
            inventoryLevel(locationId: $locationId) {
              id
            }
          }
        }
      }
      pageInfo { hasNextPage }
    }
  }
`;

async function fetchVariantsNeedingActivation(locationId) {
  const needsActivation = [];
  const skippedUntracked = [];
  let cursor = null;
  let hasNextPage = true;
  let scanned = 0;

  while (hasNextPage) {
    const data = await shopifyGraphQL(VARIANTS_QUERY, { cursor, locationId });
    const edges = data.productVariants.edges;
    scanned += edges.length;

    for (const { node } of edges) {
      const label = `${node.product.title} — ${node.title}`;
      if (!node.inventoryItem.tracked) {
        // Untracked items are treated as always available and don't need a
        // location association for Local Pickup eligibility.
        skippedUntracked.push(label);
        continue;
      }
      if (!node.inventoryItem.inventoryLevel) {
        needsActivation.push({ inventoryItemId: node.inventoryItem.id, label });
      }
    }

    hasNextPage = data.productVariants.pageInfo.hasNextPage;
    cursor = edges.length ? edges[edges.length - 1].cursor : null;
    process.stdout.write(`\r  Scanned ${scanned} variants...`);
  }
  console.log('');

  return { needsActivation, skippedUntracked, totalScanned: scanned };
}

// --- Step 3: activate + set a baseline quantity at the location --------

const SET_ON_HAND_MUTATION = `
  mutation SetOnHand($input: InventorySetOnHandQuantitiesInput!) {
    inventorySetOnHandQuantities(input: $input) {
      inventoryAdjustmentGroup { id }
      userErrors { field message }
    }
  }
`;

function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

async function activateAtLocation(items, locationId) {
  const batches = chunk(items, batchSize);
  let done = 0;

  for (const batch of batches) {
    const input = {
      reason: 'correction',
      setQuantities: batch.map((item) => ({
        inventoryItemId: item.inventoryItemId,
        locationId,
        quantity: baselineQty,
      })),
    };

    const data = await shopifyGraphQL(SET_ON_HAND_MUTATION, { input });
    const errors = data.inventorySetOnHandQuantities.userErrors;
    if (errors.length) {
      console.error('  Errors in batch:', JSON.stringify(errors, null, 2));
    }

    done += batch.length;
    console.log(`  Activated ${done}/${items.length} variants at the Pop Up location.`);
  }
}

// --- Entry point ---------------------------------------------------------

async function main() {
  if (listLocationsMode) {
    await listLocations();
    return;
  }

  console.log(`Store:         ${SHOPIFY_STORE_DOMAIN}`);
  console.log(`Location:      ${POPUP_LOCATION_ID}`);
  console.log(`Baseline qty:  ${baselineQty}`);
  console.log(`Mode:          ${isDryRun ? 'DRY RUN (no writes)' : 'LIVE — will write inventory'}`);
  console.log('');
  console.log('Scanning all product variants...\n');

  const { needsActivation, skippedUntracked, totalScanned } = await fetchVariantsNeedingActivation(POPUP_LOCATION_ID);

  console.log(`\nTotal variants scanned:          ${totalScanned}`);
  console.log(`Already stocked at Pop Up:        ${totalScanned - needsActivation.length - skippedUntracked.length}`);
  console.log(`Untracked (skipped, no action):   ${skippedUntracked.length}`);
  console.log(`Needs activation:                 ${needsActivation.length}`);

  if (needsActivation.length === 0) {
    console.log('\nNothing to do — every tracked variant is already stocked at this location.');
    return;
  }

  if (isDryRun) {
    console.log('\nDRY RUN — the following variants WOULD be activated:');
    needsActivation.forEach((v) => console.log(`  - ${v.label}`));
    console.log('\nRe-run without DRY_RUN=true to apply.');
    return;
  }

  console.log(`\nActivating ${needsActivation.length} variants at ${POPUP_LOCATION_ID} with ${baselineQty} units each...\n`);
  await activateAtLocation(needsActivation, POPUP_LOCATION_ID);
  console.log('\nDone.');
}

main().catch((err) => {
  console.error('\nScript failed:', err.message);
  process.exit(1);
});
