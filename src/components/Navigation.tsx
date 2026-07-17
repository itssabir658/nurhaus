'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/contexts/CartContext';

interface NavigationProps {
  onCartOpen:   () => void;
  onSearchOpen: () => void;
}

const links = [
  { label: 'Collection', href: '/shop' },
];

const menuLinks = [
  { label: 'Collection',  href: '/shop' },
  { label: 'Our Story',   href: '/story' },
  { label: 'Contact',     href: '/contact' },
];

// Editorial slideshow in the menu overlay — auto-advances only, no manual controls.
const MENU_SLIDES = [
  '/menu-slides/1.jpg',
  '/menu-slides/2.jpg',
  '/menu-slides/3.jpg',
  '/menu-slides/4.jpg',
  '/menu-slides/5.jpg',
  '/menu-slides/6.jpg',
  '/menu-slides/7.jpg',
  '/menu-slides/8.jpg',
];

export default function Navigation({ onCartOpen, onSearchOpen }: NavigationProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuSlide, setMenuSlide] = useState(0);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const { cart } = useCart();
  const cartCount = cart?.totalQuantity ?? 0;

  // Advances the menu-overlay slideshow automatically while it's open. Resets to
  // the first slide on close so it doesn't resume mid-cycle next time.
  useEffect(() => {
    if (!menuOpen) {
      setMenuSlide(0);
      return;
    }
    const id = setInterval(() => {
      setMenuSlide((i) => (i + 1) % MENU_SLIDES.length);
    }, 4500);
    return () => clearInterval(id);
  }, [menuOpen]);

  // Toggles the header background once the page scrolls past 64px. Uses an
  // IntersectionObserver against a tiny sentinel instead of a scroll listener —
  // the observer only fires when the threshold is actually crossed, rather than
  // running a handler on every single scroll pixel/frame.
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <>
      {/* Scroll sentinel — sits in normal document flow (scrolls with the page,
          unlike the fixed header below) at the 64px threshold. Observed instead
          of listening to the scroll event directly. */}
      <div ref={sentinelRef} aria-hidden="true" className="absolute top-16 h-px w-px pointer-events-none" />

      {/* Nav is offset 44px below the announcement bar */}
      <header
        className={`fixed top-[44px] inset-x-0 z-50 backdrop-blur-xl transition-all duration-500 ${
          scrolled
            ? 'bg-primary/70 border-b border-hairline'
            : 'bg-primary/30'
        }`}
      >
        <nav className="site-max site-px h-20 flex items-center justify-between gap-8">
          {/* Logo */}
          <Link href="/" aria-label="NÜR HAUS home">
            <img
              src="/nurhaus-logo.svg"
              alt="NÜR HAUS"
              width={64}
              height={48}
              className="h-12 w-auto object-contain"
            />
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
            className="fixed inset-0 z-[80] bg-midnight overflow-hidden"
          >
            {/* Header row — floats above the editorial image instead of pushing it down */}
            <div className="absolute top-0 inset-x-0 z-10 site-px h-20 flex items-center justify-between mt-[44px]">
              <Link href="/" onClick={() => setMenuOpen(false)} aria-label="NÜR HAUS home">
                <img
                  src="/nurhaus-logo.svg"
                  alt="NÜR HAUS"
                  width={64}
                  height={48}
                  className="h-12 w-auto object-contain invert"
                />
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

            {/* Two-column: links + editorial image — full height, edge to edge */}
            <div className="h-full grid grid-cols-1 lg:grid-cols-2 overflow-hidden">
              {/* Links column */}
              <div className="flex flex-col justify-center site-px pt-[124px] pb-12 lg:pb-16">
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
                  <button onClick={onCartOpen} className="eyebrow-light hover:text-primary transition-colors">Cart ({cartCount})</button>
                </motion.div>
              </div>

              {/* Editorial image — desktop only, auto-advancing slideshow (no manual controls) */}
              <div className="hidden lg:block relative overflow-hidden">
                <AnimatePresence mode="sync">
                  <motion.div
                    key={menuSlide}
                    className="absolute inset-0"
                    initial={{ opacity: 0, scale: 1.06 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{
                      opacity: { duration: 1.8, ease: [0.22, 1, 0.36, 1] },
                      scale: { duration: 4.5, ease: 'linear' },
                    }}
                  >
                    <Image
                      src={MENU_SLIDES[menuSlide]}
                      alt="NÜR HAUS Limited Collection"
                      fill
                      sizes="50vw"
                      priority={menuSlide === 0}
                      className="object-cover object-center"
                    />
                  </motion.div>
                </AnimatePresence>
                <div className="absolute inset-0 bg-midnight/35" />
                <motion.div
                  className="absolute bottom-16 left-12 right-12"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                >
                  <p className="eyebrow-light mb-4">Limited Collection</p>
                  <h3 className="font-display text-primary text-[2.4rem] leading-tight mb-7">
                    Chapter Ⅰ
                  </h3>
                  <Link
                    href="/shop"
                    onClick={() => setMenuOpen(false)}
                    className="inline-flex items-center gap-3 text-primary/80 hover:text-primary text-sm border-b border-primary/30 hover:border-primary pb-1 transition-all duration-400"
                  >
                    Now Available <span className="text-base">→</span>
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
