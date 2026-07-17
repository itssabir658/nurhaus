'use client';

import { motion } from 'framer-motion';

const fadeUp = { hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } } };

export default function ShippingPage() {
  return (
    <div className="page-enter">
      {/* Header */}
      <div className="site-max site-px pt-16 pb-12 border-b border-hairline">
        <motion.p className="eyebrow mb-4" variants={fadeUp} initial="hidden" animate="visible">
          Refund Policy
        </motion.p>
        <motion.h1
          className="font-display text-[3rem] md:text-[5rem] leading-tight tracking-tight"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          Fair, from<br /><em>start to finish.</em>
        </motion.h1>
      </div>

      <div className="site-max site-px py-20 md:py-32">
        <div className="max-w-2xl space-y-16 md:space-y-20">

          <motion.p
            className="text-smoke text-base leading-relaxed"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            Thank you for shopping with Nür Haus. We appreciate your support and strive to provide you with the best products and services. If for any reason you&rsquo;re not completely satisfied with your purchase, we&rsquo;re here to help. As a small business, we have established the following policies to ensure a smooth and fair process for both our customers and our team.
          </motion.p>

          {/* Cancellations */}
          <section>
            <motion.h2
              className="font-display text-2xl md:text-3xl tracking-tight mb-5"
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            >
              Cancellations
            </motion.h2>
            <motion.p
              className="text-smoke text-sm leading-relaxed mb-4"
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            >
              Changed your mind? No problem! If you need to cancel your order, we are happy to help as long as it is within a 30 minutes window of placing it.
            </motion.p>
            <motion.ul
              className="space-y-3 list-disc list-outside pl-5"
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            >
              <li className="text-smoke text-sm leading-relaxed">
                <strong className="text-ink font-medium">How to cancel:</strong> Simply email us at{' '}
                <a href="mailto:nurhausca@gmail.com" className="text-ink underline underline-offset-2 hover:text-accent transition-colors">nurhausca@gmail.com</a> with your order number.
              </li>
              <li className="text-smoke text-sm leading-relaxed">
                <strong className="text-ink font-medium">Please note:</strong> We work quickly to prepare your items, so once that 30 minutes window has passed, your order begins processing and can no longer be canceled.
              </li>
            </motion.ul>
          </section>

          {/* Exchanges */}
          <section>
            <motion.h2
              className="font-display text-2xl md:text-3xl tracking-tight mb-5"
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            >
              Exchanges
            </motion.h2>
            <motion.p
              className="text-smoke text-sm leading-relaxed mb-4"
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            >
              We want you to absolutely love your N&uuml;r Haus purchase! If something isn&rsquo;t quite right, here is everything you need to know about swapping it out:
            </motion.p>
            <motion.ul
              className="space-y-3 list-disc list-outside pl-5 mb-16 md:mb-20"
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            >
              <li className="text-smoke text-sm leading-relaxed">
                <strong className="text-ink font-medium">The Quickest Method:</strong> For the fastest turnaround, we recommend returning your original item and placing a brand-new order for the item you want once the return is accepted.
              </li>
              <li className="text-smoke text-sm leading-relaxed">
                <strong className="text-ink font-medium">Timeframe:</strong> You have 5 days from your original purchase date to request an exchange.
              </li>
              <li className="text-smoke text-sm leading-relaxed">
                <strong className="text-ink font-medium">Item Condition:</strong> Please make sure the product is completely unused and in its original condition, with all tags, packaging, and accessories still attached.
              </li>
              <li className="text-smoke text-sm leading-relaxed">
                <strong className="text-ink font-medium">Proof of Purchase:</strong> Keep your receipt! We will need your proof of purchase to quickly verify and process your exchange.
              </li>
              <li className="text-smoke text-sm leading-relaxed">
                <strong className="text-ink font-medium">Shipping Costs:</strong> Please be aware that shipping charges for exchanges are covered by the customer.
              </li>
              <li className="text-smoke text-sm leading-relaxed">
                <strong className="text-ink font-medium">Sale Items:</strong> Any items marked as &ldquo;Sale&rdquo; are final sale and are not eligible for exchange.
              </li>
            </motion.ul>
            <motion.h3
              className="font-display text-2xl md:text-3xl tracking-tight mb-5"
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            >
              Easy Exchange Process
            </motion.h3>
            <motion.ol
              className="space-y-3 list-decimal list-outside pl-5"
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            >
              <li className="text-smoke text-sm leading-relaxed">
                <strong className="text-ink font-medium">Reach Out:</strong> Send an email to{' '}
                <a href="mailto:nurhausca@gmail.com" className="text-ink underline underline-offset-2 hover:text-accent transition-colors">nurhausca@gmail.com</a> with your order number to get started.
              </li>
              <li className="text-smoke text-sm leading-relaxed">
                <strong className="text-ink font-medium">Quick Review:</strong> Our team will take a look at your order details to ensure it meets the exchange criteria.
              </li>
              <li className="text-smoke text-sm leading-relaxed">
                <strong className="text-ink font-medium">Pick Something New:</strong> Once approved, you can select a new product of equal or lesser value! If your new choice is a little more expensive, you will just need to cover the price difference.
              </li>
            </motion.ol>
          </section>

          {/* Sale Items */}
          <section>
            <motion.h2
              className="font-display text-2xl md:text-3xl tracking-tight mb-5"
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            >
              Sale Items
            </motion.h2>
            <motion.p
              className="text-smoke text-sm leading-relaxed"
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            >
              Items marked as &ldquo;Sale&rdquo; are final sale.
            </motion.p>
          </section>

          {/* Closing */}
          <motion.div
            className="border-t border-hairline pt-12"
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          >
            <p className="text-smoke text-sm leading-relaxed mb-6">
              We appreciate your understanding and cooperation with our policies. Your satisfaction is important to us, and we will do our best to assist you. If you have any questions or concerns, please don&rsquo;t hesitate to contact us.
            </p>
            <p className="text-sm text-ink">
              Email:{' '}
              <a href="mailto:nurhausca@gmail.com" className="underline underline-offset-2 hover:text-accent transition-colors">nurhausca@gmail.com</a>
            </p>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
