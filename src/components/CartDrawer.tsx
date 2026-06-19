'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

interface CartItem {
  id:       string;
  name:     string;
  price:    number;
  size:     string;
  qty:      number;
  image:    string;
}

interface CartDrawerProps {
  open:          boolean;
  onClose:       () => void;
  onCountChange: (n: number) => void;
}

const SAMPLE_ITEMS: CartItem[] = [
  {
    id: 'sahar',
    name: 'The Sahar Abaya',
    price: 680,
    size: 'S',
    qty: 1,
    image: 'https://images.unsplash.com/photo-1760083545495-b297b1690672?auto=format&fit=crop&w=400&q=80',
  },
];

export default function CartDrawer({ open, onClose, onCountChange }: CartDrawerProps) {
  const [items, setItems] = useState<CartItem[]>(SAMPLE_ITEMS);

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const shippingThreshold = 500;
  const shippingProgress   = Math.min((subtotal / shippingThreshold) * 100, 100);

  useEffect(() => {
    onCountChange(items.reduce((s, i) => s + i.qty, 0));
  }, [items, onCountChange]);

  const remove = (id: string) => setItems((prev) => prev.filter((i) => i.id !== id));
  const updateQty = (id: string, delta: number) =>
    setItems((prev) =>
      prev.map((i) => i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i)
    );

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-midnight/40 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-0 right-0 bottom-0 z-[70] w-full max-w-[420px] bg-primary flex flex-col shadow-2xl"
            aria-label="Shopping cart"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-8 h-20 border-b border-hairline flex-shrink-0">
              <div>
                <p className="eyebrow">Your Cart</p>
                <p className="text-xs text-smoke mt-0.5">{items.reduce((s,i) => s+i.qty, 0)} items</p>
              </div>
              <button onClick={onClose} aria-label="Close cart" className="text-smoke hover:text-ink transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* Shipping progress */}
            <div className="px-8 py-4 border-b border-hairline bg-secondary/30 flex-shrink-0">
              {subtotal >= shippingThreshold ? (
                <p className="text-xs text-accent font-medium tracking-wide">
                  Complimentary shipping unlocked.
                </p>
              ) : (
                <p className="text-xs text-smoke mb-2.5">
                  <span className="text-ink font-medium">${(shippingThreshold - subtotal).toLocaleString()}</span> away from complimentary shipping
                </p>
              )}
              <div className="h-px bg-hairline mt-2">
                <div
                  className="h-full bg-accent transition-all duration-700 ease-expo"
                  style={{ width: `${shippingProgress}%` }}
                />
              </div>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-8 py-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-muted mb-4">
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <path d="M16 10a4 4 0 0 1-8 0" />
                  </svg>
                  <p className="text-smoke text-sm mb-6">Your cart is empty</p>
                  <Link href="/shop" onClick={onClose} className="btn-outline text-sm">Explore Collection</Link>
                </div>
              ) : (
                <ul className="space-y-8">
                  {items.map((item) => (
                    <li key={item.id} className="flex gap-5">
                      <div className="w-24 h-32 flex-shrink-0 product-card-img">
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={96}
                          height={128}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div>
                          <p className="font-display text-base leading-tight mb-1">{item.name}</p>
                          <p className="text-xs text-smoke">Size: {item.size}</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 border border-hairline">
                            <button
                              onClick={() => updateQty(item.id, -1)}
                              className="w-8 h-8 flex items-center justify-center text-smoke hover:text-ink transition-colors text-lg"
                            >
                              −
                            </button>
                            <span className="text-sm w-4 text-center">{item.qty}</span>
                            <button
                              onClick={() => updateQty(item.id, 1)}
                              className="w-8 h-8 flex items-center justify-center text-smoke hover:text-ink transition-colors"
                            >
                              +
                            </button>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">${(item.price * item.qty).toLocaleString()}</p>
                            <button
                              onClick={() => remove(item.id)}
                              className="text-[0.65rem] text-muted hover:text-smoke transition-colors tracking-wide uppercase mt-0.5"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-hairline px-8 py-6 flex-shrink-0">
                <div className="flex justify-between items-baseline mb-6">
                  <span className="text-sm text-smoke">Subtotal</span>
                  <span className="font-display text-2xl">${subtotal.toLocaleString()}</span>
                </div>
                <Link
                  href="/cart"
                  onClick={onClose}
                  className="btn-primary w-full mb-3 block text-center"
                >
                  Checkout
                </Link>
                <button
                  onClick={onClose}
                  className="w-full text-center text-xs text-smoke hover:text-ink transition-colors tracking-wide py-2"
                >
                  Continue shopping
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
