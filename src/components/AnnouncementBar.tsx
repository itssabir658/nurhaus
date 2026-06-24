'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MESSAGES = [
  'Complimentary Worldwide Shipping on Orders Above $250',
  'Limited First Collection — Now Available',
  'Free Returns Within 14 Days',
  'New Season Drop Available Now',
  'Crafted in Limited Quantities — Each Piece Numbered',
];

export default function AnnouncementBar() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[55] flex items-center justify-center overflow-hidden"
      style={{ height: '44px', background: '#111111' }}
    >
      <AnimatePresence mode="wait">
        <motion.p
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="text-[0.56rem] sm:text-[0.64rem] tracking-[0.08em] sm:tracking-[0.14em] uppercase font-medium select-none px-4 text-center whitespace-nowrap overflow-hidden text-ellipsis max-w-full"
          style={{ color: '#F8F5F1', fontFamily: 'var(--font-sans)' }}
        >
          {MESSAGES[index]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
