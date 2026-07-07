'use client';

import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { AppProduct } from '@/lib/shopify/types';
import ShopifySetupNotice from '@/components/ShopifySetupNotice';

const fadeUp = {
  hidden:  { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } },
};

export default function HomeClient({ products, configured }: { products: AppProduct[]; configured: boolean }) {
  const heroRef    = useRef<HTMLDivElement>(null);
  const curtainRef = useRef<HTMLDivElement>(null);

  // Mouse-follow parallax for the hero image — desktop only, spring-smoothed so it never costs a re-render.
  const mvX = useMotionValue(0);
  const mvY = useMotionValue(0);
  const springX = useSpring(mvX, { stiffness: 40, damping: 18, mass: 0.6 });
  const springY = useSpring(mvY, { stiffness: 40, damping: 18, mass: 0.6 });
  const heroImgX = useTransform(springX, [-1, 1], [-16, 16]);
  const heroImgY = useTransform(springY, [-1, 1], [-12, 12]);

  useEffect(() => {
    const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!isFinePointer) return;
    const handleMove = (e: MouseEvent) => {
      mvX.set((e.clientX / window.innerWidth) * 2 - 1);
      mvY.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, [mvX, mvY]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Scroll parallax on hero image
    if (heroRef.current) {
      gsap.fromTo(
        heroRef.current,
        { yPercent: 0 },
        { yPercent: 18, ease: 'none', scrollTrigger: { trigger: 'section', start: 'top top', end: 'bottom top', scrub: true } }
      );
    }

    // Curtain reveal
    if (curtainRef.current) {
      gsap.set(curtainRef.current, { scaleY: 1 });
      gsap.to(curtainRef.current, { scaleY: 0, transformOrigin: 'top', duration: 1.1, delay: 0.15, ease: 'power2.inOut' });
    }

    // Hero entrance animations (elements start hidden via inline style in JSX)
    gsap.to('.hero-eyebrow', { opacity: 1, y: 0,       duration: 0.8, delay: 0.9,  ease: 'power3.out' });
    gsap.fromTo('.hero-line',
      { yPercent: 100, opacity: 0 },
      { yPercent: 0, opacity: 1, stagger: 0.15, duration: 0.9, delay: 1.05, ease: 'power3.out' }
    );
    gsap.to('.hero-subtext', { opacity: 1, y: 0,       duration: 0.8, delay: 1.5,  ease: 'power3.out' });
    gsap.to('.hero-ctas',    { opacity: 1, y: 0,       duration: 0.8, delay: 1.7,  ease: 'power3.out' });
    gsap.to('.hero-scroll',  { opacity: 1,             duration: 0.8, delay: 2.2  });

    return () => ScrollTrigger.killAll();
  }, []);

  return (
    <div className="page-enter">
      {/* HERO */}
      <section className="relative h-[100svh] min-h-[560px] overflow-hidden -mt-[124px]">
        {/* Scroll parallax layer (GSAP) */}
        <div ref={heroRef} className="absolute inset-0 will-change-transform">
          {/* Mouse parallax layer (Framer Motion) — separate node so the two transforms never collide */}
          <motion.div
            className="absolute inset-0 scale-[1.08] sm:scale-110"
            style={{ x: heroImgX, y: heroImgY }}
          >
            <Image
              src="https://images.unsplash.com/photo-1762376268273-645db555eaf9?auto=format&fit=crop&w=1800&q=85"
              alt="Nürhaus model in an abaya beneath an arched, sheer-curtained doorway"
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-midnight/65 via-midnight/15 to-midnight/25" />
        </div>

        {/* Cinematic curtain reveal */}
        <div
          ref={curtainRef}
          className="absolute inset-0 z-30 bg-primary pointer-events-none"
          style={{ transformOrigin: 'top' }}
        />

        {/* Headline + Subtext + CTAs — pinned to bottom, centered */}
        <div className="absolute bottom-6 sm:bottom-8 md:bottom-12 left-0 right-0 z-10 px-6 md:px-12 xl:px-20 flex flex-col items-center text-center">
          <p
            className="hero-eyebrow font-sans font-light text-primary/75 text-[clamp(0.75rem,0.5rem+1vw,1.125rem)] tracking-[0.25em] uppercase mb-3 md:mb-4"
            style={{ opacity: 0, transform: 'translateY(12px)' }}
          >
            Step Into the Light
          </p>
          <h1 className="font-hero font-[350] uppercase text-primary leading-[0.95] tracking-[0.005em] sm:tracking-[0.015em] lg:tracking-[0.02em] text-[clamp(2.25rem,1.25rem+4vw,6.5rem)] md:whitespace-nowrap mb-4 md:mb-6 lg:mb-8">
            <div className="overflow-hidden pb-[0.1em]">
              <span className="hero-line block" style={{ opacity: 0 }}>
                Elegance That&rsquo;s Pure
              </span>
            </div>
          </h1>
          <p className="hero-subtext text-primary/75 text-sm md:text-base max-w-md mb-6" style={{ opacity: 0, transform: 'translateY(12px)' }}>
            Abayas and dresses cut in small batches, for women who dress with intention.
          </p>
          <div className="hero-ctas flex gap-3 sm:gap-4" style={{ opacity: 0, transform: 'translateY(12px)' }}>
            <Link
              href="/shop"
              className="inline-flex items-center justify-center gap-2 text-primary text-[0.7rem] sm:text-[0.8rem] tracking-[0.05em] sm:tracking-[0.08em] uppercase font-medium pb-1 border-b border-primary hover:text-gold hover:border-gold transition-colors duration-400"
            >
              Shop Now
            </Link>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="hero-scroll absolute bottom-8 right-6 md:right-10 z-10 hidden sm:flex flex-col items-center gap-2 text-primary/60" style={{ opacity: 0 }}>
          <span className="text-[0.62rem] tracking-[0.18em] uppercase" style={{ writingMode: 'vertical-rl' }}>Scroll</span>
          <motion.span
            className="block w-px h-10 bg-primary/40"
            animate={{ scaleY: [0, 1, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformOrigin: 'top' }}
          />
        </div>
      </section>

      {/* COLLECTION PREVIEW */}
      <section className="site-max site-px py-14 md:py-44">
        <div className="flex items-end justify-between mb-10 md:mb-24">
          <div>
            <motion.p className="eyebrow mb-3" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              The Collection
            </motion.p>
            <motion.h2
              className="font-display text-[1.75rem] sm:text-[2.4rem] md:text-[4rem] tracking-tight md:max-w-none max-w-md leading-tight"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              Handcrafted modest luxury,<br />exclusive to eight pieces.
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
                  <div className="product-card-img aspect-[3/4] mb-5">
                    {p.images[0] && (
                      <Image
                        src={p.images[0]}
                        alt={p.name}
                        width={600}
                        height={800}
                        loading={i < 3 ? 'eager' : 'lazy'}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <p className="eyebrow mb-1.5">{p.kind} · {String(i + 1).padStart(2, '0')}</p>
                  <p className="text-xs text-smoke/50">[productType: {p.productType || 'MISSING'}, tags: {p.tags?.join(',') || 'EMPTY'}]</p>
                  <div className="flex items-baseline justify-between">
                    <span className="font-product text-xl">{p.name}</span>
                    <span className="text-sm text-smoke">${p.price.toLocaleString()}</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        <div className="mt-16 text-center md:hidden">
          <Link href="/shop" className="btn-outline">View All Pieces</Link>
        </div>

        {products.filter((p) => p.kind === 'Abaya').length > 0 && (
          <div className="mt-16 md:mt-28">
            <motion.p className="eyebrow mb-6" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              The Abayas
            </motion.p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full justify-between">
              {products
                .filter((p) => p.kind === 'Abaya')
                .slice(0, 2)
                .map((product, index) => (
                  <motion.div key={product.handle} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className={`max-w-lg ${index === 1 ? 'justify-self-end' : ''}`}>
                    <Link href={`/products/${product.handle}`} className="product-card group block">
                      <div className="product-card-img aspect-[3/4] mb-5">
                        {product.images[0] && (
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            width={800}
                            height={1067}
                            loading="lazy"
                            className={`w-full h-full object-cover ${index === 0 ? 'object-[30%_50%]' : 'object-[70%_50%]'}`}
                          />
                        )}
                      </div>
                      <p className="eyebrow mb-1.5">Abaya - {String(index + 1).padStart(2, '0')}</p>
                      <p className="text-xs text-smoke/50">[productType: {product.productType || 'MISSING'}, tags: {product.tags?.join(',') || 'EMPTY'}]</p>
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
