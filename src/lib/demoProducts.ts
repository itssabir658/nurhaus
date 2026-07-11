// Curated placeholder catalog, shown only when the live Shopify store has zero products.
// Lets the storefront be previewed in full before the real catalog is populated.
// Any page that uses this falls back to real Shopify data automatically the moment
// real products exist — see usage in src/app/**/page.tsx.
import type { AppProduct, AppVariant } from './shopify/types';

const SIZES = ['S', 'M', 'L', 'XL'];

function makeVariants(opts: {
  handle: string;
  price: number;
  image: string;
  sizes?: string[];
  soldOut?: boolean;
  lowStockSize?: string;
}): AppVariant[] {
  const sizes = opts.sizes ?? SIZES;
  return sizes.map((size) => ({
    id: `demo-${opts.handle}-${size}`,
    title: size,
    availableForSale: !opts.soldOut,
    quantityAvailable: opts.soldOut ? 0 : size === opts.lowStockSize ? 4 : null,
    price: opts.price,
    image: opts.image,
    selectedOptions: [{ name: 'Size', value: size }],
  }));
}

export const DEMO_PRODUCTS: AppProduct[] = [
  {
    id: 'demo-sahar-abaya',
    handle: 'sahar-abaya',
    name: 'Layla',
    kind: 'Abaya',
    description: 'Named for the quiet hour before dawn, the Sahar is cut in a fluid double-layered crepe that moves like water and holds its shape with authority. A deep side slit and relaxed silhouette give freedom without sacrifice.',
    descriptionHtml: '<p>Named for the quiet hour before dawn, the Sahar is cut in a fluid double-layered crepe that moves like water and holds its shape with authority. A deep side slit and relaxed silhouette give freedom without sacrifice.</p>',
    price: 680,
    compareAtPrice: null,
    currency: 'USD',
    images: [
      'https://images.unsplash.com/photo-1760083545495-b297b1690672?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1752794673269-dc356838c5fd?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1619043518800-7f14be467dca?auto=format&fit=crop&w=1000&q=85',
    ],
    sizes: SIZES,
    variants: makeVariants({ handle: 'sahar-abaya', price: 680, image: 'https://images.unsplash.com/photo-1760083545495-b297b1690672?auto=format&fit=crop&w=600&q=80', lowStockSize: 'S' }),
    availableForSale: true,
    tags: ['new'],
  },
  {
    id: 'demo-noor-dress',
    handle: 'noor-dress',
    name: 'Amelie',
    kind: 'Dress',
    description: 'The Noor is an exercise in proportion. A modest neckline meets a subtly flared skirt at the knee — the kind of dress that works in every room because it asks nothing of the room.',
    descriptionHtml: '<p>The Noor is an exercise in proportion. A modest neckline meets a subtly flared skirt at the knee — the kind of dress that works in every room because it asks nothing of the room.</p>',
    price: 420,
    compareAtPrice: null,
    currency: 'USD',
    images: [
      'https://images.unsplash.com/photo-1762605135318-f34a993cbcf0?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1773439877634-e6ef9f571c12?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1619043518800-7f14be467dca?auto=format&fit=crop&w=1000&q=85',
    ],
    sizes: SIZES,
    variants: makeVariants({ handle: 'noor-dress', price: 420, image: 'https://images.unsplash.com/photo-1762605135318-f34a993cbcf0?auto=format&fit=crop&w=600&q=80', sizes: SIZES }),
    availableForSale: true,
    tags: [],
  },
  {
    id: 'demo-layl-abaya',
    handle: 'layl-abaya',
    name: 'Yara',
    kind: 'Abaya',
    description: 'The Layl — named for night — is a study in deep proportion. Cut extra long for full coverage with an open-front drape, structured shoulders, and a silk-chiffon overlay that catches light with each movement.',
    descriptionHtml: '<p>The Layl — named for night — is a study in deep proportion. Cut extra long for full coverage with an open-front drape, structured shoulders, and a silk-chiffon overlay that catches light with each movement.</p>',
    price: 720,
    compareAtPrice: null,
    currency: 'USD',
    images: [
      'https://images.unsplash.com/photo-1772474500365-c2c520545f44?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1772474542630-5f5822ca8421?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1772474521525-c022114367ce?auto=format&fit=crop&w=1000&q=85',
    ],
    sizes: SIZES,
    variants: makeVariants({ handle: 'layl-abaya', price: 720, image: 'https://images.unsplash.com/photo-1772474500365-c2c520545f44?auto=format&fit=crop&w=600&q=80', soldOut: true }),
    availableForSale: false,
    tags: ['new'],
  },
  {
    id: 'demo-dunya-dress',
    handle: 'dunya-dress',
    name: 'Faye',
    kind: 'Dress',
    description: 'Measured, considered, quietly assured — the Dunya pairs a soft midi silhouette with a structured coat layer, built for the woman moving between meetings and everything after.',
    descriptionHtml: '<p>Measured, considered, quietly assured — the Dunya pairs a soft midi silhouette with a structured coat layer, built for the woman moving between meetings and everything after.</p>',
    price: 390,
    compareAtPrice: null,
    currency: 'USD',
    images: ['https://images.unsplash.com/photo-1764179690247-df7f4014def7?auto=format&fit=crop&w=1000&q=85'],
    sizes: SIZES,
    variants: makeVariants({ handle: 'dunya-dress', price: 390, image: 'https://images.unsplash.com/photo-1764179690247-df7f4014def7?auto=format&fit=crop&w=600&q=80' }),
    availableForSale: true,
    tags: [],
  },
  {
    id: 'demo-layla-dress',
    handle: 'layla-dress',
    name: 'Elayna',
    kind: 'Dress',
    description: 'The dress that disappears into the room, and takes it with her — minimalist, architectural, cut from a single uninterrupted line of fabric.',
    descriptionHtml: '<p>The dress that disappears into the room, and takes it with her — minimalist, architectural, cut from a single uninterrupted line of fabric.</p>',
    price: 455,
    compareAtPrice: null,
    currency: 'USD',
    images: ['https://images.unsplash.com/photo-1762605135332-8a7ce1403187?auto=format&fit=crop&w=1000&q=85'],
    sizes: SIZES,
    variants: makeVariants({ handle: 'layla-dress', price: 455, image: 'https://images.unsplash.com/photo-1762605135332-8a7ce1403187?auto=format&fit=crop&w=600&q=80' }),
    availableForSale: true,
    tags: [],
  },
  {
    id: 'demo-zahra-dress',
    handle: 'zahra-dress',
    name: 'Saphira',
    kind: 'Dress',
    description: 'In light, always — the Zahra is a two-piece co-ord in fluid mocha crepe, designed to read as one continuous silhouette.',
    descriptionHtml: '<p>In light, always — the Zahra is a two-piece co-ord in fluid mocha crepe, designed to read as one continuous silhouette.</p>',
    price: 470,
    compareAtPrice: null,
    currency: 'USD',
    images: ['https://images.unsplash.com/photo-1772714601004-23b94ae3913d?auto=format&fit=crop&w=1000&q=85'],
    sizes: SIZES,
    variants: makeVariants({ handle: 'zahra-dress', price: 470, image: 'https://images.unsplash.com/photo-1772714601004-23b94ae3913d?auto=format&fit=crop&w=600&q=80' }),
    availableForSale: true,
    tags: [],
  },
  {
    id: 'demo-rana-dress',
    handle: 'rana-dress',
    name: 'Dahlia',
    kind: 'Dress',
    description: 'Hand-embroidered detailing along the bodice and sleeve, finished with a fluid silk dupatta — quiet ceremony, made wearable.',
    descriptionHtml: '<p>Hand-embroidered detailing along the bodice and sleeve, finished with a fluid silk dupatta — quiet ceremony, made wearable.</p>',
    price: 435,
    compareAtPrice: null,
    currency: 'USD',
    images: ['https://images.unsplash.com/photo-1773439877634-e6ef9f571c12?auto=format&fit=crop&w=1000&q=85'],
    sizes: SIZES,
    variants: makeVariants({ handle: 'rana-dress', price: 435, image: 'https://images.unsplash.com/photo-1773439877634-e6ef9f571c12?auto=format&fit=crop&w=600&q=80' }),
    availableForSale: true,
    tags: [],
  },
  {
    id: 'demo-samar-dress',
    handle: 'samar-dress',
    name: 'Alaïa',
    kind: 'Dress',
    description: 'A long architectural coat-dress in mocha wool blend, belted at the waist — the piece that makes the rest of the wardrobe optional.',
    descriptionHtml: '<p>A long architectural coat-dress in mocha wool blend, belted at the waist — the piece that makes the rest of the wardrobe optional.</p>',
    price: 410,
    compareAtPrice: null,
    currency: 'USD',
    images: ['https://images.unsplash.com/photo-1762605135012-56a59a059e60?auto=format&fit=crop&w=1000&q=85'],
    sizes: SIZES,
    variants: makeVariants({ handle: 'samar-dress', price: 410, image: 'https://images.unsplash.com/photo-1762605135012-56a59a059e60?auto=format&fit=crop&w=600&q=80' }),
    availableForSale: true,
    tags: [],
  },
];

export function getDemoProductByHandle(handle: string): AppProduct | null {
  return DEMO_PRODUCTS.find((p) => p.handle === handle) ?? null;
}
