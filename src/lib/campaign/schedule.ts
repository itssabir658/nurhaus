/**
 * Pure, timezone-independent campaign timing helpers.
 *
 * Every calculation here works on absolute epoch milliseconds. The deadline is
 * parsed from an ISO string with an explicit offset, so the visitor's local
 * timezone never influences when a campaign ends — only *how long until* it
 * ends, which is identical for everyone at the same instant.
 *
 * Dependency-free on purpose so it runs on the server, in the browser and in
 * plain Node for tests.
 */

export type CampaignPhase = 'scheduled' | 'live' | 'ended';

export interface CampaignWindow {
  startsAt: string | null;
  endsAt: string;
}

export function toEpoch(iso: string): number {
  const ms = Date.parse(iso);
  if (Number.isNaN(ms)) throw new Error(`Invalid campaign date: ${iso}`);
  return ms;
}

export function getCampaignPhase(window: CampaignWindow, nowMs: number): CampaignPhase {
  if (window.startsAt && nowMs < toEpoch(window.startsAt)) return 'scheduled';
  if (nowMs >= toEpoch(window.endsAt)) return 'ended';
  return 'live';
}

export interface TimeParts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
}

/** Splits a remaining duration into display units. Never negative. */
export function getTimeParts(remainingMs: number): TimeParts {
  const clamped = Math.max(0, remainingMs);
  // Round *up* to the whole second so the display reaches 00:00:00 exactly at
  // the deadline rather than a second early.
  const totalSeconds = Math.ceil(clamped / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    totalMs: clamped,
  };
}

/**
 * Visitor clocks are usually right (NTP-synced), but a phone set by hand can be
 * off by hours. Always trusting the server timestamp would instead add the
 * page's own network latency to the countdown, so the server time is only
 * used as a correction when the device clock is clearly wrong.
 */
export const CLOCK_SKEW_TOLERANCE_MS = 60_000;

export function getClockOffset(serverNowMs: number, clientNowMs: number): number {
  const offset = serverNowMs - clientNowMs;
  return Math.abs(offset) > CLOCK_SKEW_TOLERANCE_MS ? offset : 0;
}
