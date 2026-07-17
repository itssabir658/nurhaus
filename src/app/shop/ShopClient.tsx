'use client';

import { Suspense, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import type { AppProduct } from '@/lib/shopify/types';
import { getProductDescriptor } from '@/lib/productDescriptors';
import ShopifySetupNotice from '@/components/ShopifySetupNotice';

const fadeUp = {
  hidden:  { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
};

// Shop hero — same auto-rotating, breathing-zoom gallery mechanic as the
// homepage EditorialHero, but composed differently: a single full-bleed grid
// behind a dark gradient + overlaid text, instead of a split text/gallery
// layout, so the two heroes read as siblings rather than duplicates.
const HERO_IMAGES = [
  { src: '/shop-hero/1.jpg', alt: 'Alaïa' },
  { src: '/shop-hero/2.jpg', alt: 'Dahlia' },
  { src: '/shop-hero/3.jpg', alt: 'Saphira' },
  { src: '/shop-hero/4.jpg', alt: 'Elayna' },
  { src: '/shop-hero/5.jpg', alt: 'Faye' },
  { src: '/shop-hero/6.jpg', alt: 'Amélie' },
  { src: '/shop-hero/7.jpg', alt: 'Layla' },
  { src: '/shop-hero/8.jpg', alt: 'Yara' },
];
const HERO_ROTATE_MS = 4200;
const HERO_SWAP_TRANSITION = { duration: 1.1, ease: [0.22, 0.61, 0.36, 1] as const };

// Deterministic — swaps exactly one of the 4 visible slots per tick, cycling
// through all 8 source images.
function heroColumnsForTick(tick: number): number[] {
  const cols = [0, 1, 2, 3];
  for (let t = 0; t < tick; t++) {
    cols[t % 4] = (4 + t) % HERO_IMAGES.length;
  }
  return cols;
}

function HeroBreathingImage({ img, priority, breatheDelay, reducedMotion }: {
  img: { src: string; alt: string };
  priority?: boolean;
  breatheDelay: number;
  reducedMotion: boolean;
}) {
  return (
    <motion.div
      className="relative w-full h-full"
      animate={reducedMotion ? undefined : { scale: [1, 1.08, 1] }}
      transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut', delay: breatheDelay }}
    >
      <Image src={img.src} alt={img.alt} fill sizes="25vw" priority={priority} className="object-cover" />
    </motion.div>
  );
}

function HeroGalleryColumn({ imgIndex, colIndex, reducedMotion }: { imgIndex: number; colIndex: number; reducedMotion: boolean }) {
  return (
    <div className="relative h-full overflow-hidden">
      <AnimatePresence initial={false}>
        <motion.div
          key={imgIndex}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={HERO_SWAP_TRANSITION}
        >
          <HeroBreathingImage
            img={HERO_IMAGES[imgIndex]}
            priority={colIndex === 0}
            breatheDelay={colIndex * 2.5}
            reducedMotion={reducedMotion}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function ShopContent({ products, categories, configured }: { products: AppProduct[]; categories: string[]; configured: boolean }) {
  const searchParams = useSearchParams();
  const [activeCategory, setActiveCategory] = useState('All');
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState('Featured');
  const [heroColumns, setHeroColumns] = useState([0, 1, 2, 3]);
  const [heroMobileIndex, setHeroMobileIndex] = useState(0);
  const [heroReducedMotion, setHeroReducedMotion] = useState(false);

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat && categories.includes(cat)) setActiveCategory(cat);
  }, [searchParams, categories]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setHeroReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setHeroReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (heroReducedMotion) return;
    const startTime = Date.now();
    const id = setInterval(() => {
      const tick = Math.floor((Date.now() - startTime) / HERO_ROTATE_MS);
      setHeroColumns(heroColumnsForTick(tick));
    }, HERO_ROTATE_MS);
    return () => clearInterval(id);
  }, [heroReducedMotion]);

  useEffect(() => {
    if (heroReducedMotion) return;
    const id = setInterval(() => {
      setHeroMobileIndex((i) => (i + 1) % HERO_IMAGES.length);
    }, HERO_ROTATE_MS);
    return () => clearInterval(id);
  }, [heroReducedMotion]);

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
        {/* Desktop/tablet — 4-column rotating, breathing-zoom grid */}
        <div className="hidden md:grid grid-cols-4 absolute inset-0">
          {heroColumns.map((imgIndex, colIndex) => (
            <HeroGalleryColumn key={colIndex} imgIndex={imgIndex} colIndex={colIndex} reducedMotion={heroReducedMotion} />
          ))}
        </div>
        {/* Mobile — single crossfading image, cycling through the same pool */}
        <div className="md:hidden absolute inset-0 overflow-hidden">
          <AnimatePresence initial={false}>
            <motion.div
              key={heroMobileIndex}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2 }}
            >
              <Image
                src={HERO_IMAGES[heroMobileIndex].src}
                alt={HERO_IMAGES[heroMobileIndex].alt}
                fill
                priority={heroMobileIndex === 0}
                sizes="100vw"
                className="object-cover"
              />
            </motion.div>
          </AnimatePresence>
        </div>
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
              Summer Drop
            </span>
          </motion.div>
          <motion.h1
            className="font-display text-primary text-[clamp(1.6rem,7vw,6rem)] leading-[0.92] tracking-tight whitespace-nowrap"
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
            Modest pieces designed for everyday women who value elegance without compromise.
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
                <button
                  onClick={() => setActiveCategory('All')}
                  className={`px-4 py-1.5 text-[0.7rem] tracking-[0.18em] uppercase font-medium transition-all duration-300 ${
                    activeCategory === 'All'
                      ? 'bg-ink text-primary'
                      : 'text-smoke hover:text-ink'
                  }`}
                >
                  All
                </button>
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

          {/* Product grid — matches the home page's collection grid */}
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
                  className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 sm:gap-x-6 gap-y-10 md:gap-y-16"
                >
                  {filtered.map((p, i) => (
                    <motion.div
                      key={p.handle}
                      variants={fadeUp}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      transition={{ delay: (i % 3) * 0.1 } as any}
                    >
                      <ProductCard product={p} />
                    </motion.div>
                  ))}
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
                  { label: 'Size', opts: ['S', 'M', 'L', 'XL'] },
                  /* Colour filter hidden for now */
                ].map((group) => (
                  <div key={group.label}>
                    <p className="eyebrow mb-4">{group.label}</p>
                    <div className="flex flex-wrap gap-2">
                      {group.opts.map((opt) => (
                        <button
                          key={opt}
                          className="px-3 py-1.5 border border-hairline text-sm text-smoke hover:border-accent hover:text-ink transition-all duration-300"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
                {/* Price Range filter hidden for now */}
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
      <div className="product-card-img relative">
        {p.images[0] && (
          <Image
            src={p.images[0]}
            alt={p.name}
            width={large ? 800 : 600}
            height={large ? 1000 : 800}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            loading="lazy"
            className="w-full h-auto aspect-auto group-hover:scale-105 transition-transform duration-[1200ms] ease-expo"
          />
        )}
        {p.tags.includes('new') && (
          <span className="absolute top-4 left-4 bg-primary px-3 py-1 eyebrow text-ink">New</span>
        )}
        {!p.availableForSale && (
          <span className="absolute top-4 right-4 bg-midnight/80 px-3 py-1 eyebrow text-primary">Sold Out</span>
        )}
      </div>
      <div className="mt-4">
        <p className="eyebrow mb-1">{getProductDescriptor(p.name, p.kind)}</p>
        <div className="flex items-baseline justify-between">
          <span className={`font-product ${large ? 'text-2xl' : 'text-xl'}`}>{p.name}</span>
          <span className="text-sm text-smoke">${p.price.toLocaleString()}</span>
        </div>
      </div>
    </Link>
  );
}
