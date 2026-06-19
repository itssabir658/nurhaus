'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

const ALL_PRODUCTS = [
  { name: 'The Sahar Abaya',  category: 'Abaya',  price: '$680', handle: 'sahar-abaya',  image: 'https://images.unsplash.com/photo-1760083545495-b297b1690672?auto=format&fit=crop&w=400&q=80' },
  { name: 'The Noor Dress',   category: 'Dress',  price: '$420', handle: 'noor-dress',   image: 'https://images.unsplash.com/photo-1762605135318-f34a993cbcf0?auto=format&fit=crop&w=400&q=80' },
  { name: 'The Layl Abaya',   category: 'Abaya',  price: '$720', handle: 'layl-abaya',   image: 'https://images.unsplash.com/photo-1772474500365-c2c520545f44?auto=format&fit=crop&w=400&q=80' },
  { name: 'The Dunya Dress',  category: 'Dress',  price: '$390', handle: 'dunya-dress',  image: 'https://images.unsplash.com/photo-1764179690247-df7f4014def7?auto=format&fit=crop&w=400&q=80' },
  { name: 'The Layla Dress',  category: 'Dress',  price: '$455', handle: 'layla-dress',  image: 'https://images.unsplash.com/photo-1762605135332-8a7ce1403187?auto=format&fit=crop&w=400&q=80' },
  { name: 'The Zahra Dress',  category: 'Dress',  price: '$470', handle: 'zahra-dress',  image: 'https://images.unsplash.com/photo-1772714601004-23b94ae3913d?auto=format&fit=crop&w=400&q=80' },
];

const TRENDING  = ['Sahar Abaya', 'Dusk dresses', 'Ivory collection', 'New arrivals'];
const RECENTS   = ['The Noor Dress', 'Abaya sizes'];

export default function SearchPage() {
  const [query, setQuery]     = useState('');
  const inputRef              = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const results = query.length > 1
    ? ALL_PRODUCTS.filter((p) =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const hasResults = results.length > 0;
  const noResults  = query.length > 1 && !hasResults;

  return (
    <div className="page-enter min-h-screen">
      {/* Search input hero */}
      <div className="border-b border-hairline bg-primary">
        <div className="site-max site-px pt-16 pb-12">
          <motion.p className="eyebrow mb-6" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            Search
          </motion.p>
          <div className="relative">
            <motion.div
              className="flex items-center gap-5 border-b-2 border-ink pb-4"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.7, ease: [0.22,1,0.36,1] }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-muted flex-shrink-0">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for pieces, styles, occasions…"
                className="flex-1 bg-transparent font-display text-2xl md:text-4xl tracking-tight text-ink placeholder:text-muted focus:outline-none"
                aria-label="Search products"
              />
              <AnimatePresence>
                {query && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                    onClick={() => setQuery('')}
                    className="text-muted hover:text-smoke transition-colors"
                    aria-label="Clear search"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </motion.button>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="site-max site-px py-12">
        <AnimatePresence mode="wait">
          {/* Empty state */}
          {query.length <= 1 && (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24">
                {RECENTS.length > 0 && (
                  <div>
                    <p className="eyebrow mb-6">Recent Searches</p>
                    <div className="space-y-3">
                      {RECENTS.map((r) => (
                        <button
                          key={r}
                          onClick={() => setQuery(r)}
                          className="flex items-center gap-4 text-sm text-smoke hover:text-ink transition-colors w-full text-left group"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-muted">
                            <polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 .49-5" />
                          </svg>
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <div>
                  <p className="eyebrow mb-6">Trending</p>
                  <div className="flex flex-wrap gap-3">
                    {TRENDING.map((t) => (
                      <button
                        key={t}
                        onClick={() => setQuery(t)}
                        className="text-sm text-smoke border border-hairline px-4 py-2 hover:border-accent hover:text-ink transition-all duration-300"
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* No results */}
          {noResults && (
            <motion.div
              key="no-results"
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="text-center py-24"
            >
              <p className="font-display text-3xl mb-4">Nothing found for &ldquo;{query}&rdquo;</p>
              <p className="text-smoke text-sm mb-10">Try a different search or explore the collection below.</p>
              <Link href="/shop" className="btn-primary">View All Pieces</Link>
            </motion.div>
          )}

          {/* Results */}
          {hasResults && (
            <motion.div
              key="results"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <p className="eyebrow mb-8">{results.length} result{results.length !== 1 ? 's' : ''} for &ldquo;{query}&rdquo;</p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {results.map((product, i) => (
                  <motion.div
                    key={product.handle}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                  >
                    <Link href={`/products/${product.handle}`} className="group block">
                      <div className="aspect-[3/4] relative overflow-hidden bg-secondary/20 mb-3">
                        <Image src={product.image} alt={product.name} fill className="object-cover object-center product-card-img" />
                        <div className="absolute top-3 left-3">
                          <span className="eyebrow bg-primary/90 text-ink px-2 py-1 text-[0.6rem]">{product.category}</span>
                        </div>
                      </div>
                      <p className="font-display text-base group-hover:text-accent transition-colors mb-1">{product.name}</p>
                      <p className="text-sm text-smoke">{product.price}</p>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
