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

        {/* Headline + Subtext + CTAs — all pinned to bottom-left */}
        <div className="absolute bottom-6 sm:bottom-8 md:bottom-12 left-0 right-0 z-10 pl-6 md:pl-12 xl:pl-20 pr-6 md:pr-12 xl:pr-20">
          <h1 className="font-hero font-normal text-primary leading-[0.92] text-[2.2rem] sm:text-[3.2rem] md:text-[4.6rem] lg:text-[6.5rem] xl:text-[8rem] max-w-5xl mb-4 md:mb-6 lg:mb-8">
            {['Modest luxury,', 'in measured light.'].map((line, i) => (
              <div key={i} className="overflow-hidden pb-[0.15em]">
                <span
                  className="hero-line block"
                  style={{ fontStyle: i === 1 ? 'italic' : 'normal', opacity: 0 }}
                >
                  {line}
                </span>
              </div>
            ))}
          </h1>
          <p className="hero-subtext text-primary/75 text-sm md:text-base max-w-md mb-6" style={{ opacity: 0, transform: 'translateY(12px)' }}>
            Abayas and dresses cut in small batches, for women who dress with intention.
          </p>
          <div className="hero-ctas flex gap-3 sm:gap-4" style={{ opacity: 0, transform: 'translateY(12px)' }}>
            <Link
              href="/shop?category=Abaya"
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-primary text-ink text-[0.7rem] sm:text-[0.8rem] tracking-[0.05em] sm:tracking-[0.08em] uppercase font-medium px-5 sm:px-7 py-4 hover:bg-gold transition-colors duration-400"
            >
              Shop Abayas
            </Link>
            <Link
              href="/shop?category=Dress"
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 border border-primary/50 text-primary text-[0.7rem] sm:text-[0.8rem] tracking-[0.05em] sm:tracking-[0.08em] uppercase font-medium px-5 sm:px-7 py-4 hover:border-primary hover:bg-primary/10 transition-all duration-400"
            >
              Shop Dresses
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

      {/* INTERLUDE */}
      <section className="bg-midnight text-primary">
        <div className="site-max site-px py-14 md:py-44 grid md:grid-cols-2 gap-10 md:gap-28 items-center">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <p className="eyebrow-light mb-6">Campaign — No. 01</p>
            <h2 className="font-display text-[1.75rem] sm:text-[2.4rem] md:text-[3.5rem] leading-[1.1] tracking-tight">
              A wardrobe should be quiet enough to last a lifetime.
            </h2>
          </motion.div>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            style={{ clipPath: 'polygon(50% 0%, 100% 14%, 100% 100%, 0 100%, 0 14%)' }}
            className="overflow-hidden aspect-[4/5]"
          >
            <Image
              src="https://images.unsplash.com/photo-1762605135376-ae5af70a5628?auto=format&fit=crop&w=900&q=80"
              alt="Two women in elegant Nürhaus abayas"
              width={900}
              height={1125}
              className="w-full h-full object-cover"
            />
          </motion.div>
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
              className="font-display text-[1.75rem] sm:text-[2.4rem] md:text-[4rem] tracking-tight max-w-xl leading-tight"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              Eight pieces, kept deliberately small.
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
            {products.slice(0, 6).map((p, i) => (
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
              src="https://images.unsplash.com/photo-1772474587292-08b3e8932acd?auto=format&fit=crop&w=900&q=80"
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
