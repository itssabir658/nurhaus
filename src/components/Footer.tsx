'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const shopLinks  = ['Collection', 'Lookbook', 'Size Guide', 'Wishlist'];
const houseLinks = ['Our Story', 'Journal', 'Sustainability', 'Contact'];
const careLinks  = ['Shipping & Returns', 'FAQ', 'Privacy Policy', 'Terms'];

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
          className="site-max site-px py-24 md:py-32 text-center"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <p className="eyebrow-light mb-6">The Circle</p>
          <h3 className="font-display italic text-[2.4rem] md:text-[4.25rem] leading-[1.05] mb-10 max-w-2xl mx-auto">
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
      <div className="site-max site-px py-16 md:py-20">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-x-8 gap-y-14">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-2 flex flex-col justify-between">
            <div>
              <Link
                href="/"
                className="font-display font-medium uppercase tracking-[0.14em] text-[22px] leading-[0.88] inline-block mb-6"
              >
                <span className="block">NÜR</span>
                <span className="block">HAUS</span>
              </Link>
              <p className="text-sm text-primary/55 leading-relaxed max-w-[220px]">
                Modest luxury, in measured light. Made in small batches, for women who dress with intention.
              </p>
            </div>
            <div className="flex gap-6 mt-10">
              {['Instagram', 'Pinterest', 'TikTok'].map((s) => (
                <a
                  key={s}
                  href="#"
                  aria-label={s}
                  className="text-xs text-primary/55 hover:text-gold transition-colors duration-300 tracking-wide"
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns — grouped into a compact 3-up row on mobile so "Care" never
             wraps alone; the wrapper dissolves on md+ so each column is its own grid item. */}
          <div className="col-span-2 grid grid-cols-3 gap-x-6 md:contents">
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
      </div>

      {/* Ghost wordmark — pure texture, sits behind nothing, decorative */}
      <div aria-hidden="true" className="select-none pointer-events-none -mb-[2vw] -mt-4">
        <p className="font-display text-center text-primary/[0.06] text-[17vw] leading-[0.8] tracking-tight whitespace-nowrap">
          NÜRHAUS
        </p>
      </div>

      {/* Bottom bar */}
      <div className="relative border-t border-primary/15">
        <div className="site-max site-px pt-10 pb-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-primary/45">© 2026 NÜRHAUS. All rights reserved.</p>
          <p className="text-xs text-primary/45">Made in small batches.</p>
        </div>
      </div>
    </footer>
  );
}
