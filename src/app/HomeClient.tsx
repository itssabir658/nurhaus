'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import type { AppProduct } from '@/lib/shopify/types';
import ShopifySetupNotice from '@/components/ShopifySetupNotice';
import EditorialHero, { type HeroContent } from '@/components/EditorialHero';
import { CampaignCountdown } from '@/components/campaign/Countdown';
import { SaleBenefits } from '@/components/campaign/SaleBenefits';
import { PriceTag, SaleBadge } from '@/components/campaign/PriceTag';
import { useCampaign } from '@/contexts/CampaignContext';
import { matchesCampaignPercent } from '@/lib/pricing';

const fadeUp = {
  hidden:  { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } },
};

function useHeroContent(): HeroContent | undefined {
  const { campaign, isLive, endedWhileViewing } = useCampaign();
  if (!campaign) return undefined;

  if (isLive) {
    return {
      key: `${campaign.id}-live`,
      eyebrow: campaign.copy.heroEyebrow,
      headline: campaign.copy.heroHeadline,
      headlineMobile: campaign.copy.heroHeadline,
      body: campaign.copy.heroBody,
      cta: { label: campaign.copy.heroCta, href: campaign.shopHref },
      footer: campaign.showDeadline ? <CampaignCountdown /> : <SaleBenefits />,
    };
  }

  // Deadline passed while the visitor was on the page: replace the sale
  // message with a quiet closing note rather than a countdown stuck at zero.
  // A fresh visit after the deadline gets the standard hero (undefined).
  if (endedWhileViewing) {
    return {
      key: `${campaign.id}-ended`,
      headline: campaign.copy.endedHeadline,
      headlineMobile: campaign.copy.endedHeadline,
      body: campaign.copy.endedBody,
      cta: { label: campaign.copy.endedCta, href: '/shop' },
    };
  }
  return undefined;
}

/**
 * Up to four marked-down pieces, in Shopify's best-selling order (the order
 * the catalog is already fetched in), shown directly under the hero while a
 * campaign runs. Only pieces whose real markdown matches the headline
 * percentage are included, so the "20% off" heading is always true.
 */
function SaleEdit({ products }: { products: AppProduct[] }) {
  const { campaign, isLive, saleFor } = useCampaign();
  if (!campaign || !isLive) return null;

  const pieces = products
    .filter((p) => p.availableForSale && matchesCampaignPercent(saleFor(p.price, p.compareAtPrice), campaign.discountPercent))
    .slice(0, 4);
  if (pieces.length === 0) return null;

  return (
    <section className="site-max site-px pt-14 md:pt-28" aria-labelledby="sale-edit-heading">
      <div className="flex items-end justify-between gap-6 mb-8 md:mb-14">
        <div>
          <motion.p className="eyebrow mb-3" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            The Sale Edit
          </motion.p>
          <motion.h2
            id="sale-edit-heading"
            className="font-display text-[1.75rem] sm:text-[2.4rem] md:text-[3.25rem] tracking-tight leading-tight max-w-xl text-balance"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            Selected pieces, now {campaign.discountPercent}%{'\u00a0'}off.
          </motion.h2>
        </div>
        <Link
          href={campaign.shopHref}
          className="hidden md:inline-flex items-center gap-2 eyebrow text-accent hover:text-ink transition-colors duration-300 whitespace-nowrap"
        >
          {campaign.copy.heroCta} <span>→</span>
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 sm:gap-x-6 gap-y-10">
        {pieces.map((p, i) => {
          const markdown = saleFor(p.price, p.compareAtPrice);
          return (
            <motion.div
              key={p.handle}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 } as any}
            >
              <Link href={`/products/${p.handle}`} className="product-card group block">
                <div className="product-card-img relative mb-4 aspect-[3/4]">
                  {p.images[0] && (
                    <Image
                      src={p.images[0]}
                      alt={p.name}
                      fill
                      sizes="(min-width: 1024px) 25vw, 50vw"
                      className="object-cover"
                    />
                  )}
                  {markdown && <SaleBadge markdown={markdown} className="absolute top-3 left-3" />}
                </div>
                <p className="eyebrow mb-1.5">{p.kind}</p>
                <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                  <span className="font-product text-lg md:text-xl">{p.name}</span>
                  <PriceTag price={p.price} compareAt={p.compareAtPrice} />
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      <div className="md:hidden mt-10">
        <Link href={campaign.shopHref} className="btn-outline w-full">
          {campaign.copy.heroCta}
        </Link>
      </div>
    </section>
  );
}

function CardBadge({ product }: { product: AppProduct }) {
  const { saleFor } = useCampaign();
  const markdown = saleFor(product.price, product.compareAtPrice);
  return markdown ? <SaleBadge markdown={markdown} className="absolute top-3 left-3 md:top-4 md:left-4" /> : null;
}

export default function HomeClient({ products, configured }: { products: AppProduct[]; configured: boolean }) {
  const heroContent = useHeroContent();
  return (
    <div className="page-enter">
      <EditorialHero content={heroContent} />

      <SaleEdit products={products} />

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
                  <div className="product-card-img relative mb-5">
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
                    <CardBadge product={p} />
                  </div>
                  <p className="eyebrow mb-1.5">{p.kind}</p>
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                    <span className="font-product text-xl">{p.name}</span>
                    <PriceTag price={p.price} compareAt={p.compareAtPrice} />
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
                      <div className="product-card-img relative mb-5">
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
                        <CardBadge product={product} />
                      </div>
                      <p className="eyebrow mb-1.5">{product.kind}</p>
                      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                        <span className="font-product text-xl">{product.name}</span>
                        <PriceTag price={product.price} compareAt={product.compareAtPrice} />
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
