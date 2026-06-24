import type { Metadata } from 'next';
import { Cormorant_Garamond, Inter, Manrope } from 'next/font/google';
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
  variable: '--font-sans',
  display: 'swap',
});

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-body',
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
      className={`${cormorant.variable} ${inter.variable} ${manrope.variable}`}
    >
      <body className="bg-primary text-ink font-sans">
        <Providers searchProducts={searchProducts}>{children}</Providers>
      </body>
    </html>
  );
}
