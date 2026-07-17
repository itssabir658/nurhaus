'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

interface GalleryImage {
  src: string;
  alt: string;
}

// All 8 shots — 4 are visible on desktop at any moment, the rest rotate in
// one column at a time. Mobile uses all 8 in a swipeable strip.
const IMAGES: GalleryImage[] = [
  { src: '/hero-editorial/1.jpg', alt: 'A blue dress beside a historic stone building' },
  { src: '/hero-editorial/2.jpg', alt: 'Reading a novel by a bookshop window' },
  { src: '/hero-editorial/3.jpg', alt: 'A latte, held close' },
  { src: '/hero-editorial/4.jpg', alt: 'A pink floral dress, gathering flowers' },
  { src: '/hero-editorial/5.jpg', alt: 'A black floral dress with a lace fan' },
  { src: '/hero-editorial/6.jpg', alt: 'A basket carrying a favourite book' },
  { src: '/hero-editorial/7.jpg', alt: 'A lace fan and flowers laid out on the grass' },
  { src: '/hero-editorial/8.jpg', alt: 'Ordering coffee at a modern counter' },
];

const ROTATE_MS = 4000;
const SWAP_TRANSITION = { duration: 1.2, ease: [0.22, 0.61, 0.36, 1] as const };

// Pure function of elapsed ticks — deterministic, so it stays correct even if
// dev-mode double-mounting (or a stray extra effect instance) causes this to
// be computed more than once for the same tick count.
function columnsForTick(tick: number): number[] {
  const cols = [0, 1, 2, 3];
  for (let t = 0; t < tick; t++) {
    cols[t % 4] = (4 + t) % IMAGES.length;
  }
  return cols;
}

function BreathingImage({
  img,
  priority,
  sizes,
  breatheDelay,
  reducedMotion,
}: {
  img: GalleryImage;
  priority?: boolean;
  sizes: string;
  breatheDelay: number;
  reducedMotion: boolean;
}) {
  return (
    <motion.div
      className="relative w-full h-full"
      animate={reducedMotion ? undefined : { scale: [1, 1.06, 1] }}
      transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut', delay: breatheDelay }}
    >
      <Image src={img.src} alt={img.alt} fill sizes={sizes} priority={priority} className="object-cover" />
    </motion.div>
  );
}

