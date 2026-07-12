'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

type Section = 'orders' | 'wishlist' | 'addresses' | 'settings';

const NAV_ITEMS: { id: Section; label: string }[] = [
  { id: 'orders',    label: 'Orders' },
  { id: 'addresses', label: 'Addresses' },
  { id: 'settings',  label: 'Settings' },
];

const ORDERS = [
  { id: 'NH-2026-0041', date: 'June 15, 2026', status: 'Delivered',   items: 2, total: '$1,120' },
  { id: 'NH-2026-0029', date: 'May  22, 2026',  status: 'Delivered',   items: 1, total: '$480'   },
  { id: 'NH-2025-0198', date: 'Nov  08, 2025',  status: 'Delivered',   items: 3, total: '$1,610' },
];

const WISHLIST = [
  { name: 'Layla', price: '$680', handle: 'layla',   image: 'https://images.unsplash.com/photo-1760083545495-b297b1690672?auto=format&fit=crop&w=600&q=80' },
  { name: 'Amelie',  price: '$420', handle: 'amelie',    image: 'https://images.unsplash.com/photo-1762605135318-f34a993cbcf0?auto=format&fit=crop&w=600&q=80' },
  { name: 'Yara', price: '$720', handle: 'yara',    image: 'https://images.unsplash.com/photo-1772474500365-c2c520545f44?auto=format&fit=crop&w=600&q=80' },
];

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22,1,0.36,1] } } };

