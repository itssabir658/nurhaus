import { notFound } from 'next/navigation';
import { getProductByHandle, getProducts, isShopifyConfigured } from '@/lib/shopify';
import { DEMO_PRODUCTS, getDemoProductByHandle } from '@/lib/demoProducts';
import ProductClient from './ProductClient';

// Excluded from every "You May Also Consider" marquee.
const RELATED_EXCLUDE_HANDLES = ['layla', 'yara'];

export default async function ProductPage({ params }: { params: { handle: string } }) {
  const liveProduct = isShopifyConfigured ? await getProductByHandle(params.handle).catch(() => null) : null;

  if (liveProduct) {
    const others = await getProducts({ first: 100 }).catch(() => []);
    const related = others.filter((p) => p.handle !== liveProduct.handle && !RELATED_EXCLUDE_HANDLES.includes(p.handle));
    return <ProductClient product={liveProduct} related={related} isDemo={false} />;
  }

  // No live Shopify product at this handle — fall back to the demo catalog so the page
  // can still be previewed. Once a real product with this handle exists, it takes over.
  const demoProduct = getDemoProductByHandle(params.handle);
  if (!demoProduct) notFound();

  const demoRelated = DEMO_PRODUCTS.filter((p) => p.handle !== demoProduct.handle && !RELATED_EXCLUDE_HANDLES.includes(p.handle));
  return <ProductClient product={demoProduct} related={demoRelated} isDemo={true} />;
}
