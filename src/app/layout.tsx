import type { Metadata } from 'next';
import { Cormorant_Garamond, Inter, Manrope } from 'next/font/google';
import localFont from 'next/font/local';
import './globals.css';
import './background.css';
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

  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${inter.variable} ${figtree.variable} ${manrope.variable} ${brolimo.variable} ${felixti.variable}`}
    >
      <body className="bg-primary text-ink font-sans">
        <Providers searchProducts={searchProducts}>{children}</Providers>
      </body>
    </html>
  );
}
