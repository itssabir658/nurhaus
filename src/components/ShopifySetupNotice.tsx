export default function ShopifySetupNotice({ context = 'this page' }: { context?: string }) {
  return (
    <div className="site-max site-px py-32 text-center">
      <p className="eyebrow mb-4">Storefront Not Connected</p>
      <p className="font-display text-3xl tracking-tight mb-4">Connect your Shopify store.</p>
      <p className="text-sm text-smoke leading-relaxed max-w-md mx-auto mb-2">
        {`${context[0].toUpperCase()}${context.slice(1)} will populate automatically once your Shopify Storefront API credentials are configured.`}
      </p>
      <p className="text-xs text-muted max-w-sm mx-auto">
        Set <code className="text-ink">SHOPIFY_STORE_DOMAIN</code> and <code className="text-ink">SHOPIFY_STOREFRONT_ACCESS_TOKEN</code> — see <code className="text-ink">DEPLOYMENT.md</code> for the full setup guide.
      </p>
    </div>
  );
}
