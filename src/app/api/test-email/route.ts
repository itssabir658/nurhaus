import { NextResponse } from 'next/server';
import { resend } from '@/lib/resend';

// One-off test route for confirming the Resend integration works. Visit
// /api/test-email in a browser (or `curl` it) to send the sample email.
// Safe to delete once you've verified delivery.
export async function GET() {
  const { data, error } = await resend.emails.send({
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
