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
  { label: 'Refund Policy', href: '/shipping' },
  { label: 'Shipping Policy', href: '/shipping-policy' },
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
          <img
            src="/nurhaus-logo.svg"
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
                Modest silhouettes, in measured light. Made in small batches, for women who dress with intention.
              </p>
            </div>
            <div className="flex items-center gap-3 mt-10">
              <span className="text-xs text-primary/45 tracking-wide">Find us on</span>
              <a
                href="https://www.instagram.com/nurhausco?igsh=cGs3dDd1end5c3Rs"
                aria-label="Instagram"
                className="opacity-90 hover:opacity-100 transition-opacity duration-300"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src="/instagram-logo.png"
                  alt="Instagram"
                  width={24}
                  height={24}
                  className="w-6 h-6 object-contain rounded-md"
                />
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
            <p className="eyebrow-light mb-5">Policies</p>
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
          className="wordmark-emboss text-center text-[17vw] leading-[0.82] tracking-[0.02em] whitespace-nowrap"
          style={{ fontFamily: 'var(--font-felixti)' }}
        >
          NÜR HAUS
        </p>
      </div>
    </footer>
  );
}
