'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

const shopLinks  = ['Collection', 'Size Guide'];
const houseLinks = ['Our Story', 'Contact'];
const careLinks  = ['FAQ', 'Privacy Policy', 'Terms'];

const fadeUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
};

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
    <footer className="relative bg-midnight text-primary overflow-hidden">
      {/* Gold seam — the transition from the cream body into the dark footer */}
      <div className="h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />

      {/* Newsletter — large, centered, editorial */}
      <div className="border-b border-primary/15">
        <motion.div
          className="site-max site-px py-14 md:py-32 text-center"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <p className="eyebrow-light mb-6">The Circle</p>
          <h3 className="font-display text-[1.75rem] sm:text-[2.4rem] md:text-[4.25rem] leading-[1.05] mb-8 md:mb-10 max-w-2xl mx-auto">
            Quiet news, for those who prefer it that way.
          </h3>
          {submitted ? (
            <p className="text-sm text-gold">Thank you — you&apos;re on the list.</p>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-sm mx-auto">
              <div className="flex items-center border-b border-primary/30 focus-within:border-gold transition-colors duration-400">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  required
                  className="flex-1 bg-transparent py-3 text-sm text-primary placeholder:text-primary/40 outline-none font-sans text-center"
                />
                <button
                  type="submit"
                  className="text-[0.7rem] tracking-[0.18em] uppercase text-primary/80 hover:text-gold transition-colors duration-300 py-3 pl-4 font-sans font-medium flex-shrink-0"
                >
                  Join →
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>

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
                href="#"
                aria-label="Instagram"
                className="text-primary/55 hover:text-gold transition-colors duration-300"
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
                <li key={l}>
                  <Link
                    href={`/${l.toLowerCase().replace(/\s+/g, '-')}`}
                    className="text-sm text-primary/60 hover:text-primary transition-colors duration-300"
                  >
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow-light mb-5">House</p>
            <ul className="space-y-3">
              {houseLinks.map((l) => (
                <li key={l}>
                  <Link
                    href={`/${l.toLowerCase().replace(/\s+/g, '-')}`}
                    className="text-sm text-primary/60 hover:text-primary transition-colors duration-300"
                  >
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow-light mb-5">Care</p>
            <ul className="space-y-3">
              {careLinks.map((l) => (
                <li key={l}>
                  <Link
                    href={`/${l.toLowerCase().replace(/\s+\S*/g, (m) => m.replace(/\s/g, '-')).replace(/[&]/g, '')}`}
                    className="text-sm text-primary/60 hover:text-primary transition-colors duration-300"
                  >
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Ghost wordmark — full-width, flush to footer bottom */}
      <div aria-hidden="true" className="select-none pointer-events-none mt-6 pt-[0.15em]">
        <p className="text-center text-primary/[0.07] text-[19.5vw] leading-[0.82] tracking-[0.02em] whitespace-nowrap" style={{ fontFamily: 'var(--font-display)' }}>
          NÜR HAUS
        </p>
      </div>
    </footer>
  );
}
