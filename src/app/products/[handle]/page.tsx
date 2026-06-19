'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useNurhaus } from '@/contexts/NurhausContext';

const PRODUCTS: Record<string, {
  name: string; kind: string; price: number; description: string;
  details: string; care: string; shipping: string; story: string;
  images: string[]; sizes: string[]; relatedHandles: string[];
  soldOut?: boolean; stock?: number; limitedRun?: boolean;
}> = {
  'sahar-abaya': {
    name: 'The Sahar Abaya', kind: 'Abaya', price: 680,
    stock: 6, limitedRun: true,
    description: 'Named for the quiet hour before dawn, the Sahar is cut in a fluid double-layered crepe that moves like water and holds its shape with authority. A deep side slit and relaxed silhouette give freedom without sacrifice.',
    details: '100% Silk Crepe — Double layer\nFully lined in silk habotai\nHand-finished edges\nSide slit, 32cm from hem\nLength from shoulder: 142cm',
    care: 'Dry clean only\nStore on a padded hanger\nAvoid direct sunlight when storing\nIf steaming, use low heat and hold 5cm from fabric',
    shipping: 'Complimentary standard shipping on orders over $500\nDelivery in 5–10 business days\nExpress available at checkout (2–3 days)\nFree returns within 14 days',
    story: 'The Sahar began as a sketch of three lines — one for the shoulder, one for the waist, one for the hem. Everything else was taken away. What remained is this: a garment that exists in the periphery of attention, noticed only when it moves.',
    images: [
      'https://images.unsplash.com/photo-1760083545495-b297b1690672?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1752794673269-dc356838c5fd?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1619043518800-7f14be467dca?auto=format&fit=crop&w=1000&q=85',
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    relatedHandles: ['layl-abaya', 'noor-dress', 'zahra-dress'],
  },
  'noor-dress': {
    name: 'The Noor Dress', kind: 'Dress', price: 420,
    description: 'The Noor is an exercise in proportion. A modest neckline meets a subtly flared skirt at the knee — the kind of dress that works in every room because it asks nothing of the room.',
    details: '72% Viscose, 28% Linen\nUnlined\nConcealed back zip\nPockets, deep\nLength from shoulder: 124cm',
    care: 'Hand wash cold\nDo not tumble dry\nIron on low, inside out\nDry flat or hang immediately',
    shipping: 'Complimentary standard shipping on orders over $500\nDelivery in 5–10 business days\nExpress available at checkout (2–3 days)\nFree returns within 14 days',
    story: 'Noor means light in Arabic. This dress carries it the way good fabric does — not by shining, but by catching whatever light is nearby and holding it quietly.',
    images: [
      'https://images.unsplash.com/photo-1762605135318-f34a993cbcf0?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1773439877634-e6ef9f571c12?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1619043518800-7f14be467dca?auto=format&fit=crop&w=1000&q=85',
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    relatedHandles: ['layla-dress', 'dunya-dress', 'samar-dress'],
  },
  'layl-abaya': {
    name: 'The Layl Abaya', kind: 'Abaya', price: 720,
    soldOut: true,
    description: 'The Layl — named for night — is a study in deep proportion. Cut extra long for full coverage with an open-front drape, structured shoulders, and a silk-chiffon overlay that catches light with each movement.',
    details: '100% Silk Chiffon overlay\nInner layer: Silk crepe\nFully lined\nOpen-front drape\nLength from shoulder: 148cm',
    care: 'Dry clean only\nStore hanging\nHandle the overlay with care',
    shipping: 'Complimentary standard shipping on orders over $500\nDelivery in 5–10 business days\nFree returns within 14 days',
    story: 'Night has its own dress code. The Layl was designed for it.',
    images: [
      'https://images.unsplash.com/photo-1772474500365-c2c520545f44?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1772474542630-5f5822ca8421?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1772474521525-c022114367ce?auto=format&fit=crop&w=1000&q=85',
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    relatedHandles: ['sahar-abaya', 'noor-dress', 'zahra-dress'],
  },
};

const DEFAULT_PRODUCT = PRODUCTS['sahar-abaya'];

const ALL_CATALOG = [
  { handle: 'sahar-abaya', name: 'The Sahar Abaya', price: '$680', image: 'https://images.unsplash.com/photo-1760083545495-b297b1690672?auto=format&fit=crop&w=600&q=80' },
  { handle: 'noor-dress',  name: 'The Noor Dress',  price: '$420', image: 'https://images.unsplash.com/photo-1762605135318-f34a993cbcf0?auto=format&fit=crop&w=600&q=80' },
  { handle: 'layl-abaya',  name: 'The Layl Abaya',  price: '$720', image: 'https://images.unsplash.com/photo-1772474500365-c2c520545f44?auto=format&fit=crop&w=600&q=80' },
  { handle: 'zahra-dress', name: 'The Zahra Dress',  price: '$470', image: 'https://images.unsplash.com/photo-1772714601004-23b94ae3913d?auto=format&fit=crop&w=600&q=80' },
  { handle: 'layla-dress', name: 'The Layla Dress',  price: '$455', image: 'https://images.unsplash.com/photo-1762605135332-8a7ce1403187?auto=format&fit=crop&w=600&q=80' },
  { handle: 'dunya-dress', name: 'The Dunya Dress',  price: '$390', image: 'https://images.unsplash.com/photo-1764179690247-df7f4014def7?auto=format&fit=crop&w=600&q=80' },
];

const RELATED = [
  { handle: 'noor-dress',  name: 'The Noor',  price: '$420', image: 'https://images.unsplash.com/photo-1762605135318-f34a993cbcf0?auto=format&fit=crop&w=600&q=80' },
  { handle: 'layl-abaya',  name: 'The Layl',  price: '$720', image: 'https://images.unsplash.com/photo-1772474500365-c2c520545f44?auto=format&fit=crop&w=600&q=80' },
  { handle: 'zahra-dress', name: 'The Zahra', price: '$470', image: 'https://images.unsplash.com/photo-1772714601004-23b94ae3913d?auto=format&fit=crop&w=600&q=80' },
  { handle: 'layla-dress', name: 'The Layla', price: '$455', image: 'https://images.unsplash.com/photo-1762605135332-8a7ce1403187?auto=format&fit=crop&w=600&q=80' },
];

const ACCORDION_ITEMS = ['details', 'care', 'shipping', 'story'] as const;
const ACCORDION_LABELS: Record<typeof ACCORDION_ITEMS[number], string> = {
  details:  'Fabric & Details',
  care:     'Care Instructions',
  shipping: 'Shipping & Returns',
  story:    'Craftsmanship Story',
};

export default function ProductPage({ params }: { params: { handle: string } }) {
  const product = PRODUCTS[params.handle] ?? DEFAULT_PRODUCT;
  const { openWaitlist } = useNurhaus();

  const [activeImage, setActiveImage]   = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [qty, setQty]                   = useState(1);
  const [openSection, setOpenSection]   = useState<string | null>(null);
  const [addedToCart, setAddedToCart]   = useState(false);
  const [recentlyViewed, setRecentlyViewed] = useState<typeof ALL_CATALOG>([]);

  useEffect(() => {
    try {
      const stored: string[] = JSON.parse(localStorage.getItem('nh_recent') || '[]');
      const viewed = stored
        .filter((h) => h !== params.handle)
        .slice(0, 4)
        .map((h) => ALL_CATALOG.find((p) => p.handle === h))
        .filter(Boolean) as typeof ALL_CATALOG;
      setRecentlyViewed(viewed);

      const updated = [params.handle, ...stored.filter((h) => h !== params.handle)].slice(0, 8);
      localStorage.setItem('nh_recent', JSON.stringify(updated));
    } catch { /* ignore */ }
  }, [params.handle]);

  const handleAddToCart = () => {
    if (!selectedSize) return;
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2400);
  };

  return (
    <div className="page-enter">
      {/* Breadcrumb */}
      <div className="site-max site-px py-4 border-b border-hairline">
        <nav className="flex items-center gap-2 text-xs text-muted">
          <Link href="/" className="hover:text-ink transition-colors">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-ink transition-colors">Collection</Link>
          <span>/</span>
          <span className="text-smoke">{product.name}</span>
        </nav>
      </div>

      {/* Product hero */}
      <div className="site-max site-px py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">

          {/* Images */}
          <div className="space-y-4">
            <motion.div
              key={activeImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="aspect-[4/5] overflow-hidden bg-secondary/20"
            >
              <Image
                src={product.images[activeImage]}
                alt={`${product.name} — image ${activeImage + 1}`}
                width={1000}
                height={1250}
                priority={activeImage === 0}
                className="w-full h-full object-cover"
              />
            </motion.div>
            <div className="grid grid-cols-3 gap-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`aspect-[3/4] overflow-hidden transition-all duration-300 ${
                    activeImage === i ? 'ring-1 ring-ink ring-offset-2' : 'opacity-60 hover:opacity-90'
                  }`}
                >
                  <Image src={img} alt="" width={300} height={400} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Info — sticky on desktop */}
          <div className="lg:sticky lg:top-[144px]">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="eyebrow mb-3">{product.kind}</p>
              <h1 className="font-display text-[2.8rem] md:text-[3.5rem] leading-tight tracking-tight mb-4">
                {product.name}
              </h1>
              <p className="font-display text-2xl text-accent mb-8">${product.price.toLocaleString()}</p>

              <p className="text-smoke text-sm leading-relaxed mb-10 max-w-md">{product.description}</p>

              {/* Sold out banner */}
              {product.soldOut && (
                <div className="border border-hairline px-5 py-3 mb-8 flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-muted flex-shrink-0" />
                  <p className="text-sm text-smoke">This piece is currently sold out.</p>
                </div>
              )}

              {/* Size selector */}
              {!product.soldOut && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <p className="eyebrow">Select Size</p>
                    <Link href="/size-guide" className="text-xs text-smoke hover:text-ink underline underline-offset-2 transition-colors">
                      Size Guide
                    </Link>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSelectedSize(s)}
                        className={`w-12 h-12 border text-sm font-medium transition-all duration-300 ${
                          selectedSize === s
                            ? 'border-ink bg-ink text-primary'
                            : 'border-hairline text-smoke hover:border-accent hover:text-ink'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                  {!selectedSize && (
                    <p className="text-xs text-muted mt-2">Please select a size</p>
                  )}
                </div>
              )}

              {/* Limited stock indicator */}
              {!product.soldOut && (product.stock !== undefined || product.limitedRun) && (
                <motion.p
                  className="text-sm text-smoke mb-6"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  {product.stock !== undefined && product.stock <= 8 ? (
                    <>Only <span className="text-ink font-medium">{product.stock} pieces</span> remaining in this style.</>
                  ) : product.limitedRun ? (
                    <span className="font-medium text-ink">Limited Production Run</span>
                  ) : null}
                </motion.p>
              )}

              {/* Quantity */}
              {!product.soldOut && (
                <div className="flex items-center gap-4 mb-8">
                  <p className="eyebrow">Qty</p>
                  <div className="flex items-center border border-hairline">
                    <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-10 h-10 text-smoke hover:text-ink transition-colors flex items-center justify-center text-lg">−</button>
                    <span className="w-10 text-center text-sm">{qty}</span>
                    <button onClick={() => setQty(qty + 1)} className="w-10 h-10 text-smoke hover:text-ink transition-colors flex items-center justify-center">+</button>
                  </div>
                </div>
              )}

              {/* CTAs */}
              <div className="space-y-3">
                {product.soldOut ? (
                  <>
                    <button
                      onClick={() => openWaitlist(product.name)}
                      className="btn-primary w-full"
                    >
                      Join the Waiting List
                    </button>
                    <p className="text-xs text-muted text-center">
                      Be notified with priority access when this piece returns.
                    </p>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleAddToCart}
                      disabled={!selectedSize}
                      className={`btn-primary w-full transition-all duration-500 ${!selectedSize ? 'opacity-40 cursor-not-allowed' : ''}`}
                    >
                      {addedToCart ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          Added to Cart
                        </span>
                      ) : 'Add to Cart'}
                    </button>
                    <button className="btn-outline w-full">Buy Now</button>
                  </>
                )}
              </div>

              {/* Trust signals */}
              <div className="mt-8 pt-8 border-t border-hairline space-y-3">
                {[
                  { icon: '✦', text: 'Complimentary shipping on orders over $500' },
                  { icon: '✦', text: 'Free returns within 14 days' },
                  { icon: '✦', text: 'Each piece finished by hand in our atelier' },
                ].map((item) => (
                  <p key={item.text} className="text-xs text-smoke flex items-start gap-3">
                    <span className="text-gold flex-shrink-0 mt-px">{item.icon}</span>
                    {item.text}
                  </p>
                ))}
              </div>

              {/* Accordion */}
              <div className="mt-8 space-y-0 border-t border-hairline">
                {ACCORDION_ITEMS.map((key) => (
                  <div key={key} className="border-b border-hairline">
                    <button
                      onClick={() => setOpenSection(openSection === key ? null : key)}
                      className="w-full flex items-center justify-between py-5 text-left"
                    >
                      <span className="eyebrow text-ink">{ACCORDION_LABELS[key]}</span>
                      <span className={`text-muted transition-transform duration-400 text-xl leading-none ${openSection === key ? 'rotate-45' : ''}`}>+</span>
                    </button>
                    <AnimatePresence initial={false}>
                      {openSection === key && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="pb-6 pr-8">
                            {product[key].split('\n').map((line, i) => (
                              <p key={i} className={`text-sm text-smoke leading-relaxed ${i > 0 ? 'mt-1.5' : ''}`}>{line}</p>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Model info strip */}
      <div className="border-y border-hairline bg-secondary/20">
        <div className="site-max site-px py-6 flex flex-wrap gap-10">
          {[
            { label: 'Model Height', value: '5\'9" / 175cm' },
            { label: 'Model Wears',  value: 'Size S' },
            { label: 'Garment Length', value: '142cm from shoulder' },
          ].map((d) => (
            <div key={d.label}>
              <p className="eyebrow mb-1">{d.label}</p>
              <p className="text-sm text-smoke">{d.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Editorial gallery */}
      <div className="site-max site-px py-20 md:py-32">
        <p className="eyebrow mb-12">In the Atelier</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 aspect-[16/10] overflow-hidden">
            <Image
              src={product.images[0]}
              alt={product.name}
              width={1200}
              height={750}
              loading="lazy"
              className="w-full h-full object-cover hover:scale-[1.03] transition-transform duration-[1400ms] ease-expo"
            />
          </div>
          <div className="space-y-4">
            {product.images.slice(1).map((img, i) => (
              <div key={i} className="aspect-[4/5] overflow-hidden">
                <Image
                  src={img}
                  alt=""
                  width={600}
                  height={750}
                  loading="lazy"
                  className="w-full h-full object-cover hover:scale-[1.03] transition-transform duration-[1400ms] ease-expo"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recently Viewed */}
      {recentlyViewed.length > 0 && (
        <div className="border-t border-hairline">
          <div className="site-max site-px py-16 md:py-20">
            <p className="eyebrow mb-3">Recently Viewed</p>
            <div className="flex gap-5 overflow-x-auto pb-3 snap-x snap-mandatory mt-8">
              {recentlyViewed.map((p, i) => (
                <motion.div
                  key={p.handle}
                  className="flex-shrink-0 w-[200px] md:w-[240px] snap-start"
                  initial={{ opacity: 0, x: 16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.6 }}
                >
                  <Link href={`/products/${p.handle}`} className="group block">
                    <div className="aspect-[3/4] overflow-hidden bg-secondary/20 mb-3 product-card-img">
                      <Image
                        src={p.image}
                        alt={p.name}
                        width={240}
                        height={320}
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="font-display text-base group-hover:text-accent transition-colors">{p.name}</p>
                    <p className="text-sm text-smoke mt-0.5">{p.price}</p>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Related products */}
      <div className="border-t border-hairline">
        <div className="site-max site-px py-20">
          <p className="eyebrow mb-3">You May Also Consider</p>
          <h2 className="font-display text-3xl md:text-4xl tracking-tight mb-12">The Collection</h2>
          <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory">
            {RELATED.map((p, i) => (
              <motion.div
                key={p.handle}
                className="flex-shrink-0 w-[260px] md:w-[300px] snap-start"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link href={`/products/${p.handle}`} className="group block">
                  <div className="aspect-[3/4] overflow-hidden bg-secondary/20 mb-4 product-card-img">
                    <Image src={p.image} alt={p.name} width={300} height={400} loading="lazy" className="w-full h-full object-cover" />
                  </div>
                  <p className="font-display text-lg group-hover:text-accent transition-colors">{p.name}</p>
                  <p className="text-sm text-smoke mt-1">{p.price}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
