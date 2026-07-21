import type { Metadata } from 'next';
import { Cormorant_Garamond, Inter, Manrope } from 'next/font/google';
import localFont from 'next/font/local';
import { headers } from 'next/headers';
import './globals.css';
import Providers from '@/components/Providers';
import { getProducts, isShopifyConfigured } from '@/lib/shopify';

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

export const metadata: Metadata = {
  title: {
    default: 'NÜR HAUS — Modest Luxury',
    template: '%s | NÜR HAUS',
  },
  description: 'Modest luxury, in measured light. A curated collection of abayas and dresses, finished by hand and meant to be kept.',
  openGraph: {
    siteName: 'NÜR HAUS',
    type: 'website',
  },
};

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

  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${inter.variable} ${figtree.variable} ${manrope.variable} ${brolimo.variable} ${felixti.variable}`}
    >
      <body className="bg-primary text-ink font-sans">
        <Providers searchProducts={searchProducts} visitorCountry={visitorCountry}>{children}</Providers>
      </body>
    </html>
  );
}
