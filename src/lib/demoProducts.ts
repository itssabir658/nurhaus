// Curated placeholder catalog, shown only when the live Shopify store has zero products.
// Lets the storefront be previewed in full before the real catalog is populated.
// Any page that uses this falls back to real Shopify data automatically the moment
// real products exist — see usage in src/app/**/page.tsx.
import type { AppProduct, AppVariant } from './shopify/types';

const SIZES = ['S', 'M', 'L', 'XL'];

// Shared fabric (shown in the "Fabric & Details" accordion) and care copy.
const DRESS_FABRIC_HTML = '<p>Lightweight chiffon with a breathable cotton inner.</p>';
const ABAYA_FABRIC_HTML = '<p>Lightweight georgette with matching inner included.</p>';
const DRESS_CARE = 'Dry clean recommended\nSteam only (avoid direct ironing on chiffon)\nIf needed, hand wash in cold water with mild detergent\nDo not tumble dry';
const ABAYA_CARE = 'Dry clean recommended\nSteam only (avoid direct ironing on georgette)\nIf needed, hand wash in cold water with mild detergent\nDo not tumble dry';

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
    id: 'demo-layla',
    handle: 'layla',
    name: 'Layla',
    kind: 'Abaya',
    description: 'Layla features a purple garden-inspired print that feels both classic and fresh. Made from lightweight georgette, it flows beautifully with a soft, graceful drape. It comes with a matching inner for a complete and comfortable look, making it effortless to style for any occasion.',
    descriptionHtml: ABAYA_FABRIC_HTML,
    care: ABAYA_CARE,
    price: 680,
    compareAtPrice: null,
    currency: 'USD',
    images: [
      'https://images.unsplash.com/photo-1760083545495-b297b1690672?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1752794673269-dc356838c5fd?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1619043518800-7f14be467dca?auto=format&fit=crop&w=1000&q=85',
    ],
    sizes: SIZES,
    variants: makeVariants({ handle: 'layla', price: 680, image: 'https://images.unsplash.com/photo-1760083545495-b297b1690672?auto=format&fit=crop&w=600&q=80', lowStockSize: 'S' }),
    availableForSale: true,
    tags: ['new'],
  },
  {
    id: 'demo-amelie',
    handle: 'amelie',
    name: 'Amelie',
    kind: 'Dress',
    description: 'Amelie makes a statement with its vibrant hot pink shade and elegant frill detailing. Crafted from lightweight chiffon, it offers a beautiful flow and feminine silhouette. Fully lined for comfort and breathability, Amelie is designed for those special occasions when you want a bold yet graceful look.',
    descriptionHtml: DRESS_FABRIC_HTML,
    care: DRESS_CARE,
    price: 420,
    compareAtPrice: null,
    currency: 'USD',
    images: [
      'https://images.unsplash.com/photo-1762605135318-f34a993cbcf0?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1773439877634-e6ef9f571c12?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1619043518800-7f14be467dca?auto=format&fit=crop&w=1000&q=85',
    ],
    sizes: SIZES,
    variants: makeVariants({ handle: 'amelie', price: 420, image: 'https://images.unsplash.com/photo-1762605135318-f34a993cbcf0?auto=format&fit=crop&w=600&q=80', sizes: SIZES }),
    availableForSale: true,
    tags: [],
  },
  {
    id: 'demo-yara',
    handle: 'yara',
    name: 'Yara',
    kind: 'Abaya',
    description: 'Yara is designed with soft pink florals for a delicate and feminine look. Crafted from lightweight georgette, it offers a smooth, flowy feel while remaining comfortable and easy to wear. Paired with a matching inner, it creates a complete look with minimal effort.',
    descriptionHtml: ABAYA_FABRIC_HTML,
    care: ABAYA_CARE,
    price: 720,
    compareAtPrice: null,
    currency: 'USD',
    images: [
      'https://images.unsplash.com/photo-1772474500365-c2c520545f44?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1772474542630-5f5822ca8421?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1772474521525-c022114367ce?auto=format&fit=crop&w=1000&q=85',
    ],
    sizes: SIZES,
    variants: makeVariants({ handle: 'yara', price: 720, image: 'https://images.unsplash.com/photo-1772474500365-c2c520545f44?auto=format&fit=crop&w=600&q=80', soldOut: true }),
    availableForSale: false,
    tags: ['new'],
  },
  {
    id: 'demo-faye',
    handle: 'faye',
    name: 'Faye',
    kind: 'Dress',
    description: 'Faye captures a soft, feminine charm with its delicate floral design and graceful silhouette. Crafted from lightweight chiffon, it flows beautifully with every movement while the full lining provides comfort and ease. A romantic statement piece designed for special occasions and moments that call for effortless elegance.',
    descriptionHtml: DRESS_FABRIC_HTML,
    care: DRESS_CARE,
    price: 390,
    compareAtPrice: null,
    currency: 'USD',
    images: ['https://images.unsplash.com/photo-1764179690247-df7f4014def7?auto=format&fit=crop&w=1000&q=85'],
    sizes: SIZES,
    variants: makeVariants({ handle: 'faye', price: 390, image: 'https://images.unsplash.com/photo-1764179690247-df7f4014def7?auto=format&fit=crop&w=600&q=80' }),
    availableForSale: true,
    tags: [],
  },
  {
    id: 'demo-elayna',
    handle: 'elayna',
    name: 'Elayna',
    kind: 'Dress',
    description: 'Elayna blends soft blue and pink tones into a beautiful, eye-catching palette. Designed with a graceful flow and crafted from lightweight chiffon, it creates a feminine and elegant look. Fully lined for comfort and breathability, Elayna is the perfect choice for special occasions where you want to feel polished and effortlessly dressed.',
    descriptionHtml: DRESS_FABRIC_HTML,
    care: DRESS_CARE,
    price: 455,
    compareAtPrice: null,
    currency: 'USD',
    images: ['https://images.unsplash.com/photo-1762605135332-8a7ce1403187?auto=format&fit=crop&w=1000&q=85'],
    sizes: SIZES,
    variants: makeVariants({ handle: 'elayna', price: 455, image: 'https://images.unsplash.com/photo-1762605135332-8a7ce1403187?auto=format&fit=crop&w=600&q=80' }),
    availableForSale: true,
    tags: [],
  },
  {
    id: 'demo-saphira',
    handle: 'saphira',
    name: 'Saphira',
    kind: 'Dress',
    description: 'Saphira stands out with its deep mixed purple tones that add richness without feeling heavy. Made from lightweight chiffon, it flows effortlessly with movement. Fully lined for comfort, it offers a smooth fit and an easy, refined look.',
    descriptionHtml: DRESS_FABRIC_HTML,
    care: DRESS_CARE,
    price: 470,
    compareAtPrice: null,
    currency: 'USD',
    images: ['https://images.unsplash.com/photo-1772714601004-23b94ae3913d?auto=format&fit=crop&w=1000&q=85'],
    sizes: SIZES,
    variants: makeVariants({ handle: 'saphira', price: 470, image: 'https://images.unsplash.com/photo-1772714601004-23b94ae3913d?auto=format&fit=crop&w=600&q=80' }),
    availableForSale: true,
    tags: [],
  },
  {
    id: 'demo-dahlia',
    handle: 'dahlia',
    name: 'Dahlia',
    kind: 'Dress',
    description: 'Dahlia features a classic black base with soft floral detailing for a timeless look. Made from lightweight chiffon, it falls smoothly and moves with ease. Fully lined for comfort and coverage, it feels breathable and easy to wear throughout the day. A versatile piece you can dress up or keep minimal.',
    descriptionHtml: DRESS_FABRIC_HTML,
    care: DRESS_CARE,
    price: 435,
    compareAtPrice: null,
    currency: 'USD',
    images: ['https://images.unsplash.com/photo-1773439877634-e6ef9f571c12?auto=format&fit=crop&w=1000&q=85'],
    sizes: SIZES,
    variants: makeVariants({ handle: 'dahlia', price: 435, image: 'https://images.unsplash.com/photo-1773439877634-e6ef9f571c12?auto=format&fit=crop&w=600&q=80' }),
    availableForSale: true,
    tags: [],
  },
  {
    id: 'demo-alaia',
    handle: 'alaia',
    name: 'Alaïa',
    kind: 'Dress',
    description: 'Alaïa comes in a soft light green shade that feels fresh and understated. Crafted from lightweight chiffon, it has a natural, flowy drape. Fully lined for a comfortable fit, it’s designed to feel light while still looking put together. Simple, clean, and easy to style.',
    descriptionHtml: DRESS_FABRIC_HTML,
    care: DRESS_CARE,
    price: 410,
    compareAtPrice: null,
    currency: 'USD',
    images: ['https://images.unsplash.com/photo-1762605135012-56a59a059e60?auto=format&fit=crop&w=1000&q=85'],
    sizes: SIZES,
    variants: makeVariants({ handle: 'alaia', price: 410, image: 'https://images.unsplash.com/photo-1762605135012-56a59a059e60?auto=format&fit=crop&w=600&q=80' }),
    availableForSale: true,
    tags: [],
  },
];

export function getDemoProductByHandle(handle: string): AppProduct | null {
  return DEMO_PRODUCTS.find((p) => p.handle === handle) ?? null;
}
