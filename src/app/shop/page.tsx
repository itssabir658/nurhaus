import { getProducts, isShopifyConfigured } from '@/lib/shopify';
import { DEMO_PRODUCTS } from '@/lib/demoProducts';
import type { Metadata } from 'next';
import { getServerCampaignState } from '@/lib/campaign/server';
import ShopClient from './ShopClient';

export async function generateMetadata(): Promise<Metadata> {
  const { campaign, live } = await getServerCampaignState();
  if (!campaign || !live) return { title: 'Shop the Collection' };
  const title = `The Sale — ${campaign.discountPercent}% Off Selected Styles`;
  const description = `Shop the ${campaign.name}: ${campaign.discountPercent}% off selected abayas and dresses. Sale price applied automatically.`;
  return {
    title,
    description,
    openGraph: { title, description, images: [{ url: '/shop-hero/1.jpg', alt: title }] },
  };
}

export default async function ShopPage() {
  const liveProducts = isShopifyConfigured ? await getProducts({ first: 48 }).catch(() => []) : [];
  const products = liveProducts.length > 0 ? liveProducts : DEMO_PRODUCTS;
  const types = Array.from(new Set(products.map((p) => p.kind).filter(Boolean)));
  const categories = ['All', ...types];

  return <ShopClient products={products} categories={categories} configured={isShopifyConfigured} />;
}
