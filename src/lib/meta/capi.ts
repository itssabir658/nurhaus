import { createHash } from 'node:crypto';
import { META_PIXEL_ID } from './config';

// Server-only. Never import this from a client component — it reads the
// Conversions API access token.

const ACCESS_TOKEN = process.env.META_CAPI_ACCESS_TOKEN ?? '';
const API_VERSION = process.env.META_API_VERSION ?? 'v21.0';
// Set only while verifying in Events Manager → Test Events. Leave unset in
// production: events sent with a test code are excluded from optimisation.
const TEST_EVENT_CODE = process.env.META_TEST_EVENT_CODE;

export const capiEnabled = META_PIXEL_ID.length > 0 && ACCESS_TOKEN.length > 0;

/** Meta requires lowercase, trimmed, SHA-256 hex for all PII fields. */
function hash(value: string | null | undefined): string | undefined {
  if (!value) return undefined;
  const normalised = value.trim().toLowerCase();
  if (!normalised) return undefined;
  return createHash('sha256').update(normalised).digest('hex');
}

/** Phone numbers hash digits-only, country code included, no punctuation. */
function hashPhone(value: string | null | undefined): string | undefined {
  if (!value) return undefined;
  const digits = value.replace(/\D/g, '');
  if (!digits) return undefined;
  return createHash('sha256').update(digits).digest('hex');
}

export interface CapiUserData {
  email?: string | null;
  phone?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
  country?: string | null;
  clientIpAddress?: string | null;
  clientUserAgent?: string | null;
  /** _fbp cookie, when it can be captured. Materially lifts match quality. */
  fbp?: string | null;
  /** _fbc cookie, derived from the fbclid on the landing URL. */
  fbc?: string | null;
}

export interface CapiEvent {
  eventName: 'Purchase' | 'ViewContent' | 'AddToCart' | 'InitiateCheckout';
  /** Must match the browser event_id when the same event is sent from both sides. */
  eventId: string;
  eventTime?: number;
  eventSourceUrl?: string;
  actionSource?: 'website' | 'system_generated';
  userData: CapiUserData;
  customData?: Record<string, unknown>;
}

function buildUserData(u: CapiUserData): Record<string, unknown> {
  // Meta expects arrays for the hashed identifiers.
  const wrap = (v: string | undefined) => (v ? [v] : undefined);

  const payload: Record<string, unknown> = {
    em: wrap(hash(u.email)),
    ph: wrap(hashPhone(u.phone)),
    fn: wrap(hash(u.firstName)),
    ln: wrap(hash(u.lastName)),
    ct: wrap(hash(u.city?.replace(/\s/g, ''))),
    st: wrap(hash(u.state)),
    zp: wrap(hash(u.zip?.replace(/\s/g, ''))),
    country: wrap(hash(u.country)),
    client_ip_address: u.clientIpAddress ?? undefined,
    client_user_agent: u.clientUserAgent ?? undefined,
    fbp: u.fbp ?? undefined,
    fbc: u.fbc ?? undefined,
  };

  for (const key of Object.keys(payload)) {
    if (payload[key] === undefined) delete payload[key];
  }
  return payload;
}

/**
 * Posts a single event to the Conversions API.
 *
 * Never throws: a tracking failure must not fail the caller (an order webhook
 * that 500s gets retried by Shopify, which would double-send the event).
 */
export async function sendCapiEvent(
  event: CapiEvent,
): Promise<{ ok: boolean; status?: number; error?: string }> {
  if (!capiEnabled) {
    return { ok: false, error: 'META_CAPI_ACCESS_TOKEN or NEXT_PUBLIC_META_PIXEL_ID not set' };
  }

  const body: Record<string, unknown> = {
    data: [
      {
        event_name: event.eventName,
        event_time: event.eventTime ?? Math.floor(Date.now() / 1000),
        event_id: event.eventId,
        event_source_url: event.eventSourceUrl,
        action_source: event.actionSource ?? 'website',
        user_data: buildUserData(event.userData),
        custom_data: event.customData,
      },
    ],
  };
  if (TEST_EVENT_CODE) body.test_event_code = TEST_EVENT_CODE;

  const url = `https://graph.facebook.com/${API_VERSION}/${META_PIXEL_ID}/events?access_token=${encodeURIComponent(ACCESS_TOKEN)}`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      cache: 'no-store',
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      console.error('[meta/capi] rejected', res.status, text.slice(0, 500));
      return { ok: false, status: res.status, error: text.slice(0, 500) };
    }
    return { ok: true, status: res.status };
  } catch (err) {
    console.error('[meta/capi] request failed', err);
    return { ok: false, error: err instanceof Error ? err.message : 'unknown error' };
  }
}
