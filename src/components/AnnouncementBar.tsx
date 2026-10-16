'use client';

import { useGeo } from '@/contexts/GeoContext';
import { FREE_SHIPPING_THRESHOLD } from '@/lib/shipping';

const DEFAULT_MESSAGE = `Complimentary Shipping Above $${FREE_SHIPPING_THRESHOLD} · Duties Included`;
const CANADA_MESSAGE = `Complimentary Shipping Across Canada Above $${FREE_SHIPPING_THRESHOLD}`;

export default function AnnouncementBar() {
  const { isCanadaVisitor } = useGeo();
  const MESSAGE = isCanadaVisitor ? CANADA_MESSAGE : DEFAULT_MESSAGE;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[55] flex items-center justify-center overflow-hidden"
      style={{ height: '44px', background: '#111111' }}
    >
      <p
        className="text-[0.56rem] sm:text-[0.64rem] tracking-[0.08em] sm:tracking-[0.14em] uppercase font-medium select-none px-4 text-center whitespace-nowrap overflow-hidden text-ellipsis max-w-full"
        style={{ color: '#F8F5F1', fontFamily: 'var(--font-sans)' }}
      >
        {MESSAGE}
      </p>
    </div>
  );
}
