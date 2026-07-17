'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const fadeUp = {
  hidden:  { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } },
};

// Story hero — same rotating-gallery idea as the Shop hero (real product
// photos, one visible slot swaps at a time, dark gradient + overlaid text),
// but tuned to feel distinct rather than a repeat: 3 columns instead of 4,
// swaps slide up instead of scale in, and each image holds a single slow
// one-way Ken Burns zoom instead of an oscillating "breathe".
const HERO_IMAGES = [
  { src: '/story-hero/1.jpg', alt: 'Alaïa' },
  { src: '/story-hero/2.jpg', alt: 'Dahlia' },
  { src: '/story-hero/3.jpg', alt: 'Saphira' },
  { src: '/story-hero/4.jpg', alt: 'Elayna' },
  { src: '/story-hero/5.jpg', alt: 'Faye' },
  { src: '/story-hero/6.jpg', alt: 'Amélie' },
  { src: '/story-hero/7.jpg', alt: 'Layla' },
  { src: '/story-hero/8.jpg', alt: 'Yara' },
];
const HERO_COLS = 3;
const HERO_ROTATE_MS = 5000;
const HERO_SWAP_TRANSITION = { duration: 1.1, ease: [0.22, 0.61, 0.36, 1] as const };

// Deterministic — swaps exactly one of the HERO_COLS visible slots per tick,
// cycling through all 8 source images.
function heroColumnsForTick(tick: number): number[] {
  const cols = Array.from({ length: HERO_COLS }, (_, i) => i);
  for (let t = 0; t < tick; t++) {
    cols[t % HERO_COLS] = (HERO_COLS + t) % HERO_IMAGES.length;
  }
  return cols;
}

function HeroKenBurnsImage({ img, priority, reducedMotion }: {
  img: { src: string; alt: string };
  priority?: boolean;
  reducedMotion: boolean;
}) {
  return (
    <motion.div
      className="relative w-full h-full"
      initial={{ scale: 1 }}
      animate={reducedMotion ? undefined : { scale: 1.12 }}
      transition={{ duration: HERO_ROTATE_MS * 6, ease: 'linear' }}
    >
      <Image src={img.src} alt={img.alt} fill sizes="34vw" priority={priority} className="object-cover" />
    </motion.div>
  );
}

