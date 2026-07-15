import type { CartItem, Offer } from "../types";

/**
 * Discount engine — pure functions only. No state, no side effects.
 *
 * Offer model: a quantity-based bundle offer.
 *   "2 Mojitos for 30₪" → { product_id, required_quantity: 2, discounted_price: 30 }
 *
 * Application rule: when the cart contains N units of the offer's product,
 * floor(N / required_quantity) bundles are charged at `discounted_price` each,
 * and the remaining (N mod required_quantity) units are charged at the normal
 * unit price. This means:
 *   - 2 Mojitos @ 20₪ each → 1 bundle @ 30₪ → total 30₪ (saved 10₪)
 *   - 3 Mojitos → 1 bundle @ 30₪ + 1 unit @ 20₪ → total 50₪ (saved 10₪)
 *   - 4 Mojitos → 2 bundles @ 30₪ → total 60₪ (saved 20₪)
 *
 * Design notes:
 *   - Offers without a product_id, required_quantity, or discounted_price are
 *     treated as display-only (banners) and never affect pricing.
 *   - If multiple offers target the same product, the best (cheapest) bundle
 *     price wins — handled by picking the minimum discounted_price per product.
 *   - Calculations are money-safe: rounded to 2 decimals to avoid float drift.
 */

export type AppliedOffer = {
  offer: Offer;
  cartItem: CartItem;
  bundles: number;
  bundlePrice: number;
  savings: number;
};

export type DiscountBreakdown = {
  /** Sum of every line at normal unit price (before any offers). */
  subtotal: number;
  /** Total amount saved across all applied offers. */
  savings: number;
  /** Subtotal minus savings. */
  discountedTotal: number;
  /** Per-offer breakdown for UI display. */
  applied: AppliedOffer[];
};

/** A offer is "applicable" (price-affecting) only if all discount fields are set. */
export function isApplicableOffer(offer: Offer): boolean {
  return (
    offer.active &&
    offer.product_id != null &&
    (offer.required_quantity ?? 0) > 1 &&
    offer.discounted_price != null
  );
}

/**
 * Build a composite key for matching offers to cart lines.
 * An offer with size_label = NULL matches cart lines with sizeLabel = NULL
 * (single-size products). An offer with a specific size_label matches only
 * cart lines with that exact size.
 */
function offerKey(productId: number, sizeLabel: string | null): string {
  return `${productId}::${sizeLabel ?? ""}`;
}

/**
 * Select the best applicable offer per product+size. When two offers target
 * the same product and size, the one with the lower bundle price wins.
 * Returns a Map keyed by `product_id::size_label` for O(1) lookup.
 */
export function selectBestOfferPerProduct(
  offers: ReadonlyArray<Offer>,
  productsById: ReadonlyMap<number, { price: number }>,
  items: ReadonlyArray<CartItem>
): Map<string, Offer> {
  const best = new Map<string, Offer>();
  const inCart = new Set(items.map((i) => offerKey(i.id, i.sizeLabel ?? null)));
  for (const offer of offers) {
    if (!isApplicableOffer(offer)) continue;
    if (offer.product_id == null) continue;
    const key = offerKey(offer.product_id, offer.size_label);
    // Skip offers for product+size combos not in the cart.
    if (!inCart.has(key)) continue;
    const product = productsById.get(offer.product_id);
    if (!product) continue;
    const current = best.get(key);
    if (!current) {
      best.set(key, offer);
      continue;
    }
    if ((offer.discounted_price ?? 0) < (current.discounted_price ?? 0)) {
      best.set(key, offer);
    }
  }
  return best;
}

/**
 * Core pricing function. Given cart items and applicable offers, returns a
 * full breakdown including which offers were applied and how much was saved.
 */
export function computeDiscountBreakdown(
  items: ReadonlyArray<CartItem>,
  offers: ReadonlyArray<Offer>
): DiscountBreakdown {
  // Index products by id for O(1) lookups during offer selection.
  const productsById = new Map<number, { price: number }>(
    items.map((i) => [i.id, { price: i.price }])
  );

  const bestOffers = selectBestOfferPerProduct(offers, productsById, items);

  let subtotal = 0;
  let savings = 0;
  const applied: AppliedOffer[] = [];

  for (const item of items) {
    const normalLine = round2(item.price * item.quantity);
    subtotal += normalLine;

    const key = offerKey(item.id, item.sizeLabel ?? null);
    const offer = bestOffers.get(key);
    if (!offer || offer.required_quantity == null || offer.discounted_price == null) {
      continue;
    }

    const reqQty = offer.required_quantity;
    const bundles = Math.floor(item.quantity / reqQty);
    if (bundles === 0) continue;

    const remainder = item.quantity % reqQty;
    const bundleTotal = round2((offer.discounted_price as number) * bundles);
    const remainderTotal = round2(item.price * remainder);
    const lineTotal = round2(bundleTotal + remainderTotal);
    const lineSavings = round2(normalLine - lineTotal);

    if (lineSavings > 0) {
      savings += lineSavings;
      applied.push({
        offer,
        cartItem: item,
        bundles,
        bundlePrice: offer.discounted_price as number,
        savings: lineSavings,
      });
    }
  }

  return {
    subtotal: round2(subtotal),
    savings: round2(savings),
    discountedTotal: round2(subtotal - savings),
    applied,
  };
}

function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}
