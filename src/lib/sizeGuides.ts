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

// Amélie Long Dress size guide (XS is offered in the source chart but omitted here)
const AMELIE_LONG_DRESS: SizeGuideData = {
  name: 'Amélie Long Dress',
  columns: ['Size', 'Length', 'Body Length', 'Waist', 'Chest', 'Sleeves', 'Armhole', 'Shoulder', 'Flare'],
  rows: [
    { size: 'S', length: '56', bodyLength: '14', waist: '19.5', chest: '19.5', sleeves: '25', armhole: '10', shoulder: '15', flare: '70' },
    { size: 'M', length: '57', bodyLength: '14', waist: '20.5', chest: '20.5', sleeves: '25', armhole: '10', shoulder: '15', flare: '70' },
    { size: 'L', length: '57', bodyLength: '14', waist: '22', chest: '22', sleeves: '25', armhole: '11', shoulder: '16', flare: '70' },
    { size: 'XL', length: '57', bodyLength: '14', waist: '23', chest: '23', sleeves: '25', armhole: '12', shoulder: '16.5', flare: '70' },
  ],
};

// Alaïa Long Dress size guide (XS is offered in the source chart but omitted here)
const ALAIA_LONG_DRESS: SizeGuideData = {
  name: 'Alaïa Long Dress',
  columns: ['Size', 'Length', 'Body Length', 'Waist', 'Chest', 'Sleeves', 'Armhole', 'Shoulder', 'Flare'],
  rows: [
    { size: 'S', length: '55', bodyLength: '14', waist: '19.5', chest: '19.5', sleeves: '24', armhole: '10', shoulder: '15', flare: '65' },
    { size: 'M', length: '55', bodyLength: '14', waist: '20.5', chest: '20.5', sleeves: '24', armhole: '10', shoulder: '15', flare: '65' },
    { size: 'L', length: '55', bodyLength: '14', waist: '22', chest: '22', sleeves: '24', armhole: '11', shoulder: '16', flare: '65' },
    { size: 'XL', length: '55', bodyLength: '14', waist: '23', chest: '23', sleeves: '24', armhole: '12', shoulder: '16.5', flare: '70' },
  ],
};

// Saphira Long Dress size guide (XS is offered in the source chart but omitted here)
const SAPHIRA_LONG_DRESS: SizeGuideData = {
  name: 'Saphira Long Dress',
  columns: ['Size', 'Length', 'Body Length', 'Waist', 'Chest', 'Sleeves', 'Armhole', 'Shoulder', 'Flare'],
  rows: [
    { size: 'S', length: '54', bodyLength: '14', waist: '19.5', chest: '19.5', sleeves: '24', armhole: '10', shoulder: '15', flare: '65' },
    { size: 'M', length: '54', bodyLength: '14', waist: '20.5', chest: '20.5', sleeves: '24', armhole: '10', shoulder: '15', flare: '65' },
    { size: 'L', length: '55', bodyLength: '14', waist: '22', chest: '22', sleeves: '24', armhole: '11', shoulder: '16', flare: '65' },
    { size: 'XL', length: '55', bodyLength: '14', waist: '23', chest: '23', sleeves: '24', armhole: '12', shoulder: '16.5', flare: '70' },
  ],
};

// Elayna Long Dress size guide (XS is offered in the source chart but omitted here)
const ELAYNA_LONG_DRESS: SizeGuideData = {
  name: 'Elayna Long Dress',
  columns: ['Size', 'Length', 'Body Length', 'Waist', 'Chest', 'Sleeves', 'Armhole', 'Shoulder', 'Flare'],
  rows: [
    { size: 'S', length: '56', bodyLength: '14', waist: '19.5', chest: '19.5', sleeves: '25', armhole: '10', shoulder: '15', flare: '70' },
    { size: 'M', length: '57', bodyLength: '14', waist: '20.5', chest: '20.5', sleeves: '25', armhole: '10', shoulder: '15', flare: '70' },
    { size: 'L', length: '57', bodyLength: '14', waist: '22', chest: '22', sleeves: '25', armhole: '11', shoulder: '16', flare: '70' },
    { size: 'XL', length: '57', bodyLength: '14', waist: '23', chest: '23', sleeves: '25', armhole: '12', shoulder: '16.5', flare: '70' },
  ],
};

