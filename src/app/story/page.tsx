'use client';

import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const fadeUp = {
  hidden:  { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } },
};

export default function StoryPage() {
  const heroTextRef = useRef<HTMLDivElement>(null);
  const introRef    = useRef<HTMLParagraphElement>(null);

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
      <section className="relative h-[82svh] md:h-[70vh] overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1762605135376-ae5af70a5628?auto=format&fit=crop&w=1800&q=80"
            alt="Nürhaus atelier"
            fill
            sizes="100vw"
            priority
            className="object-cover object-center scale-[1.05]"
          />
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
            className="aspect-[3/4] overflow-hidden order-last md:order-first"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <Image
              src="https://images.unsplash.com/photo-1752794673269-dc356838c5fd?auto=format&fit=crop&w=900&q=80"
              alt="The founder"
              width={900}
              height={1200}
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
          Eight pieces. All of them worth it.
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
