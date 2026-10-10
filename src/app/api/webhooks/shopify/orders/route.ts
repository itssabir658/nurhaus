import { createHmac, timingSafeEqual } from 'node:crypto';
import { NextResponse } from 'next/server';
import { sendCapiEvent } from '@/lib/meta/capi';

// node:crypto and the raw request body both require the Node runtime.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const WEBHOOK_SECRET = process.env.SHOPIFY_WEBHOOK_SECRET ?? '';

/**
 * Shopify `orders/create` → Meta Purchase.
 *
 * Purchase is sent from here rather than the browser because checkout is
 * Shopify-hosted on a different origin from this storefront, so a browser
 * pixel would miss or misattribute most orders.
 *
 * If you later install Shopify's Facebook & Instagram app, make sure it is NOT
 * also sending Purchase to this same pixel — its event IDs won't match these,
 * so the two sources would double-count rather than deduplicate.
 */

interface ShopifyLineItem {
  variant_id: number | null;
  product_id: number | null;
  quantity: number;
  price: string;
  title: string;
}

interface ShopifyOrder {
  id: number;
  admin_graphql_api_id?: string;
  email?: string | null;
  phone?: string | null;
  currency: string;
  total_price: string;
  created_at?: string;
  order_status_url?: string;
  line_items?: ShopifyLineItem[];
  customer?: {
    first_name?: string | null;
    last_name?: string | null;
  } | null;
  shipping_address?: {
    first_name?: string | null;
    last_name?: string | null;
    city?: string | null;
    province_code?: string | null;
    province?: string | null;
    zip?: string | null;
    country_code?: string | null;
  } | null;
}

function verifyShopifyHmac(rawBody: string, header: string | null): boolean {
  if (!WEBHOOK_SECRET || !header) return false;

  const expected = createHmac('sha256', WEBHOOK_SECRET)
    .update(rawBody, 'utf8')
    .digest('base64');

  const a = Buffer.from(expected);
  const b = Buffer.from(header);
  // timingSafeEqual throws on length mismatch, so check that first.
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function POST(request: Request) {
  // Must read the body as raw text — re-serialising parsed JSON changes the
  // bytes and breaks the signature.
  const rawBody = await request.text();

  if (!verifyShopifyHmac(rawBody, request.headers.get('x-shopify-hmac-sha256'))) {
    return NextResponse.json({ error: 'invalid signature' }, { status: 401 });
  }

  let order: ShopifyOrder;
  try {
    order = JSON.parse(rawBody) as ShopifyOrder;
  } catch {
    return NextResponse.json({ error: 'invalid payload' }, { status: 400 });
  }

  const lineItems = order.line_items ?? [];
  const address = order.shipping_address;

  const result = await sendCapiEvent({
    eventName: 'Purchase',
    // Stable and derived from the order, so Shopify's webhook retries
    // resolve to the same event instead of inflating purchase counts.
    eventId: `shopify_order_${order.id}`,
    eventTime: order.created_at
      ? Math.floor(new Date(order.created_at).getTime() / 1000)
      : undefined,
    eventSourceUrl: order.order_status_url,
    actionSource: 'website',
    userData: {
      email: order.email,
      phone: order.phone,
      firstName: order.customer?.first_name ?? address?.first_name,
      lastName: order.customer?.last_name ?? address?.last_name,
      city: address?.city,
      state: address?.province_code ?? address?.province,
      zip: address?.zip,
      country: address?.country_code,
    },
    customData: {
      // value and currency are REQUIRED for Purchase — without them there is
      // no ROAS and the campaign optimises blind.
      value: Number(order.total_price),
      currency: order.currency,
      content_type: 'product',
      content_ids: lineItems.map((li) => String(li.variant_id ?? li.product_id ?? '')),
      contents: lineItems.map((li) => ({
        id: String(li.variant_id ?? li.product_id ?? ''),
        quantity: li.quantity,
        item_price: Number(li.price),
      })),
      num_items: lineItems.reduce((sum, li) => sum + li.quantity, 0),
      order_id: String(order.id),
    },
  });

  if (!result.ok) {
    console.error('[shopify/orders] CAPI send failed', result.error);
  }

  // Always 200. A non-2xx makes Shopify retry, which would re-send the event;
  // the error is logged above instead.
  return NextResponse.json({ received: true, forwarded: result.ok });
}
