export interface SizeRow {
  [key: string]: string | number;
}

export interface SizeGuideData {
  name: string;
  columns: string[];
  rows: SizeRow[];
}

export interface SizeGuidesMap {
  [productHandle: string]: SizeGuideData;
}

// Abaya shared size guide data
const ABAYA_OUTER: SizeGuideData = {
  name: 'Abaya (Outer)',
  columns: ['Size', 'Length', 'Chest', 'Shoulder', 'Sleeves', 'Wrist Opening', 'Armhole', 'Flare'],
  rows: [
    { size: '54', length: '54', chest: '23', shoulder: '16.5', sleeves: '25', wristOpening: '10', armhole: '12', flare: '36' },
    { size: '56', length: '56', chest: '24', shoulder: '16.5', sleeves: '25', wristOpening: '10', armhole: '12', flare: '36' },
    { size: '58', length: '58', chest: '25', shoulder: '16.5', sleeves: '25', wristOpening: '10', armhole: '12', flare: '36' },
    { size: '60', length: '60', chest: '25', shoulder: '17', sleeves: '25', wristOpening: '10', armhole: '13', flare: '40' },
  ],
};

const ABAYA_INNER: SizeGuideData = {
  name: 'Abaya (Inner)',
  columns: ['Size', 'Length', 'Body Length', 'Chest', 'Waist', 'Neck Back', 'Neck Front', 'Sleeves Opening', 'Shoulder', 'Sleeves', 'Armhole', 'Flare'],
  rows: [
    { size: '54', length: '52', bodyLength: '14', chest: '22', waist: '22', neckBack: '3.5', neckFront: '5', sleevesOpening: '10', shoulder: '15', sleeves: '8', armhole: '11.5', flare: '45' },
    { size: '56', length: '54', bodyLength: '14', chest: '23', waist: '23', neckBack: '3.5', neckFront: '5', sleevesOpening: '10', shoulder: '15', sleeves: '8', armhole: '11.5', flare: '45' },
    { size: '58', length: '56', bodyLength: '14', chest: '23', waist: '23', neckBack: '3.5', neckFront: '5', sleevesOpening: '10', shoulder: '15', sleeves: '8', armhole: '11.5', flare: '45' },
    { size: '60', length: '58', bodyLength: '14', chest: '24', waist: '24', neckBack: '3.5', neckFront: '6', sleevesOpening: '10', shoulder: '16', sleeves: '8', armhole: '11.5', flare: '45' },
  ],
};

// Dahlia Long Dress size guide
const DAHLIA_LONG_DRESS: SizeGuideData = {
  name: 'Dahlia Long Dress',
  columns: ['Size', 'Length', 'Body Length', 'Chest', 'Waist', 'Sleeves', 'Armhole', 'Shoulder', 'Flare'],
  rows: [
    { size: 'S', length: '55', bodyLength: '14', chest: '19.5', waist: '19.5', sleeves: '24', armhole: '10', shoulder: '15', flare: '65' },
    { size: 'M', length: '55', bodyLength: '14', chest: '20.5', waist: '20.5', sleeves: '24', armhole: '10', shoulder: '15', flare: '65' },
    { size: 'L', length: '56', bodyLength: '14', chest: '22', waist: '22', sleeves: '24', armhole: '11', shoulder: '16', flare: '65' },
    { size: 'XL', length: '56', bodyLength: '14', chest: '23', waist: '23', sleeves: '24', armhole: '12', shoulder: '16.5', flare: '70' },
  ],
};

/**
 * Map of product handles to their size guides.
 * For abayas, both use the same guides (with outer and inner tabs).
 * For dresses, each has its own dedicated guide.
 *
 * Product types/categories:
 * - 'abaya': Both abayas share this guide
 * - Product-specific handles: Individual dress guides
 */
export const PRODUCT_SIZE_GUIDES: SizeGuidesMap = {
  // Abayas — both share these guides
  abaya: {
    name: 'Abaya Size Guide',
    columns: [], // Not used for abayas since they have tabs
    rows: [], // Not used for abayas
  },

  // Dresses — map product handles to their specific size guides
  // Update these handles to match your actual product handles in Shopify
  'noor-dress': DAHLIA_LONG_DRESS,
  // Add more dresses here as needed:
  // 'dunya-dress': DUNYA_DRESS_DATA,
  // 'layla-dress': LAYLA_DRESS_DATA,
  // 'zahra-dress': ZAHRA_DRESS_DATA,
};

/**
 * Get size guide data for a product by handle or type.
 * Returns null if no size guide exists for the product.
 */
export function getSizeGuideData(productHandle: string, productType?: string) {
  const handleLower = productHandle.toLowerCase();

  // First, try direct handle lookup (with various normalizations)
  if (PRODUCT_SIZE_GUIDES[handleLower]) {
    return PRODUCT_SIZE_GUIDES[handleLower];
  }

  // Try without product type suffix (e.g., "dahlia-dress" -> "dahlia")
  const baseHandle = handleLower.replace(/-(dress|abaya)$/, '');
  if (baseHandle !== handleLower && PRODUCT_SIZE_GUIDES[baseHandle]) {
    return PRODUCT_SIZE_GUIDES[baseHandle];
  }

  // Check if it's an abaya by type or handle
  const isAbaya =
    productType?.toLowerCase().includes('abaya') ||
    handleLower.includes('abaya');

  if (isAbaya) {
    return {
      name: 'Abaya Size Guide',
      tabs: [ABAYA_OUTER, ABAYA_INNER],
    };
  }

  // No size guide found
  return null;
}

export { ABAYA_OUTER, ABAYA_INNER, DAHLIA_LONG_DRESS };
