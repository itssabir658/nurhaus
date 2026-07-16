'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, MotionValue } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

interface GalleryImage {
  src: string;
  alt: string;
}

const IMAGES = {
  dress:   { src: '/hero-editorial/1.jpg', alt: 'A blue dress beside a historic stone building' },
  reading: { src: '/hero-editorial/2.jpg', alt: 'Reading a novel by a bookshop window' },
  coffee:  { src: '/hero-editorial/3.jpg', alt: 'A latte, held close' },
  pink:    { src: '/hero-editorial/4.jpg', alt: 'A pink floral dress, gathering flowers' },
  fan:     { src: '/hero-editorial/5.jpg', alt: 'A black floral dress with a lace fan' },
  basket:  { src: '/hero-editorial/6.jpg', alt: 'A basket carrying a favourite book' },
  flatlay: { src: '/hero-editorial/7.jpg', alt: 'A lace fan and flowers laid out on the grass' },
} satisfies Record<string, GalleryImage>;

interface MosaicSpec {
  img: GalleryImage;
  height: string; // fixed height classes — keeps the whole collage within one screen
  depth: 1 | 2 | 3; // 1 = nearest (moves most), 3 = farthest (moves least)
  rotate: number;
  from: 'up' | 'down';
  priority?: boolean;
}

// Left column reads top-to-bottom first — the dress is the visual anchor.
// Heights are fixed (not aspect-driven) so the total column height is a known
// budget that fits within one viewport instead of growing unbounded.
const LEFT_COLUMN: MosaicSpec[] = [
  { img: IMAGES.dress,   height: 'h-[240px] xl:h-[280px]', depth: 1, rotate: -2, from: 'up', priority: true },
  { img: IMAGES.coffee,  height: 'h-[160px] xl:h-[185px]', depth: 2, rotate: 0,  from: 'up' },
  { img: IMAGES.flatlay, height: 'h-[130px] xl:h-[150px]', depth: 3, rotate: 3,  from: 'up' },
];

// Right column is offset downward to create the staggered, masonry rhythm.
const RIGHT_COLUMN: MosaicSpec[] = [
  { img: IMAGES.reading, height: 'h-[205px] xl:h-[235px]', depth: 2, rotate: 2,  from: 'down' },
  { img: IMAGES.pink,    height: 'h-[145px] xl:h-[165px]', depth: 3, rotate: -2, from: 'down' },
  { img: IMAGES.fan,     height: 'h-[115px] xl:h-[135px]', depth: 1, rotate: 3,  from: 'down' },
];

// A single compact row on mobile — fewer images, sized to fit alongside the
// text within roughly one screen instead of a tall 2-row grid.
const MOBILE_ROW: MosaicSpec[] = [
  { img: IMAGES.dress,   height: 'h-[190px]', depth: 1, rotate: -2, from: 'up', priority: true },
  { img: IMAGES.reading, height: 'h-[160px]', depth: 1, rotate: 2,  from: 'down' },
  { img: IMAGES.coffee,  height: 'h-[135px]', depth: 1, rotate: -2, from: 'up' },
];