// Faye Long Dress size guide (XS is offered in the source chart but omitted here).
// Values currently match DAHLIA_LONG_DRESS but are kept as a separate object so
// each dress can be edited independently.
const FAYE_LONG_DRESS: SizeGuideData = {
  name: 'Faye Long Dress',
  columns: ['Size', 'Length', 'Body Length', 'Waist', 'Chest', 'Sleeves', 'Armhole', 'Shoulder', 'Flare'],
  rows: [
    { size: 'S', length: '55', bodyLength: '14', waist: '19.5', chest: '19.5', sleeves: '24', armhole: '10', shoulder: '15', flare: '65' },
    { size: 'M', length: '55', bodyLength: '14', waist: '20.5', chest: '20.5', sleeves: '24', armhole: '10', shoulder: '15', flare: '65' },
    { size: 'L', length: '56', bodyLength: '14', waist: '22', chest: '22', sleeves: '24', armhole: '11', shoulder: '16', flare: '65' },
    { size: 'XL', length: '56', bodyLength: '14', waist: '23', chest: '23', sleeves: '24', armhole: '12', shoulder: '16.5', flare: '70' },
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
 * - "Dahlia" (former Rana) has its own S/M/L/XL guide (DAHLIA_LONG_DRESS).
 * - "Amelie" (former Noor) has its own S/M/L/XL guide (AMELIE_LONG_DRESS).
 * - "Alaïa" (former Samar) has its own S/M/L/XL guide (ALAIA_LONG_DRESS).
 * - "Saphira" (former Zahra) has its own S/M/L/XL guide (SAPHIRA_LONG_DRESS).
 * - "Elayna" (former Layla Dress) has its own S/M/L/XL guide (ELAYNA_LONG_DRESS).
 * - "Faye" (former Dunya Dress) has its own S/M/L/XL guide (FAYE_LONG_DRESS).
 */
export function getSizeGuideData(
  productHandle: string,
  productType?: string,
  productName?: string,
) {
  const handle = productHandle.toLowerCase();
  const type = (productType ?? '').toLowerCase();
  // Strip diacritics so accented names (e.g. "Alaïa") match their ASCII
  // slugified handles (e.g. "alaia") and are robust to how the name is typed.
  const name = (productName ?? '')
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

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

  // Dahlia (former Rana Dress) — its own S/M/L/XL guide.
  if (name === 'dahlia' || handle === 'dahlia') {
    return DAHLIA_LONG_DRESS;
  }

  // Amelie (former Noor Dress) — its own S/M/L/XL guide.
  if (name === 'amelie' || handle === 'amelie') {
    return AMELIE_LONG_DRESS;
  }

  // Alaïa (former Samar Dress) — its own S/M/L/XL guide. Name is compared in its
  // accent-stripped form ("alaia"), which also covers the slugified handle.
  if (name === 'alaia' || handle === 'alaia') {
    return ALAIA_LONG_DRESS;
  }

  // Saphira (former Zahra Dress) — its own S/M/L/XL guide.
  if (name === 'saphira' || handle === 'saphira') {
    return SAPHIRA_LONG_DRESS;
  }

  // Elayna (former Layla Dress) — its own S/M/L/XL guide. The "Elayna" name/handle
  // does not collide with the "Layla" abaya, which is matched earlier by kind/name.
  if (name === 'elayna' || handle === 'elayna') {
    return ELAYNA_LONG_DRESS;
  }

  // Faye (former Dunya Dress) — its own S/M/L/XL guide.
  if (name === 'faye' || handle === 'faye') {
    return FAYE_LONG_DRESS;
  }

  // No size guide found for this product yet.
  return null;
}

export {
  ABAYA_OUTER,
  ABAYA_INNER,
  DAHLIA_LONG_DRESS,
  AMELIE_LONG_DRESS,
  ALAIA_LONG_DRESS,
  SAPHIRA_LONG_DRESS,
  ELAYNA_LONG_DRESS,
  FAYE_LONG_DRESS,
};
