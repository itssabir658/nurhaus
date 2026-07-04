import { getProducts, isShopifyConfigured } from '@/lib/shopify';
import { DEMO_PRODUCTS } from '@/lib/demoProducts';
import SearchPageClient from './SearchPageClient';

export default async function SearchPage() {
  const liveProducts = isShopifyConfigured ? await getProducts({ first: 48 }).catch(() => []) : [];
  const products = liveProducts.length > 0 ? liveProducts : DEMO_PRODUCTS;
  return <SearchPageClient products={products} />;
}
