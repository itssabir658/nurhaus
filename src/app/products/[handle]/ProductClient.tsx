'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useNurhaus } from '@/contexts/NurhausContext';
import { useCart } from '@/contexts/CartContext';
import type { AppProduct } from '@/lib/shopify/types';

const ACCORDION_ITEMS = ['description', 'care', 'shipping'] as const;
const ACCORDION_LABELS: Record<typeof ACCORDION_ITEMS[number], string> = {
  description: 'Fabric & Details',
  care:        'Care Instructions',
  shipping:    'Shipping & Returns',
};

const CARE_COPY = 'Dry clean recommended unless otherwise noted on the garment label.\nStore on a padded hanger, away from direct sunlight.\nSteam on low heat, holding the iron 5cm from delicate embellishment.';
const SHIPPING_COPY = 'Complimentary standard shipping on orders over $500\nDelivery in 5–10 business days\nExpress available at checkout (2–3 days)\nStore credit only — no refunds';

const RECENT_STORAGE_KEY = 'nh_recent';

export default function ProductClient({
  product,
  related,
  isDemo = false,
}: {
  product: AppProduct;
  related: AppProduct[];
  isDemo?: boolean;
}) {
  const { openWaitlist } = useNurhaus();
  const { addItem } = useCart();

  const [activeImage, setActiveImage]   = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [qty, setQty]                   = useState(1);
  const [openSection, setOpenSection]   = useState<string | null>(null);
  const [addedToCart, setAddedToCart]   = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [demoNotice, setDemoNotice]     = useState(false);
  const [recentlyViewed, setRecentlyViewed] = useState<AppProduct[]>([]);

  const hasSizes = product.sizes.length > 0;

  const selectedVariant = hasSizes
    ? product.variants.find((v) => v.selectedOptions.some((o) => o.name.toLowerCase() === 'size' && o.value === selectedSize))
    : product.variants[0];

  const productSoldOut = !product.availableForSale;
  const variantSoldOut = hasSizes && selectedSize ? !selectedVariant?.availableForSale : false;

  useEffect(() => {
    try {
      const stored: string[] = JSON.parse(localStorage.getItem(RECENT_STORAGE_KEY) || '[]');
      const viewed = stored
        .filter((h) => h !== product.handle)
        .slice(0, 4)
        .map((h) => related.find((p) => p.handle === h))
        .filter(Boolean) as AppProduct[];
      setRecentlyViewed(viewed);

      const updated = [product.handle, ...stored.filter((h) => h !== product.handle)].slice(0, 8);
      localStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(updated));
    } catch { /* ignore */ }
  }, [product.handle, related]);

  const handleAddToCart = async () => {
    if (hasSizes && !selectedSize) return;
    const variant = selectedVariant ?? product.variants[0];
    if (!variant) return;

    // Demo-catalog items have no real Shopify variant to add — show the same success
    // animation without touching the cart, so the design previews correctly either way.
    if (isDemo) {
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2400);
      return;
    }

    setIsSubmitting(true);
    try {
      await addItem(variant.id, qty);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2400);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBuyNow = async () => {
    if (hasSizes && !selectedSize) return;
    const variant = selectedVariant ?? product.variants[0];
    if (!variant) return;

    if (isDemo) {
      setDemoNotice(true);
      setTimeout(() => setDemoNotice(false), 3200);
      return;
    }

    setIsSubmitting(true);
    try {
      const updatedCart = await addItem(variant.id, qty);
      window.location.href = updatedCart.checkoutUrl;
    } finally {
      setIsSubmitting(false);
    }
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
              {product.images[activeImage] && (
                <Image
                  src={product.images[activeImage]}
                  alt={`${product.name} — image ${activeImage + 1}`}
                  width={1000}
                  height={1250}
                  priority={activeImage === 0}
                  className="w-full h-full object-cover"
                />
              )}
            </motion.div>
            {product.images.length > 1 && (
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
            )}
          </div>

          {/* Info — sticky on desktop */}
          <div className="lg:sticky lg:top-[144px]">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="eyebrow mb-3">{product.kind}</p>
              <h1 className="font-product text-[2.8rem] md:text-[3.5rem] leading-tight tracking-tight mb-4">
                {product.name}
              </h1>
              <p className="font-display text-2xl text-accent mb-8">${product.price.toLocaleString()}</p>

              <p className="text-smoke text-sm leading-relaxed mb-10 max-w-md">{product.description}</p>

              {/* Sold out banner */}
              {productSoldOut && (
                <div className="border border-hairline px-5 py-3 mb-8 flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-muted flex-shrink-0" />
                  <p className="text-sm text-smoke">This piece is currently sold out.</p>
                </div>
              )}

              {/* Size selector */}
              {!productSoldOut && hasSizes && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <p className="eyebrow">Select Size</p>
                    <Link href="/size-guide" className="text-xs text-smoke hover:text-ink underline underline-offset-2 transition-colors">
                      Size Guide
                    </Link>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((s) => {
                      const variantForSize = product.variants.find((v) =>
                        v.selectedOptions.some((o) => o.name.toLowerCase() === 'size' && o.value === s)
                      );
                      const disabled = variantForSize ? !variantForSize.availableForSale : false;
                      return (
                        <button
                          key={s}
                          disabled={disabled}
                          onClick={() => setSelectedSize(s)}
                          className={`w-12 h-12 border text-sm font-medium transition-all duration-300 relative ${
                            selectedSize === s
                              ? 'border-ink bg-ink text-primary'
                              : disabled
                                ? 'border-hairline text-muted/50 cursor-not-allowed'
                                : 'border-hairline text-smoke hover:border-accent hover:text-ink'
                          }`}
                        >
                          {s}
                          {disabled && (
                            <span className="absolute inset-0 flex items-center justify-center">
                              <span className="w-full h-px bg-muted/50 rotate-45" />
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  {!selectedSize && (
                    <p className="text-xs text-muted mt-2">Please select a size</p>
                  )}
                  {variantSoldOut && (
                    <p className="text-xs text-smoke mt-2">This size is currently sold out.</p>
                  )}
                </div>
              )}

              {/* Limited stock indicator — only when Shopify reports real inventory numbers */}
              {!productSoldOut && selectedVariant?.availableForSale && selectedVariant.quantityAvailable !== null && selectedVariant.quantityAvailable <= 8 && (
                <motion.p
                  className="text-sm text-smoke mb-6"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  Only <span className="text-ink font-medium">{selectedVariant.quantityAvailable} piece{selectedVariant.quantityAvailable === 1 ? '' : 's'}</span> remaining in this size.
                </motion.p>
              )}

              {/* Quantity */}
              {!productSoldOut && !variantSoldOut && (
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
                {productSoldOut ? (
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
                      disabled={(hasSizes && !selectedSize) || variantSoldOut || isSubmitting}
                      className={`btn-primary w-full transition-all duration-500 ${(hasSizes && !selectedSize) || variantSoldOut ? 'opacity-40 cursor-not-allowed' : ''}`}
                    >
                      {addedToCart ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          Added to Cart
                        </span>
                      ) : isSubmitting ? 'Adding…' : 'Add to Cart'}
                    </button>
                    <button
                      onClick={handleBuyNow}
                      disabled={(hasSizes && !selectedSize) || variantSoldOut || isSubmitting}
                      className={`btn-outline w-full ${(hasSizes && !selectedSize) || variantSoldOut ? 'opacity-40 cursor-not-allowed' : ''}`}
                    >
                      Buy Now
                    </button>
                    <AnimatePresence>
                      {demoNotice && (
                        <motion.p
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="text-xs text-muted text-center pt-1"
                        >
                          Preview catalog — connect Shopify to enable live checkout.
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </>
                )}
              </div>

              {/* Trust signals */}
              <div className="mt-8 pt-8 border-t border-hairline space-y-3">
                {[
                  { icon: '✦', text: 'Complimentary shipping on orders over $500' },
                  { icon: '✦', text: 'Store credit only — no refunds' },
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
                            {key === 'description' ? (
                              product.descriptionHtml ? (
                                <div
                                  className="text-sm text-smoke leading-relaxed prose-nurhaus"
                                  dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
                                />
                              ) : (
                                <p className="text-sm text-smoke leading-relaxed">{product.description}</p>
                              )
                            ) : (
                              (key === 'care' ? CARE_COPY : SHIPPING_COPY).split('\n').map((line, i) => (
                                <p key={i} className={`text-sm text-smoke leading-relaxed ${i > 0 ? 'mt-1.5' : ''}`}>{line}</p>
                              ))
                            )}
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

      {/* Editorial gallery */}
      {product.images.length > 1 && (
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
              {product.images.slice(1, 3).map((img, i) => (
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
      )}

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
                      {p.images[0] && (
                        <Image
                          src={p.images[0]}
                          alt={p.name}
                          width={240}
                          height={320}
                          loading="lazy"
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <p className="font-product text-base group-hover:text-accent transition-colors">{p.name}</p>
                    <p className="text-sm text-smoke mt-0.5">${p.price.toLocaleString()}</p>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Related products */}
      {related.length > 0 && (
        <div className="border-t border-hairline">
          <div className="site-max site-px py-20">
            <p className="eyebrow mb-3">You May Also Consider</p>
            <h2 className="font-display text-3xl md:text-4xl tracking-tight mb-12">The Collection</h2>
            <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory">
              {related.map((p, i) => (
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
                      {p.images[0] && (
                        <Image src={p.images[0]} alt={p.name} width={300} height={400} loading="lazy" className="w-full h-full object-cover" />
                      )}
                    </div>
                    <p className="font-product text-lg group-hover:text-accent transition-colors">{p.name}</p>
                    <p className="text-sm text-smoke mt-1">${p.price.toLocaleString()}</p>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
