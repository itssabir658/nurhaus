import type { Metadata } from 'next';
import { Cormorant_Garamond, Inter, Manrope } from 'next/font/google';
import './globals.css';
import Providers from '@/components/Providers';

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
    default: 'NÜRHAUS — Modest Luxury',
    template: '%s | NÜRHAUS',
  },
  description: 'Modest luxury, in measured light. A curated collection of abayas and dresses, finished by hand and meant to be kept.',
  openGraph: {
    siteName: 'NÜRHAUS',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${inter.variable} ${manrope.variable}`}
    >
      <body className="bg-primary text-ink font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
