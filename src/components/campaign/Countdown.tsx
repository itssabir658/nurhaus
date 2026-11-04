'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useCampaign } from '@/contexts/CampaignContext';
import { getTimeParts, type TimeParts } from '@/lib/campaign/schedule';

/**
 * Live time remaining until the active campaign's deadline.
 *
 * - First render is computed from the *server* timestamp, so SSR and
 *   hydration produce identical markup (no hydration warnings).
 * - After mount it ticks from the device clock (corrected only if that clock
 *   is clearly wrong), aligned to each whole second, and recalculates from
 *   the absolute deadline every tick — so it stays exact across refreshes,
 *   background tabs and sleep, and never drifts.
 * - Clamped at zero: it stops at 00:00:00 and never runs negative.
 */
export function useCountdown(): TimeParts {
  const { endsAtMs, serverNow, getNow } = useCampaign();
  const [parts, setParts] = useState<TimeParts>(() =>
    getTimeParts(endsAtMs !== null ? endsAtMs - serverNow : 0),
  );

  useEffect(() => {
    if (endsAtMs === null) return;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const tick = () => {
      const remaining = endsAtMs - getNow();
      setParts(getTimeParts(remaining));
      if (remaining <= 0) return;
      // Wake just after the next whole-second boundary.
      const untilNextSecond = remaining % 1000 || 1000;
      timer = setTimeout(tick, untilNextSecond + 15);
    };

    tick();
    const onVisible = () => {
      if (document.visibilityState !== 'visible') return;
      if (timer) clearTimeout(timer);
      tick();
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      if (timer) clearTimeout(timer);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [endsAtMs, getNow]);

  return parts;
}

/**
 * True once the remaining time is inside the campaign's countdown window
 * (e.g. the final 72 hours). Derived from the same ticking value as the
 * countdown, so it opens on time while the page is open and matches on
 * server and client for the first render.
 */
export function useCountdownWindowOpen(parts: TimeParts): boolean {
  const { campaign } = useCampaign();
  const windowHours = campaign?.countdownWindowHours ?? null;
  if (windowHours === null) return true;
  return parts.totalMs <= windowHours * 3_600_000;
}

const pad = (n: number) => String(n).padStart(2, '0');

/**
 * Reduced-motion preference, read only after mount. framer's own hook can
 * return a different value on the first client render than on the server,
 * which would change the digits' inline styles and trip hydration.
 */
function useReducedMotionAfterMount(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return reduced;
}

function RollingDigits({ value, reduced }: { value: string; reduced: boolean }) {
  return (
    <span className="relative inline-flex overflow-hidden tabular-nums" aria-hidden="true">
      {/* Invisible copy reserves the width so neighbours never shift. */}
      <span className="invisible">{value}</span>
      <AnimatePresence initial={false}>
        <motion.span
          key={value}
          className="absolute inset-0 flex justify-center"
          initial={reduced ? { opacity: 0 } : { y: '-55%', opacity: 0 }}
          animate={reduced ? { opacity: 1 } : { y: '0%', opacity: 1 }}
          exit={reduced ? { opacity: 0 } : { y: '55%', opacity: 0 }}
          transition={{ duration: reduced ? 0.15 : 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function srSummary(t: TimeParts) {
  const bits = [
    t.days ? `${t.days} day${t.days === 1 ? '' : 's'}` : null,
    `${t.hours} hour${t.hours === 1 ? '' : 's'}`,
    `${t.minutes} minute${t.minutes === 1 ? '' : 's'}`,
  ].filter(Boolean);
  return bits.join(', ');
}

/** Hero countdown: Days / Hours / Minutes / Seconds with hairline dividers. */
export function CampaignCountdown({ className = '' }: { className?: string }) {
  const { campaign } = useCampaign();
  const parts = useCountdown();
  const reduced = useReducedMotionAfterMount();
  const windowOpen = useCountdownWindowOpen(parts);
  if (!campaign) return null;

  // Before the final window: state the real end date, no ticking timer.
  if (!windowOpen) {
    return (
      <div className={className}>
        <p className="eyebrow mb-3 text-[#463A30]">The Sale Runs Until</p>
        <p className="font-display text-[#2E241E] text-[1.6rem] sm:text-[2rem] leading-tight">
          {campaign.copy.deadlineLabel.replace(/, .*$/, '')}
        </p>
        <p className="mt-2 text-[0.7rem] text-[#7A746F] tracking-wide">{campaign.copy.deadlineLabel.replace(/^.*?, /, '')}</p>
      </div>
    );
  }

  const units: [string, number][] = [
    ['Days', parts.days],
    ['Hours', parts.hours],
    ['Minutes', parts.minutes],
    ['Seconds', parts.seconds],
  ];

  return (
    <div role="timer" aria-label={`${campaign.copy.countdownLabel}: ${srSummary(parts)}. Ends ${campaign.copy.deadlineLabel}.`} className={className}>
      <p className="eyebrow mb-4 text-[#463A30]">{campaign.copy.countdownLabel}</p>
      <div className="flex items-stretch" aria-hidden="true">
        {units.map(([label, n], i) => (
          <div
            key={label}
            className={`flex flex-col items-center px-3.5 sm:px-5 first:pl-0 last:pr-0 ${i > 0 ? 'border-l border-[#2E241E]/15' : ''}`}
          >
            <span className="font-display text-[#2E241E] text-[2rem] sm:text-[2.4rem] md:text-[2.6rem] leading-none">
              <RollingDigits value={pad(n)} reduced={reduced} />
            </span>
            <span className="mt-2 text-[0.56rem] tracking-[0.24em] uppercase text-[#7A746F]" style={{ fontFamily: 'var(--font-eyebrow)' }}>
              {label}
            </span>
          </div>
        ))}
      </div>
      <p className="mt-4 text-[0.7rem] text-[#7A746F] tracking-wide">Ends {campaign.copy.deadlineLabel}</p>
    </div>
  );
}

/** One-line countdown for tight spaces (product page, cart): "17h 23m 05s". */
export function CompactCountdown({ className = '' }: { className?: string }) {
  const parts = useCountdown();
  const text = parts.days > 0
    ? `${parts.days}d ${pad(parts.hours)}h ${pad(parts.minutes)}m`
    : `${pad(parts.hours)}h ${pad(parts.minutes)}m ${pad(parts.seconds)}s`;
  return (
    <span className={`tabular-nums ${className}`} aria-label={srSummary(parts)}>
      {text}
    </span>
  );
}

/**
 * Right-hand side of the product page sale note: a live "Ends in" timer
 * inside the countdown window, otherwise the real end date. Self-contained
 * so only this element re-renders each second.
 */
export function SaleEndsNote() {
  const { campaign } = useCampaign();
  const parts = useCountdown();
  const windowOpen = useCountdownWindowOpen(parts);
  if (!campaign) return null;
  return windowOpen ? (
    <>
      <p className="text-[0.6rem] tracking-[0.2em] uppercase text-muted">Ends in</p>
      <CompactCountdown className="block text-sm text-ink font-medium mt-1" />
    </>
  ) : (
    <>
      <p className="text-[0.6rem] tracking-[0.2em] uppercase text-muted">Until</p>
      <p className="text-sm text-ink font-medium mt-1">{campaign.copy.deadlineShort.replace(/, .*$/, '')}</p>
    </>
  );
}
