export interface SizeRow {
  [key: string]: string | number;
}

export interface SizeGuideData {
  name: string;
  columns: string[];
  rows: SizeRow[];
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
 * Resolve the size guide for a product.
 *
 * Matching is done primarily by the product's display NAME — the store owner
 * controls it directly and it stays stable even when Shopify URL handles are
 * changed — then by product type/kind for abayas, and finally by known current
 * or legacy handles as a fallback (so the demo catalog and older links keep
 * working). Returns null when no guide applies to the product yet.
 *
 * Current mapping:
 * - Abayas ("Layla", "Yara") share one tabbed Outer/Inner guide, detected via
 *   the Shopify product type (kind === 'Abaya').
 * - "Dahlia" (former Rana) and "Amelie" (former Noor) share the S/M/L/XL dress
 *   guide (DAHLIA_LONG_DRESS).
 */
export function getSizeGuideData(
  productHandle: string,
  productType?: string,
  productName?: string,
) {
  const handle = productHandle.toLowerCase();
  const type = (productType ?? '').toLowerCase();
  const name = (productName ?? '').toLowerCase().trim();

  // Abayas — both current abayas share the tabbed Outer/Inner guide. Detected
  // by product type first; the new handles (layla, yara) no longer contain the
  // word "abaya", so the handle alone is no longer a reliable signal.
  const isAbaya =
    type.includes('abaya') ||
    handle.includes('abaya') ||
    name === 'layla' ||
    name === 'yara';
  if (isAbaya) {
    return {
      name: 'Abaya Size Guide',
      tabs: [ABAYA_OUTER, ABAYA_INNER],
    };
  }

  // Dresses that share the Dahlia S/M/L/XL guide: "Dahlia" (former Rana Dress)
  // and "Amelie" (former Noor Dress). Match by name first, then by known
  // current/legacy handles for the demo catalog and backward compatibility.
  const dahliaGuideNames = ['dahlia', 'amelie'];
  const dahliaGuideHandles = ['dahlia', 'amelie', 'rana-dress', 'noor-dress'];
  if (dahliaGuideNames.includes(name) || dahliaGuideHandles.includes(handle)) {
    return DAHLIA_LONG_DRESS;
  }

  // No size guide found for this product yet.
  return null;
}

export { ABAYA_OUTER, ABAYA_INNER, DAHLIA_LONG_DRESS };
