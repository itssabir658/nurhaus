'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { ACTIVE_CAMPAIGN, type Campaign } from '@/lib/campaign/config';
import { getCampaignPhase, getClockOffset, toEpoch, type CampaignPhase } from '@/lib/campaign/schedule';
import { getMarkdown, type Markdown } from '@/lib/pricing';

interface CampaignContextValue {
  campaign: Campaign | null;
  /** Campaign is inside its window AND Shopify prices honour it. Drives all sale UI. */
  isLive: boolean;
  /** The campaign ended while this visitor had the site open — show a graceful closing note. */
  endedWhileViewing: boolean;
  /** Absolute deadline in epoch ms, or null when no campaign is configured. */
  endsAtMs: number | null;
  /** Server-rendered timestamp. Used for the first render so SSR and hydration match. */
  serverNow: number;
  /** Current time, corrected for a clearly wrong device clock. Client-side only. */
  getNow: () => number;
  /** Markdown to display for a price pair — null unless the campaign is live and Shopify has a real markdown. */
  saleFor: (price: number, compareAt: number | null | undefined) => Markdown | null;
}

const CampaignContext = createContext<CampaignContextValue>({
  campaign: null,
  isLive: false,
  endedWhileViewing: false,
  endsAtMs: null,
  serverNow: 0,
  getNow: () => Date.now(),
  saleFor: () => null,
});

// Re-check at least this often while a boundary is pending, so a laptop that
// sleeps through the deadline (frozen timers) still flips promptly on wake.
const MAX_TIMER_MS = 60_000;

export function CampaignProvider({
  children,
  serverNow,
  verified,
}: {
  children: React.ReactNode;
  serverNow: number;
  /** Computed on the server from the live Shopify catalog — see lib/campaign/verify.ts. */
  verified: boolean;
}) {
  const campaign = ACTIVE_CAMPAIGN;
  const offsetRef = useRef<number | null>(null);

  // First render uses the server's timestamp on both server and client, so the
  // markup is identical and React never sees a hydration mismatch.
  const [phase, setPhase] = useState<CampaignPhase>(() =>
    campaign ? getCampaignPhase(campaign, serverNow) : 'ended',
  );
  const [endedWhileViewing, setEndedWhileViewing] = useState(false);
  const phaseRef = useRef(phase);

  const getNow = useCallback(() => {
    if (offsetRef.current === null) offsetRef.current = getClockOffset(serverNow, Date.now());
    return Date.now() + offsetRef.current;
  }, [serverNow]);

  useEffect(() => {
    if (!campaign) return;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const sync = () => {
      const now = getNow();
      const next = getCampaignPhase(campaign, now);
      if (phaseRef.current === 'live' && next === 'ended') setEndedWhileViewing(true);
      phaseRef.current = next;
      setPhase(next);

      if (timer) clearTimeout(timer);
      const boundary =
        next === 'scheduled' && campaign.startsAt ? toEpoch(campaign.startsAt)
        : next === 'live' ? toEpoch(campaign.endsAt)
        : null;
      if (boundary !== null) {
        timer = setTimeout(sync, Math.min(Math.max(boundary - now, 0) + 20, MAX_TIMER_MS));
      }
    };

    sync();
    // Background tabs throttle timers; re-sync the moment the tab is visible.
    document.addEventListener('visibilitychange', sync);
    return () => {
      if (timer) clearTimeout(timer);
      document.removeEventListener('visibilitychange', sync);
    };
  }, [campaign, getNow]);

  const honoured = Boolean(campaign) && (verified || !campaign?.requireShopifyMarkdown);
  const isLive = honoured && phase === 'live';

  const saleFor = useCallback(
    (price: number, compareAt: number | null | undefined) => (isLive ? getMarkdown(price, compareAt) : null),
    [isLive],
  );

  const value = useMemo<CampaignContextValue>(
    () => ({
      campaign,
      isLive,
      endedWhileViewing: honoured && endedWhileViewing,
      endsAtMs: campaign ? toEpoch(campaign.endsAt) : null,
      serverNow,
      getNow,
      saleFor,
    }),
    [campaign, isLive, honoured, endedWhileViewing, serverNow, getNow, saleFor],
  );

  return <CampaignContext.Provider value={value}>{children}</CampaignContext.Provider>;
}

export function useCampaign() {
  return useContext(CampaignContext);
}
