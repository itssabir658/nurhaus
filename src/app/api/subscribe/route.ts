import { NextResponse } from 'next/server';
import { isShopifyAdminConfigured, upsertCustomerSignup } from '@/lib/shopify/admin';
import { getResend } from '@/lib/resend';

export const dynamic = 'force-dynamic';

const STORE_EMAIL = 'nurhausca@gmail.com';
// Deliberately strict: no quotes or spaces, so it is also safe inside the
// customer search query string.
const EMAIL_RE = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const HANDLE_RE = /^[a-z0-9-]{1,80}$/;

/**
 * Email sign-ups from the storefront.
 *
 * - kind "newsletter": Shopify customer tagged `newsletter`, subscribed to
 *   email marketing (so they appear in Shopify Email / Marketing audiences).
 * - kind "waitlist": Shopify customer tagged `waitlist` and
 *   `waitlist-<product-handle>`. NOT subscribed to marketing; the form
 *   promises they'll only hear about that piece.
 *
 * Until SHOPIFY_ADMIN_ACCESS_TOKEN is set, each sign-up is emailed to the
 * store instead, so nobody who signs up is lost.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';
  const kind = body?.kind === 'waitlist' ? 'waitlist' : 'newsletter';
  const product = typeof body?.product === 'string' ? body.product.trim().toLowerCase() : '';

  // Honeypot: real visitors never see or fill this field.
  if (typeof body?.company === 'string' && body.company.trim() !== '') {
    return NextResponse.json({ ok: true });
  }
  if (!EMAIL_RE.test(email) || email.length > 254) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
  }
  if (kind === 'waitlist' && !HANDLE_RE.test(product)) {
    return NextResponse.json({ error: 'Missing product.' }, { status: 400 });
  }

  const tags = kind === 'newsletter' ? ['newsletter', 'website-signup'] : ['waitlist', `waitlist-${product}`];

  if (isShopifyAdminConfigured) {
    try {
      await upsertCustomerSignup({ email, tags, subscribe: kind === 'newsletter' });
      return NextResponse.json({ ok: true });
    } catch (err) {
      console.error('[subscribe] Shopify sign-up failed', err);
      // Fall through to the email fallback so the sign-up is not lost.
    }
  }

  try {
    const { error } = await getResend().emails.send({
      from: 'onboarding@resend.dev',
      to: STORE_EMAIL,
      subject:
        kind === 'newsletter'
          ? `[Newsletter] New sign-up: ${email}`
          : `[Waiting list] ${product}: ${email}`,
      html:
        kind === 'newsletter'
          ? `<p><strong>${email}</strong> joined the Nürhaus Circle on the website and agreed to receive marketing emails.</p><p>Add them in Shopify admin (Customers) with email marketing set to subscribed.</p>`
          : `<p><strong>${email}</strong> joined the waiting list for <strong>${product}</strong>.</p><p>They asked to be contacted only about this piece.</p>`,
    });
    if (error) throw new Error(error.message);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[subscribe] email fallback failed', err);
    return NextResponse.json({ error: 'Something went wrong. Please try again in a moment.' }, { status: 502 });
  }
}
