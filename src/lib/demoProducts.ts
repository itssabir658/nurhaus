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

// Mirrors the store's real in-store pickup location (Shopify Admin → Locations → Shop location)
// so every product — demo or live — shows the same pickup option until real inventory is added.
const PICKUP_INFO = {
  locationName: 'Shop location',
  address: '353 Potts Terr, Milton Ontario L9T 0X5, Canada',
  pickupTime: 'Usually ready in 2-4 days',
};

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
    id: "demo-layla",
    handle: "layla",
    name: "Layla",
    kind: "Abaya",
    description: "Layla features a purple garden-inspired print that feels both classic and fresh. Made from lightweight georgette, it flows beautifully with a soft, graceful drape. It comes with a matching inner for a complete and comfortable look, making it effortless to style for any occasion.",
    descriptionHtml: ABAYA_FABRIC_HTML,
    care: ABAYA_CARE,
    price: 680,
    compareAtPrice: null,
    currency: "USD",
    images: [
      "/products/layla/1.jpg",
      "/products/layla/2.jpg",
      "/products/layla/3.jpg",
      "/products/layla/4.jpg",
    ],
    sizes: SIZES,
    variants: makeVariants({ handle: "layla", price: 680, image: "/products/layla/1.jpg", lowStockSize: "S" }),
    availableForSale: true,
    tags: ["new"],
    pickup: PICKUP_INFO,
  },
  {
    id: 'demo-amelie',
    handle: 'amelie',
    name: 'Amélie',
    kind: 'Dress',
    description: 'Amélie makes a statement with its vibrant hot pink shade and elegant frill detailing. Crafted from lightweight chiffon, it offers a beautiful flow and feminine silhouette. Fully lined for comfort and breathability, Amélie is designed for those special occasions when you want a bold yet graceful look.',
    descriptionHtml: DRESS_FABRIC_HTML,
    care: DRESS_CARE,
    price: 420,
    compareAtPrice: null,
    currency: 'USD',
    images: [
      '/products/amelie/1.jpg',
      '/products/amelie/2.jpg',
      '/products/amelie/3.jpg',
      '/products/amelie/4.jpg',
    ],
    sizes: SIZES,
    variants: makeVariants({ handle: 'amelie', price: 420, image: '/products/amelie/1.jpg', sizes: SIZES }),
    availableForSale: true,
    tags: [],
    pickup: PICKUP_INFO,
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
      '/products/yara/1.jpg',
      '/products/yara/2.jpg',
      '/products/yara/3.jpg',
      '/products/yara/4.jpg',
    ],
    sizes: SIZES,
    variants: makeVariants({ handle: 'yara', price: 720, image: '/products/yara/1.jpg', soldOut: true }),
    availableForSale: false,
    tags: ['new'],
    pickup: PICKUP_INFO,
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
    images: [
      '/products/faye/1.jpg',
      '/products/faye/2.jpg',
      '/products/faye/3.jpg',
      '/products/faye/4.jpg',
    ],
    sizes: SIZES,
    variants: makeVariants({ handle: 'faye', price: 390, image: '/products/faye/1.jpg' }),
    availableForSale: true,
    tags: [],
    pickup: PICKUP_INFO,
  },
  {
    id: 'demo-elayna',
    handle: 'elayna',
    name: 'Elayna',
    kind: 'Dress',
    description: 'Elayna blends soft blue and hint of pink tones into a beautiful, eye-catching palette. Designed with a graceful flow and crafted from lightweight chiffon, it creates a feminine and elegant look. Fully lined for comfort and breathability, Elayna is the perfect choice for special occasions where you want to feel polished and effortlessly dressed.',
    descriptionHtml: DRESS_FABRIC_HTML,
    care: DRESS_CARE,
    price: 455,
    compareAtPrice: null,
    currency: 'USD',
    images: [
      '/products/elayna/1.jpg',
      '/products/elayna/2.jpg',
      '/products/elayna/3.jpg',
      '/products/elayna/4.jpg',
    ],
    sizes: SIZES,
    variants: makeVariants({ handle: 'elayna', price: 455, image: '/products/elayna/1.jpg' }),
    availableForSale: true,
    tags: [],
    pickup: PICKUP_INFO,
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
    images: [
      '/products/saphira/1.jpg',
      '/products/saphira/2.jpg',
      '/products/saphira/3.jpg',
      '/products/saphira/4.jpg',
    ],
    sizes: SIZES,
    variants: makeVariants({ handle: 'saphira', price: 470, image: '/products/saphira/1.jpg' }),
    availableForSale: true,
    tags: [],
    pickup: PICKUP_INFO,
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
    images: [
      '/products/dahlia/1.jpg',
      '/products/dahlia/2.jpg',
      '/products/dahlia/3.jpg',
      '/products/dahlia/4.jpg',
    ],
    sizes: SIZES,
    variants: makeVariants({ handle: 'dahlia', price: 435, image: '/products/dahlia/1.jpg' }),
    availableForSale: true,
    tags: [],
    pickup: PICKUP_INFO,
  },
  {
    id: "demo-alaia",
    handle: "alaia",
    name: "Alaia",
    kind: "Dress",
    description: "Alaia comes in a soft light green shade that feels fresh and understated. Crafted from lightweight chiffon, it has a natural, flowy drape. Fully lined for a comfortable fit, it is designed to feel light while still looking put together. Simple, clean, and easy to style.",
    descriptionHtml: DRESS_FABRIC_HTML,
    care: DRESS_CARE,
    price: 410,
    compareAtPrice: null,
    currency: "USD",
    images: [
      "/products/alaia/1.jpg",
      "/products/alaia/2.jpg",
      "/products/alaia/3.jpg",
      "/products/alaia/4.jpg",
    ],
    sizes: SIZES,
    variants: makeVariants({ handle: "alaia", price: 410, image: "/products/alaia/1.jpg" }),
    availableForSale: true,
    tags: [],
    pickup: PICKUP_INFO,
  },
];

export function getDemoProductByHandle(handle: string): AppProduct | null {
  return DEMO_PRODUCTS.find((p) => p.handle === handle) ?? null;
}
