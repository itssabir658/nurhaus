'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const SCENES = [
  {
    image: 'https://images.unsplash.com/photo-1760083545495-b297b1690672?auto=format&fit=crop&w=1600&q=85',
    label: 'Look 01 — Layla',
    text: 'Dawn.',
    subtext: 'The hour before the day asks anything of you.',
    piece: { name: 'Layla', price: '$680', handle: 'layla' },
    align: 'left',
  },
  {
    image: 'https://images.unsplash.com/photo-1762605135318-f34a993cbcf0?auto=format&fit=crop&w=1600&q=85',
    label: 'Look 02 — Amélie',
    text: 'Presence.',
    subtext: 'Not seen. Felt.',
    piece: { name: 'Amélie', price: '$420', handle: 'amelie' },
    align: 'right',
  },
  {
    image: 'https://images.unsplash.com/photo-1772474542630-5f5822ca8421?auto=format&fit=crop&w=1600&q=85',
    label: 'Look 03 — Yara',
    text: 'Night falls differently in good fabric.',
    subtext: '',
    piece: { name: 'Yara', price: '$720', handle: 'yara' },
    align: 'center',
  },
  {
    image: 'https://images.unsplash.com/photo-1764179690247-df7f4014def7?auto=format&fit=crop&w=1600&q=85',
    label: 'Look 04 — Faye',
    text: 'Measured.',
    subtext: 'Every seam a decision.',
    piece: { name: 'Faye', price: '$390', handle: 'faye' },
    align: 'left',
  },
  {
    image: 'https://images.unsplash.com/photo-1762605135332-8a7ce1403187?auto=format&fit=crop&w=1600&q=85',
    label: 'Look 05 — Elayna',
    text: 'The dress that disappears into the room.',
    subtext: 'And takes it with her.',
    piece: { name: 'Elayna', price: '$455', handle: 'elayna' },
    align: 'right',
  },
  {
    image: 'https://images.unsplash.com/photo-1772714601004-23b94ae3913d?auto=format&fit=crop&w=1600&q=85',
    label: 'Look 06 — Saphira',
    text: 'In light.',
    subtext: 'Always, in measured light.',
    piece: { name: 'Saphira', price: '$470', handle: 'saphira' },
    align: 'center',
  },
];

export default function LookbookPage() {
  const sectionsRef = useRef<HTMLElement[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    sectionsRef.current.forEach((section) => {
      if (!section) return;
      const img = section.querySelector('.parallax-img');
      if (img) {
        gsap.fromTo(
          img,
          { yPercent: -10 },
          {
            yPercent: 10,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          }
        );
      }
    });

    return () => ScrollTrigger.killAll();
  }, []);

  return (
    <div className="page-enter bg-midnight">
      {/* Header */}
      <section className="relative h-screen flex items-end pb-24 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1762376268273-645db555eaf9?auto=format&fit=crop&w=1800&q=85"
            alt="Nürhaus Lookbook"
            fill
            sizes="100vw"
            priority
            className="object-cover object-center parallax-img"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-midnight/30 via-midnight/20 to-midnight/80" />
        </div>
        <div className="relative z-10 site-max site-px w-full">
          <motion.p
            className="eyebrow-light mb-6"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Campaign — Autumn 2026
          </motion.p>
          <motion.h1
            className="font-display text-primary text-[3.5rem] md:text-[7rem] leading-[0.9] tracking-tight max-w-3xl"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1, ease: [0.22,1,0.36,1] }}
          >
            <span className="block">In Measured</span>
            <em className="block">Light.</em>
          </motion.h1>
          <motion.p
            className="text-primary/60 text-sm mt-6 max-w-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
          >
            Eight pieces, six editorials.
          </motion.p>
        </div>
      </section>

      {/* Lookbook scenes */}
      {SCENES.map((scene, i) => {
        const alignClass = scene.align === 'left' ? 'items-start text-left' : scene.align === 'right' ? 'items-end text-right' : 'items-center text-center';
        return (
          <section
            key={scene.label}
            ref={(el) => { if (el) sectionsRef.current[i] = el; }}
            className="relative h-screen overflow-hidden"
          >
            <div className="absolute inset-0 scale-[1.15]">
              <Image
                src={scene.image}
                alt={scene.label}
                fill
                sizes="100vw"
                loading={i < 2 ? 'eager' : 'lazy'}
                className="object-cover object-center parallax-img"
              />
              <div className="absolute inset-0 bg-midnight/40" />
            </div>

            <div className={`relative z-10 h-full site-max site-px flex flex-col justify-end pb-16 md:pb-24 ${alignClass}`}>
              <motion.div
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-10%' }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="eyebrow-light mb-6">{scene.label}</p>
                <h2 className="font-display text-primary text-[3rem] md:text-[6rem] leading-[0.92] tracking-tight max-w-3xl mb-3">
                  {scene.text}
                </h2>
                {scene.subtext && (
                  <p className="text-primary/60 text-base max-w-sm mb-8">{scene.subtext}</p>
                )}
                <Link
                  href={`/products/${scene.piece.handle}`}
                  className="inline-flex items-center gap-3 text-primary/80 hover:text-primary text-sm border-b border-primary/30 hover:border-primary pb-1 transition-all duration-400"
                >
                  {scene.piece.name} — {scene.piece.price} <span>→</span>
                </Link>
              </motion.div>
            </div>

            {/* Scene number */}
            <div className={`absolute top-8 z-20 site-px w-full flex ${scene.align === 'right' ? 'justify-end' : 'justify-start'}`}>
              <span className="font-display text-primary/25 text-[5rem] md:text-[8rem] leading-none select-none">
                {String(i + 1).padStart(2, '0')}
              </span>
            </div>
          </section>
        );
      })}

      {/* Closing */}
      <section className="relative bg-midnight text-primary">
        <div className="site-max site-px py-32 md:py-56 text-center">
          <motion.p
            className="eyebrow-light mb-8"
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.8 } } }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            The Collection
          </motion.p>
          <motion.h2
            className="font-display text-[3rem] md:text-[7rem] leading-[0.92] tracking-tight mb-12"
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            Eight pieces.<br />All of them worth it.
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <Link href="/shop" className="btn-ghost">Shop the Collection</Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
