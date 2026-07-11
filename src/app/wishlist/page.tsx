'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

const INITIAL_WISHLIST = [
  { name: 'Layla',  category: 'Abaya', price: '$680', handle: 'sahar-abaya',  image: 'https://images.unsplash.com/photo-1760083545495-b297b1690672?auto=format&fit=crop&w=600&q=80', inStock: true  },
  { name: 'Amelie',   category: 'Dress', price: '$420', handle: 'noor-dress',   image: 'https://images.unsplash.com/photo-1762605135318-f34a993cbcf0?auto=format&fit=crop&w=600&q=80', inStock: true  },
  { name: 'Yara',   category: 'Abaya', price: '$720', handle: 'layl-abaya',   image: 'https://images.unsplash.com/photo-1772474500365-c2c520545f44?auto=format&fit=crop&w=600&q=80', inStock: false },
  { name: 'Faye',  category: 'Dress', price: '$390', handle: 'dunya-dress',  image: 'https://images.unsplash.com/photo-1764179690247-df7f4014def7?auto=format&fit=crop&w=600&q=80', inStock: true  },
];

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22,1,0.36,1] } },
};

export default function WishlistPage() {
  const [items, setItems] = useState(INITIAL_WISHLIST);
  const [addedToCart, setAddedToCart] = useState<string | null>(null);

  const remove = (handle: string) => setItems((prev) => prev.filter((i) => i.handle !== handle));

  const addToCart = (handle: string) => {
    setAddedToCart(handle);
    setTimeout(() => setAddedToCart(null), 2000);
  };

  const [copied, setCopied] = useState(false);
  const share = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="page-enter">
      {/* Header */}
      <div className="site-max site-px pt-16 pb-10 border-b border-hairline">
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <div>
            <motion.p className="eyebrow mb-3" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              Wishlist
            </motion.p>
            <motion.h1
              className="font-display text-[2.5rem] md:text-[4.5rem] leading-tight tracking-tight"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.8, ease: [0.22,1,0.36,1] }}
            >
              Saved Pieces.
            </motion.h1>
            {items.length > 0 && (
              <motion.p className="text-sm text-muted mt-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                {items.length} piece{items.length !== 1 ? 's' : ''} saved
              </motion.p>
            )}
          </div>
          {items.length > 0 && (
            <motion.button
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
              onClick={share}
              className="flex items-center gap-2.5 text-sm text-smoke hover:text-ink transition-colors border border-hairline px-5 py-2.5 hover:border-accent"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
              </svg>
              {copied ? 'Link Copied' : 'Share Wishlist'}
            </motion.button>
          )}
        </div>
      </div>

      <div className="site-max site-px py-12">
        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-center py-32"
          >
            <div className="w-16 h-16 border border-hairline flex items-center justify-center mx-auto mb-8">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="text-muted">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </div>
            <p className="font-display text-3xl mb-4">Nothing saved yet.</p>
            <p className="text-smoke text-sm mb-10 max-w-xs mx-auto">
              Save pieces you love. We will keep them here for when you are ready.
            </p>
            <Link href="/shop" className="btn-primary">Explore the Collection</Link>
          </motion.div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8"
            variants={stagger}
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence initial={false}>
              {items.map((item) => (
                <motion.div
                  key={item.handle}
                  layout
                  variants={fadeUp}
                  exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.3 } }}
                  className="group"
                >
                  <div className="relative aspect-[3/4] overflow-hidden bg-secondary/20 mb-4">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                      className="object-cover object-center product-card-img"
                    />

                    {/* Out of stock overlay */}
                    {!item.inStock && (
                      <div className="absolute inset-0 bg-primary/60 flex items-center justify-center">
                        <span className="eyebrow text-ink bg-primary/90 px-4 py-2">Sold Out</span>
                      </div>
                    )}

                    {/* Hover actions */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex flex-col justify-end p-4 gap-2">
                      {item.inStock && (
                        <motion.button
                          onClick={() => addToCart(item.handle)}
                          className="w-full py-3 text-xs tracking-widest uppercase font-medium transition-colors duration-300 relative overflow-hidden"
                          style={{
                            background: addedToCart === item.handle ? 'var(--color-accent)' : 'var(--color-ink)',
                            color: 'var(--color-primary)',
                          }}
                        >
                          {addedToCart === item.handle ? 'Added to Cart' : 'Add to Cart'}
                        </motion.button>
                      )}
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => remove(item.handle)}
                      className="absolute top-3 right-3 w-8 h-8 bg-primary/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-primary"
                      aria-label={`Remove ${item.name} from wishlist`}
                    >
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>

                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[0.6rem] tracking-widest uppercase text-muted mb-1">{item.category}</p>
                      <Link href={`/products/${item.handle}`} className="font-display text-lg hover:text-accent transition-colors leading-tight block">
                        {item.name}
                      </Link>
                    </div>
                    <p className="text-sm text-smoke flex-shrink-0 mt-1">{item.price}</p>
                  </div>

                  {!item.inStock && (
                    <button className="mt-3 text-xs text-accent tracking-wide hover:text-ink transition-colors">
                      Notify me when available
                    </button>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}
