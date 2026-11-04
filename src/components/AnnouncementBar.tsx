'use client';

import Link from 'next/link';
import { useGeo } from '@/contexts/GeoContext';
import { useCampaign } from '@/contexts/CampaignContext';
import { FREE_SHIPPING_THRESHOLD } from '@/lib/shipping';

const DEFAULT_MESSAGE = `Complimentary Shipping Above $${FREE_SHIPPING_THRESHOLD} · Duties Included`;
const CANADA_MESSAGE = `Complimentary Shipping Across Canada Above $${FREE_SHIPPING_THRESHOLD}`;

const BAR_CLASS = 'fixed top-0 left-0 right-0 z-[55] flex items-center justify-center overflow-hidden';
const BAR_STYLE = { height: '44px', background: '#111111' } as const;

export default function AnnouncementBar() {
  const { isUSVisitor, isCanadaVisitor } = useGeo();
  const { isLive, campaign } = useCampaign();

  // While a campaign is live every visitor sees it, US included — the sale is
  // storewide, and the nav already reserves this 44px band for everyone.
  if (isLive && campaign) {
    return (
      <Link
        href={campaign.shopHref}
        className={`${BAR_CLASS} group announcement-enter`}
        style={BAR_STYLE}
        aria-label={`${campaign.copy.announcement}. ${campaign.copy.announcementCta}.`}
      >
        {/* One line from sm up; on phones the CTA drops to a second line so
            neither the offer nor the call to action gets cut. */}
        <p
          className="flex flex-col sm:flex-row items-center gap-0.5 sm:gap-4 text-[0.56rem] sm:text-[0.64rem] tracking-[0.1em] sm:tracking-[0.18em] uppercase font-medium select-none px-4 whitespace-nowrap leading-tight"
          style={{ color: '#F8F5F1', fontFamily: 'var(--font-sans)' }}
        >
          <span className="flex items-center gap-2.5">
            <span className="sale-glint text-gold" aria-hidden="true">✦</span>
            <span>{campaign.copy.announcement}</span>
          </span>
          <span className="hidden sm:inline-block h-3 w-px bg-primary/25" aria-hidden="true" />
          <span className="inline-flex items-center gap-1.5 text-gold text-[0.52rem] sm:text-[length:inherit] tracking-[0.2em] sm:tracking-[inherit]">
            <span className="announcement-cta">{campaign.copy.announcementCta}</span>
            <span className="inline-block transition-transform duration-500 ease-expo group-hover:translate-x-1" aria-hidden="true">→</span>
          </span>
        </p>
      </Link>
    );
  }

  // Normal storefront: shipping notice, hidden for confirmed US visitors.
  if (isUSVisitor) return null;
  const message = isCanadaVisitor ? CANADA_MESSAGE : DEFAULT_MESSAGE;

  return (
    <div className={BAR_CLASS} style={BAR_STYLE}>
      <p
        className="text-[0.56rem] sm:text-[0.64rem] tracking-[0.08em] sm:tracking-[0.14em] uppercase font-medium select-none px-4 text-center whitespace-nowrap overflow-hidden text-ellipsis max-w-full"
        style={{ color: '#F8F5F1', fontFamily: 'var(--font-sans)' }}
      >
        {message}
      </p>
    </div>
  );
}