function OrdersSection() {
  return (
    <div>
      <p className="font-display text-2xl tracking-tight mb-8">Your Orders</p>
      {ORDERS.length === 0 ? (
        <div className="text-center py-24 border border-hairline">
          <p className="font-display text-2xl mb-3">No orders yet.</p>
          <p className="text-smoke text-sm mb-8">Your orders will appear here once placed.</p>
          <Link href="/shop" className="btn-primary">Shop the Collection</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {ORDERS.map((order, i) => (
            <motion.div
              key={order.id}
              className="border border-hairline p-6 hover:border-accent transition-colors duration-400"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs text-muted tracking-widest uppercase mb-1">Order {order.id}</p>
                  <p className="font-display text-lg mb-1">{order.date}</p>
                  <p className="text-xs text-smoke">{order.items} item{order.items > 1 ? 's' : ''}</p>
                </div>
                <div className="text-right">
                  <p className="font-display text-xl mb-2">{order.total}</p>
                  <span className="inline-block text-[0.65rem] tracking-widest uppercase px-3 py-1 border border-hairline text-smoke">
                    {order.status}
                  </span>
                </div>
              </div>
              <div className="mt-5 pt-5 border-t border-hairline flex items-center gap-6">
                <button className="text-xs text-smoke hover:text-ink transition-colors tracking-wide">View Details</button>
                <button className="text-xs text-smoke hover:text-ink transition-colors tracking-wide">Track Order</button>
                <button className="text-xs text-smoke hover:text-ink transition-colors tracking-wide">Request Store Credit</button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

function WishlistSection() {
  const [items, setItems] = useState(WISHLIST);
  return (
    <div>
      <p className="font-display text-2xl tracking-tight mb-8">Saved Pieces</p>
      {items.length === 0 ? (
        <div className="text-center py-24 border border-hairline">
          <p className="font-display text-2xl mb-3">Nothing saved yet.</p>
          <p className="text-smoke text-sm mb-8">Items you wishlist will appear here.</p>
          <Link href="/shop" className="btn-primary">Explore the Collection</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <motion.div key={item.handle} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
              <div className="relative aspect-[3/4] overflow-hidden mb-4 bg-secondary/20">
                <Image src={item.image} alt={item.name} fill className="object-cover object-center product-card-img" />
                <button
                  onClick={() => setItems((prev) => prev.filter((p) => p.handle !== item.handle))}
                  className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-primary/90 hover:bg-primary transition-colors"
                  aria-label="Remove from wishlist"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
              <p className="text-xs text-muted tracking-widest uppercase mb-1">NÜR HAUS</p>
              <p className="font-display text-lg mb-1">{item.name}</p>
              <p className="text-sm text-smoke mb-4">{item.price}</p>
              <Link href={`/products/${item.handle}`} className="btn-outline w-full block text-center text-sm py-3">View Product</Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

function AddressesSection() {
  return (
    <div>
      <p className="font-display text-2xl tracking-tight mb-8">Saved Addresses</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border border-accent p-6 relative">
          <span className="absolute top-4 right-4 text-[0.6rem] tracking-widest uppercase text-accent">Default</span>
          <p className="font-display text-lg mb-3">Home</p>
          <div className="text-sm text-smoke space-y-1">
            <p>Amira Al-Hassan</p>
            <p>24 Mayfair Lane</p>
            <p>London W1K 5AB</p>
            <p>United Kingdom</p>
          </div>
          <div className="mt-5 pt-4 border-t border-hairline flex gap-4">
            <button className="text-xs text-smoke hover:text-ink transition-colors">Edit</button>
            <button className="text-xs text-smoke hover:text-ink transition-colors">Delete</button>
          </div>
        </div>
        <button className="border border-dashed border-hairline p-6 flex flex-col items-center justify-center gap-3 text-muted hover:border-accent hover:text-accent transition-all duration-400 min-h-[160px]">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span className="text-xs tracking-widest uppercase">Add Address</span>
        </button>
      </div>
    </div>
  );
}

function SettingsSection() {
  return (
    <div>
      <p className="font-display text-2xl tracking-tight mb-8">Account Settings</p>
      <form className="max-w-lg space-y-8" onSubmit={(e) => e.preventDefault()}>
        <div className="space-y-6">
          <p className="eyebrow">Personal Information</p>
          {[
            { id: 'firstName', label: 'First Name', value: 'Amira' },
            { id: 'lastName',  label: 'Last Name',  value: 'Al-Hassan' },
            { id: 'email',     label: 'Email',      value: 'amira@example.com' },
          ].map((f) => (
            <div key={f.id}>
              <label htmlFor={f.id} className="text-xs text-muted tracking-widest uppercase block mb-2">{f.label}</label>
              <input id={f.id} type="text" defaultValue={f.value} className="input-luxury" />
            </div>
          ))}
        </div>
        <div className="space-y-6 pt-6 border-t border-hairline">
          <p className="eyebrow">Preferences</p>
          {[
            { label: 'Order updates & tracking',   checked: true  },
            { label: 'New arrivals & campaigns',   checked: true  },
            { label: 'Exclusive member offers',    checked: false },
            { label: 'Brand news & journal posts', checked: false },
          ].map((pref) => (
            <label key={pref.label} className="flex items-center gap-4 cursor-pointer group">
              <div className={`w-4 h-4 border flex-shrink-0 flex items-center justify-center transition-colors ${pref.checked ? 'border-ink bg-ink' : 'border-hairline group-hover:border-smoke'}`}>
                {pref.checked && <svg width="8" height="8" viewBox="0 0 12 12" fill="none"><polyline points="2 6 5 9 10 3" stroke="white" strokeWidth="1.5" /></svg>}
              </div>
              <span className="text-sm text-smoke">{pref.label}</span>
            </label>
          ))}
        </div>
        <div className="pt-6 border-t border-hairline">
          <button type="submit" className="btn-primary px-12">Save Changes</button>
        </div>
      </form>
    </div>
  );
}

export default function AccountPage() {
  const [active, setActive] = useState<Section>('orders');

  const sections: Record<Section, React.ReactNode> = {
    orders:    <OrdersSection />,
    wishlist:  <WishlistSection />,
    addresses: <AddressesSection />,
    settings:  <SettingsSection />,
  };

  return (
    <div className="page-enter">
      <div className="site-max site-px py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-12 lg:gap-20">
          {/* Sidebar nav */}
          <nav className="flex flex-row lg:flex-col gap-1 border-b lg:border-b-0 lg:border-r border-hairline pb-6 lg:pb-0 lg:pr-12">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => setActive(item.id)}
                className={`text-left py-2.5 lg:py-3 text-sm transition-colors duration-300 relative ${
                  active === item.id ? 'text-ink font-medium' : 'text-muted hover:text-smoke'
                }`}
              >
                {item.label}
                {active === item.id && (
                  <motion.div layoutId="account-indicator" className="absolute -bottom-0 left-0 lg:left-auto lg:-right-12 right-0 h-px lg:h-full lg:w-px lg:top-0 bg-ink" />
                )}
              </button>
            ))}
            <div className="hidden lg:block mt-auto pt-8 border-t border-hairline">
              <button className="text-xs text-muted hover:text-smoke transition-colors tracking-wide">Sign Out</button>
            </div>
          </nav>

          {/* Main content */}
          <div>
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4, ease: [0.22,1,0.36,1] }}
              >
                {sections[active]}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
