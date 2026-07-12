'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import type { AppProduct } from '@/lib/shopify/types';

const FREE_SHIPPING_THRESHOLD = 500;

export default function CartPageClient({
  crossSell,
  shopifyDomain,
}: {
  crossSell: AppProduct[];
  shopifyDomain?: string | null;
}) {
  const { cart, isLoading, isMutating, updateItem, removeItem } = useCart();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const lines = cart?.lines ?? [];
  const subtotal = cart?.subtotal ?? 0;
  const progress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const remaining = Math.max(FREE_SHIPPING_THRESHOLD - subtotal, 0);

  const handleCheckout = () => {
    if (!cart?.checkoutUrl) return;

    // Raw *.myshopify.com host to force the checkout onto. NEXT_PUBLIC_* is
    // inlined into the client bundle at build time; we fall back to the value
    // passed from the server (SHOPIFY_STORE_DOMAIN) so this still resolves if the
    // public var wasn't present at build. Strip any protocol/path just in case.
    const shopHost = (process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || shopifyDomain || '')
      .replace(/^https?:\/\//, '')
      .replace(/\/.*$/, '')
      .trim();

    let target = cart.checkoutUrl;

    if (shopHost) {
      try {
        // The URL constructor is domain-agnostic: overwriting the hostname forces
        // the host no matter what Shopify returned — www.nurhaus.ca,
        // nurhaus.vercel.app, localhost:3000, bare nurhaus.ca, anything.
        const checkoutUrlObj = new URL(cart.checkoutUrl);
        checkoutUrlObj.protocol = 'https:';
        checkoutUrlObj.hostname = shopHost;
        checkoutUrlObj.port = ''; // drop any :port (e.g. localhost:3000)
        target = checkoutUrlObj.toString();
      } catch {
        // Fallback if checkoutUrl isn't parseable: swap protocol + host outright.
        target = cart.checkoutUrl.replace(/^https?:\/\/[^/]+/, `https://${shopHost}`);
      }
    } else {
      // Guard: without a domain we must NOT set hostname (it would become the
      // string "undefined"). Leave the URL untouched and flag the misconfig.
      console.warn(
        'Checkout domain rewrite skipped: NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN is not set. ' +
        'Set it (e.g. pzg1g0-q9.myshopify.com) in Vercel and redeploy.'
      );
    }

    setIsRedirecting(true);
    console.log('Redirecting to:', target);
    // Use window.location.href for guaranteed external navigation
    window.location.href = target;
  };

  return (
    <div className="page-enter">
      <div className="site-max site-px pt-16 pb-8 border-b border-hairline">
        <motion.p className="eyebrow mb-3" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          Shopping Cart
        </motion.p>
        <motion.h1
          className="font-display text-[2.5rem] md:text-[4rem] leading-tight tracking-tight"
          initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.8, ease: [0.22,1,0.36,1] }}
        >
          Your Cart
          {lines.length > 0 && (
            <span className="font-sans text-lg font-normal text-muted ml-4">({cart?.totalQuantity ?? 0})</span>
          )}
        </motion.h1>
      </div>

      {isLoading ? (
        <div className="site-max site-px py-32 text-center">
          <p className="text-smoke text-sm">Loading cart…</p>
        </div>
      ) : lines.length === 0 ? (
        <div className="site-max site-px py-32 text-center">
          <p className="font-display text-3xl mb-4">Your cart is empty.</p>
          <p className="text-smoke text-sm mb-10">Every piece in our collection is made to last.</p>
          <Link href="/shop" className="btn-primary">Explore the Collection</Link>
        </div>
      ) : (
        <div className="site-max site-px py-12">
          {/* Shipping progress */}
          <div className="mb-10 p-5 border border-hairline">
            <div className="flex items-center justify-between mb-3 text-sm">
              <p className="text-smoke">
                {remaining > 0
                  ? <><span className="text-ink font-medium">${remaining.toLocaleString()}</span> away from complimentary shipping</>
                  : <span className="text-accent">You have complimentary shipping.</span>
                }
              </p>
              <span className="text-xs text-muted">${FREE_SHIPPING_THRESHOLD} threshold</span>
            </div>
            <div className="h-px bg-hairline relative overflow-hidden">
              <motion.div
                className="h-full bg-accent absolute left-0 top-0"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.8, ease: [0.22,1,0.36,1] }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-12 lg:gap-20">
            {/* Items */}
            <div>
              <div className="border-t border-hairline">
                <AnimatePresence initial={false}>
                  {lines.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.4, ease: [0.22,1,0.36,1] }}
                      className="border-b border-hairline overflow-hidden"
                    >
                      <div className="flex gap-6 py-6">
                        <Link href={`/products/${item.productHandle}`} className="flex-shrink-0 w-24 h-32 relative bg-secondary/20 overflow-hidden">
                          {item.image && <Image src={item.image} alt={item.productTitle} fill className="object-cover object-center" />}
                        </Link>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4 mb-1">
                            <Link href={`/products/${item.productHandle}`} className="font-display text-lg hover:text-accent transition-colors">{item.productTitle}</Link>
                            <p className="font-display text-lg flex-shrink-0">${item.lineTotal.toLocaleString()}</p>
                          </div>
                          {item.size && <p className="text-xs text-muted tracking-wide mb-5">Size {item.size}</p>}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 border border-hairline">
                              <button disabled={isMutating} onClick={() => updateItem(item.id, Math.max(1, item.quantity - 1))} className="w-9 h-9 flex items-center justify-center text-sm hover:bg-secondary/30 transition-colors disabled:opacity-40" aria-label="Decrease quantity">−</button>
                              <span className="text-sm w-4 text-center">{item.quantity}</span>
                              <button disabled={isMutating} onClick={() => updateItem(item.id, item.quantity + 1)} className="w-9 h-9 flex items-center justify-center text-sm hover:bg-secondary/30 transition-colors disabled:opacity-40" aria-label="Increase quantity">+</button>
                            </div>
                            <button disabled={isMutating} onClick={() => removeItem(item.id)} className="text-xs text-muted hover:text-smoke transition-colors tracking-wide disabled:opacity-40">Remove</button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Summary */}
            <div>
              <div className="sticky top-[144px] border border-hairline p-7">
                <p className="eyebrow mb-6">Order Summary</p>
                <div className="space-y-3 text-sm mb-6">
                  <div className="flex justify-between">
                    <span className="text-smoke">Subtotal</span>
                    <motion.span key={subtotal} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-medium">
                      ${subtotal.toLocaleString()}
                    </motion.span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-smoke">Shipping</span>
                    <span className={remaining > 0 ? 'text-smoke' : 'text-accent'}>
                      {remaining > 0 ? 'Calculated at checkout' : 'Complimentary'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-smoke">Duties & Taxes</span>
                    <span className="text-smoke">Calculated at checkout</span>
                  </div>
                </div>
                <div className="border-t border-hairline pt-5 mb-7">
                  <div className="flex justify-between">
                    <span className="font-display text-xl">Total</span>
                    <motion.span key={subtotal} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="font-display text-xl">
                      ${subtotal.toLocaleString()}
                    </motion.span>
                  </div>
                  <p className="text-xs text-muted mt-1.5">Excluding duties where applicable</p>
                </div>
                <button
                  onClick={handleCheckout}
                  disabled={!cart?.checkoutUrl || isRedirecting}
                  className={`btn-primary w-full block text-center mb-4 ${!cart?.checkoutUrl || isRedirecting ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  {isRedirecting ? 'Redirecting...' : 'Proceed to Checkout'}
                </button>
                <Link href="/shop" className="btn-outline w-full block text-center text-sm py-3">Continue Shopping</Link>
                <div className="mt-6 pt-5 border-t border-hairline flex items-center justify-center gap-4 text-muted">
                  {['Visa', 'Mastercard', 'PayPal', 'Apple Pay', 'Shop Pay'].map((p) => (
                    <span key={p} className="text-[0.6rem] tracking-widest uppercase">{p}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Cross-sell */}
          {crossSell.length > 0 && (
            <div className="mt-20 pt-12 border-t border-hairline">
              <p className="eyebrow mb-3">You May Also Like</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-5 mt-8">
                {crossSell.map((p, i) => (
                  <motion.div
                    key={p.handle}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                  >
                    <Link href={`/products/${p.handle}`} className="group block">
                      <div className="aspect-[3/4] relative overflow-hidden bg-secondary/20 mb-3">
                        {p.images[0] && <Image src={p.images[0]} alt={p.name} fill className="object-cover object-center product-card-img" />}
                      </div>
                      <p className="font-product text-base group-hover:text-accent transition-colors mb-1">{p.name}</p>
                      <p className="text-sm text-smoke">${p.price.toLocaleString()}</p>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
