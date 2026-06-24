'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';

interface CartDrawerProps {
  open:    boolean;
  onClose: () => void;
}

const SHIPPING_THRESHOLD = 500;

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { cart, isLoading, isMutating, updateItem, removeItem } = useCart();
  const lines = cart?.lines ?? [];
  const subtotal = cart?.subtotal ?? 0;
  const shippingProgress = Math.min((subtotal / SHIPPING_THRESHOLD) * 100, 100);

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
                <p className="text-xs text-smoke mt-0.5">{cart?.totalQuantity ?? 0} items</p>
              </div>
              <button onClick={onClose} aria-label="Close cart" className="text-smoke hover:text-ink transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* Shipping progress */}
            <div className="px-8 py-4 border-b border-hairline bg-secondary/30 flex-shrink-0">
              {subtotal >= SHIPPING_THRESHOLD ? (
                <p className="text-xs text-accent font-medium tracking-wide">
                  Complimentary shipping unlocked.
                </p>
              ) : (
                <p className="text-xs text-smoke mb-2.5">
                  <span className="text-ink font-medium">${(SHIPPING_THRESHOLD - subtotal).toLocaleString()}</span> away from complimentary shipping
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
              {isLoading ? (
                <div className="h-full flex items-center justify-center">
                  <p className="text-sm text-muted">Loading cart…</p>
                </div>
              ) : lines.length === 0 ? (
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
                  {lines.map((item) => (
                    <li key={item.id} className="flex gap-5">
                      <div className="w-24 h-32 flex-shrink-0 product-card-img">
                        {item.image && (
                          <Image
                            src={item.image}
                            alt={item.productTitle}
                            width={96}
                            height={128}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div>
                          <p className="font-display text-base leading-tight mb-1">{item.productTitle}</p>
                          {item.size && <p className="text-xs text-smoke">Size: {item.size}</p>}
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 border border-hairline">
                            <button
                              disabled={isMutating}
                              onClick={() => updateItem(item.id, Math.max(1, item.quantity - 1))}
                              className="w-8 h-8 flex items-center justify-center text-smoke hover:text-ink transition-colors text-lg disabled:opacity-40"
                            >
                              −
                            </button>
                            <span className="text-sm w-4 text-center">{item.quantity}</span>
                            <button
                              disabled={isMutating}
                              onClick={() => updateItem(item.id, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center text-smoke hover:text-ink transition-colors disabled:opacity-40"
                            >
                              +
                            </button>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">${item.lineTotal.toLocaleString()}</p>
                            <button
                              disabled={isMutating}
                              onClick={() => removeItem(item.id)}
                              className="text-[0.65rem] text-muted hover:text-smoke transition-colors tracking-wide uppercase mt-0.5 disabled:opacity-40"
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
            {lines.length > 0 && (
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
