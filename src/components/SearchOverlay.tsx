'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import type { AppProduct } from '@/lib/shopify/types';

interface SearchOverlayProps {
  open:     boolean;
  onClose:  () => void;
  products: AppProduct[];
}

const RECENT = ['Abaya', 'Dress'];

export default function SearchOverlay({ open, onClose, products }: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const results = query.length > 1
    ? products.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()))
    : [];

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 200);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setQuery('');
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[90] bg-primary/97 backdrop-blur-md overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-label="Search"
        >
          {/* Header */}
          <div className="site-px h-20 flex items-center justify-between max-w-5xl mx-auto">
            <p className="eyebrow">Search</p>
            <button
              onClick={onClose}
              aria-label="Close search"
              className="text-smoke hover:text-ink transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* Search input */}
          <div className="max-w-5xl mx-auto site-px py-8 border-b border-hairline">
            <div className="flex items-center gap-4">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-muted flex-shrink-0">
                <circle cx="10.5" cy="10.5" r="7" />
                <path d="M16 16l4.5 4.5" strokeLinecap="round" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search the collection…"
                className="flex-1 bg-transparent font-display text-3xl md:text-4xl text-ink placeholder:text-muted/50 outline-none"
              />
              {query && (
                <button onClick={() => setQuery('')} className="text-muted hover:text-smoke transition-colors">
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Results or defaults */}
          <div className="max-w-5xl mx-auto site-px py-12">
            {query.length > 1 ? (
              <div>
                <p className="eyebrow mb-8">{results.length} Result{results.length !== 1 && 's'}</p>
                {results.length === 0 ? (
                  <p className="text-smoke text-sm">No results for &ldquo;{query}&rdquo;</p>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {results.map((p) => (
                      <Link
                        key={p.handle}
                        href={`/products/${p.handle}`}
                        onClick={onClose}
                        className="group"
                      >
                        <div className="product-card-img aspect-[3/4] mb-3">
                          {p.images[0] && (
                            <Image src={p.images[0]} alt={p.name} width={200} height={266} className="w-full h-full object-cover" />
                          )}
                        </div>
                        <p className="font-display text-base">{p.name}</p>
                        <p className="text-sm text-smoke mt-0.5">${p.price.toLocaleString()}</p>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                {/* Recent searches */}
                <div>
                  <p className="eyebrow mb-6">Recent Searches</p>
                  <div className="flex flex-wrap gap-2">
                    {RECENT.map((r) => (
                      <button
                        key={r}
                        onClick={() => setQuery(r)}
                        className="px-4 py-2 border border-hairline text-sm text-smoke hover:border-accent hover:text-ink transition-all duration-300"
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Trending */}
                {products.length > 0 && (
                  <div>
                    <p className="eyebrow mb-6">The Collection</p>
                    <ul className="space-y-4">
                      {products.slice(0, 4).map((p) => (
                        <li key={p.handle}>
                          <Link
                            href={`/products/${p.handle}`}
                            onClick={onClose}
                            className="flex items-center gap-4 group"
                          >
                            <div className="w-12 h-16 product-card-img flex-shrink-0">
                              {p.images[0] && (
                                <Image src={p.images[0]} alt={p.name} width={48} height={64} className="w-full h-full object-cover" />
                              )}
                            </div>
                            <div>
                              <p className="text-sm text-ink group-hover:text-accent transition-colors duration-300 font-medium">{p.name}</p>
                              <p className="text-xs text-muted mt-0.5">${p.price.toLocaleString()}</p>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
