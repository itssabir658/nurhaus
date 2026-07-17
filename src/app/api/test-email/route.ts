import { NextResponse } from 'next/server';
import { getResend } from '@/lib/resend';

// GET route handlers are eligible for static optimization by default, which
// would make Next.js actually invoke this handler (and send a real email)
// during `next build`. force-dynamic disables that — it only ever runs on
// an actual request.
export const dynamic = 'force-dynamic';

// One-off test route for confirming the Resend integration works. Visit
// /api/test-email in a browser (or `curl` it) to send the sample email.
// Safe to delete once you've verified delivery.
export async function GET() {
  const { data, error } = await getResend().emails.send({
    from: 'onboarding@resend.dev',
    to: 'nurhausca@gmail.com',
    subject: 'Hello World',
    html: '<p>Congrats on sending your <strong>first email</strong>!</p>',
  });

  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }

  return NextResponse.json({ sent: true, data });
}
