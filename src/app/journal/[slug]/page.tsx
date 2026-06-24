'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

const ARTICLE = {
  slug: 'the-quiet-power-of-modest-dressing',
  category: 'Essay',
  date: 'June 12, 2026',
  title: 'The Quiet Power of Modest Dressing',
  subtitle: 'In a world of maximalism, the choice to dress quietly has become its own form of statement.',
  readTime: '6 min read',
  heroImage: 'https://images.unsplash.com/photo-1762605135321-d025ebbd13d8?auto=format&fit=crop&w=1600&q=85',
  body: [
    { type: 'p', text: 'There is a particular kind of presence that arrives in a room before the person wearing it has spoken. It is not loud. It does not announce itself. It is simply there, and in being there, it shifts something in the atmosphere.' },
    { type: 'p', text: 'This is the quality we think about most at NÜR HAUS. Not visibility. Not statement. Not even beauty, exactly. Presence. The sense that a woman and her clothes are the same thing — not competing, not contrasting, not performing.' },
    { type: 'blockquote', text: 'Elegance is not a quality one adds. It is what remains when everything unnecessary has been removed.' },
    { type: 'h2', text: 'The Reversal' },
    { type: 'p', text: 'For a long time, modest dressing occupied a specific and somewhat marginal place in the fashion conversation. It was accommodated rather than celebrated. Brands would extend hems or add sleeves as an afterthought — a modification, rather than a starting point.' },
    { type: 'p', text: 'That has changed, slowly and then all at once. The reasons are multiple and entangled. There is the growing recognition that modest dressing is not a religious or cultural exception but a mainstream preference shared by hundreds of millions of women. There is the quiet backlash against the tyranny of exposure that has characterized so much of the past decade. And there is, perhaps most importantly, the discovery that the constraints of modest dressing — the longer hems, the covered shoulders, the emphasis on silhouette rather than skin — are generative rather than limiting.' },
    { type: 'h2', text: 'Constraint as Creative Force' },
    { type: 'p', text: 'Constraint, in design, is not the opposite of freedom. It is the condition under which freedom becomes meaningful. A garment that must work fully covered cannot rely on what it reveals. It must earn its presence through proportion, fabric, movement — through the things that matter most and last longest.' },
    { type: 'p', text: 'This is why some of the most interesting design work of the past several years has come from within the modest fashion space. The limitations imposed by the form have pushed designers toward solutions that, in retrospect, seem obvious: that a well-cut sleeve is more interesting than a bare arm; that a properly weighted fabric tells you something about a garment that no amount of exposure could.' },
    { type: 'p', text: 'We think about this constantly. Each piece we make is the answer to a constraint. The constraint is: dress this woman in a way that asks nothing of her, that gives her presence without requiring performance. The answer is almost always arrived at through removal, not addition.' },
    { type: 'h2', text: 'What Remains' },
    { type: 'p', text: 'The women who wear NÜR HAUS are not a category. They are professionals, mothers, travelers, artists. They are observant and secular, traditional and modern. What they share is a preference for dressing in a way that feels like themselves — not a costume, not a statement, not an accommodation.' },
    { type: 'p', text: 'What remains, when the unnecessary is removed, is the thing itself: a garment that fits the life it is meant for, that moves when the wearer moves, that holds its shape and its intention across years rather than seasons.' },
    { type: 'p', text: 'Quiet power. That is what we make. That is what we are.' },
  ],
};

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const scrolled = window.scrollY;
      const total    = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(total > 0 ? (scrolled / total) * 100 : 0);
    };
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  return (
    <div className="page-enter">
      {/* Reading progress bar */}
      <div className="fixed top-[124px] left-0 right-0 z-40 h-px bg-hairline">
        <div
          className="h-full bg-accent transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Hero */}
      <section className="relative h-[65vh] overflow-hidden">
        <Image
          src={ARTICLE.heroImage}
          alt={ARTICLE.title}
          fill
          sizes="100vw"
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-midnight/10 via-midnight/30 to-midnight/70" />
        <div className="relative z-10 h-full site-max site-px flex flex-col justify-end pb-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.9, ease: [0.22,1,0.36,1] }}
          >
            <div className="flex items-center gap-4 mb-5">
              <span className="eyebrow-light">{ARTICLE.category}</span>
              <span className="text-primary/40 text-xs">·</span>
              <span className="text-primary/60 text-xs">{ARTICLE.date}</span>
              <span className="text-primary/40 text-xs">·</span>
              <span className="text-primary/60 text-xs">{ARTICLE.readTime}</span>
            </div>
            <h1 className="font-display text-primary text-[2.4rem] md:text-[4.5rem] leading-tight tracking-tight max-w-3xl">
              {ARTICLE.title}
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Article body */}
      <div className="site-max site-px py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-16 lg:gap-24">
          {/* Text */}
          <article>
            <motion.p
              className="font-display text-xl md:text-2xl text-accent mb-12 max-w-2xl leading-relaxed"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              {ARTICLE.subtitle}
            </motion.p>
            <motion.div
              className="prose-nurhaus"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              {ARTICLE.body.map((block, i) => {
                if (block.type === 'p')
                  return <p key={i}>{block.text}</p>;
                if (block.type === 'h2')
                  return <h2 key={i}>{block.text}</h2>;
                if (block.type === 'blockquote')
                  return <blockquote key={i}>{block.text}</blockquote>;
                return null;
              })}
            </motion.div>

            {/* Share */}
            <div className="mt-16 pt-8 border-t border-hairline flex items-center justify-between">
              <p className="eyebrow">Share</p>
              <div className="flex gap-4">
                {['Twitter', 'Instagram', 'Copy link'].map((s) => (
                  <button
                    key={s}
                    className="text-xs text-smoke hover:text-ink transition-colors tracking-wide"
                    onClick={() => s === 'Copy link' && navigator.clipboard?.writeText(window.location.href)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-[152px] space-y-10">
              <div>
                <p className="eyebrow mb-5">From the Journal</p>
                <div className="space-y-6">
                  {[
                    { title: 'Fabric Notes: On Silk Crepe', slug: 'fabric-notes-on-silk-crepe', cat: 'Material' },
                    { title: 'Sourcing Notes: Istanbul',     slug: 'istanbul-sourcing-notes',   cat: 'Atelier'  },
                    { title: 'On Dressing with Intention',  slug: 'on-dressing-with-intention', cat: 'Essay'    },
                  ].map((a) => (
                    <Link key={a.slug} href={`/journal/${a.slug}`} className="group block">
                      <span className="eyebrow block mb-1.5">{a.cat}</span>
                      <span className="text-sm font-display text-ink/80 group-hover:text-accent transition-colors duration-300 leading-tight">{a.title}</span>
                    </Link>
                  ))}
                </div>
              </div>
              <div className="pt-6 border-t border-hairline">
                <p className="eyebrow mb-4">The Collection</p>
                <Link href="/shop" className="btn-outline w-full text-center block text-sm py-3">Shop Now</Link>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Back to journal */}
      <div className="border-t border-hairline">
        <div className="site-max site-px py-12 flex items-center justify-between">
          <Link href="/journal" className="flex items-center gap-3 text-sm text-smoke hover:text-ink transition-colors">
            <span>←</span> Back to Journal
          </Link>
          <Link href="/shop" className="btn-outline text-sm py-3 px-8">Shop the Collection</Link>
        </div>
      </div>
    </div>
  );
}
