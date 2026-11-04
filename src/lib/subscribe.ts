/** Client helper for POST /api/subscribe. Returns an error message, or null on success. */
export async function submitSignup(input: {
  email: string;
  kind: 'newsletter' | 'waitlist';
  product?: string;
  /** Honeypot value — always empty for real visitors. */
  company?: string;
}): Promise<string | null> {
  try {
    const res = await fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    if (res.ok) return null;
    const data = (await res.json().catch(() => null)) as { error?: string } | null;
    return data?.error ?? 'Something went wrong. Please try again.';
  } catch {
    return 'Connection problem. Please try again.';
  }
}