function HeroGalleryColumn({ imgIndex, colIndex, reducedMotion }: { imgIndex: number; colIndex: number; reducedMotion: boolean }) {
  return (
    <div className="relative h-full overflow-hidden">
      <AnimatePresence initial={false}>
        <motion.div
          key={imgIndex}
          className="absolute inset-0"
          initial={{ opacity: 0, y: '12%' }}
          animate={{ opacity: 1, y: '0%' }}
          exit={{ opacity: 0, y: '-12%' }}
          transition={HERO_SWAP_TRANSITION}
        >
          <HeroKenBurnsImage img={HERO_IMAGES[imgIndex]} priority={colIndex === 0} reducedMotion={reducedMotion} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default function StoryPage() {
  const heroTextRef = useRef<HTMLDivElement>(null);
  const introRef    = useRef<HTMLParagraphElement>(null);
  const [heroColumns, setHeroColumns] = useState(() => Array.from({ length: HERO_COLS }, (_, i) => i));
  const [heroMobileIndex, setHeroMobileIndex] = useState(0);
  const [heroReducedMotion, setHeroReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setHeroReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setHeroReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (heroReducedMotion) return;
    const startTime = Date.now();
    const id = setInterval(() => {
      const tick = Math.floor((Date.now() - startTime) / HERO_ROTATE_MS);
      setHeroColumns(heroColumnsForTick(tick));
    }, HERO_ROTATE_MS);
    return () => clearInterval(id);
  }, [heroReducedMotion]);

  useEffect(() => {
    if (heroReducedMotion) return;
    const id = setInterval(() => {
      setHeroMobileIndex((i) => (i + 1) % HERO_IMAGES.length);
    }, HERO_ROTATE_MS);
    return () => clearInterval(id);
  }, [heroReducedMotion]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.from('.line-inner', {
        yPercent: 100,
        stagger: 0.12,
        duration: 1.1,
        ease: 'power4.out',
        delay: 0.3,
      });
    }, heroTextRef);

    const el = introRef.current;
    if (el) {
      gsap.set(el, { opacity: 0, y: 40 });
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });
    }

    return () => { ctx.revert(); ScrollTrigger.getAll().forEach(t => t.kill()); };
  }, []);

  return (
    <div className="page-enter">
      {/* Hero */}
      <section className="relative h-[calc(100dvh-124px)] overflow-hidden">
        <div className="absolute inset-0 h-full w-full">
          {/* Desktop/tablet — 3-column rotating, Ken Burns grid */}
          <div className="hidden md:grid absolute inset-0" style={{ gridTemplateColumns: `repeat(${HERO_COLS}, minmax(0, 1fr))` }}>
            {heroColumns.map((imgIndex, colIndex) => (
              <HeroGalleryColumn key={colIndex} imgIndex={imgIndex} colIndex={colIndex} reducedMotion={heroReducedMotion} />
            ))}
          </div>
          {/* Mobile — single sliding-crossfade image, cycling through the same pool */}
          <div className="md:hidden absolute inset-0 overflow-hidden">
            <AnimatePresence initial={false}>
              <motion.div
                key={heroMobileIndex}
                className="absolute inset-0"
                initial={{ opacity: 0, y: '12%' }}
                animate={{ opacity: 1, y: '0%' }}
                exit={{ opacity: 0, y: '-12%' }}
                transition={HERO_SWAP_TRANSITION}
              >
                <HeroKenBurnsImage img={HERO_IMAGES[heroMobileIndex]} priority={heroMobileIndex === 0} reducedMotion={heroReducedMotion} />
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-midnight/20 via-midnight/30 to-midnight/70" />
        </div>
        <div className="relative z-10 h-full site-max site-px flex flex-col justify-end pb-6 md:pb-12">
          <div className="mb-3">
            <span
              className="eyebrow-light inline-flex items-center rounded-full border border-primary/25 px-4 py-1.5"
              style={{
                backdropFilter: 'blur(14px) saturate(160%)',
                WebkitBackdropFilter: 'blur(14px) saturate(160%)',
                background: 'rgba(255,255,255,0.1)',
                color: 'var(--c-primary)',
              }}
            >
              Our Story
            </span>
          </div>
          <div ref={heroTextRef}>
            {['"Elegance is not attention.', 'It is presence."'].map((line, i) => (
              <div key={i} className="overflow-hidden pb-[0.14em]">
                <div
                  className={`line-inner font-display text-primary leading-[0.92] tracking-tight text-[clamp(1.6rem,7vw,6rem)] ${i === 1 ? 'pl-[0.26em]' : ''}`}
                  style={{ fontStyle: 'normal' }}
                >
                  {line}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="site-max site-px py-24 md:py-40 max-w-4xl">
        <p
          ref={introRef}
          className="font-display text-[1.6rem] md:text-[2.2rem] leading-[1.35] tracking-tight text-ink/90"
        >
          NÜR HAUS was founded on the belief that a garment should ask nothing of the woman wearing it — no compromise, no apology. Modest dressing is not a category. It is a point of view.
        </p>
      </section>

      {/* Founder split */}
      <section className="bg-secondary/25">
        <div className="site-max site-px py-24 md:py-40 grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-28 items-center">
          <motion.div
            className="aspect-[1012/1800] overflow-hidden order-last md:order-first"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <Image
              src="/founder-image.jpeg"
              alt="The founder"
              width={1012}
              height={1800}
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
            <p className="eyebrow mb-6">The Founder</p>
            <h2 className="font-display text-[2.4rem] md:text-[3.2rem] leading-tight tracking-tight mb-8">
              Built slowly, on purpose.
            </h2>
            <div className="space-y-5 text-smoke text-sm leading-relaxed max-w-md">
              <p>I spent years looking for clothes that fit the life I was living &mdash; simple, modest, and easy for everyday wear. So I started designing my own.</p>
              <p>NÜR HAUS was created from that need. Pieces that feel considered, without being complicated. Modest clothing made to be lived in &mdash; moving gently through everyday moments, not just special occasions.</p>
              <p>The focus has always been on ease and comfort. Soft silhouettes, breathable fabrics, and designs that feel natural the moment you put them on. Nothing overwhelming, just pieces that feel like they belong in your life.</p>
              <p>Each design is made with quiet attention to detail &mdash; how it moves, how it falls, and how it makes you feel when you wear it.</p>
              <p>This is clothing for everyday life. What you reach for when you want to feel comfortable, modest, and like yourself.</p>
            </div>
            <p className="font-display text-2xl text-accent mt-10">— Hamna Zaman, Founder</p>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="site-max site-px py-24 md:py-40 text-center">
        <motion.h2
          className="font-display text-[2.8rem] md:text-[5rem] leading-tight tracking-tight mb-8"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          Present for now.<br />Rare forever.
        </motion.h2>
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <Link href="/shop" className="btn-primary">Explore the Collection</Link>
        </motion.div>
      </section>
    </div>
  );
}
