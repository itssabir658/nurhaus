'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

const INITIAL_ITEMS = [
  {
    id: 'sahar-abaya-s',
    name: 'The Sahar Abaya',
    variant: 'Ivory — S',
    price: 680,
    qty: 1,
    image: 'https://images.unsplash.com/photo-1760083545495-b297b1690672?auto=format&fit=crop&w=400&q=80',
    handle: 'sahar-abaya',
  },
  {
    id: 'noor-dress-m',
    name: 'The Noor Dress',
    variant: 'Dusk — M',
    price: 420,
    qty: 1,
    image: 'https://images.unsplash.com/photo-1762605135318-f34a993cbcf0?auto=format&fit=crop&w=400&q=80',
    handle: 'noor-dress',
  },
];

const CROSS_SELL = [
  { name: 'The Layl Abaya',  price: '$720', handle: 'layl-abaya',    image: 'https://images.unsplash.com/photo-1772474500365-c2c520545f44?auto=format&fit=crop&w=400&q=80' },
  { name: 'The Dunya Dress', price: '$390', handle: 'dunya-dress',   image: 'https://images.unsplash.com/photo-1764179690247-df7f4014def7?auto=format&fit=crop&w=400&q=80' },
  { name: 'The Zahra Dress', price: '$470', handle: 'zahra-dress',   image: 'https://images.unsplash.com/photo-1772714601004-23b94ae3913d?auto=format&fit=crop&w=400&q=80' },
];

const FREE_SHIPPING_THRESHOLD = 500;

export default function CartPage() {
  const [items, setItems] = useState(INITIAL_ITEMS);

  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const progress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const remaining = Math.max(FREE_SHIPPING_THRESHOLD - subtotal, 0);

  const updateQty = (id: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((item) => item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item)
    );
  };

  const remove = (id: string) => setItems((prev) => prev.filter((i) => i.id !== id));

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
          {items.length > 0 && (
            <span className="font-sans text-lg font-normal text-muted ml-4">({items.length})</span>
          )}
        </motion.h1>
      </div>

      {items.length === 0 ? (
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
                  ? <><span className="text-ink font-medium">${remaining}</span> away from complimentary shipping</>
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
                  {items.map((item) => (
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
                        <Link href={`/products/${item.handle}`} className="flex-shrink-0 w-24 h-32 relative bg-secondary/20 overflow-hidden">
                          <Image src={item.image} alt={item.name} fill className="object-cover object-center" />
                        </Link>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4 mb-1">
                            <Link href={`/products/${item.handle}`} className="font-display text-lg hover:text-accent transition-colors">{item.name}</Link>
                            <p className="font-display text-lg flex-shrink-0">${(item.price * item.qty).toLocaleString()}</p>
                          </div>
                          <p className="text-xs text-muted tracking-wide mb-5">{item.variant}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 border border-hairline">
                              <button onClick={() => updateQty(item.id, -1)} className="w-9 h-9 flex items-center justify-center text-sm hover:bg-secondary/30 transition-colors" aria-label="Decrease quantity">−</button>
                              <span className="text-sm w-4 text-center">{item.qty}</span>
                              <button onClick={() => updateQty(item.id, +1)} className="w-9 h-9 flex items-center justify-center text-sm hover:bg-secondary/30 transition-colors" aria-label="Increase quantity">+</button>
                            </div>
                            <button onClick={() => remove(item.id)} className="text-xs text-muted hover:text-smoke transition-colors tracking-wide">Remove</button>
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
                <Link href="/checkout" className="btn-primary w-full block text-center mb-4">Proceed to Checkout</Link>
                <Link href="/shop" className="btn-outline w-full block text-center text-sm py-3">Continue Shopping</Link>
                <div className="mt-6 pt-5 border-t border-hairline flex items-center justify-center gap-4 text-muted">
                  {['Visa', 'Mastercard', 'PayPal', 'Apple Pay'].map((p) => (
                    <span key={p} className="text-[0.6rem] tracking-widest uppercase">{p}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Cross-sell */}
          <div className="mt-20 pt-12 border-t border-hairline">
            <p className="eyebrow mb-3">You May Also Like</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5 mt-8">
              {CROSS_SELL.map((p, i) => (
                <motion.div
                  key={p.handle}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                >
                  <Link href={`/products/${p.handle}`} className="group block">
                    <div className="aspect-[3/4] relative overflow-hidden bg-secondary/20 mb-3">
                      <Image src={p.image} alt={p.name} fill className="object-cover object-center product-card-img" />
                    </div>
                    <p className="font-display text-base group-hover:text-accent transition-colors mb-1">{p.name}</p>
                    <p className="text-sm text-smoke">{p.price}</p>
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
