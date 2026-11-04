import { notFound } from 'next/navigation';
import { getProductByHandle, getProducts, isShopifyConfigured } from '@/lib/shopify';
import { DEMO_PRODUCTS, getDemoProductByHandle } from '@/lib/demoProducts';
import ProductClient from './ProductClient';
import type { Metadata } from 'next';
import type { AppProduct } from '@/lib/shopify/types';
import { getServerCampaignState } from '@/lib/campaign/server';
import { getMarkdown, formatMoney } from '@/lib/pricing';

async function loadProduct(handle: string): Promise<AppProduct | null> {
  const live = isShopifyConfigured ? await getProductByHandle(handle).catch(() => null) : null;
  return live ?? getDemoProductByHandle(handle);
}

/** Per-product title, description and share image (previously every product page used the site default). */
export async function generateMetadata({ params }: { params: { handle: string } }): Promise<Metadata> {
  const product = await loadProduct(params.handle);
  if (!product) return {};
  const { live } = await getServerCampaignState();
  const markdown = live ? getMarkdown(product.price, product.compareAtPrice) : null;

  const title = markdown ? `${product.name} — ${markdown.percentOff}% Off` : `${product.name} — ${product.kind}`;
  const priceLine = markdown
    ? `Now ${formatMoney(markdown.price)} (was ${formatMoney(markdown.compareAt)}).`
    : `${formatMoney(product.price)}.`;
  const blurb = product.description ? product.description.slice(0, 140).replace(/\s+\S*$/, '') + '…' : '';
  const description = `${product.name}, a modest ${product.kind.toLowerCase()} by NÜR HAUS. ${priceLine} ${blurb}`.trim();
  const image = product.images[0];

  return {
    title,
    description,
    openGraph: { title, description, ...(image ? { images: [{ url: image, alt: product.name }] } : {}) },
    twitter: { card: 'summary_large_image', title, description, ...(image ? { images: [image] } : {}) },
  };
}

/**
 * schema.org Product data from live Shopify fields only (price, currency,
 * stock), so Google can show price and availability in results.
 */
function productJsonLd(product: AppProduct) {
  const prices = product.variants.map((v) => v.price);
  const low = prices.length ? Math.min(...prices) : product.price;
  const high = prices.length ? Math.max(...prices) : product.price;
  const availability = product.availableForSale ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock';
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images,
    brand: { '@type': 'Brand', name: 'NÜR HAUS' },
    category: product.kind,
    offers:
      low === high
        ? { '@type': 'Offer', price: low.toFixed(2), priceCurrency: product.currency, availability, itemCondition: 'https://schema.org/NewCondition' }
        : { '@type': 'AggregateOffer', lowPrice: low.toFixed(2), highPrice: high.toFixed(2), priceCurrency: product.currency, availability, offerCount: product.variants.length },
  };
}

function JsonLd({ data }: { data: unknown }) {
  // JSON.stringify output can't break out of the script tag once "<" is escaped.
  const json = JSON.stringify(data).replace(/</g, '\\u003c');
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}

// Excluded from every "You May Also Consider" marquee.
const RELATED_EXCLUDE_HANDLES = ['layla', 'yara'];

export default async function ProductPage({ params }: { params: { handle: string } }) {
  const liveProduct = isShopifyConfigured ? await getProductByHandle(params.handle).catch(() => null) : null;

  if (liveProduct) {
    const others = await getProducts({ first: 100 }).catch(() => []);
    const related = others.filter((p) => p.handle !== liveProduct.handle && !RELATED_EXCLUDE_HANDLES.includes(p.handle));
    return (
      <>
        <JsonLd data={productJsonLd(liveProduct)} />
        <ProductClient product={liveProduct} related={related} isDemo={false} />
      </>
    );
  }

  // No live Shopify product at this handle — fall back to the demo catalog so the page
  // can still be previewed. Once a real product with this handle exists, it takes over.
  const demoProduct = getDemoProductByHandle(params.handle);
  if (!demoProduct) notFound();

  const demoRelated = DEMO_PRODUCTS.filter((p) => p.handle !== demoProduct.handle && !RELATED_EXCLUDE_HANDLES.includes(p.handle));
  return <ProductClient product={demoProduct} related={demoRelated} isDemo={true} />;
}
