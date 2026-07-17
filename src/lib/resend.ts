import { Resend } from 'resend';

// Server-only — never import this from a Client Component. The API key must
// stay out of the browser bundle, so this file (and anything using it) can
// only run in Server Components, Route Handlers, or Server Actions.
if (typeof window !== 'undefined') {
  throw new Error('src/lib/resend.ts was imported into client code — the Resend API key must never reach the browser.');
}

// Lazily constructed — Next.js's build-time "Collecting page data" step
// imports every route module, which would eagerly run `new Resend(...)` and
// crash the whole production build if RESEND_API_KEY isn't set in that
// environment yet. Deferring construction until a request actually needs it
// means a missing key only fails the request, not the deploy.
let client: Resend | null = null;

export function getResend(): Resend {
  if (!client) {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY is not set. Add it in your environment (Vercel: Project Settings > Environment Variables).');
    }
    client = new Resend(process.env.RESEND_API_KEY);
  }
  return client;
}
