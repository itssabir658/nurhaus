'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const KEY = 'nh_exit';
const TTL = 7 * 24 * 60 * 60 * 1000;

export default function ExitIntentPopup() {
  const [visible, setVisible] = useState(false);
  const [email, setEmail]     = useState('');
  const [submitted, setSubmitted] = useState(false);

  const show = useCallback(() => {
    try {
      const last = localStorage.getItem(KEY);
      if (last && Date.now() - Number(last) < TTL) return;
      setVisible(true);
      localStorage.setItem(KEY, String(Date.now()));
    } catch { /* private browsing */ }
  }, []);

  useEffect(() => {
    const onLeave = (e: MouseEvent) => {
      if (e.clientY <= 2) show();
    };
    document.addEventListener('mouseleave', onLeave);

    let scrollFired = false;
    const onScroll = () => {
      if (scrollFired) return;
      const pct = window.scrollY / Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      if (pct >= 0.7) { scrollFired = true; show(); }
    };
    const mobileTimer = setTimeout(show, 60_000);
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      document.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('scroll', onScroll);
      clearTimeout(mobileTimer);
    };
  }, [show]);

  const close = () => setVisible(false);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <AnimatePresence>
      {visible && (
        <>
          <motion.div
            className="fixed inset-0 z-[88] bg-midnight/75"
            style={{ backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            onClick={close}
          />

          <div className="fixed inset-0 z-[88] flex items-center justify-center p-6 pointer-events-none">
            <motion.div
              className="w-full max-w-2xl bg-primary grid grid-cols-1 md:grid-cols-2 overflow-hidden relative pointer-events-auto"
              initial={{ opacity: 0, y: 36, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.97 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Image */}
              <motion.div
                className="relative hidden md:block min-h-[360px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                <Image
                  src="https://images.unsplash.com/photo-1762605135318-f34a993cbcf0?auto=format&fit=crop&w=700&q=85"
                  alt="NÜRHAUS"
                  fill
                  sizes="336px"
                  className="object-cover object-center"
                />
              </motion.div>

              {/* Content */}
              <div className="p-10 md:p-12 relative">
                <button
                  onClick={close}
                  className="absolute top-4 right-4 text-muted hover:text-ink transition-colors"
                  aria-label="Close"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>

                <AnimatePresence mode="wait">
                  {!submitted ? (
                    <motion.div key="form" initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                      <p className="eyebrow mb-5">Before You Leave</p>
                      <h2 className="font-display text-[1.8rem] tracking-tight mb-4 leading-tight">
                        Join the<br /><em>Private List.</em>
                      </h2>
                      <p className="text-sm text-smoke leading-relaxed mb-7 max-w-[220px]">
                        Receive early access to future collections before they are available to the public.
                      </p>
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Your email address"
                          className="input-luxury w-full"
                        />
                        <button type="submit" className="btn-primary w-full">
                          Join The Private List
                        </button>
                      </form>
                      <p className="text-[0.62rem] text-muted mt-4 tracking-[0.08em]">No spam. Only meaningful updates.</p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                      className="text-center py-12"
                    >
                      <motion.div
                        className="w-12 h-12 border border-hairline flex items-center justify-center mx-auto mb-5"
                        initial={{ scale: 0.7, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.1, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-accent">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </motion.div>
                      <p className="font-display text-2xl tracking-tight mb-2">You are in.</p>
                      <p className="text-sm text-smoke">We will be in touch soon.</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
