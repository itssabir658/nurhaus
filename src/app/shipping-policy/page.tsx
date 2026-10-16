'use client';

import { motion } from 'framer-motion';
import { FREE_SHIPPING_THRESHOLD } from '@/lib/shipping';

const fadeUp = { hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } } };

export default function ShippingPolicyPage() {
  return (
    <div className="page-enter">
      {/* Header */}
      <div className="site-max site-px pt-16 pb-12 border-b border-hairline">
        <motion.p className="eyebrow mb-4" variants={fadeUp} initial="hidden" animate="visible">
          Shipping Policy
        </motion.p>
        <motion.h1
          className="font-display text-[3rem] md:text-[5rem] leading-tight tracking-tight"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          On its way<br /><em>to you.</em>
        </motion.h1>
      </div>

      <div className="site-max site-px py-20 md:py-32">
        <div className="max-w-2xl space-y-16 md:space-y-20">

          {/* Shipping Within Canada & US */}
          <section>
            <motion.h2
              className="font-display text-2xl md:text-3xl tracking-tight mb-16 md:mb-20"
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            >
              Shipping Within Canada &amp; US
            </motion.h2>
            {/* The threshold applies in both markets now, so this section is no
                longer gated on country. Duties are prepaid on US orders, which
                is stated explicitly — an unexpected customs bill is the kind of
                surprise that loses a customer permanently. */}
            <motion.h3
              className="font-display text-2xl md:text-3xl tracking-tight mb-5"
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            >
              Free Shipping
            </motion.h3>
            <motion.p
              className="text-smoke text-sm leading-relaxed mb-16 md:mb-20"
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            >
              We offer complimentary shipping on all orders over ${FREE_SHIPPING_THRESHOLD} (before taxes and discounts), to
              both Canada and the United States.
            </motion.p>
            <motion.h3
              className="font-display text-2xl md:text-3xl tracking-tight mb-5"
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            >
              Shipping Rates &amp; Duties
            </motion.h3>
            <motion.p
              className="text-smoke text-sm leading-relaxed mb-16 md:mb-20"
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            >
              Orders below the free shipping threshold will have shipping charges calculated at checkout. Duties on
              orders shipping to the United States are prepaid and included in the price you pay &mdash; there is
              nothing further to settle when your parcel arrives.
            </motion.p>
            <motion.h3
              className="font-display text-2xl md:text-3xl tracking-tight mb-5"
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            >
              Order Processing
            </motion.h3>
            <motion.p
              className="text-smoke text-sm leading-relaxed mb-16 md:mb-20"
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            >
              Please allow 24&ndash;48 hours for your order to be carefully prepared and processed before shipment.
            </motion.p>
            <motion.h3
              className="font-display text-2xl md:text-3xl tracking-tight mb-5"
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            >
              Delivery Timeline
            </motion.h3>
            <motion.p
              className="text-smoke text-sm leading-relaxed"
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            >
              Estimated delivery timelines will be displayed at checkout and will vary based on your location and selected shipping method.
            </motion.p>
          </section>

        </div>
      </div>
    </div>
  );
}
