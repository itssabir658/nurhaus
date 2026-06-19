'use client';

import { useState, useEffect, useCallback } from 'react';
import Navigation from './Navigation';
import Footer from './Footer';
import CartDrawer from './CartDrawer';
import SearchOverlay from './SearchOverlay';
import AnnouncementBar from './AnnouncementBar';
import WelcomePopup from './WelcomePopup';
import ExitIntentPopup from './ExitIntentPopup';
import WaitlistPopup from './WaitlistPopup';
import { NurhausContext } from '@/contexts/NurhausContext';
import Lenis from 'lenis';

export default function Providers({ children }: { children: React.ReactNode }) {
  const [cartOpen, setCartOpen]         = useState(false);
  const [searchOpen, setSearchOpen]     = useState(false);
  const [cartCount, setCartCount]       = useState(0);
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const [waitlistProduct, setWaitlistProduct] = useState('');

  const openWaitlist = useCallback((productName: string) => {
    setWaitlistProduct(productName);
    setWaitlistOpen(true);
  }, []);

  useEffect(() => {
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
      <AnnouncementBar />
      <Navigation
        onCartOpen={() => setCartOpen(true)}
        onSearchOpen={() => setSearchOpen(true)}
        cartCount={cartCount}
      />
      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        onCountChange={setCartCount}
      />
      <SearchOverlay
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
      />
      <WelcomePopup />
      <ExitIntentPopup />
      <WaitlistPopup
        open={waitlistOpen}
        productName={waitlistProduct}
        onClose={() => setWaitlistOpen(false)}
      />
      {/* 44px announcement bar + 80px nav = 124px total header height */}
      <main className="pt-[124px]">{children}</main>
      <Footer />
    </NurhausContext.Provider>
  );
}
