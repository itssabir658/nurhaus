'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

const ARTICLES = [
  {
    slug: 'the-quiet-power-of-modest-dressing',
    category: 'Essay',
    date: 'June 2026',
    title: 'The Quiet Power of Modest Dressing',
    excerpt: 'In a world of maximalism, the choice to dress quietly has become its own form of statement. We explore why restraint speaks louder than display.',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1762605135332-8a7ce1403187?auto=format&fit=crop&w=1200&q=80',
    featured: true,
  },
  {
    slug: 'fabric-notes-on-silk-crepe',
    category: 'Material',
    date: 'May 2026',
    title: 'Fabric Notes: On Silk Crepe',
    excerpt: 'Every season we choose one fabric to understand deeply. This season, it is silk crepe — and why the way it falls changes everything.',
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1619043518800-7f14be467dca?auto=format&fit=crop&w=800&q=80',
    featured: false,
  },
  {
    slug: 'istanbul-sourcing-notes',
    category: 'Atelier',
    date: 'April 2026',
    title: 'Sourcing Notes: Istanbul',
    excerpt: "Our founder traveled to the Grand Bazaar’s textile district to find the linen-viscose blend that would become The Noor. What she found instead was a lesson in patience.",
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1764179690247-df7f4014def7?auto=format&fit=crop&w=800&q=80',
    featured: false,
  },
  {
    slug: 'on-dressing-with-intention',
    category: 'Essay',
    date: 'March 2026',
    title: 'On Dressing with Intention',
    excerpt: 'The ritual of choosing what to wear is rarely about the clothes. A reflection on the relationship between dressing and the self.',
    readTime: '7 min read',
    image: 'https://images.unsplash.com/photo-1752794673269-dc356838c5fd?auto=format&fit=crop&w=800&q=80',
    featured: false,
  },
  {
    slug: 'japan-fabric-sourcing',
    category: 'Atelier',
    date: 'February 2026',
    title: 'Japan: Where We Find Our Silk',
    excerpt: 'The mills of Nishijin in Kyoto weave fabric that has been in continuous production since the 8th century. We visit the weavers behind The Sahar Abaya.',
    readTime: '8 min read',
    image: 'https://images.unsplash.com/photo-1705674337411-3b89e5afcc11?auto=format&fit=crop&w=800&q=80',
    featured: false,
  },
];

const CATEGORIES = ['All', 'Essay', 'Atelier', 'Material'];

const fadeUp = {
  hidden:  { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
};

export default function JournalPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const featured = ARTICLES[0];
  const filtered = ARTICLES.slice(1).filter((a) =>
    activeCategory === 'All' ? true : a.category === activeCategory
  );

  return (
    <div className="page-enter">
      {/* Featured article hero */}
      <section className="relative h-[80vh] overflow-hidden">
        <Image
          src={featured.image}
          alt={featured.title}
          fill
          sizes="100vw"
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-midnight/75 via-midnight/25 to-midnight/10" />
        <div className="relative z-10 h-full site-max site-px flex flex-col justify-end pb-16 md:pb-24">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center gap-4 mb-5">
              <span className="eyebrow-light">{featured.category}</span>
              <span className="text-primary/40 text-xs">·</span>
              <span className="text-primary/60 text-xs tracking-wide">{featured.date}</span>
              <span className="text-primary/40 text-xs">·</span>
              <span className="text-primary/60 text-xs tracking-wide">{featured.readTime}</span>
            </div>
            <h1 className="font-display text-primary text-[2.4rem] md:text-[4.5rem] leading-tight tracking-tight max-w-3xl mb-6">
              {featured.title}
            </h1>
            <p className="text-primary/70 text-sm max-w-xl mb-8">{featured.excerpt}</p>
            <Link
              href={`/journal/${featured.slug}`}
              className="inline-flex items-center gap-3 text-primary text-sm tracking-wide border-b border-primary/40 pb-1 hover:border-gold transition-colors duration-400"
            >
              Read Essay <span>→</span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Category filter */}
      <div className="border-b border-hairline">
        <div className="site-max site-px h-14 flex items-center gap-1">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setActiveCategory(c)}
              className={`px-4 py-1.5 text-[0.7rem] tracking-[0.18em] uppercase font-medium transition-all duration-300 ${
                activeCategory === c ? 'bg-ink text-primary' : 'text-smoke hover:text-ink'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Journal header */}
      <div className="site-max site-px pt-16 pb-8">
        <motion.p className="eyebrow mb-3" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          The Journal
        </motion.p>
        <motion.h2
          className="font-display text-[2.4rem] md:text-[3.5rem] tracking-tight"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          On making, choosing, and wearing.
        </motion.h2>
      </div>

      {/* Article grid */}
      <div className="site-max site-px pb-24 md:pb-40">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {filtered.map((article, i) => (
            <motion.article
              key={article.slug}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 3) * 0.09, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link href={`/journal/${article.slug}`} className="group block">
                <div className="product-card-img aspect-[4/3] mb-6">
                  <Image
                    src={article.image}
                    alt={article.title}
                    width={800}
                    height={600}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="eyebrow">{article.category}</span>
                  <span className="text-muted text-xs">·</span>
                  <span className="text-muted text-xs">{article.date}</span>
                  <span className="text-muted text-xs">·</span>
                  <span className="text-muted text-xs">{article.readTime}</span>
                </div>
                <h2 className="font-display text-xl md:text-2xl tracking-tight mb-3 group-hover:text-accent transition-colors duration-300 leading-tight">
                  {article.title}
                </h2>
                <p className="text-smoke text-sm leading-relaxed line-clamp-3">{article.excerpt}</p>
                <span className="inline-flex items-center gap-2 mt-4 text-xs text-accent tracking-wide uppercase group-hover:gap-3 transition-all duration-300">
                  Read <span>→</span>
                </span>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
}
