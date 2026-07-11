'use client';

import Link from 'next/link';
import Image from 'next/image';

const shopLinks  = [
  { label: 'Collection',  href: '/shop' },
];
const houseLinks = [
  { label: 'Our Story', href: '/story' },
  { label: 'Contact',   href: '/contact' },
];
const careLinks  = [
  { label: 'FAQ',             href: '/faq' },
  { label: 'Shipping & Returns', href: '/shipping' },
];

export default function Footer() {
  return (
    <footer className="footer-grain relative bg-midnight text-primary overflow-hidden">
      {/* Gold seam — the transition from the cream body into the dark footer */}
      <div className="h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />

      {/* Brand + links */}
      <div className="site-max site-px pt-6 pb-16 md:pb-20">
        {/* Logo — above the grid so description aligns with column headings */}
        <Link href="/" aria-label="NÜR HAUS home" className="inline-block mb-10">
          <Image
            src="/nurhaus-logo.png"
            alt="NÜR HAUS"
            width={64}
            height={48}
            className="h-12 w-auto object-contain invert"
          />
        </Link>

        <div className="grid grid-cols-3 md:grid-cols-5 gap-x-6 md:gap-x-8 gap-y-10 md:gap-y-14">
          {/* Brand column */}
          <div className="col-span-3 md:col-span-2 flex flex-col justify-between">
            <div>
              <p className="text-sm text-primary/55 leading-relaxed max-w-[220px]">
                Modest luxury, in measured light. Made in small batches, for women who dress with intention.
              </p>
            </div>
            <div className="flex items-center gap-3 mt-10">
              <span className="text-xs text-primary/45 tracking-wide">Find us on</span>
              <a
                href="https://www.instagram.com/nurhausco?igsh=cGs3dDd1end5c3Rs"
                aria-label="Instagram"
                className="text-primary/55 hover:text-gold transition-colors duration-300"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <p className="eyebrow-light mb-5">Shop</p>
            <ul className="space-y-3">
              {shopLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-primary/60 hover:text-primary transition-colors duration-300"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow-light mb-5">House</p>
            <ul className="space-y-3">
              {houseLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-primary/60 hover:text-primary transition-colors duration-300"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow-light mb-5">Care</p>
            <ul className="space-y-3">
              {careLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-primary/60 hover:text-primary transition-colors duration-300"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Embossed wordmark — full-width, flush to footer bottom, carved
          into the cardstock via a static top-left highlight / bottom-right shadow. */}
      <div aria-hidden="true" className="select-none mt-6 pt-[0.15em]">
        <p
          className="wordmark-emboss text-center text-[19.5vw] leading-[0.82] tracking-[0.02em] whitespace-nowrap"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          NÜR HAUS
        </p>
      </div>
    </footer>
  );
}
