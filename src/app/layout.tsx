import type { Metadata } from 'next';
import { Cormorant_Garamond, Inter, Manrope } from 'next/font/google';
import localFont from 'next/font/local';
import { headers } from 'next/headers';
import './globals.css';
import Providers from '@/components/Providers';
import { getProducts, isShopifyConfigured } from '@/lib/shopify';
import { DEMO_PRODUCTS } from '@/lib/demoProducts';
import { getServerCampaignState } from '@/lib/campaign/server';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-eyebrow',
  display: 'swap',
});

const figtree = localFont({
  src: [
    { path: '../../public/fonts/Figtree-VariableFont_wght.ttf', style: 'normal' },
    { path: '../../public/fonts/Figtree-Italic-VariableFont_wght.ttf', style: 'italic' },
  ],
  variable: '--font-sans',
  display: 'swap',
});

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

const brolimo = localFont({
  src: [{ path: '../../public/fonts/BrolimoRegular.ttf', style: 'normal' }],
  variable: '--font-brolimo',
  display: 'swap',
});

const felixti = localFont({
  src: [{ path: '../../public/fonts/Felixti.ttf', style: 'normal' }],
  variable: '--font-felixti',
  display: 'swap',
});

const BASE_DESCRIPTION =
  'Modest luxury, in measured light. A curated collection of abayas and dresses, finished by hand and meant to be kept.';

export async function generateMetadata(): Promise<Metadata> {
  const base: Metadata = {
    metadataBase: new URL('https://nurhaus.ca'),
    title: {
      default: 'NÜR HAUS — Modest Luxury',
      template: '%s | NÜR HAUS',
    },
    description: BASE_DESCRIPTION,
    openGraph: {
      siteName: 'NÜR HAUS',
      type: 'website',
    },
  };

  // While a sale is live (and honoured by Shopify prices), search results and
  // link previews on WhatsApp/Instagram/Facebook lead with the offer. Reverts
  // to the standing brand copy automatically when the campaign ends.
  const { campaign, live } = await getServerCampaignState();
  if (!campaign || !live) return base;

  const title = `NÜR HAUS — ${campaign.name}, ${campaign.discountPercent}% Off Site-Wide`;
  const description = `${campaign.discountPercent}% off modest abayas and dresses, site-wide. Finished by hand. Sale price applied automatically, no code needed.`;
  return {
    ...base,
    title: { default: title, template: '%s | NÜR HAUS' },
    description,
    openGraph: {
      siteName: 'NÜR HAUS',
      type: 'website',
      title,
      description,
      images: [{ url: '/hero-editorial/4.jpg', alt: `${campaign.name} at NÜR HAUS` }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/hero-editorial/4.jpg'],
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const searchProducts = isShopifyConfigured ? await getProducts({ first: 48 }).catch(() => []) : [];

  // Vercel's edge network sets this header with the visitor's IP-derived country
  // on every request — no separate geolocation service needed. The raw code is
  // passed down and Providers derives isUSVisitor/isCanadaVisitor from it, so
  // every shipping/promo mention (banner, cart drawer, cart page, product
  // trust signals, shipping policy) shares one source of truth. Falls back to
  // null (undefined outside Vercel, e.g. local dev) rather than hiding or
  // altering anything, so promo copy only changes once a country is confirmed.
  const requestHeaders = await headers();
  const visitorCountry = requestHeaders.get('x-vercel-ip-country');

  // Campaign gating. The sale is only advertised when Shopify's own prices
  // carry the matching markdown (live catalog when connected; the demo
  // catalog only when Shopify isn't configured at all). The request
  // timestamp seeds the first render so server and client markup match.
  const { verified: campaignVerified } = await getServerCampaignState(
    isShopifyConfigured ? searchProducts : DEMO_PRODUCTS,
  );
  const serverNow = Date.now();

  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${inter.variable} ${figtree.variable} ${manrope.variable} ${brolimo.variable} ${felixti.variable}`}
    >
      <body className="bg-primary text-ink font-sans">
        <Providers
          searchProducts={searchProducts}
          visitorCountry={visitorCountry}
          serverNow={serverNow}
          campaignVerified={campaignVerified}
        >{children}</Providers>
      </body>
    </html>
  );
}
