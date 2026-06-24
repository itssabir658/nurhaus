'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ABAYA_SIZES = [
  { size: 'XS',  bust: '31.5–33.1', waist: '24.4–26.0', hip: '34.3–35.8', length: '54.3' },
  { size: 'S',   bust: '33.1–34.6', waist: '26.0–27.6', hip: '35.8–37.4', length: '55.1' },
  { size: 'M',   bust: '34.6–36.2', waist: '27.6–29.1', hip: '37.4–39.0', length: '55.9' },
  { size: 'L',   bust: '36.2–37.8', waist: '29.1–30.7', hip: '39.0–40.6', length: '56.7' },
  { size: 'XL',  bust: '37.8–39.4', waist: '30.7–32.3', hip: '40.6–42.1', length: '57.5' },
  { size: 'XXL', bust: '39.4–40.9', waist: '32.3–33.9', hip: '42.1–43.7', length: '58.3' },
];

const DRESS_SIZES = [
  { size: 'XS',  bust: '32.3–33.9', waist: '25.2–26.8', hip: '35.0–36.6', length: '46.5' },
  { size: 'S',   bust: '33.9–35.4', waist: '26.8–28.3', hip: '36.6–38.2', length: '47.2' },
  { size: 'M',   bust: '35.4–37.0', waist: '28.3–29.9', hip: '38.2–39.8', length: '48.0' },
  { size: 'L',   bust: '37.0–38.6', waist: '29.9–31.5', hip: '39.8–41.3', length: '48.8' },
  { size: 'XL',  bust: '38.6–40.2', waist: '31.5–33.1', hip: '41.3–42.9', length: '49.6' },
  { size: 'XXL', bust: '40.2–41.7', waist: '33.1–34.6', hip: '42.9–44.5', length: '50.4' },
];

const TIPS = [
  { label: 'Bust',   tip: 'Measure around the fullest part of your chest, keeping the tape parallel to the floor.' },
  { label: 'Waist',  tip: 'Measure around the narrowest part of your waist, usually about 1 in above your navel.' },
  { label: 'Hip',    tip: 'Measure around the fullest part of your hips and seat, approximately 8 in below your waist.' },
  { label: 'Length', tip: 'For abayas and dresses, length is measured from the highest point of the shoulder to the hem.' },
];

type Tab = 'abaya' | 'dress';

export default function SizeGuidePage() {
  const [activeTab, setActiveTab] = useState<Tab>('abaya');
  const data = activeTab === 'abaya' ? ABAYA_SIZES : DRESS_SIZES;

  return (
    <div className="page-enter">
      {/* Header */}
      <div className="site-max site-px pt-16 pb-12 border-b border-hairline">
        <motion.p
          className="eyebrow mb-4"
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          Sizing
        </motion.p>
        <motion.h1
          className="font-display text-[3rem] md:text-[5rem] leading-tight tracking-tight"
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.9, ease: [0.22,1,0.36,1] }}
        >
          Find Your Size.
        </motion.h1>
        <motion.p
          className="text-smoke text-sm max-w-lg mt-4 leading-relaxed"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.7 }}
        >
          All measurements are in inches. If you are between sizes, we recommend sizing up. Need help? Email us at sales@nurhaus.ca
        </motion.p>
      </div>

      <div className="site-max site-px py-16 md:py-24">
        {/* Tabs */}
        <div className="flex gap-0 border-b border-hairline mb-12 max-w-xs">
          {(['abaya', 'dress'] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 text-[0.7rem] tracking-[0.2em] uppercase font-medium transition-all duration-300 relative ${
                activeTab === tab ? 'text-ink' : 'text-muted hover:text-smoke'
              }`}
            >
              {tab === 'abaya' ? 'Abayas' : 'Dresses'}
              {activeTab === tab && (
                <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-px bg-ink" />
              )}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-16 lg:gap-24">
          {/* Size table */}
          <div>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.4, ease: [0.22,1,0.36,1] }}
              >
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-hairline">
                        {['Size', 'Bust (in)', 'Waist (in)', 'Hip (in)', 'Length (in)'].map((h) => (
                          <th key={h} className="text-left py-4 pr-8 eyebrow text-ink font-medium first:pl-0">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((row, i) => (
                        <motion.tr
                          key={row.size}
                          className="border-b border-hairline/60 hover:bg-secondary/20 transition-colors duration-200"
                          initial={{ opacity: 0, x: -16 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05, duration: 0.5 }}
                        >
                          <td className="py-5 pr-8 font-display text-xl font-medium">{row.size}</td>
                          <td className="py-5 pr-8 text-smoke">{row.bust}</td>
                          <td className="py-5 pr-8 text-smoke">{row.waist}</td>
                          <td className="py-5 pr-8 text-smoke">{row.hip}</td>
                          <td className="py-5 text-smoke">{row.length}</td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <p className="text-xs text-muted mt-6 leading-relaxed">
                  * Lengths are measured from highest shoulder point to hem on size M. Lengths increase by approximately ¾ in per size.
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* How to measure sidebar */}
          <div>
            <div className="sticky top-[144px]">
              <p className="eyebrow mb-8">How to Measure</p>

              {/* Visual guide placeholder */}
              <div className="aspect-[3/4] bg-secondary/30 mb-8 flex items-center justify-center relative overflow-hidden">
                <div className="text-center">
                  <svg width="80" height="160" viewBox="0 0 80 160" className="text-muted mx-auto mb-4">
                    <ellipse cx="40" cy="20" rx="16" ry="18" fill="none" stroke="currentColor" strokeWidth="1.5" />
                    <line x1="40" y1="38" x2="40" y2="100" stroke="currentColor" strokeWidth="1.5" />
                    <line x1="20" y1="55" x2="60" y2="55" stroke="currentColor" strokeWidth="1.5" />
                    <line x1="40" y1="100" x2="20" y2="155" stroke="currentColor" strokeWidth="1.5" />
                    <line x1="40" y1="100" x2="60" y2="155" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M28 55 Q24 70 28 80" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3 2" />
                    <path d="M52 55 Q56 70 52 80" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3 2" />
                  </svg>
                  <p className="text-xs text-muted">Measurement diagram</p>
                </div>
                {/* Annotation lines */}
                <div className="absolute right-4 top-[30%]">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-px bg-accent" />
                    <span className="text-[10px] text-accent uppercase tracking-wide">Bust</span>
                  </div>
                </div>
                <div className="absolute right-4 top-[50%]">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-px bg-accent" />
                    <span className="text-[10px] text-accent uppercase tracking-wide">Waist</span>
                  </div>
                </div>
                <div className="absolute right-4 top-[65%]">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-px bg-accent" />
                    <span className="text-[10px] text-accent uppercase tracking-wide">Hip</span>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {TIPS.map((tip, i) => (
                  <motion.div
                    key={tip.label}
                    className="border-t border-hairline pt-4"
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.07, duration: 0.6 }}
                  >
                    <p className="eyebrow mb-2">{tip.label}</p>
                    <p className="text-xs text-smoke leading-relaxed">{tip.tip}</p>
                  </motion.div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-hairline">
                <p className="text-xs text-smoke leading-relaxed mb-4">
                  Still unsure? Our team is happy to help you find the perfect fit.
                </p>
                <a href="mailto:sales@nurhaus.ca" className="btn-outline w-full block text-center text-sm py-3">
                  Ask for Advice
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
