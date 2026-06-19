'use client';

import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const TRUST_INDICATORS = [
  { label: 'Worldwide Shipping', icon: 'M2 12h20M12 2c2.5 2.8 4 6.4 4 10s-1.5 7.2-4 10c-2.5-2.8-4-6.4-4-10s1.5-7.2 4-10z' },
  { label: 'Premium Quality',    icon: 'M12 2l2.6 6.6L21 9l-5 4.6L17.4 21 12 17.3 6.6 21 8 13.6 3 9l6.4-.4z' },
  { label: 'Secure Checkout',    icon: 'M5 11V8a7 7 0 0 1 14 0v3M5 11h14v9H5v-9z' },
];

const PRODUCTS = [
  { handle: 'sahar-abaya',  name: 'The Sahar',  kind: 'Abaya',  num: '01', price: '$680', image: 'https://images.unsplash.com/photo-1760083545495-b297b1690672?auto=format&fit=crop&w=900&q=80' },
  { handle: 'noor-dress',   name: 'The Noor',   kind: 'Dress',  num: '02', price: '$420', image: 'https://images.unsplash.com/photo-1762605135318-f34a993cbcf0?auto=format&fit=crop&w=900&q=80' },
  { handle: 'layla-dress',  name: 'The Layla',  kind: 'Dress',  num: '03', price: '$455', image: 'https://images.unsplash.com/photo-1762605135332-8a7ce1403187?auto=format&fit=crop&w=900&q=80' },
  { handle: 'layl-abaya',   name: 'The Layl',   kind: 'Abaya',  num: '04', price: '$720', image: 'https://images.unsplash.com/photo-1772474500365-c2c520545f44?auto=format&fit=crop&w=900&q=80' },
  { handle: 'dunya-dress',  name: 'The Dunya',  kind: 'Dress',  num: '05', price: '$390', image: 'https://images.unsplash.com/photo-1764179690247-df7f4014def7?auto=format&fit=crop&w=900&q=80' },
  { handle: 'rana-dress',   name: 'The Rana',   kind: 'Dress',  num: '06', price: '$435', image: 'https://images.unsplash.com/photo-1773439877634-e6ef9f571c12?auto=format&fit=crop&w=900&q=80' },
];

const fadeUp = {
  hidden:  { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } },
};

const MANIFESTO_TEXT = 'We make few things, slowly. Cloth chosen for the way it holds light, lines drawn for the way a woman moves through a room. Eight pieces this season — two abayas, six dresses — each finished by hand and meant to be kept.';
const MANIFESTO_WORDS = MANIFESTO_TEXT.split(' ');

