import { getProducts, isShopifyConfigured } from '@/lib/shopify';
import { DEMO_PRODUCTS } from '@/lib/demoProducts';
import CartPageClient from './CartPageClient';

export default async function CartPage() {
  const liveProducts = isShopifyConfigured ? await getProducts({ first: 3 }).catch(() => []) : [];
  const crossSell = liveProducts.length > 0 ? liveProducts : DEMO_PRODUCTS.slice(0, 3);
  return <CartPageClient crossSell={crossSell} />;
}
