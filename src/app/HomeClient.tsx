'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import type { AppProduct } from '@/lib/shopify/types';
import ShopifySetupNotice from '@/components/ShopifySetupNotice';
import EditorialHero from '@/components/EditorialHero';

const fadeUp = {
  hidden:  { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } },
};

export default function HomeClient({ products, configured }: { products: AppProduct[]; configured: boolean }) {
  return (
    <div className="page-enter">
      <EditorialHero />

      {/* COLLECTION PREVIEW */}
      <section className="site-max site-px py-14 md:py-44">
        <div className="flex items-end justify-between mb-10 md:mb-24">
          <div>
            <motion.p className="eyebrow mb-3" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              Chapter Ⅰ
            </motion.p>
            <motion.h2
              className="font-display text-[1.75rem] sm:text-[2.4rem] md:text-[4rem] tracking-tight md:max-w-none max-w-md leading-tight"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              Designed with care, rooted in modesty.
            </motion.h2>
          </div>
          <Link href="/shop" className="hidden md:inline-flex items-center gap-2 eyebrow text-accent hover:text-ink transition-colors duration-300">
            View all <span>→</span>
          </Link>
        </div>

        {products.length === 0 ? (
          configured ? (
            <div className="text-center py-20">
              <p className="eyebrow mb-4">Catalog Empty</p>
              <p className="font-display text-3xl tracking-tight mb-4">Your store is connected.</p>
              <p className="text-sm text-smoke leading-relaxed max-w-md mx-auto">
                No products were found. Add products in your Shopify admin and make sure they&rsquo;re published to the Headless sales channel — see DEPLOYMENT.md §4.
              </p>
            </div>
          ) : (
            <ShopifySetupNotice context="the collection" />
          )
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 sm:gap-x-6 gap-y-10 md:gap-y-16">
            {products
              .filter((p) => p.kind === 'Dress')
              .slice(0, 6)
              .map((p, i) => (
              <motion.div
                key={p.handle}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: (i % 3) * 0.1 } as any}
              >
                <Link href={`/products/${p.handle}`} className="product-card group block">
                  <div className="product-card-img mb-5">
                    {p.images[0] && (
                      <Image
                        src={p.images[0]}
                        alt={p.name}
                        width={600}
                        height={800}
                        loading={i < 3 ? 'eager' : 'lazy'}
                        className="w-full h-auto aspect-auto"
                      />
                    )}
                  </div>
                  <p className="eyebrow mb-1.5">{p.kind}</p>
                  <div className="flex items-baseline justify-between">
                    <span className="font-product text-xl">{p.name}</span>
                    <span className="text-sm text-smoke">${p.price.toLocaleString()}</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {products.filter((p) => p.kind === 'Abaya').length > 0 && (
          <div className="mt-16 md:mt-28">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full justify-between">
              {products
                .filter((p) => p.kind === 'Abaya')
                .slice(0, 2)
                .map((product, index) => (
                  <motion.div key={product.handle} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className={`max-w-lg ${index === 1 ? 'justify-self-end' : ''}`}>
                    <Link href={`/products/${product.handle}`} className="product-card group block">
                      <div className="product-card-img mb-5">
                        {product.images[0] && (
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            width={800}
                            height={1067}
                            loading="lazy"
                            className="w-full h-auto aspect-auto"
                          />
                        )}
                      </div>
                      <p className="eyebrow mb-1.5">{product.kind}</p>
                      <div className="flex items-baseline justify-between">
                        <span className="font-product text-xl">{product.name}</span>
                        <span className="text-sm text-smoke">${product.price.toLocaleString()}</span>
                      </div>
                    </Link>
                  </motion.div>
                ))}
            </div>
          </div>
        )}
      </section>

      {/* STORY TEASE */}
      <section className="bg-secondary/30">
        <div className="site-max site-px py-14 md:py-40 grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          <motion.div
            className="aspect-[4/5] overflow-hidden"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <Image
              src="/story-image.jpeg"
              alt="The story of Nürhaus"
              width={900}
              height={1125}
              loading="lazy"
              className="w-full h-full object-cover"
            />
          </motion.div>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <p className="eyebrow mb-6">Our Story</p>
            <h2 className="font-display text-[1.75rem] sm:text-[2.4rem] md:text-[3.5rem] leading-[1.1] tracking-tight mb-8">
              &ldquo;Elegance is not attention. It is presence.&rdquo;
            </h2>
            <p className="text-smoke text-base leading-relaxed mb-10 max-w-md">
              NÜR HAUS was born from a simple belief: that modest dressing is not a constraint but a form of quiet power. Each piece is made to accompany a woman through the moments that matter.
            </p>
            <Link href="/story" className="btn-outline">Read our story</Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
