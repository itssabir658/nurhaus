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
    <footer className="relative text-ink overflow-hidden">
      {/* Stain — torn-paper texture with the embossed wordmark baked into a
          single image, shown at every breakpoint. bg-stain is a loading-state
          fallback color behind it. */}
      <div className="relative bg-stain min-h-[260px] md:min-h-[360px] overflow-hidden flex items-end justify-center">
        <Image
          src="/footer-wordmark.png"
          alt=""
          aria-hidden="true"
          width={1508}
          height={1043}
          className="select-none w-full h-auto"
        />
      </div>

      {/* Divider — back to the default light paper theme below the stain */}
      <div className="site-max site-px">
        <div className="border-t border-hairline" />
      </div>

      {/* Brand + links — refined editorial grid */}
      <div className="site-max site-px pt-12 pb-8 md:pt-16 md:pb-10">
        <div className="grid grid-cols-3 md:grid-cols-5 gap-x-6 md:gap-x-8 gap-y-10">
          {/* Brand column */}
          <div className="col-span-3 md:col-span-2">
            <Link href="/" aria-label="NÜR HAUS home" className="inline-block mb-5">
              <Image
                src="/nurhaus-logo.png"
                alt="NÜR HAUS"
                width={655}
                height={464}
                className="h-9 w-auto object-contain"
              />
            </Link>
            <p className="text-sm text-gray-700 leading-relaxed max-w-[240px]">
              Modest silhouettes, in measured light. Made in small batches, for women who dress with intention.
            </p>
            <div className="flex items-center gap-3 mt-6">
              <span className="text-[10px] tracking-widest uppercase text-accent">Find us on</span>
              <a
                href="https://www.instagram.com/nurhausco?igsh=cGs3dDd1end5c3Rs"
                aria-label="Instagram"
                className="text-gray-700 opacity-90 hover:opacity-100 transition-opacity duration-300"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5"
                  aria-hidden="true"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <p className="text-[10px] tracking-widest uppercase text-accent mb-4">Shop</p>
            <ul className="space-y-2.5">
              {shopLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-gray-700 hover:text-ink transition-colors duration-300"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[10px] tracking-widest uppercase text-accent mb-4">House</p>
            <ul className="space-y-2.5">
              {houseLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-gray-700 hover:text-ink transition-colors duration-300"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[10px] tracking-widest uppercase text-accent mb-4">Policies</p>
            <ul className="space-y-2.5">
              {careLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-gray-700 hover:text-ink transition-colors duration-300"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom credits */}
        <div className="border-t border-hairline mt-10 pt-6">
          <p className="text-center md:text-left text-[10px] tracking-widest uppercase text-accent">
            Designed &amp; Developed by{' '}
            <a
              href="https://www.itssabir.com"
              target="_blank"
              rel="noopener noreferrer"
              className="signature-pulse text-gray-700 transition-opacity duration-300"
            >
              Sabir
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
