'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function NewsletterBlock({ dark = false }: { dark?: boolean }) {
  const [email, setEmail]     = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const textClass    = dark ? 'text-primary' : 'text-ink';
  const subtextClass = dark ? 'text-primary/60' : 'text-smoke';
  const eyebrowClass = dark ? 'eyebrow-light' : 'eyebrow';
  const borderClass  = dark ? 'border-primary/20' : 'border-hairline';
  const inputClass   = dark
    ? 'w-full bg-transparent border-b border-primary/30 focus:border-primary pb-3 pt-1 text-sm text-primary placeholder:text-primary/40 focus:outline-none transition-colors duration-300'
    : 'input-luxury w-full';

  return (
    <div className="text-center max-w-lg mx-auto">
      <AnimatePresence mode="wait">
        {!submitted ? (
          <motion.div key="form" initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <p className={`${eyebrowClass} mb-5`}>The Circle</p>
            <h2 className={`font-display text-3xl md:text-4xl tracking-tight mb-4 ${textClass}`}>
              Enter The<br /><em>Nürhaus Circle.</em>
            </h2>
            <p className={`text-sm leading-relaxed mb-8 ${subtextClass}`}>
              Receive collection previews, editorial stories, and exclusive releases.
            </p>
            <form onSubmit={handleSubmit} className="max-w-xs mx-auto space-y-4">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className={inputClass}
              />
              <motion.button
                type="submit"
                className={`w-full border text-xs tracking-[0.16em] uppercase font-medium py-4 transition-all duration-500 ${
                  dark
                    ? 'border-primary/40 text-primary hover:bg-primary hover:text-ink'
                    : 'border-ink text-ink hover:bg-ink hover:text-primary'
                }`}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                Join The Circle
              </motion.button>
            </form>
            <p className={`text-[0.62rem] mt-4 tracking-[0.08em] ${subtextClass}`}>
              No spam. Only meaningful updates.
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className={`w-12 h-12 border flex items-center justify-center mx-auto mb-5 ${borderClass}`}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
                className={dark ? 'text-primary/70' : 'text-accent'}>
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <p className={`font-display text-2xl tracking-tight mb-2 ${textClass}`}>Welcome to the circle.</p>
            <p className={`text-sm ${subtextClass}`}>We will be in touch with something worth reading.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
