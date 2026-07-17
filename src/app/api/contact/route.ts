import { NextResponse } from 'next/server';
import { getResend } from '@/lib/resend';

// Not statically optimizable anyway (POST handler), but explicit for clarity
// and in case this route ever grows a GET.
export const dynamic = 'force-dynamic';

const STORE_EMAIL = 'nurhausca@gmail.com';

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const name = typeof body?.name === 'string' ? body.name.trim() : '';
  const email = typeof body?.email === 'string' ? body.email.trim() : '';
  const subject = typeof body?.subject === 'string' ? body.subject.trim() : '';
  const message = typeof body?.message === 'string' ? body.message.trim() : '';

  if (!name || !email || !message) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const { data, error } = await getResend().emails.send({
    from: 'onboarding@resend.dev',
    to: STORE_EMAIL,
    replyTo: email,
    subject: subject ? `[Contact] ${subject} — ${name}` : `[Contact] New message from ${name}`,
    html: `
      <p><strong>From:</strong> ${escapeHtml(name)} (${escapeHtml(email)})</p>
      ${subject ? `<p><strong>Topic:</strong> ${escapeHtml(subject)}</p>` : ''}
      <p><strong>Message:</strong></p>
      <p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>
    `,
  });

  if (error) {
    return NextResponse.json({ error: 'Failed to send message' }, { status: 502 });
  }

  return NextResponse.json({ sent: true, id: data?.id });
}