function MosaicFrame({
  spec,
  index,
  springX,
  springY,
  scrollSpring,
  reducedMotion,
  sizesAttr,
}: {
  spec: MosaicSpec;
  index: number;
  springX: MotionValue<number>;
  springY: MotionValue<number>;
  scrollSpring: MotionValue<number>;
  reducedMotion: boolean;
  sizesAttr: string;
}) {
  const depthFactor = spec.depth === 1 ? 1.4 : spec.depth === 2 ? 1 : 0.6;
  const tiltX = useTransform(springX, [-1, 1], [-7 * depthFactor, 7 * depthFactor]);
  const tiltY = useTransform(springY, [-1, 1], [-7 * depthFactor, 7 * depthFactor]);
  const driftY = useTransform(scrollSpring, (v) => v * -0.1 * depthFactor);

  return (
    <motion.div style={{ x: reducedMotion ? 0 : tiltX, y: reducedMotion ? 0 : driftY }}>
      <motion.div
        className={`w-full ${spec.height}`}
        initial={{ opacity: 0, scale: 0.92, y: spec.from === 'up' ? 40 : -40 }}
        animate={{ opacity: 1, scale: 1, y: 0, rotate: spec.rotate }}
        transition={{ duration: 1, delay: 0.35 + index * 0.12, ease: [0.16, 1, 0.3, 1] }}
        whileHover={reducedMotion ? undefined : { rotate: 0, scale: 1.035 }}
      >
        <motion.div
          className="relative w-full h-full rounded-[22px] overflow-hidden shadow-[0_18px_40px_rgba(46,36,30,0.15)]"
          animate={reducedMotion ? undefined : { y: [0, spec.depth % 2 === 0 ? 6 : -6, 0] }}
          transition={{ duration: 9 + spec.depth * 2.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Image
            src={spec.img.src}
            alt={spec.img.alt}
            fill
            sizes={sizesAttr}
            priority={spec.priority}
            loading={spec.priority ? undefined : 'lazy'}
            className="object-cover"
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default function EditorialHero() {
  const [reducedMotion, setReducedMotion] = useState(false);

  const mvX = useMotionValue(0);
  const mvY = useMotionValue(0);
  const springX = useSpring(mvX, { stiffness: 40, damping: 22, mass: 0.6 });
  const springY = useSpring(mvY, { stiffness: 40, damping: 22, mass: 0.6 });

  const rawScrollY = useMotionValue(0);
  const scrollSpring = useSpring(rawScrollY, { stiffness: 55, damping: 20, mass: 0.5 });

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!isFinePointer) return;
    const handleMove = (e: MouseEvent) => {
      mvX.set((e.clientX / window.innerWidth) * 2 - 1);
      mvY.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, [reducedMotion, mvX, mvY]);

  useEffect(() => {
    if (reducedMotion) return;
    const handleScroll = () => rawScrollY.set(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [reducedMotion, rawScrollY]);

  return (
    <section className="relative bg-[#F8F5F0]">
      <div className="relative site-max site-px lg:py-10 lg:h-[calc(100svh-124px)] lg:min-h-[600px] lg:flex lg:items-center">
        {/* ============ DESKTOP (lg+) ============ */}
        <div className="hidden lg:grid lg:grid-cols-[40%_60%] lg:gap-16 xl:gap-20 w-full items-center">
          {/* Left — editorial copy (unchanged) */}
          <div className="pr-8 xl:pr-16 pt-4">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="font-display text-xs tracking-[0.32em] uppercase text-[#2E241E]/70 mb-10"
            >
              NÜR HAUS
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="font-display text-[#2E241E] text-[clamp(2.6rem,3.4vw,4.2rem)] leading-[1.12] tracking-tight mb-8"
            >
              Modest Silhouettes,
              <br />
              Thoughtfully Made.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="text-[#2E241E]/70 text-base leading-relaxed max-w-xs mb-12"
            >
              Small-batch abayas and dresses — light, easy, and made with intention.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                href="/shop"
                className="group inline-flex items-center gap-3 border border-[#2E241E] px-7 py-3.5 text-[0.72rem] tracking-[0.1em] uppercase text-[#2E241E] transition-colors duration-300 hover:bg-[#2E241E] hover:text-white"
              >
                Shop Now
                <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
            </motion.div>
          </div>

          {/* Right — two-column depth-parallax masonry */}
          <div className="grid grid-cols-[1.15fr_1fr] gap-6 xl:gap-8">
            <div className="flex flex-col gap-6 xl:gap-8">
              {LEFT_COLUMN.map((spec, i) => (
                <MosaicFrame
                  key={spec.img.src}
                  spec={spec}
                  index={i}
                  springX={springX}
                  springY={springY}
                  scrollSpring={scrollSpring}
                  reducedMotion={reducedMotion}
                  sizesAttr="(min-width: 1280px) 320px, 260px"
                />
              ))}
            </div>
            <div className="flex flex-col gap-6 xl:gap-8 pt-14 xl:pt-16 -ml-3 xl:-ml-4">
              {RIGHT_COLUMN.map((spec, i) => (
                <MosaicFrame
                  key={spec.img.src}
                  spec={spec}
                  index={i + LEFT_COLUMN.length}
                  springX={springX}
                  springY={springY}
                  scrollSpring={scrollSpring}
                  reducedMotion={reducedMotion}
                  sizesAttr="(min-width: 1280px) 280px, 230px"
                />
              ))}
            </div>
          </div>
        </div>

        {/* ============ MOBILE / TABLET (< lg) — compact, fits close to one screen ============ */}
        <div className="lg:hidden w-full flex flex-col justify-center min-h-[calc(100svh-124px)]">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="font-display text-xs tracking-[0.32em] uppercase text-[#2E241E]/70 mb-4"
          >
            NÜR HAUS
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-[#2E241E] text-[clamp(1.9rem,8vw,2.75rem)] leading-[1.15] tracking-tight mb-4"
          >
            Modest Silhouettes,
            <br />
            Thoughtfully Made.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="text-[#2E241E]/70 text-sm leading-relaxed max-w-sm mb-6"
          >
            Small-batch abayas and dresses — light, easy, and made with intention.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="mb-8"
          >
            <Link
              href="/shop"
              className="group inline-flex items-center gap-3 border border-[#2E241E] px-6 py-3 text-[0.7rem] tracking-[0.1em] uppercase text-[#2E241E] transition-colors duration-300 active:bg-[#2E241E] active:text-white"
            >
              Shop Now
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
          </motion.div>

          {/* Single compact row — 3 images sized to sit comfortably alongside the text */}
          <div className="flex items-end gap-3">
            {MOBILE_ROW.map((spec, i) => (
              <motion.div
                key={spec.img.src}
                className={`relative flex-1 ${spec.height} rounded-[16px] overflow-hidden shadow-[0_10px_26px_rgba(46,36,30,0.14)]`}
                style={{ transform: `rotate(${spec.rotate}deg)` }}
                initial={{ opacity: 0, y: spec.from === 'up' ? 24 : -24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              >
                <Image
                  src={spec.img.src}
                  alt={spec.img.alt}
                  fill
                  sizes="33vw"
                  priority={spec.priority}
                  loading={spec.priority ? undefined : 'lazy'}
                  className="object-cover"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
