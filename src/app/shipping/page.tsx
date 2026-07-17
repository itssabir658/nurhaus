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

          {/* Cancellation Policy */}
          <section>
            <motion.h2
              className="font-display text-2xl md:text-3xl tracking-tight mb-5"
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            >
              Cancellation Policy
            </motion.h2>
            <motion.p
              className="text-smoke text-sm leading-relaxed"
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            >
              Customers have a 1-hour window after placing their order to cancel. If you wish to cancel, please contact us at{' '}
              <a href="mailto:nurhausca@gmail.com" className="text-ink underline underline-offset-2 hover:text-accent transition-colors">nurhausca@gmail.com</a>, along with your order number, within this time frame. After 1 hour, the order will begin processing and cannot be canceled.
            </motion.p>
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
