'use client';

import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import NewsletterBlock from '@/components/NewsletterBlock';

const VALUES = [
  { title: 'Minimalism',       body: 'We remove until what remains cannot be removed. Every seam, every button, every proportion is a deliberate decision.' },
  { title: 'Modesty',          body: 'Modesty is not restriction. It is a choice that carries its own kind of authority — quiet, confident, irreducible.' },
  { title: 'Craftsmanship',    body: 'Every piece is cut and assembled in our atelier. Hands, not machines, determine the character of each garment.' },
  { title: 'Timeless Design',  body: 'We do not follow seasons. A NÜRHAUS piece should be as relevant in ten years as the day it was made.' },
];

const TIMELINE = [
  { year: '2021', event: 'The idea: a modest fashion house that refuses compromise.' },
  { year: '2022', event: 'Six months in a studio in Istanbul, developing the first patterns.' },
  { year: '2023', event: 'First atelier team of four. First fabric sourcing trip to Japan.' },
  { year: '2024', event: 'Quiet launch: 12 pieces, sold in 48 hours by word of mouth.' },
  { year: '2025', event: 'The Collection: eight pieces, two abayas, six dresses. Now available worldwide.' },
];

const fadeUp = {
  hidden:  { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } },
};

export default function StoryPage() {
  const heroTextRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (heroTextRef.current) {
      gsap.from(heroTextRef.current.querySelectorAll('.line-inner'), {
        yPercent: 100,
        stagger: 0.12,
        duration: 1.1,
        ease: 'power4.out',
        delay: 0.3,
      });
    }

    return () => ScrollTrigger.killAll();
  }, []);

  return (
    <div className="page-enter">
      {/* Hero */}
      <section className="relative min-h-[92vh] flex items-end pb-24 md:pb-40 overflow-hidden">
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
        <div className="relative z-10 site-max site-px">
          <p className="eyebrow-light mb-8">Our Story</p>
          <div ref={heroTextRef}>
            {['"Elegance is not attention.', 'It is presence."'].map((line, i) => (
              <div key={i} className="overflow-hidden">
                <div
                  className="line-inner font-display text-primary leading-[0.92] tracking-tight text-[3rem] sm:text-[5rem] md:text-[7rem] lg:text-[8.5rem]"
                  style={{ fontStyle: 'italic' }}
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
        <motion.p
          className="font-display text-[1.6rem] md:text-[2.2rem] leading-[1.35] tracking-tight text-ink/90"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          NÜRHAUS was founded on the belief that a garment should ask nothing of the woman wearing it — no compromise, no apology. Modest dressing is not a category. It is a point of view.
        </motion.p>
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
              <p>I spent years looking for clothes that fit the life I was living — something that could move between a boardroom and a dinner without asking me to change who I was. Nothing existed. So I made it.</p>
              <p>NÜRHAUS started in my apartment with a pattern table and four bolts of fabric. The first pieces were for women I knew. Then for women I didn't. The approach has not changed: start from need, remove everything unnecessary, keep only what is irreducible.</p>
              <p>Every decision — the length, the fabric weight, the single seam at the back — is a conversation with the woman who will wear it. I hope she finds, as I did, that dressing quietly is its own form of power.</p>
            </div>
            <p className="font-display italic text-2xl text-accent mt-10">— Leila A., Founder</p>
          </motion.div>
        </div>
      </section>

      {/* Brand values */}
      <section className="site-max site-px py-24 md:py-44">
        <div className="mb-16 md:mb-24">
          <motion.p className="eyebrow mb-4" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            What We Believe
          </motion.p>
          <motion.h2
            className="font-display text-[2.4rem] md:text-[4rem] tracking-tight max-w-xl leading-tight"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            Four principles. No exceptions.
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-16">
          {VALUES.map((v, i) => (
            <motion.div
              key={v.title}
              className="border-t border-hairline pt-8"
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 2) * 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="eyebrow mb-4">{String(i + 1).padStart(2, '0')}</p>
              <h3 className="font-display text-2xl md:text-3xl tracking-tight mb-4">{v.title}</h3>
              <p className="text-smoke text-sm leading-relaxed max-w-sm">{v.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-midnight text-primary">
        <div className="site-max site-px py-24 md:py-44">
          <motion.p className="eyebrow-light mb-4" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            The Journey
          </motion.p>
          <motion.h2
            className="font-display text-[2.4rem] md:text-[4rem] tracking-tight mb-20 max-w-xl leading-tight"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            Built with patience.
          </motion.h2>

          <div className="relative">
            <div className="absolute left-0 md:left-[120px] top-0 bottom-0 w-px bg-primary/15" />
            <div className="space-y-16">
              {TIMELINE.map((item, i) => (
                <motion.div
                  key={item.year}
                  className="flex gap-8 md:gap-16 items-start relative pl-6 md:pl-0"
                  initial={{ opacity: 0, x: -24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="absolute left-0 md:left-[116px] top-2 w-2 h-2 rounded-full bg-gold" />
                  <span className="hidden md:block font-display text-gold text-2xl min-w-[100px] text-right">{item.year}</span>
                  <div className="md:pl-10">
                    <span className="md:hidden eyebrow-light block mb-2">{item.year}</span>
                    <p className="text-primary/80 text-base leading-relaxed max-w-lg">{item.event}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="site-max site-px py-24 md:py-40 text-center">
        <motion.h2
          className="font-display text-[2.8rem] md:text-[5rem] italic leading-tight tracking-tight mb-8"
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

      {/* Newsletter */}
      <section className="border-t border-hairline">
        <div className="site-max site-px py-24 md:py-32">
          <NewsletterBlock />
        </div>
      </section>
    </div>
  );
}