function GalleryColumn({
  imgIndex,
  colIndex,
  hoveredCol,
  setHoveredCol,
  reducedMotion,
  hiddenBelowLg,
}: {
  imgIndex: number;
  colIndex: number;
  hoveredCol: number | null;
  setHoveredCol: (i: number | null) => void;
  reducedMotion: boolean;
  hiddenBelowLg?: boolean;
}) {
  const isHovered = hoveredCol === colIndex;
  const isDimmed = hoveredCol !== null && !isHovered;

  return (
    <div
      className={`relative h-full overflow-hidden ${hiddenBelowLg ? 'hidden lg:block' : ''}`}
      onMouseEnter={() => setHoveredCol(colIndex)}
      onMouseLeave={() => setHoveredCol(null)}
    >
      <AnimatePresence initial={false}>
        <motion.div
          key={imgIndex}
          className="absolute inset-0"
          initial={{ opacity: 0, y: 30, scale: 1.05 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -30, scale: 1.03 }}
          transition={SWAP_TRANSITION}
        >
          <motion.div
            className="w-full h-full"
            animate={{
              scale: isHovered ? 1.03 : 1,
              filter: isDimmed ? 'brightness(0.92)' : isHovered ? 'brightness(1.05)' : 'brightness(1)',
            }}
            transition={{ duration: 0.6 }}
          >
            <BreathingImage
              img={IMAGES[imgIndex]}
              sizes="(min-width: 1024px) 25vw, 33vw"
              priority={colIndex === 0}
              breatheDelay={colIndex * 2.5}
              reducedMotion={reducedMotion}
            />
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default function EditorialHero() {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [columns, setColumns] = useState([0, 1, 2, 3]);
  const [hoveredCol, setHoveredCol] = useState<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const elapsedBeforePauseRef = useRef(0);
  const pausedRef = useRef(false);

  const mvX = useMotionValue(0);
  const mvY = useMotionValue(0);
  const springX = useSpring(mvX, { stiffness: 40, damping: 25 });
  const springY = useSpring(mvY, { stiffness: 40, damping: 25 });

  const mobileTrackRef = useRef<HTMLDivElement>(null);
  const mobilePausedRef = useRef(false);
  const mobileResumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Pausing freezes elapsed time; resuming shifts the start point so the count
  // picks back up exactly where it left off instead of jumping ahead.
  useEffect(() => {
    const now = Date.now();
    if (hoveredCol !== null) {
      if (startTimeRef.current !== null) {
        elapsedBeforePauseRef.current = now - startTimeRef.current;
      }
      pausedRef.current = true;
    } else {
      startTimeRef.current = now - elapsedBeforePauseRef.current;
      pausedRef.current = false;
    }
  }, [hoveredCol]);

  // Desktop/tablet: replace exactly one column every ROTATE_MS, cycling through
  // all 8 sources. Tick count is derived from elapsed time (not incremented),
  // so it's self-correcting even if an effect instance runs more than once.
  useEffect(() => {
    if (reducedMotion) return;
    if (startTimeRef.current === null) startTimeRef.current = Date.now();
    const id = setInterval(() => {
      if (pausedRef.current || startTimeRef.current === null) return;
      const tick = Math.floor((Date.now() - startTimeRef.current) / ROTATE_MS);
      setColumns(columnsForTick(tick));
    }, ROTATE_MS);
    return () => clearInterval(id);
  }, [reducedMotion]);

  // Elegant, barely-there mouse parallax on the whole gallery.
  useEffect(() => {
    if (reducedMotion) return;
    const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!isFinePointer) return;
    const handleMove = (e: MouseEvent) => {
      mvX.set(((e.clientX / window.innerWidth) * 2 - 1) * 10);
      mvY.set(((e.clientY / window.innerHeight) * 2 - 1) * 8);
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, [reducedMotion, mvX, mvY]);

  // Preload every frame so rotation never flickers.
  useEffect(() => {
    IMAGES.forEach((img) => {
      const el = new window.Image();
      el.src = img.src;
    });
  }, []);

  // Mobile: gentle auto-scroll every ~4.5s, pausing while the visitor is touching.
  useEffect(() => {
    if (reducedMotion) return;
    const track = mobileTrackRef.current;
    if (!track) return;

    const id = setInterval(() => {
      if (mobilePausedRef.current) return;
      const card = track.children[0] as HTMLElement | undefined;
      const step = card ? card.offsetWidth + 12 : track.clientWidth * 0.85;
      const next = track.scrollLeft + step;
      const atEnd = next >= track.scrollWidth - track.clientWidth - 4;
      track.scrollTo({ left: atEnd ? 0 : next, behavior: 'smooth' });
    }, 4500);

    const pause = () => {
      mobilePausedRef.current = true;
      if (mobileResumeTimer.current) clearTimeout(mobileResumeTimer.current);
    };
    const resumeLater = () => {
      if (mobileResumeTimer.current) clearTimeout(mobileResumeTimer.current);
      mobileResumeTimer.current = setTimeout(() => { mobilePausedRef.current = false; }, 3000);
    };

    track.addEventListener('touchstart', pause, { passive: true });
    track.addEventListener('touchend', resumeLater, { passive: true });
    track.addEventListener('pointerdown', pause);
    track.addEventListener('pointerup', resumeLater);

    return () => {
      clearInterval(id);
      if (mobileResumeTimer.current) clearTimeout(mobileResumeTimer.current);
      track.removeEventListener('touchstart', pause);
      track.removeEventListener('touchend', resumeLater);
      track.removeEventListener('pointerdown', pause);
      track.removeEventListener('pointerup', resumeLater);
    };
  }, [reducedMotion]);

  return (
    <section className="relative bg-[#F8F5F0] overflow-hidden">
      {/* ============ DESKTOP / TABLET (md+) ============ */}
      <div className="hidden md:flex md:h-[calc(100vh-124px)] md:min-h-[560px]">
        {/* Left — editorial copy */}
        <div className="relative w-[45%] lg:w-[40%] flex items-center site-px">
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-repeat opacity-[0.4] mix-blend-multiply pointer-events-none"
            style={{ backgroundImage: "url('/patterns/floral-line-art.jpg')", backgroundSize: '440px' }}
          />
          <div className="relative z-10">
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="font-display text-[#2E241E] text-[clamp(2.4rem,3.4vw,4rem)] leading-[1.15] tracking-tight"
            >
              Modest Silhouettes,
              <br />
              Thoughtfully Made.
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="w-12 h-px bg-[#2E241E]/30 origin-left my-7"
            />

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="text-[#463A30] text-base leading-relaxed max-w-xs mb-10"
            >
              Small-batch abayas and dresses — light, easy, and made with intention.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.75, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                href="/shop"
                className="group inline-flex items-center gap-3 rounded-full border border-[#2E241E] px-7 py-3.5 text-[0.72rem] tracking-[0.1em] uppercase text-[#2E241E] transition-colors duration-300 hover:bg-[#2E241E] hover:text-white"
              >
                Shop Now
                <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Right — rotating editorial gallery */}
        <motion.div
          className="w-[55%] lg:w-[60%] h-full grid grid-cols-3 lg:grid-cols-4 gap-2.5"
          style={{ x: reducedMotion ? 0 : springX, y: reducedMotion ? 0 : springY }}
        >
          {columns.map((imgIndex, colIndex) => (
            <motion.div
              key={colIndex}
              className="h-full"
              initial={{ opacity: 0, y: 40, scale: 1.05 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.9, delay: colIndex * 0.12, ease: [0.22, 1, 0.36, 1] }}
            >
              <GalleryColumn
                imgIndex={imgIndex}
                colIndex={colIndex}
                hoveredCol={hoveredCol}
                setHoveredCol={setHoveredCol}
                reducedMotion={reducedMotion}
                hiddenBelowLg={colIndex === 3}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* ============ MOBILE (< md) — text-first, swipeable peek gallery ============ */}
      <div className="md:hidden relative flex flex-col justify-center min-h-[calc(100svh-124px)] site-px py-8">
        {/* Floral watermark spans the full hero canvas (nav edge down through the photo
            track's height); the opaque photos simply paint over it, giving a clean edge
            without needing to clip the pattern layer itself. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-repeat opacity-[0.4] mix-blend-multiply pointer-events-none"
          style={{ backgroundImage: "url('/patterns/floral-line-art.jpg')", backgroundSize: '260px' }}
        />
        <div className="relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-[#2E241E] text-[clamp(2rem,9vw,2.75rem)] leading-[1.15] tracking-tight mb-4"
          >
            Modest Silhouettes, Thoughtfully Made.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="text-[#463A30] text-[15px] font-medium leading-relaxed max-w-[90%] mb-6"
          >
            Small-batch abayas and dresses — light, easy, and made with intention.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="mb-8"
          >
            <Link
              href="/shop"
              className="flex items-center justify-center gap-3 w-full h-[52px] rounded-full border border-[#2E241E] text-[0.72rem] tracking-[0.1em] uppercase text-[#2E241E] active:bg-[#2E241E] active:text-white transition-colors duration-300"
            >
              Shop Now
              <span>→</span>
            </Link>
          </motion.div>
        </div>

        <motion.div
          ref={mobileTrackRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="relative z-10 -mx-6 flex gap-3 overflow-x-auto px-6 pb-1 snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {IMAGES.map((img, i) => (
            <div
              key={img.src}
              className="relative flex-shrink-0 snap-start w-[86%] h-[300px] overflow-hidden"
            >
              <BreathingImage
                img={img}
                sizes="86vw"
                priority={i === 0}
                breatheDelay={(i % 4) * 2}
                reducedMotion={reducedMotion}
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
