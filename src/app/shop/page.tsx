import { getProducts, isShopifyConfigured } from '@/lib/shopify';
import { DEMO_PRODUCTS } from '@/lib/demoProducts';
import ShopClient from './ShopClient';

export const metadata = { title: 'Shop the Collection' };

export default async function ShopPage() {
  const liveProducts = isShopifyConfigured ? await getProducts({ first: 48 }).catch(() => []) : [];
  const products = liveProducts.length > 0 ? liveProducts : DEMO_PRODUCTS;
  const types = Array.from(new Set(products.map((p) => p.kind).filter(Boolean)));
  const categories = ['All', ...types];

  return <ShopClient products={products} categories={categories} configured={isShopifyConfigured} />;
}
