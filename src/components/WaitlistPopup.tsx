'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  open:        boolean;
  productName: string;
  onClose:     () => void;
}

export default function WaitlistPopup({ open, productName, onClose }: Props) {
  const [email, setEmail]         = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => { setSubmitted(false); setEmail(''); }, 500);
      return () => clearTimeout(t);
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[90] bg-midnight/72"
            style={{ backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={onClose}
          />

          <div className="fixed inset-0 z-[90] flex items-center justify-center p-6 pointer-events-none">
            <motion.div
              className="w-full max-w-md bg-primary p-10 md:p-12 relative pointer-events-auto"
              initial={{ opacity: 0, y: 32, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.97 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              <button
                onClick={onClose}
                className="absolute top-5 right-5 text-muted hover:text-ink transition-colors"
                aria-label="Close"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>

              <AnimatePresence mode="wait">
                {!submitted ? (
                  <motion.div key="form" initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                    <p className="eyebrow mb-5">This Piece Will Return</p>
                    <h2 className="font-display text-[1.9rem] tracking-tight mb-2 leading-tight">
                      Join the<br /><em>Waiting List.</em>
                    </h2>
                    {productName && (
                      <p className="text-sm text-accent mb-5 tracking-wide">{productName}</p>
                    )}
                    <p className="text-sm text-smoke leading-relaxed mb-8 max-w-xs">
                      Receive priority access when this piece becomes available again. No commitment required.
                    </p>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Your email address"
                        className="input-luxury w-full"
                        autoFocus
                      />
                      <button type="submit" className="btn-primary w-full">
                        Notify Me
                      </button>
                    </form>
                    <p className="text-[0.62rem] text-muted mt-4 tracking-[0.08em]">
                      You will only be contacted about this piece.
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="text-center py-8"
                  >
                    <motion.div
                      className="w-14 h-14 border border-hairline flex items-center justify-center mx-auto mb-6"
                      initial={{ scale: 0.7, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="text-accent">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </motion.div>
                    <p className="font-display text-2xl tracking-tight mb-2">You are on the list.</p>
                    <p className="text-sm text-smoke leading-relaxed max-w-xs mx-auto">
                      We will notify you the moment this piece returns.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
