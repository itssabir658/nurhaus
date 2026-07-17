import { Resend } from 'resend';

// Server-only — never import this from a Client Component. The API key must
// stay out of the browser bundle, so this file (and anything using it) can
// only run in Server Components, Route Handlers, or Server Actions.
if (typeof window !== 'undefined') {
  throw new Error('src/lib/resend.ts was imported into client code — the Resend API key must never reach the browser.');
}

export const resend = new Resend(process.env.RESEND_API_KEY);
