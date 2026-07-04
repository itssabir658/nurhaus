'use client';

import { useState, useEffect, useCallback } from 'react';
import Navigation from './Navigation';
import Footer from './Footer';
import CartDrawer from './CartDrawer';
import SearchOverlay from './SearchOverlay';
import AnnouncementBar from './AnnouncementBar';
import { NurhausContext } from '@/contexts/NurhausContext';
import { CartProvider } from '@/contexts/CartContext';
import type { AppProduct } from '@/lib/shopify/types';
import Lenis from 'lenis';

export default function Providers({
  children,
  searchProducts = [],
}: {
  children: React.ReactNode;
  searchProducts?: AppProduct[];
}) {
  const [cartOpen, setCartOpen]     = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const openWaitlist = useCallback((_productName: string) => {}, []);

  useEffect(() => {
    const isMobile = window.matchMedia('(max-width: 768px)').matches;

    // Disable Lenis on mobile to allow native scrolling and address bar hiding
    if (isMobile) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    const id = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(id);
      lenis.destroy();
    };
  }, []);

  return (
    <NurhausContext.Provider value={{ openWaitlist }}>
      <CartProvider>
        <AnnouncementBar />
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
  );
}
