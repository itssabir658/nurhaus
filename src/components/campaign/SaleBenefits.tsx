'use client';

import { useCampaign } from '@/contexts/CampaignContext';
import { useGeo } from '@/contexts/GeoContext';
import { shippingPromise } from '@/lib/shipping';

/**
 * Hero footer used when the campaign doesn't show a deadline. Answers the
 * three questions that stop a sale shopper from buying: how much off, do I
 * need a code, and what will shipping cost. Everything stated is true for
 * every order (shipping copy is the same geo-aware promise used site-wide).
 */
export function SaleBenefits({ className = '' }: { className?: string }) {
  const { campaign } = useCampaign();
  const { isCanadaVisitor } = useGeo();
  if (!campaign) return null;

  const items = [
    `${campaign.discountPercent}% off site-wide`,
    'Sale price applied automatically, no code needed',
    shippingPromise(isCanadaVisitor),
  ];

  return (
    <ul className={`space-y-2.5 text-left ${className}`}>
      {items.map((text) => (
        <li key={text} className="flex items-start gap-3 text-[0.8rem] leading-snug text-[#463A30]">
          <span className="text-gold flex-shrink-0 mt-px" aria-hidden="true">✦</span>
          {text}
        </li>
      ))}
    </ul>
  );
}
