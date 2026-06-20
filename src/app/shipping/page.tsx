'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SHIPPING_OPTIONS = [
  { name: 'Standard',   time: '5–10 business days', price: 'Complimentary on orders over $500', note: 'Orders under $500 — $12' },
  { name: 'Express',    time: '2–3 business days',  price: '$28',   note: 'Available at checkout' },
  { name: 'Overnight',  time: 'Next business day',  price: '$48',   note: 'Order before 12pm EST' },
];

const REGIONS = [
  { region: 'Canada',         time: '2–5 days',   express: 'Next day' },
  { region: 'United States',  time: '3–6 days',   express: '1–2 days' },
  { region: 'Europe',         time: '6–10 days',  express: '3–4 days' },
  { region: 'Middle East',    time: '6–10 days',  express: '3–4 days' },
  { region: 'Rest of World',  time: '8–14 days',  express: '4–6 days' },
];

const RETURN_STEPS = [
  { step: '01', title: 'Request',    body: 'Email sales@nurhaus.ca within 14 days of receiving your order. Include your order number and reason for return.' },
  { step: '02', title: 'Package',    body: 'Place the item in its original packaging with all tags attached. Items must be unworn and in original condition.' },
  { step: '03', title: 'Ship',       body: 'We will send you a pre-paid return label. Drop the package at any approved carrier location.' },
  { step: '04', title: 'Refund',     body: 'Refunds are processed within 5–7 business days of receiving the returned item. You will receive an email confirmation.' },
];

const FAQS = [
  { q: 'Can I exchange an item for a different size?', a: 'Yes. Request an exchange through sales@nurhaus.ca within 14 days. Subject to availability, we will ship the replacement at no additional cost.' },
  { q: 'What if my order arrives damaged?', a: 'Please photograph the item and packaging immediately and email us within 48 hours. We will arrange a replacement or full refund.' },
  { q: 'Are returns free?', a: 'We provide complimentary return labels for Canadian orders. International return shipping costs are deducted from the refund amount.' },
  { q: 'Can I return a sale item?', a: 'Sale items are eligible for exchange or store credit only, not refund. Final sale items are non-returnable.' },
];

const fadeUp = { hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22,1,0.36,1] } } };

export default function ShippingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="page-enter">
      {/* Header */}
      <div className="site-max site-px pt-16 pb-12 border-b border-hairline">
        <motion.p className="eyebrow mb-4" variants={fadeUp} initial="hidden" animate="visible">Shipping & Returns</motion.p>
        <motion.h1
          className="font-display text-[3rem] md:text-[5rem] leading-tight tracking-tight"
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.9, ease: [0.22,1,0.36,1] }}
        >
          Delivered with<br /><em>the same care.</em>
        </motion.h1>
      </div>

      <div className="site-max site-px py-20 md:py-32 space-y-24 md:space-y-40">

        {/* Shipping options */}
        <section>
          <motion.p className="eyebrow mb-10" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>Delivery Options</motion.p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SHIPPING_OPTIONS.map((opt, i) => (
              <motion.div
                key={opt.name}
                className="border border-hairline p-8 hover:border-accent transition-colors duration-400"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.7 }}
              >
                <p className="eyebrow mb-5">{opt.name}</p>
                <p className="font-display text-2xl mb-3">{opt.time}</p>
                <p className="text-sm text-ink mb-1">{opt.price}</p>
                <p className="text-xs text-muted">{opt.note}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Worldwide delivery table */}
        <section>
          <motion.p className="eyebrow mb-4" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>Worldwide Delivery</motion.p>
          <motion.h2
            className="font-display text-3xl md:text-4xl tracking-tight mb-10"
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          >
            We ship to over 60 countries.
          </motion.h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-hairline">
                  <th className="text-left py-4 pr-8 eyebrow font-medium">Region</th>
                  <th className="text-left py-4 pr-8 eyebrow font-medium">Standard</th>
                  <th className="text-left py-4 eyebrow font-medium">Express</th>
                </tr>
              </thead>
              <tbody>
                {REGIONS.map((r, i) => (
                  <motion.tr
                    key={r.region}
                    className="border-b border-hairline/60 hover:bg-secondary/20 transition-colors"
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06, duration: 0.6 }}
                  >
                    <td className="py-5 pr-8 font-medium text-ink">{r.region}</td>
                    <td className="py-5 pr-8 text-smoke">{r.time}</td>
                    <td className="py-5 text-smoke">{r.express}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted mt-4">All times are estimates from dispatch. Customs delays may affect delivery.</p>
        </section>

        {/* Returns process */}
        <section>
          <motion.p className="eyebrow mb-4" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>Returns</motion.p>
          <motion.h2
            className="font-display text-3xl md:text-4xl tracking-tight mb-3"
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          >
            14 days. No questions.
          </motion.h2>
          <motion.p
            className="text-smoke text-sm mb-12 max-w-lg"
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          >
            If your piece is not right, we will make it right. Returns are accepted within 14 days of delivery for unworn items with all tags attached.
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {RETURN_STEPS.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.7 }}
              >
                <p className="font-display text-5xl text-hairline mb-4">{step.step}</p>
                <p className="eyebrow mb-3">{step.title}</p>
                <p className="text-sm text-smoke leading-relaxed">{step.body}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section>
          <motion.p className="eyebrow mb-4" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>Common Questions</motion.p>
          <div className="max-w-2xl space-y-0 border-t border-hairline">
            {FAQS.map((faq, i) => (
              <div key={i} className="border-b border-hairline">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between py-6 text-left gap-4"
                >
                  <span className="font-display text-lg text-ink">{faq.q}</span>
                  <span className={`text-muted transition-transform duration-400 text-xl leading-none flex-shrink-0 ${openFaq === i ? 'rotate-45' : ''}`}>+</span>
                </button>
                <AnimatePresence initial={false}>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.45, ease: [0.22,1,0.36,1] }}
                      className="overflow-hidden"
                    >
                      <p className="text-sm text-smoke leading-relaxed pb-6 max-w-xl">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
