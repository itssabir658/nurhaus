'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useNurhaus } from '@/contexts/NurhausContext';
import { useCart } from '@/contexts/CartContext';
import SizeGuideModal from '@/components/SizeGuideModal';
import { getSizeGuideData } from '@/lib/sizeGuides';
import type { AppProduct } from '@/lib/shopify/types';

const ACCORDION_ITEMS = ['description', 'care'] as const;
const ACCORDION_LABELS: Record<typeof ACCORDION_ITEMS[number], string> = {
  description: 'Fabric & Details',
  care:        'Care Instructions',
};

// Fabric & Details and Care content is driven from code (not Shopify) so it
// renders identically on the live site regardless of the Shopify description
// field. All dresses are chiffon; both abayas are georgette.
const DRESS_FABRIC_HTML = '<p>Lightweight chiffon with a breathable cotton inner.</p>';
const ABAYA_FABRIC_HTML = '<p>Lightweight georgette with matching inner included.</p>';
const DRESS_CARE = 'Dry clean recommended\nSteam only (avoid direct ironing on chiffon)\nIf needed, hand wash in cold water with mild detergent\nDo not tumble dry';
const ABAYA_CARE = 'Dry clean recommended\nSteam only (avoid direct ironing on georgette)\nIf needed, hand wash in cold water with mild detergent\nDo not tumble dry';

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
  const { openWaitlist, openCart } = useNurhaus();
  const { addItem } = useCart();

  const [activeImage, setActiveImage]     = useState(0);
  const [selectedSize, setSelectedSize]   = useState('');
  const [qty, setQty]                     = useState(1);
  const [openSection, setOpenSection]     = useState<string | null>(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isBuyingNow, setIsBuyingNow]     = useState(false);
  const [sizeError, setSizeError]         = useState(false);
  const [soldOutTap, setSoldOutTap]       = useState(false);
  const [qtyShake, setQtyShake]           = useState(false);
  const [demoNotice, setDemoNotice]       = useState(false);
  const [recentlyViewed, setRecentlyViewed] = useState<AppProduct[]>([]);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  const sizeGuideData = getSizeGuideData(product.handle, product.kind, product.name);

  // Fabric & Details and Care are rendered from code (by garment kind) so the
  // live site matches localhost regardless of the Shopify description field.
  const isAbaya = product.kind?.toLowerCase().includes('abaya');
  const fabricHtml = isAbaya ? ABAYA_FABRIC_HTML : DRESS_FABRIC_HTML;
  const careCopy = isAbaya ? ABAYA_CARE : DRESS_CARE;

  const hasSizes = product.sizes.length > 0;

  const selectedVariant = hasSizes
    ? product.variants.find((v) => v.selectedOptions.some((o) => o.name.toLowerCase() === 'size' && o.value === selectedSize))
    : product.variants[0];

  const productSoldOut = !product.availableForSale;
  const variantSoldOut = hasSizes && selectedSize ? !selectedVariant?.availableForSale : false;

  // Checked independently of Shopify's product-level availableForSale flag, which can
  // lag behind real variant inventory — this reflects the actual per-size stock.
  const allSizesSoldOut = hasSizes && product.variants.length > 0 && product.variants.every((v) => !v.availableForSale);

  // Shopify reports quantityAvailable only when inventory tracking is on for this variant;
  // null means untracked/unlimited, so there's no cap to enforce.
  const maxQty = selectedVariant?.quantityAvailable ?? null;
  const atMaxQty = maxQty !== null && qty >= maxQty;

  // Re-clamp quantity whenever the selected size (and therefore its stock cap) changes —
  // e.g. going from a size with 5 in stock down to one with only 2.
  useEffect(() => {
    if (maxQty !== null) {
      setQty((q) => Math.min(Math.max(1, q), maxQty));
    }
  }, [maxQty]);

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

  const triggerSizeError = () => {
    setSizeError(true);
    window.setTimeout(() => setSizeError(false), 600);
  };

  // Fires when the shopper taps a sold-out size — surfaces a message instead
  // of selecting it, so a sold-out size can never render in the "selected" state.
  const triggerSoldOutTap = () => {
    setSoldOutTap(true);
    window.setTimeout(() => setSoldOutTap(false), 2400);
  };

  // Fires when the shopper tries to push qty past the selected size's remaining stock.
  const triggerQtyShake = () => {
    setQtyShake(true);
    window.setTimeout(() => setQtyShake(false), 300);
  };

  const handleAddToCart = async () => {
    if (hasSizes && !selectedSize) {
      triggerSizeError();
      return;
    }
    const variant = selectedVariant ?? product.variants[0];
    if (!variant) return;
    const safeQty = maxQty !== null ? Math.min(qty, maxQty) : qty;

    // Demo-catalog items have no real Shopify variant to add — show a lightweight
    // notice without touching the cart, so the design previews correctly either way.
    if (isDemo) {
      setDemoNotice(true);
      window.setTimeout(() => setDemoNotice(false), 3200);
      return;
    }

    setIsAddingToCart(true);
    try {
      await addItem(variant.id, safeQty);
      openCart();
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (hasSizes && !selectedSize) {
      triggerSizeError();
      return;
    }
    const variant = selectedVariant ?? product.variants[0];
    if (!variant) return;
    const safeQty = maxQty !== null ? Math.min(qty, maxQty) : qty;

    if (isDemo) {
      setDemoNotice(true);
      window.setTimeout(() => setDemoNotice(false), 3200);
      return;
    }

    setIsBuyingNow(true);
    try {
      // Shopify's Storefront API issues checkout sessions via the cart's checkoutUrl —
      // this creates/updates the cart for just this variant, then hands off to Shopify's
      // hosted checkout, bypassing the cart page entirely.
      const updatedCart = await addItem(variant.id, safeQty);
      window.location.href = updatedCart.checkoutUrl;
    } finally {
      setIsBuyingNow(false);
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
              className="overflow-hidden bg-secondary/20 flex items-center justify-center"
            >
              {product.images[activeImage] && (
                <Image
                  src={product.images[activeImage]}
                  alt={`${product.name} — image ${activeImage + 1}`}
                  width={1000}
                  height={1250}
                  priority={activeImage === 0}
                  className="w-full h-full object-contain"
                />
              )}
            </motion.div>
            {product.images.length > 1 && (
              <div className="grid grid-cols-3 md:grid-cols-2 md:items-start gap-3">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`aspect-[3/4] md:aspect-auto overflow-hidden transition-all duration-300 ${
                      activeImage === i ? 'ring-1 ring-ink ring-offset-2' : 'opacity-60 hover:opacity-90'
                    }`}
                  >
                    <Image
                      src={img}
                      alt=""
                      width={300}
                      height={400}
                      className="w-full h-full object-cover md:h-auto md:w-full md:object-contain md:aspect-auto"
                    />
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
                    {sizeGuideData && (
                      <button
                        onClick={() => setSizeGuideOpen(true)}
                        className="text-xs text-smoke hover:text-ink underline underline-offset-2 transition-colors"
                      >
                        Size Guide
                      </button>
                    )}
                  </div>
                  {allSizesSoldOut ? (
                    <div className="w-full border border-hairline px-5 py-3 flex items-center justify-center">
                      <p className="text-xs text-muted uppercase tracking-[0.15em]">Sold Out</p>
                    </div>
                  ) : (
                    <>
                      <div className={`flex flex-wrap gap-3 ${sizeError ? 'animate-shake' : ''}`}>
                        {product.sizes.map((s) => {
                          const variantForSize = product.variants.find((v) =>
                            v.selectedOptions.some((o) => o.name.toLowerCase() === 'size' && o.value === s)
                          );
                          const disabled = variantForSize ? !variantForSize.availableForSale : false;
                          const isSelected = selectedSize === s;
                          return (
                            <div key={s} className="flex flex-col items-center gap-1">
                              <button
                                type="button"
                                aria-selected={isSelected}
                                aria-disabled={disabled}
                                onClick={() => {
                                  if (disabled) {
                                    triggerSoldOutTap();
                                    return;
                                  }
                                  setSoldOutTap(false);
                                  setSelectedSize(s);
                                }}
                                className={`w-12 h-12 text-sm font-medium transition-all duration-300 ${
                                  isSelected
                                    ? 'bg-ink border-2 border-ink text-primary shadow-sm'
                                    : disabled
                                      ? 'bg-hairline/60 border border-hairline text-smoke opacity-60 cursor-not-allowed'
                                      : 'bg-primary border border-hairline text-ink hover:bg-ink hover:border-ink hover:text-primary'
                                }`}
                              >
                                {s}
                              </button>
                              <span
                                aria-hidden={!disabled}
                                className={`text-[9px] uppercase tracking-[0.1em] text-muted transition-opacity duration-200 ${disabled ? 'opacity-100' : 'opacity-0'}`}
                              >
                                Sold Out
                              </span>
                            </div>
                          );
                        })}
                      </div>
                      {soldOutTap ? (
                        <p className="text-xs mt-1 text-smoke">This size is currently sold out.</p>
                      ) : !selectedSize ? (
                        <p className={`text-xs mt-1 transition-colors duration-200 ${sizeError ? 'text-red-500 font-medium' : 'text-muted'}`}>
                          Please select a size
                        </p>
                      ) : null}
                    </>
                  )}
                </div>
              )}

              {/* Size guide access when the size selector is hidden (sold out).
                  Sizing info stays useful for sold-out / restocking pieces. */}
              {productSoldOut && sizeGuideData && (
                <div className="mb-6">
                  <button
                    onClick={() => setSizeGuideOpen(true)}
                    className="text-xs text-smoke hover:text-ink underline underline-offset-2 transition-colors"
                  >
                    Size Guide
                  </button>
                </div>
              )}

              {/* Quantity */}
              {!productSoldOut && !variantSoldOut && (
                <div className="mb-8">
                  <div className="flex items-center gap-4">
                    <p className="eyebrow">Qty</p>
                    <div className={`flex items-center border border-hairline ${qtyShake ? 'animate-shake-subtle' : ''}`}>
                      <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-10 h-10 text-smoke hover:text-ink transition-colors flex items-center justify-center text-lg">−</button>
                      <span className="w-10 text-center text-sm">{qty}</span>
                      <button
                        onClick={() => {
                          if (atMaxQty) {
                            triggerQtyShake();
                            return;
                          }
                          setQty((q) => (maxQty !== null ? Math.min(q + 1, maxQty) : q + 1));
                        }}
                        aria-disabled={atMaxQty}
                        className={`w-10 h-10 text-smoke hover:text-ink transition-colors flex items-center justify-center ${atMaxQty ? 'opacity-30 cursor-not-allowed hover:text-smoke' : ''}`}
                      >
                        +
                      </button>
                    </div>
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
                      disabled={variantSoldOut || isAddingToCart || isBuyingNow}
                      className={`btn-primary w-full transition-all duration-500 ${variantSoldOut ? 'opacity-40 cursor-not-allowed' : ''}`}
                    >
                      {isAddingToCart ? 'Adding…' : 'Add to Cart'}
                    </button>
                    <button
                      onClick={handleBuyNow}
                      disabled={variantSoldOut || isAddingToCart || isBuyingNow}
                      className={`btn-outline w-full ${variantSoldOut ? 'opacity-40 cursor-not-allowed' : ''}`}
                    >
                      {isBuyingNow ? 'Processing…' : 'Buy Now'}
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

              {/* Pop-Up location (static banner, always visible) */}
              <a
                href="https://www.google.com/maps/search/?api=1&query=3-530+Speers+Rd%2C+Oakville+Ontario+L6K+2E5%2C+Canada"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 border border-hairline p-4 flex items-start gap-3 hover:border-accent transition-colors duration-300 group"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-smoke group-hover:text-ink transition-colors flex-shrink-0 mt-0.5">
                  <path d="M12 21s-7-6.5-7-11.5a7 7 0 1 1 14 0C19 14.5 12 21 12 21Z" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="12" cy="9.5" r="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div>
                  <p className="text-xs text-ink font-medium underline underline-offset-2">Pop Up — July 26, 12–3PM</p>
                  <p className="text-xs text-smoke mt-1">3-530 Speers Rd, Oakville Ontario L6K 2E5, Canada</p>
                </div>
              </a>

              {/* Trust signals */}
              <div className="mt-8 pt-8 border-t border-hairline space-y-3">
                {[
                  { icon: '✦', text: 'Complimentary shipping on orders above $250' },
                  { icon: '✦', text: 'Each piece finished by hand' },
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
                              <div
                                className="!text-xs text-smoke leading-relaxed prose-nurhaus"
                                dangerouslySetInnerHTML={{ __html: fabricHtml }}
                              />
                            ) : (
                              <div className="!text-xs text-smoke leading-relaxed prose-nurhaus">
                                {careCopy.split('\n').map((line, i) => (
                                  <p key={i} className={i > 0 ? 'mt-1.5' : ''}>{line}</p>
                                ))}
                              </div>
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

      {/* Related products — continuous auto-sliding marquee of every other product */}
      {related.length > 0 && (
        <div className="border-t border-hairline">
          <div className="site-max site-px pt-20">
            <p className="eyebrow mb-3">You May Also Consider</p>
            <h2 className="font-display text-3xl md:text-4xl tracking-tight mb-12">The Collection</h2>
          </div>
          <div className="marquee-row overflow-hidden pb-20">
            <div
              className="marquee-track flex gap-6 w-max"
              style={{ ['--marquee-duration' as string]: `${related.length * 5}s` }}
            >
              {[...related, ...related].map((p, i) => (
                <Link key={`${p.handle}-${i}`} href={`/products/${p.handle}`} className="group block flex-shrink-0 w-[260px] md:w-[300px]">
                  <div className="aspect-[3/4] overflow-hidden bg-secondary/20 mb-4 product-card-img">
                    {p.images[0] && (
                      <Image src={p.images[0]} alt={p.name} width={300} height={400} loading="lazy" className="w-full h-full object-cover" />
                    )}
                  </div>
                  <p className="font-product text-lg group-hover:text-accent transition-colors">{p.name}</p>
                  <p className="text-sm text-smoke mt-1">${p.price.toLocaleString()}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Size Guide Modal */}
      {sizeGuideData && (
        <SizeGuideModal
          isOpen={sizeGuideOpen}
          onClose={() => setSizeGuideOpen(false)}
          productName={product.name}
          guide={sizeGuideData}
        />
      )}
    </div>
  );
}
