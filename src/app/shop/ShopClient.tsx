'use client';

import { Suspense, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import type { AppProduct } from '@/lib/shopify/types';
import ShopifySetupNotice from '@/components/ShopifySetupNotice';

const fadeUp = {
  hidden:  { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
};

function ShopContent({ products, categories, configured }: { products: AppProduct[]; categories: string[]; configured: boolean }) {
  const searchParams = useSearchParams();
  const [activeCategory, setActiveCategory] = useState('All');
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState('Featured');

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat && categories.includes(cat)) setActiveCategory(cat);
  }, [searchParams, categories]);

  const filtered = [...products]
    .filter((p) => (activeCategory === 'All' ? true : p.kind === activeCategory))
    .sort((a, b) => {
      if (sortBy === 'Price ↑') return a.price - b.price;
      if (sortBy === 'Price ↓') return b.price - a.price;
      return 0;
    });

  return (
    <div className="page-enter">
      {/* Hero */}
      <section className="relative h-[82svh] md:h-[70vh] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1762376268273-645db555eaf9?auto=format&fit=crop&w=1800&q=80"
          alt="Shop the Nürhaus collection"
          fill
          sizes="100vw"
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-midnight/10 via-midnight/30 to-midnight/60" />
        <div className="relative z-10 h-full site-max site-px flex flex-col justify-end pb-6 md:pb-12">
          <motion.div
            className="mb-4"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7, ease: [0.22,1,0.36,1] }}
          >
            <span
              className="eyebrow-light inline-flex items-center rounded-full border border-primary/25 px-4 py-1.5"
              style={{
                backdropFilter: 'blur(14px) saturate(160%)',
                WebkitBackdropFilter: 'blur(14px) saturate(160%)',
                background: 'rgba(255,255,255,0.1)',
                color: 'var(--c-primary)',
              }}
            >
              Autumn Collection
            </span>
          </motion.div>
          <motion.h1
            className="font-display text-primary text-[2.2rem] sm:text-[3rem] md:text-[6rem] leading-[0.92] tracking-tight max-w-3xl"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.9, ease: [0.22,1,0.36,1] }}
          >
            Crafted for Presence.
          </motion.h1>
          <motion.p
            className="text-primary/70 text-sm mt-4 max-w-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            Luxury modest wear designed for women who value elegance without compromise.
          </motion.p>
        </div>
      </section>

      {products.length === 0 ? (
        configured ? (
          <div className="site-max site-px py-32 text-center">
            <p className="eyebrow mb-4">Catalog Empty</p>
            <p className="font-display text-3xl tracking-tight mb-4">Your store is connected.</p>
            <p className="text-sm text-smoke leading-relaxed max-w-md mx-auto">
              No products were found. Add products in your Shopify admin and make sure they&rsquo;re published to the Headless sales channel — see DEPLOYMENT.md §4.
            </p>
          </div>
        ) : (
          <ShopifySetupNotice context="the collection" />
        )
      ) : (
        <>
          {/* Filter bar */}
          <div className="border-b border-hairline sticky top-[124px] z-30 bg-primary/95 backdrop-blur-sm">
            <div className="site-max site-px h-14 flex items-center justify-between gap-6">
              {/* Categories */}
              <div className="flex gap-1">
                {categories.map((c) => (
                  <button
                    key={c}
                    onClick={() => setActiveCategory(c)}
                    className={`px-4 py-1.5 text-[0.7rem] tracking-[0.18em] uppercase font-medium transition-all duration-300 ${
                      activeCategory === c
                        ? 'bg-ink text-primary'
                        : 'text-smoke hover:text-ink'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-4">
                {/* Sort */}
                <div className="hidden sm:flex items-center gap-2 text-[0.7rem] tracking-[0.12em] uppercase text-smoke">
                  <span>Sort:</span>
                  {['Featured', 'Price ↑', 'Price ↓'].map((s) => (
                    <button
                      key={s}
                      onClick={() => setSortBy(s)}
                      className={`hover:text-ink transition-colors ${sortBy === s ? 'text-ink font-medium' : ''}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>

                {/* Filter toggle */}
                <button
                  onClick={() => setFilterOpen(true)}
                  className="flex items-center gap-2 text-[0.7rem] tracking-[0.18em] uppercase text-smoke hover:text-ink transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <line x1="4" y1="6" x2="20" y2="6" /><line x1="8" y1="12" x2="20" y2="12" /><line x1="12" y1="18" x2="20" y2="18" />
                  </svg>
                  Filter
                </button>

              </div>
            </div>
          </div>

          {/* Magazine grid */}
          <div className="site-max site-px py-16 md:py-24">
            {filtered.length === 0 ? (
              <p className="text-center text-smoke text-sm py-20">No pieces in this category yet.</p>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCategory + sortBy}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-24"
                >
                  {/* Row 1: Large left, small right */}
                  {filtered.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-end">
                      <motion.div
                        className="md:col-span-7"
                        variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                      >
                        <ProductCard product={filtered[0]} large />
                      </motion.div>
                      {filtered[1] && (
                        <motion.div
                          className="md:col-span-4 md:col-start-9 md:pb-16"
                          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                        >
                          <ProductCard product={filtered[1]} />
                        </motion.div>
                      )}
                    </div>
                  )}

                  {/* Row 2: Small left, large right */}
                  {filtered.length > 2 && (
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-end">
                      {filtered[2] && (
                        <motion.div
                          className="md:col-span-4 md:pb-20"
                          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                        >
                          <ProductCard product={filtered[2]} />
                        </motion.div>
                      )}
                      {filtered[3] && (
                        <motion.div
                          className="md:col-span-7 md:col-start-6"
                          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                        >
                          <ProductCard product={filtered[3]} large />
                        </motion.div>
                      )}
                    </div>
                  )}

                  {/* Remaining in 3-col grid */}
                  {filtered.length > 4 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-16">
                      {filtered.slice(4).map((p, i) => (
                        <motion.div
                          key={p.handle}
                          variants={fadeUp}
                          initial="hidden"
                          whileInView="visible"
                          viewport={{ once: true }}
                          transition={{ delay: (i % 3) * 0.08 } as any}
                        >
                          <ProductCard product={p} />
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </>
      )}

      {/* Filter sidebar */}
      <AnimatePresence>
        {filterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-[60] bg-midnight/30"
              onClick={() => setFilterOpen(false)}
            />
            <motion.aside
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="fixed top-0 left-0 bottom-0 z-[70] w-80 bg-primary shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between px-8 h-20 border-b border-hairline flex-shrink-0">
                <p className="eyebrow">Filters</p>
                <button onClick={() => setFilterOpen(false)} className="text-smoke hover:text-ink transition-colors">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-8 py-8 space-y-10">
                {[
                  { label: 'Category', opts: categories.filter((c) => c !== 'All') },
                  { label: 'Size',     opts: ['XS', 'S', 'M', 'L', 'XL', 'XXL'] },
                  { label: 'Colour',   opts: ['Ivory', 'Black', 'Sand', 'Blush', 'Stone'] },
                ].map((group) => (
                  <div key={group.label}>
                    <p className="eyebrow mb-4">{group.label}</p>
                    <div className="flex flex-wrap gap-2">
                      {group.opts.map((opt) => (
                        <button
                          key={opt}
                          onClick={() => group.label === 'Category' && setActiveCategory(opt)}
                          className="px-3 py-1.5 border border-hairline text-sm text-smoke hover:border-accent hover:text-ink transition-all duration-300"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
                <div>
                  <p className="eyebrow mb-4">Price Range</p>
                  <div className="flex items-center gap-3">
                    <input placeholder="Min" className="input-luxury flex-1 text-sm" style={{ fontSize: '0.875rem' }} />
                    <span className="text-muted">—</span>
                    <input placeholder="Max" className="input-luxury flex-1 text-sm" style={{ fontSize: '0.875rem' }} />
                  </div>
                </div>
              </div>
              <div className="border-t border-hairline px-8 py-6 flex-shrink-0 flex gap-3">
                <button className="btn-outline flex-1 text-sm" onClick={() => setFilterOpen(false)}>Clear</button>
                <button className="btn-primary flex-1 text-sm" onClick={() => setFilterOpen(false)}>Apply</button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ShopClient(props: { products: AppProduct[]; categories: string[]; configured: boolean }) {
  return (
    <Suspense fallback={null}>
      <ShopContent {...props} />
    </Suspense>
  );
}

function ProductCard({ product: p, large = false }: { product: AppProduct; large?: boolean }) {
  return (
    <Link href={`/products/${p.handle}`} className="product-card group block">
      <div className={`product-card-img relative ${large ? 'aspect-[4/5]' : 'aspect-[3/4]'}`}>
        {p.images[0] && (
          <Image
            src={p.images[0]}
            alt={p.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            loading="lazy"
            className="object-cover group-hover:scale-105 transition-transform duration-[1200ms] ease-expo"
          />
        )}
        {p.tags.includes('new') && (
          <span className="absolute top-4 left-4 bg-primary px-3 py-1 eyebrow text-ink">New</span>
        )}
        {!p.availableForSale && (
          <span className="absolute top-4 right-4 bg-midnight/80 px-3 py-1 eyebrow text-primary">Sold Out</span>
        )}
        <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-midnight/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <p className="font-product text-lg text-primary">{p.name}</p>
          <p className="text-primary/80 text-sm mt-0.5">${p.price.toLocaleString()}</p>
        </div>
      </div>
      <div className="mt-4">
        <p className="eyebrow mb-1">{p.kind}</p>
        <div className="flex items-baseline justify-between">
          <span className={`font-product ${large ? 'text-2xl' : 'text-xl'}`}>{p.name}</span>
          <span className="text-sm text-smoke">${p.price.toLocaleString()}</span>
        </div>
      </div>
    </Link>
  );
}
