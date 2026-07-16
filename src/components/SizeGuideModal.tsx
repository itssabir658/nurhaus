'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { SizeGuideData } from '@/lib/sizeGuides';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  guide: SizeGuideData | { name: string; tabs: SizeGuideData[] };
}

export default function SizeGuideModal({ isOpen, onClose, productName, guide }: SizeGuideModalProps) {
  const [activeTab, setActiveTab] = useState(0);

  const isTabbedGuide = 'tabs' in guide;
  const currentGuide = isTabbedGuide ? guide.tabs[activeTab] : (guide as SizeGuideData);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 bg-black/40 flex items-end md:items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="bg-primary w-full md:max-w-5xl md:max-h-[80vh] rounded-t-2xl md:rounded-xl overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-hairline sticky top-0 bg-primary">
              <div>
                <p className="text-xs text-smoke mb-1">Size Guide</p>
                <h2 className="font-display text-xl md:text-2xl text-ink">{productName}</h2>
              </div>
              <button
                onClick={onClose}
                aria-label="Close"
                className="text-ink/60 hover:text-ink transition-colors p-1"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* Tabs (if applicable) */}
            {isTabbedGuide && (
              <div className="flex gap-6 border-b border-hairline px-6 overflow-x-auto">
                {(guide as any).tabs.map((tab: SizeGuideData, i: number) => (
                  <button
                    key={i}
                    onClick={() => setActiveTab(i)}
                    className={`py-3 text-[0.7rem] tracking-[0.2em] uppercase font-medium transition-all duration-300 relative whitespace-nowrap ${
                      activeTab === i ? 'text-ink' : 'text-muted hover:text-smoke'
                    }`}
                  >
                    {tab.name}
                    {activeTab === i && <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-px bg-ink" />}
                  </button>
                ))}
              </div>
            )}

            {/* Table */}
            <div className="flex-1 overflow-y-auto px-2 py-6 md:px-6">
              <table className="w-full text-sm table-fixed">
                <thead>
                  <tr className="border-b border-hairline">
                    {currentGuide.columns.map((col) => (
                      <th key={col} className={`py-4 px-2 md:px-3 eyebrow text-ink font-medium ${
                        col.toLowerCase() === 'size' ? 'text-left' : 'text-center'
                      }`}>
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {currentGuide.rows.map((row, i) => (
                    <motion.tr
                      key={i}
                      className="border-b border-hairline/60 hover:bg-secondary/20 transition-colors duration-200"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.02 }}
                    >
                      {currentGuide.columns.map((col) => {
                        const colKey = col.toLowerCase().replace(/\s+/g, '');
                        const camelCaseKey = col
                          .toLowerCase()
                          .split(' ')
                          .map((word, i) => i === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1))
                          .join('');
                        const value = row[colKey] ?? row[camelCaseKey] ?? row[col] ?? '—';
                        const isSize = col.toLowerCase() === 'size';
                        return (
                          <td
                            key={col}
                            className={`py-4 px-2 md:px-3 text-smoke ${
                              isSize ? 'text-left font-display text-lg font-medium text-ink' : 'text-center'
                            }`}
                          >
                            {value}
                          </td>
                        );
                      })}
                    </motion.tr>
                  ))}
                </tbody>
              </table>

              <p className="text-xs text-muted mt-8 leading-relaxed">
                * All measurements are in inches. If you are between sizes, we recommend sizing up.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
