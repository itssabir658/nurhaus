'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const CATEGORIES = [
  {
    id: 'orders',
    label: 'Orders',
    faqs: [
      { q: 'How do I place an order?', a: 'Browse the collection, select your size and add to cart. You can checkout as a guest or create an account for faster future purchases. We accept all major credit cards, PayPal, and Apple Pay.' },
      { q: 'Can I change or cancel my order after placing it?', a: 'Orders can be amended or cancelled within 1 hour of placement by emailing sales@nurhaus.ca with your order number. After this window, the order moves to fulfilment and changes may not be possible.' },
      { q: 'Do you offer gift wrapping?', a: 'All NÜR HAUS orders arrive in our signature packaging. For gifting, you can add a handwritten note at checkout at no additional cost.' },
      { q: 'Is my payment information secure?', a: 'Yes. We use SSL encryption and never store your card details. All payments are processed through PCI-compliant third-party providers.' },
    ],
  },
  {
    id: 'shipping',
    label: 'Shipping',
    faqs: [
      { q: 'How long does delivery take?', a: 'Standard delivery takes 5–10 business days internationally. Express (2–3 days) and Overnight options are available at checkout. Canadian orders typically arrive within 2–5 days on standard.' },
      { q: 'Do you ship worldwide?', a: 'Yes. We ship to over 60 countries. Shipping rates and delivery times vary by destination and are calculated at checkout.' },
      { q: 'Will I be charged customs duties?', a: 'Customs duties and import taxes may apply depending on your country. These are not included in the product price and are the responsibility of the recipient. We cannot predict or control these charges.' },
      { q: 'How do I track my order?', a: 'You will receive a tracking email as soon as your order is dispatched. You can also track your order in your account under Order History.' },
    ],
  },
  {
    id: 'returns',
    label: 'Returns',
    faqs: [
      { q: 'What is your returns policy?', a: 'We do not offer refunds. Eligible unworn items in original condition with all tags attached may be returned within 5 days of delivery for store credit only. Please email sales@nurhaus.ca with your order number to begin.' },
      { q: 'Do you offer refunds?', a: 'No. All returns are issued as store credit only — never a refund to your original payment method. Store credit never expires and can be used on any future order.' },
      { q: 'How is my store credit issued?', a: 'Once your returned item is received and inspected, store credit is issued within 5–7 business days and sent to you by email as a code to use at checkout.' },
      { q: 'Can I exchange for a different size?', a: 'Yes. We offer exchanges within 5 days. Email sales@nurhaus.ca with your order number and preferred size. Exchanges are subject to availability.' },
    ],
  },
  {
    id: 'sizing',
    label: 'Sizing',
    faqs: [
      { q: 'How do your pieces fit?', a: 'Our pieces are designed with a relaxed, modest silhouette. They are generally true to size. If you are between sizes, we recommend sizing up. Full measurement details are on our Size Guide page.' },
      { q: 'Do you offer custom sizing?', a: 'We do not currently offer made-to-measure but our size range covers S–XL. If you need specific measurement guidance, our team is happy to help via email.' },
      { q: 'I am unsure between two sizes. What should I do?', a: 'Email us at sales@nurhaus.ca with your measurements and the piece you are considering. Our team will recommend the best fit based on the specific cut of that garment.' },
    ],
  },
  {
    id: 'care',
    label: 'Care',
    faqs: [
      { q: 'How should I care for my NÜR HAUS pieces?', a: 'Care instructions vary by fabric and are printed on the garment label. Most of our pieces are hand-wash or dry-clean only. Detailed care guidance is included in the product packaging.' },
      { q: 'Can I iron my pieces?', a: 'Most fabrics can be lightly steamed. Ironing directly should be done on a low setting with a pressing cloth. Never iron printed or embroidered sections.' },
      { q: 'What fabric are your pieces made from?', a: 'We use a range of premium natural and blended fabrics including silk crepe, fine wool, structured cotton, and chiffon. The exact fabric composition is listed on each product page.' },
    ],
  },
];

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0].id);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [search, setSearch] = useState('');

  const category = CATEGORIES.find((c) => c.id === activeCategory)!;

  const filtered = search.length > 1
    ? CATEGORIES.flatMap((c) => c.faqs.filter((f) => f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase())))
    : null;

  return (
    <div className="page-enter">
      {/* Header */}
      <div className="site-max site-px pt-16 pb-12 border-b border-hairline">
        <motion.p className="eyebrow mb-4" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          FAQ
        </motion.p>
        <motion.h1
          className="font-display text-[3rem] md:text-[5rem] leading-tight tracking-tight mb-8"
          initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.9, ease: [0.22,1,0.36,1] }}
        >
          Frequently Asked<br /><em>Questions.</em>
        </motion.h1>

        {/* Search */}
        <motion.div
          className="relative max-w-md"
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
        >
          <svg className="absolute left-0 top-1/2 -translate-y-1/2 text-muted" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setOpenFaq(null); }}
            placeholder="Search questions…"
            className="w-full pl-7 pb-3 pt-1 bg-transparent border-b border-hairline focus:border-ink text-sm text-ink placeholder:text-muted focus:outline-none transition-colors duration-300"
          />
        </motion.div>
      </div>

      <div className="site-max site-px py-16">
        {filtered !== null ? (
          /* Search results */
          <div>
            <p className="eyebrow mb-8">{filtered.length} result{filtered.length !== 1 ? 's' : ''} for &ldquo;{search}&rdquo;</p>
            <div className="max-w-2xl border-t border-hairline">
              {filtered.length === 0 ? (
                <div className="py-16 text-center">
                  <p className="font-display text-2xl mb-3">No results found.</p>
                  <p className="text-smoke text-sm mb-6">Try a different search or contact us directly.</p>
                  <Link href="/contact" className="btn-outline text-sm py-3 px-8">Contact Us</Link>
                </div>
              ) : (
                filtered.map((faq, i) => (
                  <FAQItem key={i} faq={faq} isOpen={openFaq === i} onToggle={() => setOpenFaq(openFaq === i ? null : i)} />
                ))
              )}
            </div>
          </div>
        ) : (
          /* Category browse */
          <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-12 lg:gap-20">
            {/* Category nav */}
            <nav className="flex flex-row lg:flex-col gap-1 border-b lg:border-b-0 lg:border-r border-hairline pb-6 lg:pb-0 lg:pr-12">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => { setActiveCategory(cat.id); setOpenFaq(null); }}
                  className={`text-left py-2.5 lg:py-3.5 text-sm transition-colors duration-300 relative ${
                    activeCategory === cat.id ? 'text-ink font-medium' : 'text-muted hover:text-smoke'
                  }`}
                >
                  {cat.label}
                  {activeCategory === cat.id && (
                    <motion.div layoutId="faq-indicator" className="absolute -bottom-0 left-0 lg:left-auto lg:-right-12 right-0 h-px lg:h-full lg:w-px lg:top-0 bg-ink" />
                  )}
                </button>
              ))}
            </nav>

            {/* FAQ items */}
            <div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCategory}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.4, ease: [0.22,1,0.36,1] }}
                >
                  <p className="font-display text-3xl tracking-tight mb-10">{category.label}</p>
                  <div className="border-t border-hairline">
                    {category.faqs.map((faq, i) => (
                      <FAQItem
                        key={i}
                        faq={faq}
                        isOpen={openFaq === i}
                        onToggle={() => setOpenFaq(openFaq === i ? null : i)}
                        index={i}
                      />
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      <div className="border-t border-hairline bg-secondary/20">
        <div className="site-max site-px py-16 md:py-20 text-center">
          <p className="font-display text-2xl md:text-3xl tracking-tight mb-8">Still have a question?</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="btn-primary">Contact Us</Link>
            <a href="https://wa.me/16479386284" className="btn-outline">WhatsApp</a>
          </div>
        </div>
      </div>
    </div>
  );
}

function FAQItem({
  faq,
  isOpen,
  onToggle,
  index = 0,
}: {
  faq: { q: string; a: string };
  isOpen: boolean;
  onToggle: () => void;
  index?: number;
}) {
  return (
    <motion.div
      className="border-b border-hairline"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.5 }}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-start justify-between py-6 text-left gap-6 group"
        aria-expanded={isOpen}
      >
        <span className="font-display text-lg md:text-xl text-ink group-hover:text-accent transition-colors duration-300 leading-tight max-w-xl">
          {faq.q}
        </span>
        <span
          className={`text-muted text-2xl leading-none flex-shrink-0 mt-0.5 transition-transform duration-400 ${isOpen ? 'rotate-45' : ''}`}
          aria-hidden="true"
        >
          +
        </span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22,1,0.36,1] }}
            className="overflow-hidden"
          >
            <p className="text-sm text-smoke leading-relaxed pb-8 max-w-2xl">{faq.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
