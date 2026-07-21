'use client';

import { useState, useEffect, useCallback } from 'react';
import Navigation from './Navigation';
import Footer from './Footer';
import CartDrawer from './CartDrawer';
import SearchOverlay from './SearchOverlay';
import AnnouncementBar from './AnnouncementBar';
import { NurhausContext } from '@/contexts/NurhausContext';
import { CartProvider } from '@/contexts/CartContext';
import { GeoProvider } from '@/contexts/GeoContext';
import type { AppProduct } from '@/lib/shopify/types';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function Providers({
  children,
  searchProducts = [],
  visitorCountry = null,
}: {
  children: React.ReactNode;
  searchProducts?: AppProduct[];
  visitorCountry?: string | null;
}) {
  const isUSVisitor = visitorCountry === 'US';
  const isCanadaVisitor = visitorCountry === 'CA';
  const [cartOpen, setCartOpen]     = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const openWaitlist = useCallback((_productName: string) => {}, []);
  const openCart = useCallback(() => setCartOpen(true), []);

  useEffect(() => {
    const isMobile = window.matchMedia('(max-width: 768px)').matches;

    // Disable Lenis on mobile to allow native scrolling and address bar hiding
    if (isMobile) return;

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    // Keep GSAP's ScrollTrigger in sync with Lenis's virtualized scroll position.
    // Without this, Lenis and ScrollTrigger each run their own independent
    // scroll-tracking loop and fight over the same frame — the root cause of
    // the multi-second freezes on scroll.
    lenis.on('scroll', ScrollTrigger.update);

    // Drive Lenis off GSAP's shared ticker instead of a second, separate
    // requestAnimationFrame loop, so there's exactly one scroll-driven
    // animation frame per tick across the whole app.
    const update = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(update);
      lenis.destroy();
    };
  }, []);

  return (
    <GeoProvider value={{ isUSVisitor, isCanadaVisitor }}>
      <NurhausContext.Provider value={{ openWaitlist, openCart }}>
        <CartProvider>
          {!isUSVisitor && <AnnouncementBar />}
          <Navigation
            onCartOpen={() => setCartOpen(true)}
            onSearchOpen={() => setSearchOpen(true)}
          />
          <CartDrawer
            open={cartOpen}
            onClose={() => setCartOpen(false)}
          />
          <SearchOverlay
            open={searchOpen}
            onClose={() => setSearchOpen(false)}
            products={searchProducts}
          />
          {/* 44px announcement bar + 80px nav = 124px total header height */}
          <main className="pt-[124px]">{children}</main>
          <Footer />
        </CartProvider>
      </NurhausContext.Provider>
    </GeoProvider>
  );
}
