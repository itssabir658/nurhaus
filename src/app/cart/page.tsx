import { getProducts, isShopifyConfigured } from '@/lib/shopify';
import { DEMO_PRODUCTS } from '@/lib/demoProducts';
import CartPageClient from './CartPageClient';

export default async function CartPage() {
  const liveProducts = isShopifyConfigured ? await getProducts({ first: 3 }).catch(() => []) : [];
  const crossSell = liveProducts.length > 0 ? liveProducts : DEMO_PRODUCTS.slice(0, 3);
  // Pass the raw *.myshopify.com domain to the client so checkout can rewrite the
  // custom primary domain (which Next.js would otherwise intercept). Read here on
  // the server because SHOPIFY_STORE_DOMAIN is not exposed to the client bundle.
  const shopifyDomain = process.env.SHOPIFY_STORE_DOMAIN ?? null;
  return <CartPageClient crossSell={crossSell} shopifyDomain={shopifyDomain} />;
}
