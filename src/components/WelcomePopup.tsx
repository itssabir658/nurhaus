'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

const KEY = 'nh_welcome';
const TTL = 30 * 24 * 60 * 60 * 1000;

export default function WelcomePopup() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const last = localStorage.getItem(KEY);
    if (last && Date.now() - Number(last) < TTL) return;
    const t = setTimeout(() => {
      setVisible(true);
      localStorage.setItem(KEY, String(Date.now()));
    }, 5000);
    return () => clearTimeout(t);
  }, []);

  const close = () => setVisible(false);

  return (
    <AnimatePresence>
      {visible && (
        <>
          <motion.div
            className="fixed inset-0 z-[85] bg-midnight/65"
            style={{ backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            onClick={close}
          />
          <div className="fixed inset-0 z-[85] flex items-center justify-center p-6 pointer-events-none">
            <motion.div
              className="w-full max-w-[480px] bg-primary overflow-hidden relative pointer-events-auto"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <button
                onClick={close}
                className="absolute top-4 right-4 z-10 w-8 h-8 bg-primary/80 flex items-center justify-center text-ink/50 hover:text-ink transition-colors"
                aria-label="Close"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>

              {/* Hero image */}
              <motion.div
                className="relative h-56 overflow-hidden"
                initial={{ scale: 1.08 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              >
                <Image
                  src="https://images.unsplash.com/photo-1760083545495-b297b1690672?auto=format&fit=crop&w=960&q=85"
                  alt="NÜRHAUS Collection"
                  fill
                  sizes="480px"
                  className="object-cover object-top"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-primary/50" />
              </motion.div>

              {/* Content */}
              <div className="px-8 pb-8 pt-7">
                <p className="eyebrow mb-3">Welcome</p>
                <h2 className="font-display text-[2rem] tracking-tight mb-3 leading-tight">
                  Welcome to<br /><em>NÜRHAUS.</em>
                </h2>
                <p className="text-sm text-smoke leading-relaxed mb-7 max-w-xs">
                  Discover our debut collection of timeless abayas and dresses crafted for modern elegance.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    href="/shop"
                    onClick={close}
                    className="btn-primary flex-1 text-center"
                  >
                    Explore Collection
                  </Link>
                  <button
                    onClick={close}
                    className="btn-outline flex-1 text-sm py-3"
                  >
                    Continue Browsing
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
