'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface NavigationProps {
  onCartOpen:   () => void;
  onSearchOpen: () => void;
  cartCount:    number;
}

const links = [
  { label: 'Collection', href: '/shop' },
  { label: 'Lookbook',   href: '/lookbook' },
  { label: 'Our Story',  href: '/story' },
  { label: 'Journal',    href: '/journal' },
];

const menuLinks = [
  { label: 'Collection',  href: '/shop' },
  { label: 'Lookbook',    href: '/lookbook' },
  { label: 'Our Story',   href: '/story' },
  { label: 'Journal',     href: '/journal' },
  { label: 'Size Guide',  href: '/size-guide' },
  { label: 'Shipping',    href: '/shipping' },
  { label: 'Contact',     href: '/contact' },
];

export default function Navigation({ onCartOpen, onSearchOpen, cartCount }: NavigationProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 64);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <>
      {/* Nav is offset 44px below the announcement bar */}
      <header
        className={`fixed top-[44px] inset-x-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-primary/90 backdrop-blur-md border-b border-hairline'
            : 'bg-transparent'
        }`}
      >
        <nav className="site-max site-px h-20 flex items-center justify-between gap-8">
          {/* Logo */}
          <Link
            href="/"
            className="font-display font-medium uppercase tracking-[0.14em] text-[17px] leading-[0.88] text-center"
            aria-label="NÜRHAUS home"
          >
            <span className="block">NÜR</span>
            <span className="block">HAUS</span>
          </Link>

          {/* Desktop links */}
          <ul className="hidden lg:flex items-center gap-10">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-[0.8rem] tracking-[0.08em] text-ink/75 hover:text-ink transition-colors duration-300 relative group"
                >
                  {l.label}
                  <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-accent group-hover:w-full transition-all duration-500 ease-expo" />
                </Link>
              </li>
            ))}
          </ul>

          {/* Actions */}
          <div className="flex items-center gap-5">
            <button
              onClick={onSearchOpen}
              aria-label="Open search"
              className="hidden sm:flex text-ink/70 hover:text-ink transition-colors duration-300"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="10.5" cy="10.5" r="7" />
                <path d="M16 16l4.5 4.5" strokeLinecap="round" />
              </svg>
            </button>

            <Link href="/wishlist" aria-label="Wishlist" className="hidden sm:flex text-ink/70 hover:text-ink transition-colors duration-300">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </Link>

            <Link href="/account" aria-label="Account" className="hidden sm:flex text-ink/70 hover:text-ink transition-colors duration-300">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </Link>

            <button
              onClick={onCartOpen}
              aria-label={`Cart (${cartCount} items)`}
              className="relative text-ink/70 hover:text-ink transition-colors duration-300"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-accent text-primary text-[10px] flex items-center justify-center font-medium">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              className="flex flex-col gap-[5px] p-1"
            >
              <span className="block w-5 h-px bg-ink" />
              <span className="block w-5 h-px bg-ink" />
            </button>
          </div>
        </nav>
      </header>

      {/* Fullscreen menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[80] bg-midnight flex flex-col"
          >
            {/* Header row */}
            <div className="site-px h-20 flex items-center justify-between flex-shrink-0 mt-[44px]">
              <Link
                href="/"
                onClick={() => setMenuOpen(false)}
                className="font-display font-medium uppercase tracking-[0.14em] text-[17px] leading-[0.88] text-center text-primary"
              >
                <span className="block">NÜR</span>
                <span className="block">HAUS</span>
              </Link>
              <button
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                className="text-primary/60 hover:text-primary transition-colors"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* Two-column: links + editorial image */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 overflow-hidden min-h-0">
              {/* Links column */}
              <div className="flex flex-col justify-center site-px pb-12 lg:pb-16">
                <nav className="space-y-1">
                  {menuLinks.map((l, i) => (
                    <motion.div
                      key={l.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.055, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <Link
                        href={l.href}
                        onClick={() => setMenuOpen(false)}
                        className="block font-display text-[2.4rem] sm:text-[3rem] lg:text-[2.6rem] xl:text-[3rem] text-primary/75 hover:text-primary py-1.5 transition-colors duration-300 leading-tight"
                      >
                        {l.label}
                      </Link>
                    </motion.div>
                  ))}
                </nav>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                  className="mt-12 flex flex-wrap gap-6"
                >
                  <button onClick={onSearchOpen} className="eyebrow-light hover:text-primary transition-colors">Search</button>
                  <Link href="/account" onClick={() => setMenuOpen(false)} className="eyebrow-light hover:text-primary transition-colors">Account</Link>
                  <Link href="/wishlist" onClick={() => setMenuOpen(false)} className="eyebrow-light hover:text-primary transition-colors">Wishlist</Link>
                  <button onClick={onCartOpen} className="eyebrow-light hover:text-primary transition-colors">Cart ({cartCount})</button>
                </motion.div>
              </div>

              {/* Editorial image — desktop only */}
              <div className="hidden lg:block relative overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1762605135332-8a7ce1403187?auto=format&fit=crop&w=900&q=85"
                  alt="NÜRHAUS Limited Collection"
                  fill
                  sizes="50vw"
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-midnight/35" />
                <motion.div
                  className="absolute bottom-16 left-12 right-12"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                >
                  <p className="eyebrow-light mb-4">Limited Collection</p>
                  <h3 className="font-display italic text-primary text-[2.4rem] leading-tight mb-7">
                    Now Available.
                  </h3>
                  <Link
                    href="/shop"
                    onClick={() => setMenuOpen(false)}
                    className="inline-flex items-center gap-3 text-primary/80 hover:text-primary text-sm border-b border-primary/30 hover:border-primary pb-1 transition-all duration-400"
                  >
                    Explore Collection <span className="text-base">→</span>
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