export default function HomePage() {
  const heroRef   = useRef<HTMLDivElement>(null);
  const manifestoRef = useRef<HTMLParagraphElement>(null);

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

    if (heroRef.current) {
      gsap.fromTo(
        heroRef.current,
        { yPercent: 0 },
        { yPercent: 18, ease: 'none', scrollTrigger: { trigger: 'section', start: 'top top', end: 'bottom top', scrub: true } }
      );
    }

    if (manifestoRef.current) {
      gsap.to(manifestoRef.current.querySelectorAll('.word'), {
        color: '#111111',
        ease: 'none',
        stagger: 0.4,
        scrollTrigger: {
          trigger: manifestoRef.current,
          start: 'top 75%',
          end: 'bottom 50%',
          scrub: true,
        },
      });
    }

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
        <motion.div
          className="absolute inset-0 z-30 bg-primary pointer-events-none"
          style={{ transformOrigin: 'top' }}
          initial={{ scaleY: 1 }}
          animate={{ scaleY: 0 }}
          transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1], delay: 0.15 }}
        />

        <div className="relative z-10 h-full site-max site-px flex flex-col justify-end pb-16 md:pb-28">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mb-5 md:mb-6"
          >
            <span
              className="eyebrow-light inline-flex items-center rounded-full border border-primary/25 px-4 py-1.5"
              style={{
                backdropFilter: 'blur(14px) saturate(160%)',
                WebkitBackdropFilter: 'blur(14px) saturate(160%)',
                background: 'rgba(255,255,255,0.1)',
                color: '#111111',
              }}
            >
              Autumn — Launch Collection
            </span>
          </motion.div>
          <h1 className="font-display text-primary leading-[0.92] text-[2.6rem] sm:text-[4.2rem] md:text-[6.2rem] lg:text-[8rem] max-w-5xl">
            {['Modest luxury,', 'in measured light.'].map((line, i) => (
              <div key={i} className="overflow-hidden">
                <motion.span
                  className="block"
                  style={{ fontStyle: i === 1 ? 'italic' : 'normal' }}
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  transition={{ delay: 1.05 + i * 0.15, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                >
                  {line}
                </motion.span>
              </div>
            ))}
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-primary/75 text-sm md:text-base mt-5 md:mt-6 max-w-md"
          >
            Abayas and dresses cut in small batches, for women who dress with intention.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.7, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 md:mt-10 flex flex-wrap gap-3 sm:gap-4"
          >
            <Link
              href="/shop?category=Abaya"
              className="inline-flex items-center justify-center gap-2 bg-primary text-ink text-[0.8rem] tracking-[0.08em] uppercase font-medium px-7 py-4 hover:bg-gold transition-colors duration-400"
            >
              Shop Abayas
            </Link>
            <Link
              href="/shop?category=Dress"
              className="inline-flex items-center justify-center gap-2 border border-primary/50 text-primary text-[0.8rem] tracking-[0.08em] uppercase font-medium px-7 py-4 hover:border-primary hover:bg-primary/10 transition-all duration-400"
            >
              Shop Dresses
            </Link>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.0, duration: 0.9 }}
            className="mt-10 md:mt-14 flex flex-wrap gap-x-7 gap-y-3"
          >
            {TRUST_INDICATORS.map((t) => (
              <div key={t.label} className="flex items-center gap-2.5 text-primary/70">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="flex-shrink-0">
                  <path d={t.icon} />
                </svg>
                <span className="text-[0.68rem] tracking-[0.1em] uppercase">{t.label}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll cue */}
        <motion.div
          className="absolute bottom-8 right-6 md:right-10 z-10 hidden sm:flex flex-col items-center gap-2 text-primary/60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2, duration: 0.8 }}
        >
          <span className="text-[0.62rem] tracking-[0.18em] uppercase" style={{ writingMode: 'vertical-rl' }}>Scroll</span>
          <motion.span
            className="block w-px h-10 bg-primary/40"
            animate={{ scaleY: [0, 1, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformOrigin: 'top' }}
          />
        </motion.div>
      </section>

      {/* MANIFESTO */}
      <section className="site-max site-px py-36 md:py-56 max-w-5xl">
        <motion.p
          className="eyebrow mb-10"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          The Atelier
        </motion.p>
        <p
          ref={manifestoRef}
          className="font-display text-[1.75rem] sm:text-[2.5rem] md:text-[3.25rem] leading-[1.2] tracking-tight"
        >
          {MANIFESTO_WORDS.map((w, i) => (
            <span key={i} className="word" style={{ color: '#CCC4BB' }}>
              {w}{i < MANIFESTO_WORDS.length - 1 ? ' ' : ''}
            </span>
          ))}
        </p>
      </section>

      {/* INTERLUDE */}
      <section className="bg-midnight text-primary">
        <div className="site-max site-px py-28 md:py-44 grid md:grid-cols-2 gap-16 md:gap-28 items-center">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <p className="eyebrow-light mb-6">Campaign — No. 01</p>
            <h2 className="font-display text-[2.4rem] md:text-[3.5rem] leading-[1.1] tracking-tight">
              A wardrobe should be quiet enough to last a lifetime.
            </h2>
            <p className="font-display italic text-gold text-2xl md:text-3xl mt-8 text-right" dir="rtl" lang="ar">
              على مهلٍ، وبنور
            </p>
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
      <section className="site-max site-px py-28 md:py-44">
        <div className="flex items-end justify-between mb-16 md:mb-24">
          <div>
            <motion.p className="eyebrow mb-3" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              The Collection
            </motion.p>
            <motion.h2
              className="font-display text-[2.4rem] md:text-[4rem] tracking-tight max-w-xl leading-tight"
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-16">
          {PRODUCTS.map((p, i) => (
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
                  <Image
                    src={p.image}
                    alt={p.name}
                    width={600}
                    height={800}
                    loading={i < 3 ? 'eager' : 'lazy'}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="eyebrow mb-1.5">{p.kind} · {p.num}</p>
                <div className="flex items-baseline justify-between">
                  <span className="font-display text-xl">{p.name}</span>
                  <span className="text-sm text-smoke">{p.price}</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 text-center md:hidden">
          <Link href="/shop" className="btn-outline">View All Pieces</Link>
        </div>
      </section>

      {/* STORY TEASE */}
      <section className="bg-secondary/30">
        <div className="site-max site-px py-28 md:py-40 grid md:grid-cols-2 gap-16 items-center">
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
            <h2 className="font-display text-[2.4rem] md:text-[3.5rem] leading-[1.1] tracking-tight mb-8">
              &ldquo;Elegance is not attention. It is presence.&rdquo;
            </h2>
            <p className="text-smoke text-base leading-relaxed mb-10 max-w-md">
              NÜRHAUS was born from a simple belief: that modest dressing is not a constraint but a form of quiet power. Each piece is made to accompany a woman through the moments that matter.
            </p>
            <Link href="/story" className="btn-outline">Read our story</Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
