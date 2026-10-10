'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { META_PIXEL_ID, metaPixelEnabled, trackPageView } from '@/lib/meta/pixel';

/**
 * Meta Pixel base install.
 *
 * The storefront is headless, so Shopify's Facebook & Instagram app cannot
 * instrument these pages — it only injects into Shopify-hosted themes. Every
 * top-of-funnel event therefore has to be fired from here.
 *
 * Purchase is deliberately NOT tracked in the browser: checkout happens on the
 * Shopify-hosted subdomain, so it is sent server-side from the Shopify
 * orders/create webhook instead. See src/app/api/webhooks/shopify/orders.
 */
export default function MetaPixel() {
  const pathname = usePathname();
  // The base snippet fires PageView on init; skip the first effect so the
  // landing page isn't counted twice.
  const bootstrapped = useRef(false);

  useEffect(() => {
    if (!metaPixelEnabled) return;
    if (!bootstrapped.current) {
      bootstrapped.current = true;
      return;
    }
    trackPageView();
  }, [pathname]);

  if (!metaPixelEnabled) return null;

  return (
    <Script id="meta-pixel" strategy="afterInteractive">
      {`
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window,document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${META_PIXEL_ID}');
fbq('track', 'PageView');
      `}
    </Script>
  );
}
