// Fragment bodies are kept separate from their dependencies — each top-level query/mutation
// below appends exactly the set of fragments it needs, exactly once. (Embedding a fragment's
// text inside another fragment's template string, then appending both, double-defines it and
// Shopify rejects the document with a "fragment must be unique" error.)

const IMAGE_FRAGMENT = `
  fragment ImageFragment on Image {
    url
    altText
    width
    height
  }
`;

const VARIANT_FRAGMENT = `
  fragment VariantFragment on ProductVariant {
    id
    title
    availableForSale
    quantityAvailable
    selectedOptions {
      name
      value
    }
    price {
      amount
      currencyCode
    }
    image {
      ...ImageFragment
    }
  }
`;

const PRODUCT_FRAGMENT = `
  fragment ProductFragment on Product {
    id
    handle
    title
    description
    descriptionHtml
    productType
    productTypeMetafield: metafield(namespace: "custom", key: "product_type") {
      value
    }
    tags
    availableForSale
    options {
      name
      values
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    compareAtPriceRange {
      maxVariantPrice {
        amount
        currencyCode
      }
    }
    images(first: 8) {
      edges {
        node {
          ...ImageFragment
        }
      }
    }
    variants(first: 100) {
      edges {
        node {
          ...VariantFragment
        }
      }
    }
  }
`;

const CART_FRAGMENT = `
  fragment CartFragment on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      totalAmount { amount currencyCode }
      subtotalAmount { amount currencyCode }
    }
    lines(first: 100) {
      edges {
        node {
          id
          quantity
          cost {
            totalAmount { amount currencyCode }
          }
          merchandise {
            ... on ProductVariant {
              id
              title
              availableForSale
              quantityAvailable
              selectedOptions { name value }
              price { amount currencyCode }
              image { ...ImageFragment }
              product {
                handle
                title
              }
            }
          }
        }
      }
    }
  }
`;

export const getProductsQuery = `
  query GetProducts($first: Int!, $query: String) {
    products(first: $first, query: $query, sortKey: BEST_SELLING) {
      edges {
        node {
          ...ProductFragment
        }
      }
    }
  }
  ${PRODUCT_FRAGMENT}
  ${VARIANT_FRAGMENT}
  ${IMAGE_FRAGMENT}
`;

export const getProductByHandleQuery = `
  query GetProductByHandle($handle: String!) {
    product(handle: $handle) {
      ...ProductFragment
    }
  }
  ${PRODUCT_FRAGMENT}
  ${VARIANT_FRAGMENT}
  ${IMAGE_FRAGMENT}
`;

export const getCartQuery = `
  query GetCart($cartId: ID!) {
    cart(id: $cartId) {
      ...CartFragment
    }
  }
  ${CART_FRAGMENT}
  ${IMAGE_FRAGMENT}
`;

export const cartCreateMutation = `
  mutation CartCreate($lines: [CartLineInput!]) {
    cartCreate(input: { lines: $lines }) {
      cart { ...CartFragment }
      userErrors { field message }
    }
  }
  ${CART_FRAGMENT}
  ${IMAGE_FRAGMENT}
`;

export const cartLinesAddMutation = `
  mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart { ...CartFragment }
      userErrors { field message }
    }
  }
  ${CART_FRAGMENT}
  ${IMAGE_FRAGMENT}
`;

export const cartLinesUpdateMutation = `
  mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart { ...CartFragment }
      userErrors { field message }
    }
  }
  ${CART_FRAGMENT}
  ${IMAGE_FRAGMENT}
`;

export const cartLinesRemoveMutation = `
  mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart { ...CartFragment }
      userErrors { field message }
    }
  }
  ${CART_FRAGMENT}
  ${IMAGE_FRAGMENT}
`;
