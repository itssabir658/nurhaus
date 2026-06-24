import { getProducts, isShopifyConfigured } from '@/lib/shopify';
import { DEMO_PRODUCTS } from '@/lib/demoProducts';
import HomeClient from './HomeClient';

export default async function HomePage() {
  const liveProducts = isShopifyConfigured ? await getProducts({ first: 6 }).catch(() => []) : [];
  const products = liveProducts.length > 0 ? liveProducts : DEMO_PRODUCTS.slice(0, 6);
  return <HomeClient products={products} configured={isShopifyConfigured} />;
}
