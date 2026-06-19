'use client';

import { useState } from 'react';
import Link from 'next/link';

const shopLinks  = ['Collection', 'Lookbook', 'Size Guide', 'Wishlist'];
const houseLinks = ['Our Story', 'Journal', 'Sustainability', 'Contact'];
const careLinks  = ['Shipping & Returns', 'FAQ', 'Privacy Policy', 'Terms'];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    setEmail('');
  };

  return (
    <footer className="border-t border-hairline bg-primary">
      {/* Top band */}
      <div className="site-max site-px pt-20 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
          {/* Newsletter */}
          <div>
            <p className="eyebrow mb-5">The List</p>
            <h3 className="font-display text-3xl md:text-4xl leading-tight mb-8 max-w-sm">
              Be the first to know.
            </h3>
            {submitted ? (
              <p className="text-sm text-accent">Thank you — you&apos;re on the list.</p>
            ) : (
              <form onSubmit={handleSubmit} className="max-w-sm">
                <div className="flex items-center border-b border-hairline focus-within:border-accent transition-colors duration-400">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address"
                    required
                    className="flex-1 bg-transparent py-3 text-sm text-ink placeholder:text-muted outline-none font-sans"
                  />
                  <button
                    type="submit"
                    className="text-[0.7rem] tracking-[0.18em] uppercase text-ink hover:text-accent transition-colors duration-300 py-3 pl-4 font-sans font-medium"
                  >
                    Join →
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Links */}
          <div className="grid grid-cols-3 gap-8">
            <div>
              <p className="eyebrow mb-5">Shop</p>
              <ul className="space-y-3">
                {shopLinks.map((l) => (
                  <li key={l}>
                    <Link
                      href={`/${l.toLowerCase().replace(/\s+/g, '-')}`}
                      className="text-sm text-smoke hover:text-ink transition-colors duration-300"
                    >
                      {l}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="eyebrow mb-5">House</p>
              <ul className="space-y-3">
                {houseLinks.map((l) => (
                  <li key={l}>
                    <Link
                      href={`/${l.toLowerCase().replace(/\s+/g, '-')}`}
                      className="text-sm text-smoke hover:text-ink transition-colors duration-300"
                    >
                      {l}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="eyebrow mb-5">Care</p>
              <ul className="space-y-3">
                {careLinks.map((l) => (
                  <li key={l}>
                    <Link
                      href={`/${l.toLowerCase().replace(/\s+\S*/g, (m) => m.replace(/\s/g, '-')).replace(/[&]/g, '')}`}
                      className="text-sm text-smoke hover:text-ink transition-colors duration-300"
                    >
                      {l}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-hairline">
        <div className="site-max site-px py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link
            href="/"
            className="font-display font-medium uppercase tracking-[0.14em] text-[13px] leading-[0.88] text-center"
          >
            <span className="block">NÜR</span>
            <span className="block">HAUS</span>
          </Link>
          <div className="flex gap-6">
            {['Instagram', 'Pinterest', 'TikTok'].map((s) => (
              <a
                key={s}
                href="#"
                aria-label={s}
                className="text-xs text-smoke hover:text-ink transition-colors duration-300 tracking-wide"
              >
                {s}
              </a>
            ))}
          </div>
          <p className="text-xs text-muted">© 2026 NÜRHAUS. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
